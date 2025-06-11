// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PetCoin
 * @dev PetHealthChain 平台的 ERC-20 代幣
 * 用於獎勵飼主上傳健康報告和購買 NFT
 */
contract PetCoin is ERC20, Ownable {
    // 每次健康報告上傳的獎勵數量 (10 PetCoin)
    uint256 public constant HEALTH_REPORT_REWARD = 10 * 10**18;
    
    // 授權的健康報告合約地址
    address public healthRecordContract;
    
    // 事件
    event HealthReportReward(address indexed user, uint256 amount);
    event HealthRecordContractUpdated(address indexed newContract);
    
    /**
     * @dev 建構函數
     * @param initialOwner 初始擁有者地址
     */
    constructor(address initialOwner) 
        ERC20("PetCoin", "PTC") 
        Ownable(initialOwner) 
    {
        // 初始鑄造 1,000,000 PetCoin 給部署者
        _mint(initialOwner, 1000000 * 10**decimals());
    }
    
    /**
     * @dev 設定健康報告合約地址
     * @param _healthRecordContract 健康報告合約地址
     */
    function setHealthRecordContract(address _healthRecordContract) external onlyOwner {
        require(_healthRecordContract != address(0), "PetCoin: Invalid contract address");
        healthRecordContract = _healthRecordContract;
        emit HealthRecordContractUpdated(_healthRecordContract);
    }
    
    /**
     * @dev 獎勵用戶 PetCoin（僅限健康報告合約調用）
     * @param user 用戶地址
     */
    function rewardUser(address user) external {
        require(msg.sender == healthRecordContract, "PetCoin: Only health record contract can call");
        require(user != address(0), "PetCoin: Invalid user address");
        
        _mint(user, HEALTH_REPORT_REWARD);
        emit HealthReportReward(user, HEALTH_REPORT_REWARD);
    }
    
    /**
     * @dev 擁有者可以鑄造額外代幣（用於特殊活動或獎勵）
     * @param to 接收地址
     * @param amount 鑄造數量
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "PetCoin: Invalid recipient address");
        _mint(to, amount);
    }
    
    /**
     * @dev 燒毀代幣
     * @param amount 燒毀數量
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    /**
     * @dev 從指定地址燒毀代幣（需要授權）
     * @param from 燒毀地址
     * @param amount 燒毀數量
     */
    function burnFrom(address from, uint256 amount) external {
        _spendAllowance(from, msg.sender, amount);
        _burn(from, amount);
    }
}
