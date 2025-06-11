# 🖼️ PetNFT - PetHealthChain NFT 鑄造與交易系統

PetNFT 是 PetHealthChain 平台的 NFT 模組，包含兩個核心智能合約：**PetNFT**（鑄造）和 **PetNFTMarket**（交易）。飼主可以使用寵物照片鑄造專屬 NFT，代表毛孩的數位身分，並支援平台內的收藏、展示和交易功能。

## 📋 功能特色

### 🎨 NFT 鑄造系統
- **付費鑄造**: 使用 10 PTC (PetCoin) 鑄造 NFT
- **IPFS 整合**: 支援 IPFS CID 作為 NFT metadata 儲存
- **ERC-721 標準**: 完全相容的 ERC-721 NFT 實作
- **數位身分**: 每個 NFT 代表寵物的唯一數位身分證

### 🏪 NFT 交易市集
- **固定價格交易**: 支援 PTC 幣種的固定價格買賣
- **自主定價**: 賣家可自由設定 NFT 售價
- **安全交易**: 內建重入攻擊防護機制
- **透明化**: 所有交易活動均記錄在區塊鏈上

### 📊 數據結構

#### PetNFT 合約
```solidity
// ERC-721 基本資訊
contract PetNFT is ERC721URIStorage, Ownable {
    uint256 public constant MINT_FEE = 10 * 1e18;  // 鑄造費用：10 PTC
    PetCoin public immutable petCoin;               // PetCoin 合約地址
    uint256 private _tokenIds;                      // NFT ID 計數器
}
```

#### PetNFTMarket 合約
```solidity
struct Listing {
    address seller;        // 賣家地址
    uint256 price;        // 售價（PTC 單位）
}

mapping(uint256 => Listing) public listings;  // NFT 上架資訊
```

## 🏗️ 技術架構

### 智能合約結構
```
PetNFT 生態系統
├── PetNFT.sol
│   ├── ERC721URIStorage (OpenZeppelin)    # NFT 基礎功能
│   ├── Ownable (OpenZeppelin)             # 擁有者管理
│   ├── PetCoin 整合                        # 鑄造費用支付
│   └── IPFS CID 儲存                      # Metadata 儲存
└── PetNFTMarket.sol
    ├── ReentrancyGuard (OpenZeppelin)     # 重入攻擊防護
    ├── 固定價格交易系統
    ├── PetCoin 支付整合
    └── 事件系統
```

### 前端整合準備
```
frontend/
├── src/abi/PetNFT.json           # PetNFT 合約 ABI
├── src/abi/PetNFTMarket.json     # PetNFTMarket 合約 ABI
├── src/utils/petNFT.js           # NFT 相關工具函數
└── src/components/               # NFT 相關組件
    ├── MintNFT.jsx              # NFT 鑄造組件
    ├── NFTGallery.jsx           # NFT 展示組件
    └── NFTMarket.jsx            # NFT 交易組件
```

