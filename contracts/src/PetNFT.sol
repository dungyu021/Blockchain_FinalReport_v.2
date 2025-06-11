// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title IPetCoin
 * @dev PetCoin 合約接口
 */
interface IPetCoin {
    function allowance(address owner, address spender) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

/// @title PetHealthChain NFT — 每隻寵物一張鏈上身分證
/// @notice 鑄造時需支付 10 PTC，並將 metadata CID 設為 tokenURI
/// @dev 確保每個CID只能鑄造一個NFT，防止重複鑄造
contract PetNFT is Ownable, ReentrancyGuard {
    /// 單位：PetCoin (18 decimals)
    uint256 public constant MINT_FEE = 10 * 1e18;

    IPetCoin public immutable petCoin;
    uint256 private _tokenIds;

    // NFT元數據結構
    struct PetNFTMetadata {
        uint256 tokenId;        // Token ID
        string name;            // NFT名稱
        string imageCID;        // 圖片IPFS CID
        string description;     // NFT描述
        address owner;          // 擁有者地址
        uint256 timestamp;      // 鑄造時間戳
        bool exists;            // NFT是否存在
    }

    // 儲存所有NFT的metadata
    mapping(uint256 => PetNFTMetadata) public nftMetadata;
    
    // 用戶擁有的NFT列表
    mapping(address => uint256[]) public userNFTs;

    // CID 唯一性映射 - 記錄已使用的CID
    mapping(string => bool) private _usedCIDs;
    
    // CID 對應的 Token ID 映射 - 方便查詢
    mapping(string => uint256) private _cidToTokenId;

    // NFT 擁有者映射
    mapping(uint256 => address) private _owners;

    // NFT 授權映射 (tokenId => approved address)
    mapping(uint256 => address) private _tokenApprovals;

    // 操作員授權映射 (owner => operator => approved)
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // NFT 總供應量
    uint256 public totalSupply;

    // 事件定義
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event Minted(address indexed owner, uint256 indexed tokenId, string name, string imageCID, string description);

    constructor(address petCoinAddr) Ownable(msg.sender) {
        require(petCoinAddr != address(0), "PetNFT: zero addr");
        petCoin = IPetCoin(petCoinAddr);
    }

    /// @param nftName NFT名稱
    /// @param imageCID 圖片的IPFS CID (不含協定頭)
    /// @param description NFT描述
    /// @dev 確保CID未被使用過，實現唯一性約束
    function mint(string calldata nftName, string calldata imageCID, string calldata description) external nonReentrant {
        // 0. 檢查參數是否為空
        require(bytes(nftName).length > 0, "PetNFT: name cannot be empty");
        require(bytes(imageCID).length > 0, "PetNFT: imageCID cannot be empty");
        require(bytes(description).length > 0, "PetNFT: description cannot be empty");
        
        // 1. 檢查CID唯一性 - 防止重複鑄造
        require(!_usedCIDs[imageCID], "PetNFT: imageCID already used");
        
        // 2. 收取費用 — 需先在前端 approve
        require(
            petCoin.allowance(msg.sender, address(this)) >= MINT_FEE,
            "PetNFT: approve first"
        );
        petCoin.transferFrom(msg.sender, address(this), MINT_FEE);

        // 3. 鑄造 NFT
        uint256 id = ++_tokenIds;
        _owners[id] = msg.sender;
        totalSupply++;

        // 4. 儲存NFT元數據
        nftMetadata[id] = PetNFTMetadata({
            tokenId: id,
            name: nftName,
            imageCID: imageCID,
            description: description,
            owner: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        // 5. 更新用戶NFT列表
        userNFTs[msg.sender].push(id);

        // 6. 記錄CID使用狀態
        _usedCIDs[imageCID] = true;
        _cidToTokenId[imageCID] = id;

        emit Transfer(address(0), msg.sender, id);
        emit Minted(msg.sender, id, nftName, imageCID, description);
    }

    /// @notice 檢查CID是否已被使用
    /// @param cid 要檢查的IPFS CID
    /// @return 如果CID已被使用返回true，否則返回false
    function isCIDUsed(string calldata cid) external view returns (bool) {
        return _usedCIDs[cid];
    }

    /// @notice 根據CID查詢對應的Token ID
    /// @param imageCID 圖片IPFS CID
    /// @return 對應的Token ID，如果CID未被使用則返回0
    function getTokenIdByCID(string calldata imageCID) external view returns (uint256) {
        require(_usedCIDs[imageCID], "PetNFT: imageCID not used");
        return _cidToTokenId[imageCID];
    }

    /// @notice 獲取NFT的詳細元數據
    /// @param tokenId Token ID
    /// @return NFT的完整元數據
    function getNFTMetadata(uint256 tokenId) external view returns (PetNFTMetadata memory) {
        require(_exists(tokenId), "PetNFT: token does not exist");
        return nftMetadata[tokenId];
    }

    /// @notice 獲取用戶擁有的所有NFT Token ID列表
    /// @param user 用戶地址
    /// @return 用戶擁有的所有Token ID陣列
    function getUserNFTs(address user) external view returns (uint256[] memory) {
        return userNFTs[user];
    }

    /// @notice 獲取用戶擁有的NFT數量
    /// @param user 用戶地址
    /// @return NFT數量
    function getUserNFTCount(address user) external view returns (uint256) {
        return userNFTs[user].length;
    }

    /// @notice 獲取NFT擁有者
    /// @param tokenId Token ID
    /// @return 擁有者地址
    function ownerOf(uint256 tokenId) external view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "PetNFT: token does not exist");
        return owner;
    }

    /// @notice 獲取用戶擁有的NFT數量
    /// @param owner 擁有者地址
    /// @return NFT數量
    function balanceOf(address owner) external view returns (uint256) {
        require(owner != address(0), "PetNFT: balance query for the zero address");
        return userNFTs[owner].length;
    }

    /// @notice 授權他人操作特定NFT
    /// @param to 被授權者地址
    /// @param tokenId Token ID
    function approve(address to, uint256 tokenId) external {
        address owner = _owners[tokenId];
        require(owner != address(0), "PetNFT: token does not exist");
        require(msg.sender == owner || _operatorApprovals[owner][msg.sender], "PetNFT: not owner nor approved");
        
        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    /// @notice 獲取NFT的授權者
    /// @param tokenId Token ID
    /// @return 被授權者地址
    function getApproved(uint256 tokenId) external view returns (address) {
        require(_exists(tokenId), "PetNFT: token does not exist");
        return _tokenApprovals[tokenId];
    }

    /// @notice 設定或取消操作員授權
    /// @param operator 操作員地址
    /// @param approved 是否授權
    function setApprovalForAll(address operator, bool approved) external {
        require(operator != msg.sender, "PetNFT: approve to caller");
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /// @notice 檢查是否為操作員
    /// @param owner 擁有者地址
    /// @param operator 操作員地址
    /// @return 是否為操作員
    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /// @notice 轉移NFT
    /// @param from 源地址
    /// @param to 目標地址
    /// @param tokenId Token ID
    function transferFrom(address from, address to, uint256 tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "PetNFT: transfer caller is not owner nor approved");
        _transfer(from, to, tokenId);
    }

    /// @notice 安全轉移NFT
    /// @param from 源地址
    /// @param to 目標地址
    /// @param tokenId Token ID
    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "PetNFT: transfer caller is not owner nor approved");
        _transfer(from, to, tokenId);
    }

