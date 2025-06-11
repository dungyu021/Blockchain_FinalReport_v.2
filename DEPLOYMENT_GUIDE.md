# 🚀 PetHealthChain 專案部署指南

## 📋 目錄
1. [需要上傳到 GitHub 的檔案](#需要上傳到-github-的檔案)
2. [不需要上傳的檔案](#不需要上傳的檔案)
3. [其他人如何運行專案](#其他人如何運行專案)
4. [環境配置說明](#環境配置說明)
5. [常見問題解決](#常見問題解決)

---

## 📁 需要上傳到 GitHub 的檔案

### 🔸 專案根目錄
```
Blockchain_FinalReport/
├── README.md                    ✅ 專案說明文件
├── DEPLOYMENT_GUIDE.md          ✅ 本部署指南（新增）
├── PETCOIN_README.md            ✅ PetCoin 詳細說明
├── HEALTHREPORT_README.md       ✅ 健康報告模組說明
├── PETNFT_README.md             ✅ PetNFT 模組說明
├── CID_UNIQUENESS_UPDATE.md     ✅ CID 唯一性更新說明
├── update_contract_address.md   ✅ 合約地址更新說明
├── README_healthreport.md       ✅ 健康報告額外說明
├── .gitignore                   ✅ Git 忽略文件配置
├── .gitmodules                  ✅ Git 子模組配置
└── 專案報告說明.md               ✅ 專案報告文件
```

### 🔸 合約目錄 (contracts/)
```
contracts/
├── foundry.toml                 ✅ Foundry 配置文件
├── src/                         ✅ 智能合約源碼
│   ├── PetCoin.sol             ✅ ERC-20 代幣合約
│   ├── HealthReport.sol        ✅ 健康報告合約
│   ├── PetNFT.sol              ✅ ERC-721 NFT 合約
│   └── PetNFTMarket.sol        ✅ NFT 市場合約
├── script/                      ✅ 部署腳本
│   ├── DeployPetCoin.s.sol     ✅ PetCoin 部署腳本
│   ├── DeployHealthReport.s.sol ✅ 健康報告部署腳本
│   └── DeployPetNFT.s.sol      ✅ PetNFT 部署腳本
└── test/                        ✅ 測試文件
    ├── PetCoin.t.sol           ✅ PetCoin 測試
    ├── HealthReport.t.sol      ✅ 健康報告測試
    └── PetNFT.t.sol            ✅ PetNFT 測試

**注意：`lib/` 目錄不需要上傳，會通過 Git 子模組或 Foundry 自動安裝**
```

### 🔸 前端目錄 (frontend/)
```
frontend/
├── package.json                 ✅ npm 依賴配置
├── package-lock.json            ✅ 依賴版本鎖定文件
├── README.md                    ✅ 前端說明文件
├── README_HEALTHREPORT.md       ✅ 健康報告前端說明
├── public/                      ✅ 靜態資源目錄
├── src/                         ✅ 前端源碼
│   ├── App.js                  ✅ 主應用組件
│   ├── App.css                 ✅ 主應用樣式
│   ├── index.js                ✅ 應用入口點
│   ├── index.css               ✅ 全局樣式
│   ├── components/             ✅ UI 組件
│   │   ├── TopNavbar.js       ✅ 頂部導航欄
│   │   ├── TopNavbar.css      ✅ 導航欄樣式
│   │   ├── HealthReportUploadArea.js ✅ 健康報告上傳組件
│   │   ├── HealthReportUploadArea.css ✅ 上傳組件樣式
│   │   ├── PetNFTMintArea.js  ✅ NFT 鑄造組件
│   │   ├── PetNFTMintArea.css ✅ 鑄造組件樣式
│   │   ├── HistorySection.js  ✅ 歷史記錄組件
│   │   ├── HistorySection.css ✅ 歷史記錄樣式
│   │   ├── Notification.js    ✅ 通知組件
│   │   └── Notification.css   ✅ 通知樣式
│   ├── utils/                  ✅ 工具函數
│   │   ├── petcoin.js         ✅ PetCoin 工具函數
│   │   ├── healthreport.js    ✅ 健康報告工具函數
│   │   └── petNFT.js          ✅ PetNFT 工具函數
│   ├── abi/                    ✅ 合約 ABI 文件
│   │   ├── petcoin.json       ✅ PetCoin ABI
│   │   ├── healthreport.json  ✅ 健康報告 ABI
│   │   └── petnft.json        ✅ PetNFT ABI
│   └── hooks/                  ✅ React Hooks（如果存在）
```

---

## ❌ 不需要上傳的檔案

### 🔸 自動生成的檔案
```
❌ frontend/node_modules/        # npm 依賴包
❌ contracts/cache/              # Foundry 編譯緩存
❌ contracts/out/                # Foundry 編譯輸出
❌ contracts/broadcast/          # 廣播交易記錄
❌ contracts/lib/                # Foundry 依賴庫（通過子模組管理）
❌ .DS_Store                     # macOS 系統文件
```

### 🔸 敏感信息文件
```
❌ .env                          # 環境變數（包含私鑰）
❌ .env.local                    # 本地環境變數
❌ contracts/.env                # 合約環境變數
❌ frontend/.env                 # 前端環境變數
```

### 🔸 編輯器文件
```
❌ .vscode/                      # VS Code 設定
❌ .idea/                        # IntelliJ IDEA 設定
❌ .cursor/                      # Cursor 編輯器設定
```

---

## 🛠️ 其他人如何運行專案

### 步驟 1️⃣：環境準備

#### 安裝必要工具
```bash
# 1. 安裝 Node.js (版本 16 或以上)
# 到 https://nodejs.org/ 下載安裝

# 2. 安裝 Git
# 到 https://git-scm.com/ 下載安裝

# 驗證安裝
node --version    # 應顯示版本號
npm --version     # 應顯示版本號
```

**注意：不需要安裝 Foundry，因為我們使用已部署的合約**

### 步驟 2️⃣：克隆專案

```bash
# 克隆專案（替換為實際的 GitHub URL）
git clone https://github.com/your-username/Blockchain_FinalReport.git
cd Blockchain_FinalReport
```

### 步驟 3️⃣：安裝前端依賴

```bash
# 進入前端目錄
cd frontend

# 安裝 npm 依賴
npm install

# 如果安裝失敗，可以嘗試清除緩存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 步驟 4️⃣：配置錢包

#### 4.1 配置 MetaMask 錢包
1. 安裝 [MetaMask 瀏覽器擴展](https://metamask.io/)
2. 創建錢包並備份助記詞
3. 添加 Sepolia 測試網：
   - 網路名稱：`Sepolia Test Network`
   - RPC URL：`https://ethereum-sepolia-rpc.publicnode.com`
   - Chain ID：`11155111`
   - 貨幣符號：`ETH`
   - 區塊瀏覽器：`https://sepolia.etherscan.io/`

#### 4.2 獲取測試 ETH
訪問以下水龍頭獲取測試 ETH：
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Chainlink Faucet](https://faucets.chain.link/sepolia)

### 步驟 5️⃣：啟動前端應用

```bash
# 在 frontend 目錄下執行
npm start

# 或者使用 dev 命令
npm run dev
```

### 步驟 6️⃣：訪問應用

1. 打開瀏覽器訪問 `http://localhost:3000`
2. 連接 MetaMask 錢包
3. 確保切換到 Sepolia 測試網
4. 開始使用 PetHealthChain！

**🎉 恭喜！您已經成功運行 PetHealthChain 平台！**

---

## 🔧 進階選項（開發者）

如果您是開發者並想要修改合約或重新部署，可以參考以下步驟：

<details>
<summary>點擊展開：合約開發和部署步驟</summary>

### 安裝 Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 安裝合約依賴
```bash
cd contracts
git submodule init
git submodule update
# 或者
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

### 編譯和測試
```bash
forge build
forge test
```

### 部署合約（需要私鑰）
```bash
# 創建 .env 文件
echo "PRIVATE_KEY=你的私鑰" > .env
echo "ETHERSCAN_API_KEY=你的API_Key" >> .env

# 部署
source .env
forge script script/DeployPetCoin.s.sol:DeployPetCoin --rpc-url sepolia --broadcast --verify
```

### 更新前端合約地址
如果重新部署，記得更新 `frontend/src/utils/` 目錄下的合約地址。

</details>

---

## ⚙️ 環境配置說明

### 🔸 必要的軟體版本
- **Node.js**: 16.0+ 或 18.0+
- **npm**: 8.0+
- **Git**: 2.30+
- **Foundry**: 僅開發者需要（一般用戶不需要）

### 🔸 瀏覽器要求
- **Chrome**: 90+ (推薦)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### 🔸 操作系統支援
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Ubuntu 20.04+
- ✅ 其他 Linux 發行版

---

## 🚨 常見問題解決

### Q1: `forge` 命令找不到
**解決方案：**
```bash
# 重新安裝 Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 添加到 PATH（Linux/macOS）
echo 'export PATH="$HOME/.foundry/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Q2: npm install 失敗
**解決方案：**
```bash
# 清除 npm 緩存
npm cache clean --force

# 刪除 node_modules 重新安裝
rm -rf node_modules package-lock.json
npm install

# 或使用 yarn
npm install -g yarn
yarn install
```

### Q3: MetaMask 連接失敗
**解決方案：**
1. 確認 MetaMask 已安裝並解鎖
2. 檢查網路是否為 Sepolia 測試網
3. 重新整理頁面並重新連接
4. 清除瀏覽器緩存

### Q4: 合約互動失敗
**解決方案：**
1. 確認 Sepolia 測試網中有足夠的 ETH
2. 檢查合約地址是否正確
3. 確認 gas limit 和 gas price 設定
4. 查看瀏覽器開發者工具的錯誤信息

### Q5: IPFS 上傳失敗
**解決方案：**
1. 檢查網路連接
2. 確認文件大小不超過限制
3. 嘗試使用不同的 IPFS 節點
4. 查看控制台錯誤信息

### Q6: 子模組初始化失敗
**解決方案：**
```bash
# 手動初始化子模組
git submodule deinit -f .
git submodule init
git submodule update

# 或者直接安裝依賴
cd contracts
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

---

## 📞 技術支援

如果您在部署過程中遇到問題：

1. **檢查控制台錯誤信息**：打開瀏覽器開發者工具查看詳細錯誤
2. **查看專案文檔**：閱讀各模組的 README 文件
3. **搜索類似問題**：在 GitHub Issues 中搜索相關問題
4. **提交新 Issue**：如果問題仍未解決，請在 GitHub 上提交詳細的 Issue

---

## 🎉 恭喜！

如果您成功完成了上述步驟，您現在擁有一個完全運行的 PetHealthChain 區塊鏈寵物健康管理平台！

可以開始：
- 🧾 上傳健康報告並獲得 PetCoin 獎勵
- 🖼️ 鑄造您的寵物 NFT
- 💰 管理您的 PetCoin 代幣
- 📊 查看歷史記錄和統計

**享受您的 Web3 寵物健康管理體驗！** 🐾 