## 📋 前置需求

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v16+)
- [Foundry](https://book.getfoundry.sh/) 開發框架
- [MetaMask](https://metamask.io/) 瀏覽器擴充功能
- Sepolia 測試網 ETH
- **已部署的 PetCoin 合約** (必須先部署 PetCoin)
- [Pinata](https://pinata.cloud/) 或 [NFT.Storage](https://nft.storage/) 帳戶（用於 IPFS 儲存）

## ⚡ 5 分鐘快速部署

### 步驟 1: 確認前置條件
```bash
# 確認 Foundry 已安裝
forge --version

# 進入合約目錄
cd Blockchain_FinalReport/contracts

# 確認依賴已安裝
forge install
```

### 步驟 2: 設定環境變數
```bash
# 編輯 .env 檔案
# 必須包含以下變數：
echo "PRIVATE_KEY=your_metamask_private_key_here" >> .env
echo "PETCOIN_ADDR=your_deployed_petcoin_address_here" >> .env
```

**🔑 取得 PetCoin 地址:**
如果尚未部署 PetCoin，請先參考 `PETCOIN_README.md` 完成 PetCoin 合約部署。

### 步驟 3: 編譯和測試
```bash
# 編譯 PetNFT 相關合約
forge build

# 執行 PetNFT 測試
forge test --match-contract PetNFTTest -vv

# 檢查特定功能測試
forge test --match-test testMintAndTrade -vv
```

### 步驟 4: 部署 PetNFT 合約
```bash
# 載入環境變數
source .env

# 部署到 Sepolia 測試網
forge script script/DeployPetNFT.s.sol:DeployPetNFT --rpc-url sepolia --broadcast --verify

# 如果沒有設定 Etherscan API，不使用 --verify
forge script script/DeployPetNFT.s.sol:DeployPetNFT --rpc-url sepolia --broadcast
```

### 步驟 5: 記錄部署資訊
部署成功後，從輸出中記錄重要地址：
```
== Logs ==
  PetNFT => 0xYourPetNFTContractAddress
  Market => 0xYourPetNFTMarketContractAddress
```

**📝 請妥善保存這些地址：**
- `PETNFT_ADDRESS`: PetNFT 合約地址
- `PETNFTMARKET_ADDRESS`: PetNFTMarket 合約地址

## 🎨 IPFS Metadata 準備指南

### 步驟 1: 準備 NFT Metadata
創建符合 ERC-721 標準的 JSON metadata：
```json
{
  "name": "我的寵物 - 小白",
  "description": "小白是一隻可愛的柴犬，非常活潑好動",
  "image": "ipfs://QmYourImageCID",
  "attributes": [
    {
      "trait_type": "品種",
      "value": "柴犬"
    },
    {
      "trait_type": "年齡",
      "value": "3歲"
    },
    {
      "trait_type": "性別",
      "value": "公"
    }
  ]
}
```

### 步驟 2: 上傳到 IPFS
```bash
# 使用 Pinata CLI (需先安裝和設定)
pinata upload metadata.json

# 或使用 NFT.Storage web 界面
# 1. 訪問 https://nft.storage/
# 2. 上傳檔案
# 3. 複製返回的 CID
```

### 步驟 3: 驗證 CID 格式
確保取得的 CID 格式正確：
```
範例 CID: bafkreigh2akiscaildcqisu62ru2vqnhkazhzqfrblvbx7kxt5sbtkkpwy3s
```

## 📱 合約互動指南

### NFT 鑄造操作

#### 1. 檢查 PetCoin 餘額
```bash
# 設定合約地址變數
export PETNFT_ADDRESS="0xYourPetNFTContractAddress"
export PETCOIN_ADDRESS="0xYourPetCoinContractAddress"

# 檢查帳戶 PTC 餘額
cast call $PETCOIN_ADDRESS "balanceOf(address)" 0xYourAddress --rpc-url sepolia
```

#### 2. 授權 PetCoin 給 PetNFT
```bash
# 授權 10 PTC 給 PetNFT 合約（鑄造費用）
cast send $PETCOIN_ADDRESS "approve(address,uint256)" \
  $PETNFT_ADDRESS \
  10000000000000000000 \
  --private-key $PRIVATE_KEY \
  --rpc-url sepolia
```

#### 3. 鑄造 NFT
```bash
# 使用 IPFS CID 鑄造 NFT
cast send $PETNFT_ADDRESS "mint(string)" \
  "bafkreigh2akiscaildcqisu62ru2vqnhkazhzqfrblvbx7kxt5sbtkkpwy3s" \
  --private-key $PRIVATE_KEY \
  --rpc-url sepolia
```

### NFT 查詢操作

#### 查詢 NFT 基本資訊
```bash
# 查詢 NFT 擁有者
cast call $PETNFT_ADDRESS "ownerOf(uint256)" 1 --rpc-url sepolia

# 查詢 NFT metadata URI
cast call $PETNFT_ADDRESS "tokenURI(uint256)" 1 --rpc-url sepolia

# 查詢總鑄造數量
cast call $PETNFT_ADDRESS "totalSupply()" --rpc-url sepolia
```

#### 查詢用戶擁有的 NFT
```bash
# 查詢用戶擁有的 NFT 數量
cast call $PETNFT_ADDRESS "balanceOf(address)" 0xYourAddress --rpc-url sepolia
```

### NFT 市集操作

#### 1. 上架 NFT
```bash
export MARKET_ADDRESS="0xYourPetNFTMarketContractAddress"

# 授權 NFT 給市集合約
cast send $PETNFT_ADDRESS "approve(address,uint256)" \
  $MARKET_ADDRESS \
  1 \
  --private-key $PRIVATE_KEY \
  --rpc-url sepolia

# 上架 NFT（價格：20 PTC）
cast send $MARKET_ADDRESS "list(uint256,uint256)" \
  1 \
  20000000000000000000 \
  --private-key $PRIVATE_KEY \
  --rpc-url sepolia
```

#### 2. 購買 NFT
```bash
# 先授權 PTC 給市集
cast send $PETCOIN_ADDRESS "approve(address,uint256)" \
  $MARKET_ADDRESS \
  20000000000000000000 \
  --private-key $PRIVATE_KEY \
  --rpc-url sepolia

# 購買 NFT
cast send $MARKET_ADDRESS "buy(uint256)" \
  1 \
  --private-key $PRIVATE_KEY \
  --rpc-url sepolia
```

#### 3. 取消上架
```bash
# 取消 NFT 上架
cast send $MARKET_ADDRESS "cancel(uint256)" \
  1 \
  --private-key $PRIVATE_KEY \
  --rpc-url sepolia
```

#### 4. 查詢市集資訊
```bash
# 查詢 NFT 上架資訊
cast call $MARKET_ADDRESS "listings(uint256)" 1 --rpc-url sepolia
```

## 🔗 與其他模組整合

### 與 PetCoin 整合流程
PetNFT 模組完全依賴 PetCoin 作為支付方式：

1. **鑄造費用**: 每次鑄造需要支付 10 PTC
2. **市集交易**: 所有 NFT 交易以 PTC 結算
3. **收益流向**: 鑄造費用進入 PetNFT 合約，交易費用直接給賣家

### 與 HealthReport 整合思路
可以考慮將健康報告與 NFT 結合：

```solidity
// 未來可能的整合功能
function mintWithHealthReport(string calldata cid, uint256 reportId) external {
    // 驗證健康報告存在且屬於發送者
    require(healthReportContract.isValidReport(reportId), "Invalid report");
    require(healthReportContract.getReportOwner(reportId) == msg.sender, "Not owner");
    
    // 執行原有鑄造邏輯
    // ...
}
```

## 🎯 前端整合範例

### React 組件範例

#### NFT 鑄造組件
```javascript
import { ethers } from 'ethers';
import PetNFTABI from './abi/PetNFT.json';
import PetCoinABI from './abi/PetCoin.json';

const PETNFT_CONTRACT_ADDRESS = "0xYourPetNFTContractAddress";
const PETCOIN_CONTRACT_ADDRESS = "0xYourPetCoinContractAddress";

// NFT 鑄造函數
async function mintNFT(metadataCID) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  const petCoinContract = new ethers.Contract(PETCOIN_CONTRACT_ADDRESS, PetCoinABI, signer);
  const petNFTContract = new ethers.Contract(PETNFT_CONTRACT_ADDRESS, PetNFTABI, signer);
  
  try {
    // 1. 檢查 PTC 餘額
    const balance = await petCoinContract.balanceOf(await signer.getAddress());
    const mintFee = ethers.utils.parseEther("10");
    
    if (balance.lt(mintFee)) {
      throw new Error("PTC 餘額不足，需要至少 10 PTC");
    }
    
    // 2. 授權 PTC
    const approveTx = await petCoinContract.approve(PETNFT_CONTRACT_ADDRESS, mintFee);
    await approveTx.wait();
    
    // 3. 鑄造 NFT
    const mintTx = await petNFTContract.mint(metadataCID);
    await mintTx.wait();
    
    console.log('NFT 鑄造成功:', mintTx.hash);
    return mintTx.hash;
  } catch (error) {
    console.error('鑄造失敗:', error);
    throw error;
  }
}
```

#### NFT 市集組件
```javascript
import PetNFTMarketABI from './abi/PetNFTMarket.json';

const MARKET_CONTRACT_ADDRESS = "0xYourPetNFTMarketContractAddress";

// 上架 NFT
async function listNFT(tokenId, priceInPTC) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  const petNFTContract = new ethers.Contract(PETNFT_CONTRACT_ADDRESS, PetNFTABI, signer);
  const marketContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, PetNFTMarketABI, signer);
  
  try {
    // 1. 授權 NFT 給市集
    const approveTx = await petNFTContract.approve(MARKET_CONTRACT_ADDRESS, tokenId);
    await approveTx.wait();
    
    // 2. 上架 NFT
    const price = ethers.utils.parseEther(priceInPTC.toString());
    const listTx = await marketContract.list(tokenId, price);
    await listTx.wait();
    
    console.log('NFT 上架成功:', listTx.hash);
    return listTx.hash;
  } catch (error) {
    console.error('上架失敗:', error);
    throw error;
  }
}

// 購買 NFT
async function buyNFT(tokenId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  const petCoinContract = new ethers.Contract(PETCOIN_CONTRACT_ADDRESS, PetCoinABI, signer);
  const marketContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, PetNFTMarketABI, signer);
  
  try {
    // 1. 查詢 NFT 價格
    const listing = await marketContract.listings(tokenId);
    const price = listing.price;
    
    // 2. 授權 PTC 給市集
    const approveTx = await petCoinContract.approve(MARKET_CONTRACT_ADDRESS, price);
    await approveTx.wait();
    
    // 3. 購買 NFT
    const buyTx = await marketContract.buy(tokenId);
    await buyTx.wait();
    
    console.log('NFT 購買成功:', buyTx.hash);
    return buyTx.hash;
  } catch (error) {
    console.error('購買失敗:', error);
    throw error;
  }
}

// 查詢用戶擁有的 NFT
async function getUserNFTs(userAddress) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const petNFTContract = new ethers.Contract(PETNFT_CONTRACT_ADDRESS, PetNFTABI, provider);
  
  try {
    const balance = await petNFTContract.balanceOf(userAddress);
    const nfts = [];
    
    // 注意：此方法效率較低，實際應用建議使用事件查詢
    for (let i = 1; i <= balance; i++) {
      try {
        const tokenId = await petNFTContract.tokenOfOwnerByIndex(userAddress, i - 1);
        const tokenURI = await petNFTContract.tokenURI(tokenId);
        nfts.push({ tokenId: tokenId.toString(), tokenURI });
      } catch (error) {
        // Token 可能已被轉移
        continue;
      }
    }
    
    return nfts;
  } catch (error) {
    console.error('查詢 NFT 失敗:', error);
    throw error;
  }
}
```

## 🛠️ 故障排除

### 常見問題

#### 1. 鑄造失敗：「approve first」
**原因**: 未授權足夠的 PTC 給 PetNFT 合約
**解決方案**:
```bash
# 檢查授權額度
cast call $PETCOIN_ADDRESS "allowance(address,address)" \
  0xYourAddress $PETNFT_ADDRESS --rpc-url sepolia

# 重新授權
cast send $PETCOIN_ADDRESS "approve(address,uint256)" \
  $PETNFT_ADDRESS 10000000000000000000 \
  --private-key $PRIVATE_KEY --rpc-url sepolia
```

#### 2. 上架失敗：「approve NFT first」
**原因**: 未授權 NFT 給 Market 合約
**解決方案**:
```bash
# 授權特定 NFT
cast send $PETNFT_ADDRESS "approve(address,uint256)" \
  $MARKET_ADDRESS 1 \
  --private-key $PRIVATE_KEY --rpc-url sepolia
```

#### 3. 購買失敗：「approve PTC first」
**原因**: 未授權足夠的 PTC 給 Market 合約
**解決方案**:
```bash
# 查詢 NFT 價格
cast call $MARKET_ADDRESS "listings(uint256)" 1 --rpc-url sepolia

# 授權對應金額的 PTC
cast send $PETCOIN_ADDRESS "approve(address,uint256)" \
  $MARKET_ADDRESS [NFT_PRICE] \
  --private-key $PRIVATE_KEY --rpc-url sepolia
```

#### 4. IPFS CID 無法訪問
**原因**: CID 格式錯誤或 IPFS 節點問題
**解決方案**:
- 驗證 CID 格式是否正確
- 確認檔案已正確上傳到 IPFS
- 使用公共 IPFS Gateway 測試：`https://ipfs.io/ipfs/YOUR_CID`

### 合約管理命令

#### PetNFT 管理
```bash
# 提領合約內的 PTC（僅 owner）
cast send $PETNFT_ADDRESS "withdraw(address,uint256)" \
  0xRecipientAddress \
  1000000000000000000 \
  --private-key $PRIVATE_KEY --rpc-url sepolia

# 查詢合約 PTC 餘額
cast call $PETCOIN_ADDRESS "balanceOf(address)" $PETNFT_ADDRESS --rpc-url sepolia
```

## 📈 進階功能開發

### 批量操作
考慮添加批量鑄造和批量上架功能：

```solidity
// 批量鑄造（未來功能）
function batchMint(string[] calldata cids) external {
    uint256 totalFee = MINT_FEE * cids.length;
    require(petCoin.allowance(msg.sender, address(this)) >= totalFee, "approve first");
    petCoin.transferFrom(msg.sender, address(this), totalFee);
    
    for (uint256 i = 0; i < cids.length; i++) {
        uint256 id = ++_tokenIds;
        _safeMint(msg.sender, id);
        _setTokenURI(id, string.concat("ipfs://", cids[i]));
    }
}
```

### 版稅系統
考慮添加創作者版稅功能：

```solidity
// 版稅系統（未來功能）
mapping(uint256 => address) public creators;
uint256 public royaltyPercentage = 250; // 2.5%

function setRoyalty(uint256 tokenId, address creator) external onlyOwner {
    creators[tokenId] = creator;
}
```

## 🎉 部署完成檢查清單

完成部署後，請確認以下項目：

- [ ] PetNFT 合約已成功部署
- [ ] PetNFTMarket 合約已成功部署  
- [ ] 合約地址已記錄並更新到前端配置
- [ ] PetCoin 合約地址已正確設定
- [ ] 測試鑄造功能正常運作
- [ ] 測試市集上架功能正常運作
- [ ] 測試市集購買功能正常運作
- [ ] IPFS metadata 格式符合 ERC-721 標準
- [ ] 前端組件能正確與合約互動

---

🚀 **恭喜！您已成功部署 PetNFT 系統！**

現在您的 PetHealthChain 平台具備了完整的 NFT 鑄造和交易功能。用戶可以：
- 使用 PTC 鑄造專屬寵物 NFT
- 在平台市集上架和交易 NFT
- 收藏和展示自己的數位寵物身分證

如有任何問題，請參考故障排除章節或查看相關技術文檔。 