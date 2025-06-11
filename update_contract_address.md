# HealthReport合約重新部署指南

## 📋 重新部署步驟

### 1. 編譯合約
```bash
cd contracts
forge build
```

### 2. 部署新的HealthReport合約
```bash
forge create src/HealthReport.sol:HealthReport \
  --constructor-args "0x9FEcDD05B3D96344B0015e8785a604d9BACF3C1D" \
  --private-key $PRIVATE_KEY \
  --rpc-url sepolia
```

⚠️ **記錄新的合約地址！**

### 3. 設置環境變量
```bash
# 替換為你得到的新合約地址
export NEW_HEALTHREPORT_ADDRESS="新的合約地址"
export PETCOIN_ADDRESS="0xd0D7899C8DB6456BE828e086ac89D803F0999E0B"
```

### 4. 設置合約關聯
```bash
# 在新的HealthReport合約中設置PetCoin地址
cast send $NEW_HEALTHREPORT_ADDRESS "setPetCoinContract(address)" $PETCOIN_ADDRESS \
  --private-key $PRIVATE_KEY \
  --rpc-url sepolia

# 在PetCoin合約中設置新的HealthReport地址
cast send $PETCOIN_ADDRESS "setHealthRecordContract(address)" $NEW_HEALTHREPORT_ADDRESS \
  --private-key $PRIVATE_KEY \
  --rpc-url sepolia
```

### 5. 驗證設置
```bash
# 檢查HealthReport合約中的PetCoin地址
cast call $NEW_HEALTHREPORT_ADDRESS "petCoinContract()" --rpc-url sepolia

# 檢查PetCoin合約中的HealthReport地址
cast call $PETCOIN_ADDRESS "healthRecordContract()" --rpc-url sepolia
```

### 6. 更新前端合約地址
在 `frontend/src/utils/healthreport.js` 中更新：
```javascript
export const HEALTHREPORT_CONTRACT_ADDRESS = "新的合約地址";
```

### 7. 測試新功能
```bash
# 測試CID唯一性檢查
cast call $NEW_HEALTHREPORT_ADDRESS "isCIDUsed(string)" "QmTest123" --rpc-url sepolia
```

## 🔍 新功能驗證

部署完成後，你的新合約將具備：
- ✅ CID唯一性檢查
- ✅ 防止重複上傳
- ✅ 防止重複獎勵
- ✅ CID查詢功能

## ⚠️ 注意事項

1. **舊數據遷移**：舊合約的數據不會自動轉移到新合約
2. **前端更新**：必須更新前端合約地址
3. **測試**：部署後務必測試所有功能
4. **備份**：保存好新的合約地址

## 🧪 測試清單

- [ ] 合約部署成功
- [ ] 合約關聯設置正確
- [ ] 前端地址更新
- [ ] CID唯一性檢查功能
- [ ] 健康報告上傳功能
- [ ] PTC獎勵發放功能
- [ ] 歷史記錄顯示功能 