    /// @notice 安全轉移NFT（帶數據）
    /// @param from 源地址
    /// @param to 目標地址
    /// @param tokenId Token ID
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "PetNFT: transfer caller is not owner nor approved");
        _transfer(from, to, tokenId);
    }

    /// @notice 獲取Token URI
    /// @param tokenId Token ID
    /// @return Token URI
    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "PetNFT: URI query for nonexistent token");
        return string.concat("ipfs://", nftMetadata[tokenId].imageCID);
    }

    /// @dev 內部函數：檢查NFT是否存在
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0);
    }

    /// @dev 內部函數：檢查是否為擁有者或被授權者
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        require(_exists(tokenId), "PetNFT: operator query for nonexistent token");
        address owner = _owners[tokenId];
        return (spender == owner || _tokenApprovals[tokenId] == spender || _operatorApprovals[owner][spender]);
    }

    /// @dev 內部函數：執行轉移
    function _transfer(address from, address to, uint256 tokenId) internal {
        require(_owners[tokenId] == from, "PetNFT: transfer from incorrect owner");
        require(to != address(0), "PetNFT: transfer to the zero address");

        // 清除授權
        _tokenApprovals[tokenId] = address(0);

        // 更新擁有者
        _owners[tokenId] = to;

        // 更新用戶NFT列表
        _updateUserNFTsOnTransfer(from, to, tokenId);

        emit Transfer(from, to, tokenId);
    }

    /// @dev 內部函數：更新轉移時的用戶NFT列表
    function _updateUserNFTsOnTransfer(address from, address to, uint256 tokenId) internal {
        // 從原擁有者的列表中移除
        _removeTokenFromUserList(from, tokenId);
        
        // 添加到新擁有者的列表中
        userNFTs[to].push(tokenId);
        
        // 更新NFT metadata中的擁有者
        nftMetadata[tokenId].owner = to;
    }

    /// @dev 內部函數：從用戶NFT列表中移除指定token
    function _removeTokenFromUserList(address user, uint256 tokenId) internal {
        uint256[] storage userTokens = userNFTs[user];
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (userTokens[i] == tokenId) {
                // 將最後一個元素移到當前位置，然後刪除最後一個元素
                userTokens[i] = userTokens[userTokens.length - 1];
                userTokens.pop();
                break;
            }
        }
    }

    /// 提領累積的 PetCoin
    function withdraw(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "PetNFT: zero addr");
        petCoin.transfer(to, amount);
    }

    /// @notice 獲取總供應量
    /// @return NFT總數量
    function getTotalSupply() external view returns (uint256) {
        return totalSupply;
    }

    /// @notice 獲取合約名稱
    /// @return 合約名稱
    function name() external pure returns (string memory) {
        return "PetHealthChainNFT";
    }

    /// @notice 獲取合約符號
    /// @return 合約符號
    function symbol() external pure returns (string memory) {
        return "PHCN";
    }
}
