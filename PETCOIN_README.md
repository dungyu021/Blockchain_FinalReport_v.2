# 🐾 PetCoin (PTC) - PetHealthChain 代幣系統

PetCoin 是 PetHealthChain 平台的原生 ERC-20 代幣，用於激勵飼主上傳寵物健康報告並參與平台生態系統。

## 📋 功能特色

### 🪙 代幣基本資訊
- **名稱**: PetCoin
- **符號**: PTC
- **小數位數**: 18
- **初始供應量**: 1,000,000 PTC
- **標準**: ERC-20

### 🎁 獎勵機制
- **健康報告獎勵**: 每次上傳健康報告獲得 10 PTC
- **自動發放**: 通過智能合約自動發放獎勵
- **透明記錄**: 所有獎勵記錄在區塊鏈上可查

### 💰 代幣功能
- ✅ 標準 ERC-20 轉帳功能
- ✅ 授權機制（Approve/TransferFrom）
- ✅ 燒毀功能（Burn）
- ✅ 鑄造功能（僅限擁有者）
- ✅ 事件監聽

## 🏗️ 技術架構

### 智能合約
```
PetCoin.sol
├── ERC20 (OpenZeppelin)
├── Ownable (OpenZeppelin)
├── 獎勵機制
├── 燒毀功能
└── 事件系統
```

### 前端整合
```
frontend/
├── src/abi/PetCoin.json          # 合約 ABI
├── src/utils/petCoin.js          # 合約互動工具
└── src/App.jsx                   # 主應用（已整合）
```

