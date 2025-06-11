# PetHealthChain DApp Frontend

這是 PetHealthChain DApp 的前端應用，基於 React 構建，支持 MetaMask 錢包連接和 PetCoin 代幣交互。

## 功能特色

- 🐾 美觀的寵物健康報告上傳界面
- 🦊 MetaMask 錢包連接
- 💰 PetCoin (PTC) 代幣餘額顯示
- 📋 健康報告表單提交
- 📱 響應式設計

## 技術架構

### 組件結構
- **TopNavbar**: 頂部導航欄，包含 Logo 和錢包連接功能
- **HealthReportUploadArea**: 健康報告上傳區域

### 顏色主題
- 主色調: `#ffeed6` (淺奶茶色)
- 次要色: `#ffb370` (橙黃色)
- 強調色: `#f08651` (橙紅色)

## 安裝與運行

1. 安裝依賴:
```bash
cd frontend
npm install
```

2. 啟動開發服務器:
```bash
npm start
```

3. 在瀏覽器中打開 [http://localhost:3000](http://localhost:3000)

## MetaMask 設置

1. 確保已安裝 MetaMask 瀏覽器擴展
2. 連接到正確的網絡（根據您的合約部署情況）
3. 點擊「連接 MetaMask」按鈕授權連接

## PetCoin 合約集成

合約地址: `0xd0D7899C8DB6456BE828e086ac89D803F0999E0B`

目前支持的功能:
- 查看 PTC 代幣餘額
- 錢包地址顯示
- ETH 餘額顯示

## 文件結構

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── TopNavbar.js
│   │   ├── TopNavbar.css
│   │   ├── HealthReportUploadArea.js
│   │   └── HealthReportUploadArea.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## 待開發功能

- [ ] IPFS 存儲集成
- [ ] 智能合約健康報告提交
- [ ] 歷史記錄查詢
- [ ] 多語言支持
- [ ] 更多的 PetCoin 功能集成 