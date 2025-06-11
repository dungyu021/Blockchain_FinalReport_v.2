# 🔒 PetNFT CID 唯一性更新

## 📋 更新概要

本次更新為 PetNFT 合約添加了 **CID 唯一性約束**，確保每個 IPFS CID 只能用於鑄造一個 NFT，防止重複鑄造和資源浪費。

## 🚀 新增功能

### 1. CID 唯一性檢查
- **功能說明**: 每個 CID 只能鑄造一個 NFT
- **實現方式**: 使用 `mapping(string => bool) private _usedCIDs` 記錄已使用的 CID
- **錯誤處理**: 嘗試使用已存在的 CID 時拋出 `"cid already used"` 錯誤

### 2. 新增合約函數

#### `isCIDUsed(string calldata cid) external view returns (bool)`
- **目的**: 檢查指定 CID 是否已被使用
- **參數**: `cid` - 要檢查的 IPFS CID
- **返回值**: `true` 如果 CID 已被使用，`false` 如果未被使用

#### `getTokenIdByCID(string calldata cid) external view returns (uint256)`
- **目的**: 根據 CID 查詢對應的 Token ID
- **參數**: `cid` - IPFS CID
- **返回值**: 對應的 Token ID
- **錯誤**: 如果 CID 未被使用，拋出 `"cid not used"` 錯誤

### 3. 增強的 mint 函數
```solidity
function mint(string calldata cid) external {
    // 0. 檢查CID是否為空
    require(bytes(cid).length > 0, "empty cid");
    
    // 1. 檢查CID唯一性 - 防止重複鑄造
    require(!_usedCIDs[cid], "cid already used");
    
    // 2. 收取費用
    // 3. 鑄造NFT
    // 4. 記錄CID使用狀態
    _usedCIDs[cid] = true;
    _cidToTokenId[cid] = id;
}
```

## 🔧 合約變更

### 新增狀態變量
```solidity
// CID 唯一性映射 - 記錄已使用的CID
mapping(string => bool) private _usedCIDs;

// CID 對應的 Token ID 映射 - 方便查詢
mapping(string => uint256) private _cidToTokenId;
```

### 新增事件
現有的 `Minted` 事件保持不變：
```solidity
event Minted(address indexed owner, uint256 indexed tokenId, string cid);
```

## 🌐 前端整合

### 新增 JavaScript 函數

#### `checkCIDUsed(cid)`
```javascript
export const checkCIDUsed = async (cid) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const petNFTContract = new ethers.Contract(PETNFT_CONTRACT_ADDRESS, PetNFTABI, provider);
  return await petNFTContract.isCIDUsed(cid);
};
```

#### `getTokenIdByCID(cid)`
```javascript
export const getTokenIdByCID = async (cid) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const petNFTContract = new ethers.Contract(PETNFT_CONTRACT_ADDRESS, PetNFTABI, provider);
  const tokenId = await petNFTContract.getTokenIdByCID(cid);
  return tokenId.toString();
};
```

#### `validateIPFSCID(cid)`
```javascript
export const validateIPFSCID = (cid) => {
  if (!cid || typeof cid !== 'string') return false;
  
  // 支援CIDv0 (Qm...) 和CIDv1 (bafy..., bafk...)格式
  const cidPattern = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{52,}|bafk[a-z0-9]{52,})/;
  return cidPattern.test(cid.trim());
};
```

#### 更新的 `mintNFT(imageCID)` 函數
```javascript
export const mintNFT = async (imageCID) => {
  // 1. 驗證CID格式
  if (!validateIPFSCID(imageCID)) {
    throw new Error('無效的IPFS CID格式');
  }
  
  // 2. 檢查CID唯一性
  const isCIDUsed = await checkCIDUsed(imageCID);
  if (isCIDUsed) {
    throw new Error('此CID已被使用，請使用不同的圖片鑄造NFT');
  }
  
  // 3. 直接使用CID鑄造NFT
  const tx = await petNFTContract.mint(imageCID);
  return { success: true, txHash: tx.hash, imageCID };
};
```

