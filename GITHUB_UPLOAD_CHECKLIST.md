# 📋 GitHub 上傳檢查清單

> ✨ **簡化版本**：其他人只需要運行前端，使用已部署的合約

## ✅ 必須上傳的檔案和目錄

### 📂 專案根目錄
- [ ] `README.md` - 專案主要說明
- [ ] `QUICK_SETUP.md` - 5分鐘快速設置指南
- [ ] `DEPLOYMENT_GUIDE.md` - 完整部署指南
- [ ] `CONTRACT_INTERACTION_GUIDE.md` - 合約調用原理說明
- [ ] `PETCOIN_README.md` - PetCoin 說明
- [ ] `HEALTHREPORT_README.md` - 健康報告說明  
- [ ] `PETNFT_README.md` - PetNFT 說明
- [ ] `CID_UNIQUENESS_UPDATE.md` - CID 更新說明
- [ ] `update_contract_address.md` - 合約地址更新
- [ ] `README_healthreport.md` - 健康報告額外說明
- [ ] `專案報告說明.md` - 專案報告
- [ ] `.gitignore` - Git 忽略配置
- [ ] `.gitmodules` - Git 子模組配置

### 📂 contracts/ 目錄
- [ ] `foundry.toml` - Foundry 配置
- [ ] `src/` 目錄 (所有 .sol 檔案)
  - [ ] `PetCoin.sol`
  - [ ] `HealthReport.sol` 
  - [ ] `PetNFT.sol`
  - [ ] `PetNFTMarket.sol`
- [ ] `script/` 目錄 (所有部署腳本)
  - [ ] `DeployPetCoin.s.sol`
  - [ ] `DeployHealthReport.s.sol`
  - [ ] `DeployPetNFT.s.sol`
- [ ] `test/` 目錄 (所有測試檔案)
  - [ ] `PetCoin.t.sol`
  - [ ] `HealthReport.t.sol`
  - [ ] `PetNFT.t.sol`

**注意：`lib/` 目錄不需要上傳，會自動通過 Git 子模組或 Foundry 安裝**

### 📂 frontend/ 目錄
- [ ] `package.json` - npm 依賴配置
- [ ] `package-lock.json` - 依賴版本鎖定
- [ ] `README.md` - 前端說明
- [ ] `README_HEALTHREPORT.md` - 健康報告前端說明
- [ ] `public/` 目錄 (靜態資源)
- [ ] `src/` 目錄完整結構：
  - [ ] `App.js`, `App.css`, `index.js`, `index.css`
  - [ ] `components/` 目錄 (所有組件和樣式)
  - [ ] `utils/` 目錄 (所有工具函數)
  - [ ] `abi/` 目錄 (所有 ABI 檔案)
  - [ ] `hooks/` 目錄 (如果存在)

---

## ❌ 不可上傳的檔案

### 🚫 自動生成檔案
- [ ] ✅ 確認已排除 `frontend/node_modules/`
- [ ] ✅ 確認已排除 `contracts/cache/`
- [ ] ✅ 確認已排除 `contracts/out/`
- [ ] ✅ 確認已排除 `contracts/broadcast/`
- [ ] ✅ 確認已排除 `contracts/lib/` (Foundry 依賴庫)

### 🚫 敏感信息檔案  
- [ ] ✅ 確認已排除所有 `.env` 檔案
- [ ] ✅ 確認已排除 `.env.local`, `.env.development.local` 等

### 🚫 系統/編輯器檔案
- [ ] ✅ 確認已排除 `.DS_Store`
- [ ] ✅ 確認已排除 `.vscode/`, `.idea/`, `.cursor/`

---

## 🔧 上傳前檢查

### Git 配置檢查
- [ ] 檢查 `.gitignore` 是否正確配置
- [ ] 檢查 `.gitmodules` 是否包含 OpenZeppelin 子模組
- [ ] 確認 `contracts/lib/` 已被 `.gitignore` 排除
- [ ] 執行 `git status` 確認沒有敏感檔案被追蹤

### 檔案完整性檢查
- [ ] 確認所有源碼檔案存在且完整
- [ ] 確認 `package.json` 包含正確的依賴
- [ ] 確認合約 ABI 檔案已更新

### 文檔檢查
- [ ] README.md 包含正確的專案資訊
- [ ] 部署指南完整且可執行
- [ ] 合約地址已更新到最新版本

---

## 🚀 快速命令

### 檢查 Git 狀態
```bash
# 查看將要提交的檔案
git status

# 查看被忽略的檔案
git ls-files --others --ignored --exclude-standard
```

### 檢查敏感檔案
```bash
# 搜尋專案中的私鑰（應該沒有結果）
grep -r "PRIVATE_KEY" . --exclude-dir=node_modules

# 搜尋 .env 檔案（確認都被忽略）
find . -name "*.env*" -type f

# 檢查 lib 目錄是否被正確忽略
ls -la contracts/lib/ 2>/dev/null && echo "⚠️  lib 目錄存在，確認已被 .gitignore 排除" || echo "✅ lib 目錄不存在或被忽略"
```

### 上傳前最終檢查
```bash
# 1. 確認在正確分支
git branch

# 2. 添加所有需要的檔案
git add .

# 3. 檢查即將提交的內容
git diff --cached --name-only

# 4. 提交
git commit -m "Initial commit: PetHealthChain project"

# 5. 推送到 GitHub
git push origin main
```

---

## 📝 提交建議訊息

### 初次上傳
```
feat: Initial PetHealthChain blockchain pet health management platform

- Add PetCoin ERC-20 token contract with reward mechanism
- Add HealthReport contract for health record management  
- Add PetNFT contract for pet NFT minting and trading
- Add React frontend with Web3 integration
- Add comprehensive deployment and setup documentation
```

### 後續更新
```
feat: Add new feature description
fix: Fix specific issue description  
docs: Update documentation
style: Code style improvements
refactor: Code refactoring without feature changes
```

---

## 🎯 簡化運行摘要

其他人只需要 **3 個簡單步驟**：

1. **安裝 Node.js** + **克隆專案**
2. **安裝依賴**: `cd frontend && npm install`  
3. **啟動應用**: `npm start`

**不需要**：
- ❌ 安裝 Foundry
- ❌ 編譯合約
- ❌ 部署合約
- ❌ 配置私鑰
- ❌ 安裝合約依賴

**只需要**：
- ✅ MetaMask 錢包
- ✅ Sepolia 測試網配置
- ✅ 少量測試 ETH 