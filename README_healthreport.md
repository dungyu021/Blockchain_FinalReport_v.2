# HealthReport.sol 模組

## 📋 模組簡介

此合約提供一個簡單的寵物健康紀錄上鏈系統，飼主可上傳健康報告至 IPFS，並將摘要與報告位置寫入區塊鏈。獸醫可查詢寵物歷史紀錄供診斷參考。

## 📁 檔案說明

- `contracts/HealthReport.sol`：主合約，包含報告上傳與查詢功能
- `scripts/deployHealthReport.js`：部署合約的腳本
- `artifacts/HealthReport.json`：由 Hardhat 自動產出的 ABI（給前端串接用）

## 📦 方法說明

### uploadReport(petId, ipfsHash, summary)

- 上傳健康報告
- `petId`：寵物識別碼
- `ipfsHash`：IPFS 報告連結
- `summary`：報告摘要文字

### getReports(petId)

- 查詢某隻寵物所有報告
- 回傳 `Report[]` 陣列，包含：
  - `ipfsHash`
  - `summary`
  - `timestamp`

## 🚀 部署方式

```bash
npx hardhat run scripts/deployHealthReport.js
