// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title IPetCoin
 * @dev PetCoin 合約接口
 */
interface IPetCoin {
    function rewardUser(address user) external;
}

/**
 * @title HealthReport
 * @dev PetHealthChain 寵物健康報告管理合約
 * 整合 Storacha (Web3 Storage) 用於 IPFS 檔案儲存
 */
contract HealthReport is Ownable, ReentrancyGuard {
    
    // 健康報告結構
    struct Report {
        uint256 reportId;           // 報告編號
        string petId;               // 寵物編號
        string reportType;          // 報告類型
        string reportName;          // 報告名稱
        string ipfsCID;             // IPFS CID (來自 Storacha)
        string description;         // 描述
        address owner;              // 飼主地址
        uint256 timestamp;          // 上傳時間戳
        bool isValid;               // 報告是否有效
    }
    
    // 儲存所有報告
    mapping(uint256 => Report) public reports;
    
    // 用戶的報告編號列表
    mapping(address => uint256[]) public userReports;
    
    // 寵物編號對應的報告列表
    mapping(string => uint256[]) public petReports;
    
    // CID 唯一性映射 (CID => 是否已使用)
    mapping(string => bool) public usedCIDs;
    
    // CID 對應的報告ID (CID => reportId)
    mapping(string => uint256) public cidToReportId;
    
    // 報告計數器
    uint256 public reportCounter;
    
    // PetCoin 合約地址（用於獎勵整合）
    address public petCoinContract;
    
    // 事件
    event ReportUploaded(
        uint256 indexed reportId,
        address indexed owner,
        string indexed petId,
        string reportType,
        string ipfsCID,
        uint256 timestamp
    );
    
    event ReportUpdated(
        uint256 indexed reportId,
        address indexed owner,
        string ipfsCID
    );
    
    event ReportInvalidated(
        uint256 indexed reportId,
        address indexed owner
    );
    
    event PetCoinContractUpdated(address indexed newContract);
    
    event CIDAlreadyUsed(string indexed ipfsCID, uint256 existingReportId, address attemptedBy);
    
    /**
     * @dev 建構函數
     * @param initialOwner 初始擁有者地址
     */
    constructor(address initialOwner) Ownable(initialOwner) {
        reportCounter = 1; // 從 1 開始計數
    }
    
    /**
     * @dev 設定 PetCoin 合約地址
     * @param _petCoinContract PetCoin 合約地址
     */
    function setPetCoinContract(address _petCoinContract) external onlyOwner {
        require(_petCoinContract != address(0), "HealthReport: Invalid contract address");
        petCoinContract = _petCoinContract;
        emit PetCoinContractUpdated(_petCoinContract);
    }
    
    /**
     * @dev 上傳健康報告
     * @param _petId 寵物編號
     * @param _reportType 報告類型
     * @param _reportName 報告名稱
     * @param _ipfsCID IPFS CID (來自 Storacha)
     * @param _description 描述
     */
    function uploadReport(
        string memory _petId,
        string memory _reportType,
        string memory _reportName,
        string memory _ipfsCID,
        string memory _description
    ) external nonReentrant {
        require(bytes(_petId).length > 0, "HealthReport: Pet ID cannot be empty");
        require(bytes(_reportType).length > 0, "HealthReport: Report type cannot be empty");
        require(bytes(_reportName).length > 0, "HealthReport: Report name cannot be empty");
        require(bytes(_ipfsCID).length > 0, "HealthReport: IPFS CID cannot be empty");
        
        // 檢查 CID 是否已被使用
        require(!usedCIDs[_ipfsCID], "HealthReport: This CID has already been used");
        
        // 標記 CID 為已使用
        usedCIDs[_ipfsCID] = true;
        
        uint256 reportId = reportCounter;
        
        // 創建新報告
        reports[reportId] = Report({
            reportId: reportId,
            petId: _petId,
            reportType: _reportType,
            reportName: _reportName,
            ipfsCID: _ipfsCID,
            description: _description,
            owner: msg.sender,
            timestamp: block.timestamp,
            isValid: true
        });
        
        // 更新映射
        userReports[msg.sender].push(reportId);
        petReports[_petId].push(reportId);
        cidToReportId[_ipfsCID] = reportId;
        
        // 增加計數器
        reportCounter++;
        
        // 發送事件
        emit ReportUploaded(
            reportId,
            msg.sender,
            _petId,
            _reportType,
            _ipfsCID,
            block.timestamp
        );
        
        // 如果設定了 PetCoin 合約，發送獎勵
        if (petCoinContract != address(0)) {
            try IPetCoin(petCoinContract).rewardUser(msg.sender) {
                // 獎勵發送成功
            } catch {
                // 獎勵發送失敗，但不影響報告上傳
                // 可以在這裡發送事件記錄失敗原因
            }
        }
    }
    
    /**
     * @dev 更新報告的 IPFS CID
     * @param _reportId 報告編號
     * @param _newIpfsCID 新的 IPFS CID
     */
    function updateReportCID(uint256 _reportId, string memory _newIpfsCID) external {
        require(_reportId > 0 && _reportId < reportCounter, "HealthReport: Invalid report ID");
        require(reports[_reportId].owner == msg.sender, "HealthReport: Not the owner");
        require(reports[_reportId].isValid, "HealthReport: Report is invalid");
        require(bytes(_newIpfsCID).length > 0, "HealthReport: IPFS CID cannot be empty");
        
        reports[_reportId].ipfsCID = _newIpfsCID;
        
        emit ReportUpdated(_reportId, msg.sender, _newIpfsCID);
    }
    
    /**
     * @dev 設定報告為無效（僅限擁有者或報告擁有者）
     * @param _reportId 報告編號
     */
    function invalidateReport(uint256 _reportId) external {
        require(_reportId > 0 && _reportId < reportCounter, "HealthReport: Invalid report ID");
        require(
            reports[_reportId].owner == msg.sender || owner() == msg.sender,
            "HealthReport: Not authorized"
        );
        require(reports[_reportId].isValid, "HealthReport: Report already invalid");
        
        reports[_reportId].isValid = false;
        
        emit ReportInvalidated(_reportId, reports[_reportId].owner);
    }
    
    /**
     * @dev 獲取報告詳細資訊
     * @param _reportId 報告編號
     */
    function getReport(uint256 _reportId) external view returns (Report memory) {
        require(_reportId > 0 && _reportId < reportCounter, "HealthReport: Invalid report ID");
        return reports[_reportId];
    }
    
    /**
     * @dev 獲取用戶的所有報告編號
     * @param _user 用戶地址
     */
    function getUserReports(address _user) external view returns (uint256[] memory) {
        return userReports[_user];
    }
    
    /**
     * @dev 獲取特定寵物的所有報告編號
     * @param _petId 寵物編號
     */
    function getPetReports(string memory _petId) external view returns (uint256[] memory) {
        return petReports[_petId];
    }
    
    /**
     * @dev 獲取用戶報告總數
     * @param _user 用戶地址
     */
    function getUserReportCount(address _user) external view returns (uint256) {
        return userReports[_user].length;
    }
    
    /**
     * @dev 獲取特定寵物的報告總數
     * @param _petId 寵物編號
     */
    function getPetReportCount(string memory _petId) external view returns (uint256) {
        return petReports[_petId].length;
    }
    
    /**
     * @dev 獲取總報告數量
     */
    function getTotalReportCount() external view returns (uint256) {
        return reportCounter - 1;
    }
    
    /**
     * @dev 批量獲取報告資訊
     * @param _reportIds 報告編號陣列
     */
    function getReportsBatch(uint256[] memory _reportIds) external view returns (Report[] memory) {
        Report[] memory batchReports = new Report[](_reportIds.length);
        
        for (uint256 i = 0; i < _reportIds.length; i++) {
            require(_reportIds[i] > 0 && _reportIds[i] < reportCounter, "HealthReport: Invalid report ID");
            batchReports[i] = reports[_reportIds[i]];
        }
        
        return batchReports;
    }
    
    /**
     * @dev 檢查報告是否存在且有效
     * @param _reportId 報告編號
     */
    function isValidReport(uint256 _reportId) external view returns (bool) {
        if (_reportId == 0 || _reportId >= reportCounter) {
            return false;
        }
        return reports[_reportId].isValid;
    }
    
    /**
     * @dev 檢查 CID 是否已被使用
     * @param _ipfsCID IPFS CID
     */
    function isCIDUsed(string memory _ipfsCID) external view returns (bool) {
        return usedCIDs[_ipfsCID];
    }
    
    /**
     * @dev 通過 CID 獲取報告ID
     * @param _ipfsCID IPFS CID
     */
    function getReportIdByCID(string memory _ipfsCID) external view returns (uint256) {
        require(usedCIDs[_ipfsCID], "HealthReport: CID not found");
        return cidToReportId[_ipfsCID];
    }
    
    /**
     * @dev 通過 CID 獲取報告詳情
     * @param _ipfsCID IPFS CID
     */
    function getReportByCID(string memory _ipfsCID) external view returns (Report memory) {
        require(usedCIDs[_ipfsCID], "HealthReport: CID not found");
        uint256 reportId = cidToReportId[_ipfsCID];
        return reports[reportId];
    }
}