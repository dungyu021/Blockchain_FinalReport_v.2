# 🏥 HealthReport - PetHealthChain 健康報告管理系統

HealthReport 是 PetHealthChain 平台的核心智能合約，專門管理寵物健康報告的上鏈儲存。整合 Storacha (Web3 Storage) 平台，實現去中心化的健康檔案管理。

## 📋 功能特色

### 🗂️ 健康報告管理
- **報告上傳**: 儲存健康報告的 IPFS CID 和元數據到區塊鏈
- **報告查詢**: 透過寵物編號或用戶地址查詢歷史報告
- **報告更新**: 允許飼主更新報告的 IPFS CID
- **報告驗證**: 提供報告有效性驗證機制

### 🔗 Storacha 整合
- **IPFS 儲存**: 支援 Storacha 平台的 CID 儲存
- **檔案追蹤**: 記錄每個報告的 IPFS 哈希值
- **版本控制**: 支援報告檔案的更新和版本追蹤

### 📊 數據結構
```solidity
struct Report {
    uint256 reportId;      // 報告編號
    string petId;          // 寵物編號
    string reportType;     // 報告類型（血液檢查、疫苗接種等）
    string reportName;     // 報告名稱
    string ipfsCID;        // IPFS CID (來自 Storacha)
    string description;    // 報告描述
    address owner;         // 飼主地址
    uint256 timestamp;     // 上傳時間戳
    bool isValid;          // 報告是否有效
}
```

## 🏗️ 技術架構

### 智能合約
```
HealthReport.sol
├── Ownable (OpenZeppelin)         # 擁有者管理
├── ReentrancyGuard (OpenZeppelin) # 重入攻擊防護
├── 報告管理系統
├── IPFS CID 儲存
├── 事件系統
└── 批量查詢功能
```

### 前端整合準備
```
frontend/
├── src/abi/HealthReport.json     # 合約 ABI
├── src/utils/healthReport.js     # 合約互動工具
└── src/components/               # 健康報告相關組件
```

