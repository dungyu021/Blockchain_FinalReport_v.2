# 🔧 Sepolia RPC 連接問題修復指南

## 🚨 問題描述
如果您看到控制台出現類似以下錯誤：
```
MetaMask - RPC Error: Execution prevented because the circuit breaker is open
{code: -32603, message: "Execution prevented because the circuit breaker is open"}
```

這表示當前使用的 RPC 端點出現了問題。

## 🛠️ 立即修復步驟

### 方法 1: 更新 MetaMask 網路設定（推薦）

1. **打開 MetaMask 錢包**
2. **點擊頂部的網路名稱** (目前顯示 "Sepolia Test Network")
3. **點擊 "設定" 或 "編輯"**
4. **更新 RPC URL** 為以下任一選項：

#### 🌟 推薦 RPC 端點（按穩定性排序）：

```
1. https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
   ✅ 高穩定性，Infura 官方提供

2. https://rpc.sepolia.org
   ✅ 社群維護，通常很穩定

3. https://eth-sepolia.g.alchemy.com/v2/demo
   ✅ Alchemy 官方demo端點

4. https://sepolia.gateway.tenderly.co
   ✅ Tenderly 提供的端點

5. https://ethereum-sepolia.blockpi.network/v1/rpc/public
   ✅ BlockPI 公共端點
```

### 方法 2: 重置 MetaMask 連接

1. **重新整理網頁** (F5 或 Ctrl+R)
2. **中斷 MetaMask 連接**：
   - 點擊 MetaMask 圖示
   - 選擇 "已連接的網站"
   - 中斷與當前網站的連接
3. **重新連接錢包**

### 方法 3: 清除瀏覽器緩存

1. **按 F12 打開開發者工具**
2. **右鍵點擊重整按鈕**
3. **選擇 "清空快取並重新載入"**

## 🔍 如何驗證修復成功

修復後，您應該看到：
- ✅ 控制台不再出現 RPC 錯誤
- ✅ 可以正常連接錢包
- ✅ ETH 和 PTC 餘額正常顯示
- ✅ 可以正常進行交易

## 📋 完整的 Sepolia 測試網設定

```
網路名稱: Sepolia Test Network
RPC URL: https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
Chain ID: 11155111
貨幣符號: ETH
區塊瀏覽器: https://sepolia.etherscan.io/
```

## 🆘 如果問題仍然存在

1. **檢查網路連接**：確保您的網路連接穩定
2. **更換網路**：嘗試使用不同的網路連接（如手機熱點）
3. **重啟瀏覽器**：完全關閉並重啟瀏覽器
4. **更新 MetaMask**：確保使用最新版本的 MetaMask
5. **聯繫支援**：如果問題持續，請提供錯誤訊息詳情

## 🔄 備用方案

如果所有 RPC 端點都無法使用，可以：
1. **等待一段時間**：RPC 問題通常是暫時的
2. **使用不同的瀏覽器**：Chrome、Firefox、Edge 等
3. **檢查 MetaMask 狀態**：訪問 https://status.metamask.io/

---

**💡 提示**：建議收藏此頁面，以便日後快速解決類似問題！ 