## 📋 前置需求

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v16+)
- [MetaMask](https://metamask.io/) 瀏覽器擴充功能
- Sepolia 測試網 ETH

## ⚡ 5 分鐘快速部署

### 步驟 1: 安裝 Foundry
```bash
# Windows (Git Bash) / macOS / Linux
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 步驟 2: 克隆並設定專案
```bash
# 克隆專案
git clone <your-repo-url>
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
```

### 步驟 5: 部署合約
```bash
# 載入環境變數
source .env

# 部署到 Sepolia
forge script script/DeployPetCoin.s.sol:DeployPetCoin --rpc-url sepolia --broadcast
```

### 步驟 6: 設定前端
```bash
# 進入前端目錄
cd ../frontend

# 安裝前端依賴
npm install

# 啟動開發伺服器
npm run dev
```

### 步驟 7: 更新合約地址
1. 從部署輸出中複製 PetCoin 合約地址
2. 更新 `frontend/src/utils/petCoin.js`:
```javascript
export const PETCOIN_CONTRACT_ADDRESS = "0xYourActualContractAddress";
```

## 🌐 MetaMask 網路設定

### 添加 Sepolia 測試網
- **網路名稱**: Sepolia Test Network
- **RPC URL**: `https://ethereum-sepolia-rpc.publicnode.com`
- **Chain ID**: `11155111`
- **貨幣符號**: `ETH`
- **區塊瀏覽器**: `https://sepolia.etherscan.io/`

### 獲取測試 ETH
訪問以下任一水龍頭：
- https://sepoliafaucet.com/
- https://faucets.chain.link/sepolia

## 📱 前端功能

### 錢包整合
- 🔗 MetaMask 連接
- 💰 ETH 餘額顯示
- 🪙 PTC 餘額顯示
- 🔄 自動更新餘額

### PetCoin 功能
- 💸 轉帳 PTC 代幣
- 🎁 健康報告獎勵
- 📊 交易歷史
- 🔔 事件通知

### 用戶體驗
- ✨ 現代化 UI 設計
- 📱 響應式布局
- 🎯 直觀操作流程
- ⚡ 即時狀態更新

## 🔧 合約互動範例

### 基本查詢
```bash
# 查詢代幣餘額
cast call <CONTRACT_ADDRESS> "balanceOf(address)" <USER_ADDRESS> --rpc-url sepolia

# 查詢總供應量
cast call <CONTRACT_ADDRESS> "totalSupply()" --rpc-url sepolia

# 查詢代幣名稱和符號
cast call <CONTRACT_ADDRESS> "name()" --rpc-url sepolia
cast call <CONTRACT_ADDRESS> "symbol()" --rpc-url sepolia
```

### 代幣操作
```bash
# 轉帳代幣
cast send <CONTRACT_ADDRESS> "transfer(address,uint256)" <TO_ADDRESS> <AMOUNT> --private-key $PRIVATE_KEY --rpc-url sepolia

# 授權代幣
cast send <CONTRACT_ADDRESS> "approve(address,uint256)" <SPENDER_ADDRESS> <AMOUNT> --private-key $PRIVATE_KEY --rpc-url sepolia

# 燒毀代幣
cast send <CONTRACT_ADDRESS> "burn(uint256)" <AMOUNT> --private-key $PRIVATE_KEY --rpc-url sepolia
```

### 驗證合約（可選功能）
如果您想在 Etherscan 上驗證合約代碼，需要：

1. 獲取 Etherscan API Key（免費註冊）
2. 添加到 .env 檔案：
```bash
echo "ETHERSCAN_API_KEY=your_etherscan_api_key_here" >> .env
```
3. 手動驗證合約：
```bash
forge verify-contract <CONTRACT_ADDRESS> src/PetCoin.sol:PetCoin --chain sepolia
```

## 🔧 API 參考

### 主要函數

```solidity
// 查詢餘額
function balanceOf(address account) external view returns (uint256)

// 轉帳代幣
function transfer(address to, uint256 amount) external returns (bool)

// 獎勵用戶（僅限健康報告合約）
function rewardUser(address user) external

// 燒毀代幣
function burn(uint256 amount) external

// 鑄造代幣（僅限擁有者）
function mint(address to, uint256 amount) external

// 設定健康報告合約地址（僅限擁有者）
function setHealthRecordContract(address _healthRecordContract) external
```

### 事件

```solidity
// 健康報告獎勵事件
event HealthReportReward(address indexed user, uint256 amount);

// 健康報告合約更新事件
event HealthRecordContractUpdated(address indexed newContract);

// 標準 ERC-20 轉帳事件
event Transfer(address indexed from, address indexed to, uint256 value);
```

## 🎯 驗證部署

### 1. 檢查合約
在 Sepolia Etherscan 上查看您的合約地址

### 2. 測試前端功能
- 連接 MetaMask 錢包
- 查看 PTC 餘額
- 嘗試轉帳功能
- 上傳健康報告獲得獎勵

## 🐛 常見問題

### Q: 編譯失敗
```bash
# 清理並重新編譯
forge clean
forge build
```

### Q: 部署失敗 - 餘額不足
確保您的錢包有足夠的 Sepolia ETH

### Q: 前端無法連接合約
檢查合約地址是否正確更新到 `petCoin.js`

### Q: MetaMask 連接失敗
確保已切換到 Sepolia 測試網

### Q: 測試失敗
```bash
# 重新安裝依賴
forge install
forge test -vv
```

## 🔐 安全特性

### 權限控制
- 🛡️ Ownable 模式保護關鍵功能
- 🔒 僅授權合約可發放獎勵
- ✅ 地址驗證機制

### 測試覆蓋
- 🧪 完整單元測試
- 🔍 邊界條件測試
- 🚨 錯誤處理測試

## 📊 使用統計

### 代幣分配
- 💼 初始供應量：1,000,000 PTC
- 🎁 獎勵池：可通過鑄造增加
- 🔥 燒毀機制：減少總供應量

### 獎勵機制
- 📄 每次健康報告：10 PTC
- 🏆 特殊活動：可由擁有者額外發放
- 📈 激勵參與：提高平台活躍度

## 🛠️ 開發工具

### 智能合約
- **Foundry**: 開發框架
- **OpenZeppelin**: 安全合約庫
- **Solidity**: 0.8.20
- **PublicNode**: 免費 RPC 服務

### 前端
- **React**: 用戶介面
- **Ethers.js**: 區塊鏈互動
- **Chakra UI**: UI 組件庫

## 📞 注意事項

1. 確保錢包有足夠的 Sepolia ETH 用於 gas 費用
2. 私鑰請妥善保管，不要提交到版本控制
3. 使用 PublicNode 免費 RPC，無需註冊 API Key
4. 部署後記錄合約地址，用於前端整合
5. 合約驗證是可選功能，不影響基本使用
6. 在生產環境中使用前，請進行充分的安全審計

## 📞 支援

如有問題或建議，請聯繫開發團隊或在 GitHub 上提交 Issue。

---

🎉 **恭喜！您已成功部署 PetHealthChain 平台！**

**免責聲明**: 這是一個教育和演示項目。在生產環境中使用前，請進行充分的安全審計。 