## 📋 前置需求

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v16+)
- [Foundry](https://book.getfoundry.sh/) 開發框架
- [MetaMask](https://metamask.io/) 瀏覽器擴充功能
- Sepolia 測試網 ETH
- [Storacha](https://storacha.network/) 帳戶（用於 IPFS 儲存）

## ⚡ 5 分鐘快速部署

### 步驟 1: 安裝 Foundry
```bash
# Windows (Git Bash) / macOS / Linux
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 步驟 2: 克隆並設定專案
```bash
# 進入合約目錄
cd Blockchain_FinalReport/contracts

# 安裝智能合約依賴
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

### 步驟 3: 設定環境變數
```bash
# 創建 .env 檔案
echo "PRIVATE_KEY=your_metamask_private_key_here" > .env
```

**🔑 如何獲取私鑰:**
1. 開啟 MetaMask
2. 點擊帳戶名稱 → 帳戶詳情
3. 點擊「匯出私鑰」
4. 輸入密碼並複製私鑰

### 步驟 4: 編譯和測試
```bash
# 編譯合約
forge build

# 執行測試
forge test -vv

# 執行特定測試
forge test --match-contract HealthReportTest -vv
```

### 步驟 5: 部署合約
```bash
# 載入環境變數
source .env

# 部署到 Sepolia 測試網
forge script script/DeployHealthReport.s.sol:DeployHealthReport --rpc-url sepolia --broadcast --verify

# 如果沒有設定 Etherscan API，不使用 --verify
forge script script/DeployHealthReport.s.sol:DeployHealthReport --rpc-url sepolia --broadcast
```

### 步驟 6: 記錄合約地址
部署成功後，從輸出中複製合約地址：
```
HealthReport contract deployed to: 0xYourActualContractAddress
Deployer address: 0xYourDeployerAddress
Contract owner: 0xYourDeployerAddress
Initial report counter: 1
```

## 🌐 Storacha 設定指南

### 步驟 1: 註冊 Storacha 帳戶
1. 訪問 [Storacha.network](https://storacha.network/)
2. 註冊新帳戶或登入現有帳戶
3. 完成帳戶驗證

### 步驟 2: 上傳檔案取得 CID
1. 在 Storacha 控制台上傳健康報告檔案
2. 上傳完成後，複製 IPFS CID
3. CID 格式通常為：`bafkreixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 步驟 3: 在前端使用 CID
將複製的 CID 貼到前端界面的「請貼上CID」欄位中完成上鏈作業。

## 📱 合約互動指南

### 基本查詢操作
```bash
# 設定合約地址變數
export CONTRACT_ADDRESS="0xYourActualContractAddress"

# 查詢總報告數量
cast call $CONTRACT_ADDRESS "getTotalReportCount()" --rpc-url sepolia

# 查詢特定報告
cast call $CONTRACT_ADDRESS "getReport(uint256)" 1 --rpc-url sepolia

# 查詢用戶報告數量
cast call $CONTRACT_ADDRESS "getUserReportCount(address)" 0xUserAddress --rpc-url sepolia
```

### 上傳健康報告
```bash
# 上傳新報告
cast send $CONTRACT_ADDRESS "uploadReport(string,string,string,string,string)" \
  "PET001" \
  "血液檢查" \
  "定期健康檢查" \
  "bafkreiexample123456789abcdef" \
  "寵物血液檢查報告，各項指標正常" \
  --private-key $PRIVATE_KEY \
  --rpc-url sepolia
```

### 查詢報告資訊
```bash
# 查詢用戶所有報告編號
cast call $CONTRACT_ADDRESS "getUserReports(address)" 0xUserAddress --rpc-url sepolia

# 查詢特定寵物的所有報告
cast call $CONTRACT_ADDRESS "getPetReports(string)" "PET001" --rpc-url sepolia

# 檢查報告是否有效
cast call $CONTRACT_ADDRESS "isValidReport(uint256)" 1 --rpc-url sepolia
```

## 🔗 與 PetCoin 整合

HealthReport 合約預留了與 PetCoin 整合的接口。要啟用獎勵功能：

### 步驟 1: 部署 PetCoin 合約
```bash
# 部署 PetCoin
forge script script/DeployPetCoin.s.sol:DeployPetCoin --rpc-url sepolia --broadcast
```

### 步驟 2: 設定合約互相關聯
```bash
# 在 HealthReport 中設定 PetCoin 地址
cast send $CONTRACT_ADDRESS "setPetCoinContract(address)" $PETCOIN_ADDRESS \
  --private-key $PRIVATE_KEY \
  --rpc-url sepolia

# 在 PetCoin 中設定 HealthReport 地址
cast send $PETCOIN_ADDRESS "setHealthRecordContract(address)" $CONTRACT_ADDRESS \
  --private-key $PRIVATE_KEY \
  --rpc-url sepolia
```

### 步驟 3: 修改 HealthReport 合約啟用獎勵
在 `uploadReport` 函數中添加 PetCoin 獎勵邏輯：
```solidity
// 在 uploadReport 函數末尾添加
if (petCoinContract != address(0)) {
    IPetCoin(petCoinContract).rewardUser(msg.sender);
}
```

## 🎯 前端整合範例

### React 組件範例
```javascript
import { ethers } from 'ethers';
import HealthReportABI from './abi/HealthReport.json';

const HEALTHREPORT_CONTRACT_ADDRESS = "0xYourActualContractAddress";

// 上傳健康報告
async function uploadHealthReport(petId, reportType, reportName, ipfsCID, description) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(HEALTHREPORT_CONTRACT_ADDRESS, HealthReportABI, signer);
  
  try {
    const tx = await contract.uploadReport(petId, reportType, reportName, ipfsCID, description);
    await tx.wait();
    console.log('報告上傳成功:', tx.hash);
  } catch (error) {
    console.error('上傳失敗:', error);
  }
}

// 查詢用戶報告
async function getUserReports(userAddress) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(HEALTHREPORT_CONTRACT_ADDRESS, HealthReportABI, provider);
  
  try {
    const reportIds = await contract.getUserReports(userAddress);
    const reports = [];
    
    for (const id of reportIds) {
      const report = await contract.getReport(id);
      reports.push(report);
    }
    
    return reports;
  } catch (error) {
    console.error('查詢失敗:', error);
    return [];
  }
}
```

## 🔧 故障排除

### 常見問題

**Q: 部署時出現 "insufficient funds" 錯誤**
A: 確保您的錢包有足夠的 Sepolia ETH。可從水龍頭獲取：
- https://sepoliafaucet.com/
- https://faucets.chain.link/sepolia

**Q: 合約驗證失敗**
A: 檢查是否設定了 Etherscan API Key：
```bash
echo "ETHERSCAN_API_KEY=your_api_key_here" >> .env
```

**Q: IPFS CID 格式錯誤**
A: 確保從 Storacha 複製的 CID 格式正確，通常以 `bafkrei` 開頭。

**Q: 交易失敗 "execution reverted"**
A: 檢查輸入參數是否符合要求（非空字串、有效地址等）。

### 測試網路配置
**Sepolia 測試網設定:**
- 網路名稱: Sepolia Test Network
- RPC URL: `https://ethereum-sepolia-rpc.publicnode.com`
- Chain ID: `11155111`
- 貨幣符號: `ETH`
- 區塊瀏覽器: `https://sepolia.etherscan.io/`

## 📊 事件監聽

合約提供完整的事件系統，可用於前端即時更新：

```javascript
// 監聽報告上傳事件
contract.on("ReportUploaded", (reportId, owner, petId, reportType, ipfsCID, timestamp) => {
  console.log(`新報告上傳: ${reportId}, 寵物: ${petId}, 類型: ${reportType}`);
});

// 監聽報告更新事件
contract.on("ReportUpdated", (reportId, owner, ipfsCID) => {
  console.log(`報告更新: ${reportId}, 新CID: ${ipfsCID}`);
});
```

## 🚀 生產部署建議

1. **主網部署前測試**: 在測試網充分測試所有功能
2. **Gas 費用優化**: 考慮批量操作來減少交易費用
3. **合約升級**: 考慮使用代理模式實現合約升級
4. **存取控制**: 根據需要調整權限管理
5. **監控和告警**: 設定合約事件監控

## 📚 API 參考

### 主要函數

```solidity
// 上傳健康報告
function uploadReport(string petId, string reportType, string reportName, string ipfsCID, string description)

// 獲取報告詳情
function getReport(uint256 reportId) returns (Report memory)

// 獲取用戶所有報告
function getUserReports(address user) returns (uint256[] memory)

// 獲取寵物所有報告
function getPetReports(string petId) returns (uint256[] memory)

// 更新報告 CID
function updateReportCID(uint256 reportId, string newIpfsCID)

// 檢查報告有效性
function isValidReport(uint256 reportId) returns (bool)
```

## 📝 授權條款

本項目採用 MIT 授權條款。詳情請參閱 LICENSE 檔案。

---

🐾 **PetHealthChain Team** - 讓每個毛孩都有完整的健康記錄！ 