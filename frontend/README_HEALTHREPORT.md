# PetHealthChain - 健康報告上傳組件

## 🐾 功能介紹

健康報告上傳組件是 PetHealthChain 平台的核心功能，允許飼主將寵物的健康檢查報告上傳到區塊鏈，並自動獲得 PetCoin (PTC) 代幣獎勵。

## 🎨 設計特色

- **橘色主題設計**: 符合 PetHealthChain 品牌配色
- **現代化 UI**: 漸層背景、圓角設計、動態效果
- **響應式設計**: 支援桌面、平板、手機裝置
- **互動動效**: 按鈕 hover 效果、載入動畫、貓咪圖標彈跳

## 🚀 主要功能

### 1. 表單輸入
- **寵物編號**: 識別特定寵物
- **報告類型**: 如血液檢查、X光檢查等
- **報告名稱**: 報告的標題
- **IPFS CID**: 從 Storacha 上傳獲得的文件 CID
- **描述**: 詳細描述健康報告內容

### 2. 錢包整合
- **自動檢測**: 自動檢測 MetaMask 連接狀態
- **一鍵連接**: 快速連接 MetaMask 錢包
- **狀態顯示**: 即時顯示錢包連接狀態

### 3. 智能合約交互
- **報告上鏈**: 將報告資訊存儲到區塊鏈
- **事件監聽**: 即時接收上傳成功通知
- **獎勵機制**: 自動獲得 10 PTC 代幣獎勵

## 📱 使用流程

1. **準備工作**
   - 安裝 MetaMask 瀏覽器擴展
   - 切換到 Sepolia 測試網路
   - 確保有足夠的 ETH 支付 gas 費用

2. **上傳檔案到 Storacha**
   - 前往 [Storacha](https://storacha.network/)
   - 註冊帳戶並上傳健康報告檔案
   - 複製獲得的 IPFS CID

3. **填寫表單**
   - 連接 MetaMask 錢包
   - 輸入寵物編號、報告類型、報告名稱
   - 貼上 IPFS CID
   - 添加描述（選填）

4. **提交上鏈**
   - 點擊「上鏈」按鈕
   - 確認 MetaMask 交易
   - 等待交易確認
   - 獲得 10 PTC 代幣獎勵

## 🛠️ 技術架構

### 前端組件
```
HealthReportUploadArea/
├── HealthReportUploadArea.js    # React 組件
├── HealthReportUploadArea.css   # 樣式文件
└── index.js                     # 導出文件
```

### 依賴項
- **React**: 前端框架
- **ethers.js**: 以太坊交互
- **CSS3**: 現代化樣式

### 合約集成
```javascript
// 工具文件
utils/healthreport.js
├── 合約實例化
├── 錢包連接
├── 報告上傳
├── 事件監聽
└── 數據格式化
```

## 🎯 合約地址

```
HealthReport: 0xE8d9afF8Fa0B38d47B7B7DAdc58e2e7178cF5Ea0
PetCoin: 0xd0D7899C8DB6456BE828e086ac89D803F0999E0B
```

## 📋 環境要求

- Node.js 16+
- React 18+
- MetaMask 瀏覽器擴展
- Sepolia 測試網路

## 🔧 開發指令

```bash
# 啟動開發服務器
npm start

# 構建生產版本
npm run build

# 運行測試
npm test
```

## 🔒 安全考量

1. **輸入驗證**: 所有表單輸入都會進行格式驗證
2. **IPFS CID 驗證**: 檢查 CID 格式的有效性
3. **交易確認**: 等待區塊鏈交易確認
4. **錯誤處理**: 完善的錯誤提示和處理機制

## 🎨 樣式定制

### 主色調
- 主橘色: `#FF8C42`
- 漸層起點: `#FFB366`
- 強調色: `#FF6B35`

### 響應式斷點
- 平板: `768px`
- 手機: `480px`

## 📞 技術支援

如有任何技術問題，請聯繫開發團隊或查看：
- [Storacha 文檔](https://storacha.network/docs/)
- [MetaMask 使用指南](https://metamask.io/faqs/)
- [Sepolia 測試網路](https://sepolia.etherscan.io/)

---

## 🎉 恭喜！

您已成功設置健康報告上傳功能！每次成功上傳報告，您都將獲得 10 PTC 代幣獎勵，這些代幣可以用於平台上的其他功能。

**記住**: 這是測試環境，請使用測試代幣進行操作。 