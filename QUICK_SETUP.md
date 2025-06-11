# ⚡ PetHealthChain 快速設置指南（5分鐘）

> 🎯 **目標**：快速運行 PetHealthChain 前端，使用已部署的合約

## 🚀 快速開始

### 1️⃣ 安裝 Node.js
- 到 [nodejs.org](https://nodejs.org/) 下載並安裝 Node.js 16+ 版本

### 2️⃣ 克隆並安裝
```bash
# 克隆專案
git clone https://github.com/your-username/Blockchain_FinalReport.git
cd Blockchain_FinalReport

# 安裝前端依賴
cd frontend
npm install
```

### 3️⃣ 配置 MetaMask
1. 安裝 [MetaMask](https://metamask.io/) 瀏覽器擴展
2. 創建錢包
3. 添加 Sepolia 測試網：
   ```
   網路名稱：Sepolia Test Network
   RPC URL：https://ethereum-sepolia-rpc.publicnode.com
   Chain ID：11155111
   貨幣符號：ETH
   ```

### 4️⃣ 獲取測試 ETH
- 到 [Sepolia Faucet](https://sepoliafaucet.com/) 獲取免費測試 ETH

### 5️⃣ 啟動應用
```bash
npm start
```

### 6️⃣ 開始使用
1. 打開 `http://localhost:3000`
2. 連接 MetaMask 錢包
3. 切換到 Sepolia 測試網
4. 開始體驗 PetHealthChain！🐾

---

## ✅ 檢查清單

- [ ] Node.js 已安裝（`node --version`）
- [ ] 專案已克隆並安裝依賴
- [ ] MetaMask 已安裝並配置 Sepolia 測試網
- [ ] 錢包中有測試 ETH
- [ ] 前端應用已啟動（`npm start`）
- [ ] 瀏覽器能正常訪問 localhost:3000

---

## 🆘 遇到問題？

### Node.js 版本太舊
```bash
# 檢查版本
node --version

# 如果版本低於 16，請到 nodejs.org 下載最新版本
```

### npm install 失敗
```bash
# 清除緩存重試
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### MetaMask 連接失敗
1. 確認 MetaMask 已解鎖
2. 確認網路切換到 Sepolia
3. 重新整理頁面

### 合約互動失敗
1. 確認錢包有足夠測試 ETH
2. 確認網路是 Sepolia 測試網
3. 查看瀏覽器控制台錯誤訊息

---

## 🎉 成功！

如果一切順利，您現在可以：
- 💰 查看和轉帳 PetCoin
- 🧾 上傳健康報告獲得獎勵
- 🖼️ 鑄造寵物 NFT
- 📊 查看歷史記錄

**享受您的 Web3 寵物健康管理體驗！** 🚀 