### 更新的鑄造流程
```javascript
// 新流程：用戶預先上傳圖片到IPFS，直接使用CID鑄造
// 1. 驗證CID格式
// 2. 檢查PTC餘額
// 3. 檢查授權額度  
// 4. 檢查CID唯一性
const isCIDUsed = await checkCIDUsed(imageCID);
if (isCIDUsed) {
  throw new Error('此CID已被使用，請使用不同的圖片鑄造NFT');
}
// 5. 直接使用CID鑄造NFT
```

## 🧪 測試用例

新增了以下測試用例：

### `testCIDUniqueness()`
- 測試 CID 唯一性約束
- 驗證 `isCIDUsed()` 和 `getTokenIdByCID()` 函數
- 確保重複使用相同 CID 會失敗

### `testEmptyCID()`
- 測試空 CID 的處理
- 確保空字串 CID 會被拒絕

### `testUnusedCIDQuery()`
- 測試查詢未使用 CID 的行為
- 驗證適當的錯誤處理

## 📝 錯誤訊息

| 錯誤訊息 | 觸發條件 | 中文說明 |
|---------|----------|----------|
| `"empty cid"` | CID 為空字串 | CID不能為空 |
| `"cid already used"` | CID 已被使用 | 此CID已被使用，無法重複鑄造 |
| `"cid not used"` | 查詢未使用的 CID | CID未被使用 |

## 🔄 向後兼容性

- ✅ 現有的 `mint()` 函數接口保持不變
- ✅ 現有的事件和查詢函數無變化
- ✅ 只是增加了額外的驗證邏輯
- ✅ 已部署的 NFT 不受影響

## 🚀 部署說明

1. **編譯合約**:
   ```bash
   cd contracts && forge build
   ```

2. **運行測試**:
   ```bash
   forge test
   ```

3. **部署到測試網**:
   ```bash
   forge script script/DeployPetNFT.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast
   ```

4. **更新前端 ABI**:
   - 更新 `frontend/src/abi/petnft.json`
   - 包含新的 `isCIDUsed` 和 `getTokenIdByCID` 函數

## 💡 使用建議

### 對於開發者
- 在鑄造前先檢查 CID 是否已被使用
- 使用有意義且唯一的 metadata 內容
- 實施適當的錯誤處理

### 對於用戶
- **預先準備**: 先將寵物圖片上傳到IPFS並獲得CID
- **確保唯一性**: 每個CID只能鑄造一個NFT，使用不同的圖片內容
- **CID格式**: 支援CIDv0 (以Qm開頭) 和CIDv1 (以bafy或bafk開頭)
- **查詢功能**: 可以通過 `getTokenIdByCID()` 查詢特定CID對應的NFT

## 🔐 安全性提升

1. **防止重複鑄造**: 避免相同內容產生多個 NFT
2. **資源節約**: 減少區塊鏈存儲重複數據
3. **內容唯一性**: 確保每個 NFT 代表獨特的寵物內容
4. **透明度**: 公開的查詢函數提供完全透明的 CID 使用狀態

## 🔄 完整使用流程

### 第一步：準備圖片CID
1. 將寵物圖片上傳到IPFS服務 (如Pinata、NFT.Storage等)
2. 獲得圖片的CID (例如：`QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o`)
3. 複製CID備用

### 第二步：鑄造NFT
1. 連接MetaMask錢包
2. 確保有足夠的PTC餘額 (至少10 PTC)
3. 在前端表單中貼上圖片CID
4. 點擊「鑄造NFT」按鈕
5. 確認交易並等待上鏈

### 第三步：驗證結果
1. 檢查交易狀態
2. 使用 `getTokenIdByCID()` 查詢NFT ID
3. 在錢包中查看新鑄造的NFT

## 📞 聯絡支援

如果在使用過程中遇到問題，請查看：
- 合約測試用例了解預期行為
- 前端錯誤處理獲得詳細錯誤訊息
- 區塊鏈瀏覽器確認交易狀態

### 常見問題
- **「此CID已被使用」**: 請使用不同的圖片或確認CID是否正確
- **「無效的IPFS CID格式」**: 檢查CID格式是否正確 (Qm... 或 bafy...)
- **「PTC餘額不足」**: 請確保錢包中有至少10 PTC 