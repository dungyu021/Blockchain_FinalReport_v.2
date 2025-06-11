# 🐾 PetHealthChain - 區塊鏈寵物健康管理平台

PetHealthChain 是一套結合區塊鏈技術的寵物健康管理平台，提供以下三大功能模組：

## 🚀 主要功能介紹

### 1. 🧾 健康報告上鏈模組  
- 飼主可將寵物健康檢查報告上傳至 IPFS，並將摘要資訊（Hash + Timestamp）上鏈  
- 醫師或系統可根據地址查詢歷史紀錄，提升診斷效率與資料透明度

### 2. 💰 寵物幣（PetCoin）激勵機制  
- 每次完成健康檢查並上傳報告後，系統自動發送 ERC-20 代幣（PetCoin）作為獎勵  
- 寵物幣可用於後續 NFT 鑄造或購買其他用戶的 NFT
- **每次健康報告獎勵：10 PTC**

### 3. 🖼️ NFT 鑄造與交易模組  
- 飼主可使用寵物照片鑄造專屬 NFT，代表毛孩的數位身分  
- NFT 可在平台上收藏、展示或與其他用戶交換

整體系統由前端 DApp 串接三個獨立智能合約模組，部署於 Ethereum Sepolia 測試鏈，並支援 MetaMask 錢包互動。

## ⚡ 快速開始

**🚀 [5 分鐘快速設定指南](./QUICK_SETUP.md)** - 立即開始使用！（推薦）

**📋 [完整部署指南](./DEPLOYMENT_GUIDE.md)** - 詳細步驟說明

或者按照以下詳細步驟：

### 1. 環境準備
```bash
# 安裝 Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 克隆專案
git clone <your-repo-url>
cd Blockchain_FinalReport
```

### 2. 部署 PetCoin 合約
```bash
# 進入合約目錄
cd contracts

# 安裝依賴
forge install OpenZeppelin/openzeppelin-contracts --no-commit

# 創建環境變數檔案
echo "PRIVATE_KEY=your_private_key_here" > .env
echo "ETHERSCAN_API_KEY=your_etherscan_api_key_here" >> .env

# 編譯合約
forge build

# 執行測試
forge test

# 部署到 Sepolia
source .env
forge script script/DeployPetCoin.s.sol:DeployPetCoin --rpc-url sepolia --broadcast --verify
```

### 3. 啟動前端
```bash
# 進入前端目錄
cd ../frontend

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

### 4. 更新合約地址
部署成功後，將合約地址更新到：
```javascript
// frontend/src/utils/petCoin.js
export const PETCOIN_CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
```

## 📁 專案結構
```
pet-health-web3/
├── contracts/                 # Solidity 智能合約（使用 Foundry）
│   ├── src/
│   │   ├── PetCoin.sol        # ERC-20 代幣合約 ✅
│   │   ├── PetNFT.sol         # ERC-721 NFT 合約
│   │   └── HealthRecord.sol   # 健康報告紀錄合約
│   ├── script/                # 合約部署腳本
│   │   └── DeployPetCoin.s.sol # PetCoin 部署腳本 ✅
│   ├── test/                  # 單元測試
│   │   └── PetCoin.t.sol      # PetCoin 測試 ✅
│   ├── foundry.toml           # Foundry 專案設定 ✅
│   └── DEPLOYMENT.md          # 部署說明 ✅
│ 
├── frontend/                  # React + Vite 前端介面
│   ├── public/                # 靜態資源
│   ├── src/
│   │   ├── abi/               # ABI JSON
│   │   │   └── PetCoin.json   # PetCoin ABI ✅
│   │   ├── components/        # UI 元件（按鈕、表單）
│   │   ├── pages/             # 功能頁（NFT 鑄造、健康報告上傳）
│   │   ├── utils/             # Ethers.js 封裝方法
│   │   │   └── petCoin.js     # PetCoin 工具函數 ✅
│   │   └── App.jsx            # 主頁（已整合 PetCoin）✅
│   ├── .env                   # RPC 與私鑰（開發用）
│   └── package.json           # 相依套件
│
├── README.md                  # 專案簡介（本文件）
├── QUICK_START.md             # 快速設定指南 ✅
├── PETCOIN_README.md          # PetCoin 詳細說明 ✅
├── deploy.sh                  # 自動部署腳本 ✅
├── .gitignore                 # 排除上傳檔案設定
└── LICENSE (optional)         # 授權條款
```

## 🛠️ 技術棧

### 智能合約
- **Foundry**: 開發框架
- **OpenZeppelin**: 安全合約庫
- **Solidity**: 0.8.20

### 前端
- **React**: 用戶介面框架
- **Vite**: 建構工具
- **Ethers.js**: 區塊鏈互動
- **Chakra UI**: UI 組件庫

### 區塊鏈網路
- **Sepolia 測試網**: 部署環境
- **PublicNode RPC**: 免費 RPC 服務
- **MetaMask**: 錢包整合

## 🌐 網路配置

### Sepolia 測試網設定
- **網路名稱**: Sepolia Test Network
- **RPC URL**: `https://ethereum-sepolia-rpc.publicnode.com`
- **Chain ID**: 11155111
- **貨幣符號**: ETH
- **區塊瀏覽器**: https://sepolia.etherscan.io/

### 獲取測試 ETH
- **Sepolia 水龍頭**: https://sepoliafaucet.com/
- **Alchemy 水龍頭**: https://sepoliafaucet.com/
- **Chainlink 水龍頭**: https://faucets.chain.link/sepolia

## 📋 功能清單

### ✅ 已完成
- [x] PetCoin ERC-20 代幣合約
- [x] 健康報告獎勵機制
- [x] 前端錢包整合
- [x] PTC 餘額顯示
- [x] PTC 轉帳功能
- [x] 事件監聽系統
- [x] 完整測試覆蓋
- [x] 部署腳本和文檔

### 🔄 進行中
- [ ] HealthRecord 合約
- [ ] PetNFT 合約
- [ ] IPFS 整合
- [ ] NFT 市場功能

### 📋 待開發
- [ ] 多語言支援
- [ ] 行動端 App
- [ ] 獸醫師認證系統
- [ ] 社群功能

## 📖 詳細文檔

- **[🚀 快速設定指南](./QUICK_START.md)** - 5 分鐘快速部署
- **[📋 PetCoin 詳細說明](./PETCOIN_README.md)** - 代幣系統完整介紹
- **[🔧 部署指南](./contracts/DEPLOYMENT.md)** - 詳細部署步驟
- **[⚙️ API 文檔](./frontend/src/utils/petCoin.js)** - 前端整合說明

## 🤝 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 📞 聯絡資訊

如有問題或建議，請聯繫開發團隊或在 GitHub 上提交 Issue。

---

**⚠️ 免責聲明**: 這是一個教育和演示項目。在生產環境中使用前，請進行充分的安全審計。
