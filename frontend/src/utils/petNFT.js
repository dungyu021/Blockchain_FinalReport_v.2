import { ethers } from 'ethers';
import PetNFTABI from '../abi/petnft.json';
import PetCoinABI from '../abi/petcoin.json';

// 合約地址
const PETNFT_CONTRACT_ADDRESS = "0x7AAF93D0fc6eB25E1Fe42f8F54c17955F29e179c";
const PETCOIN_CONTRACT_ADDRESS = "0xd0D7899C8DB6456BE828e086ac89D803F0999E0B";

// 獲取當前連接的帳戶
export const getCurrentAccount = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      });
      return accounts[0] || null;
    } catch (error) {
      console.error('獲取帳戶失敗:', error);
      return null;
    }
  }
  return null;
};

// 連接錢包
export const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      return accounts[0];
    } catch (error) {
      console.error('連接錢包失敗:', error);
      throw error;
    }
  } else {
    throw new Error('請安裝MetaMask');
  }
};

// 驗證圖片URL格式
export const validateImageURL = (url) => {
  try {
    const urlObj = new URL(url);
    // 檢查是否為有效的圖片URL
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => 
      urlObj.pathname.toLowerCase().includes(ext)
    );
    
    // 也接受IPFS URL格式
    const isIPFS = url.startsWith('ipfs://') || url.includes('ipfs.io') || url.includes('gateway.pinata.cloud');
    
    return hasImageExtension || isIPFS || url.includes('imgur') || url.includes('cloudinary');
  } catch {
    return false;
  }
};

// 驗證IPFS CID格式
export const validateIPFSCID = (cid) => {
  if (!cid || typeof cid !== 'string') {
    return false;
  }
  
  // 基本的CID格式檢查
  // CIDv1通常以 'bafy' 或 'bafk' 開頭
  // CIDv0通常以 'Qm' 開頭
  const cidPattern = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{52,}|bafk[a-z0-9]{52,}|bafybeig[a-z0-9]{52,})/;
  
  return cidPattern.test(cid.trim());
};

// 注意：新的流程中，用戶需要預先將圖片上傳到IPFS，然後直接輸入CID
// 因此不再需要uploadMetadataToIPFS函數

// 檢查PTC餘額
export const checkPTCBalance = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      
      const petCoinContract = new ethers.Contract(
        PETCOIN_CONTRACT_ADDRESS, 
        PetCoinABI, 
        provider
      );
      
      const balance = await petCoinContract.balanceOf(userAddress);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('檢查PTC餘額失敗:', error);
      throw error;
    }
  }
  throw new Error('請連接錢包');
};

// 檢查PTC授權額度
export const checkPTCAllowance = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      
      const petCoinContract = new ethers.Contract(
        PETCOIN_CONTRACT_ADDRESS, 
        PetCoinABI, 
        provider
      );
      
      const allowance = await petCoinContract.allowance(userAddress, PETNFT_CONTRACT_ADDRESS);
      return ethers.utils.formatEther(allowance);
    } catch (error) {
      console.error('檢查PTC授權失敗:', error);
      throw error;
    }
  }
  throw new Error('請連接錢包');
};

// 授權PTC給NFT合約
export const approvePTC = async (amount = "10") => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const petCoinContract = new ethers.Contract(
        PETCOIN_CONTRACT_ADDRESS, 
        PetCoinABI, 
        signer
      );
      
      const amountInWei = ethers.utils.parseEther(amount);
      const tx = await petCoinContract.approve(PETNFT_CONTRACT_ADDRESS, amountInWei);
      
      console.log('PTC授權交易已發送:', tx.hash);
      await tx.wait();
      console.log('PTC授權成功');
      
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error('PTC授權失敗:', error);
      throw error;
    }
  }
  throw new Error('請連接錢包');
};

// 檢查CID是否已被使用
export const checkCIDUsed = async (cid) => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const petNFTContract = new ethers.Contract(
        PETNFT_CONTRACT_ADDRESS, 
        PetNFTABI, 
        provider
      );
      
      const isUsed = await petNFTContract.isCIDUsed(cid);
      return isUsed;
    } catch (error) {
      console.error('檢查CID使用狀態失敗:', error);
      throw error;
    }
  }
  throw new Error('請連接錢包');
};

// 根據CID查詢Token ID
export const getTokenIdByCID = async (cid) => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const petNFTContract = new ethers.Contract(
        PETNFT_CONTRACT_ADDRESS, 
        PetNFTABI, 
        provider
      );
      
      const tokenId = await petNFTContract.getTokenIdByCID(cid);
      return tokenId.toString();
    } catch (error) {
      console.error('根據CID查詢Token ID失敗:', error);
      throw error;
    }
  }
  throw new Error('請連接錢包');
};

// 鑄造NFT主函數 - 使用name, imageCID, description
export const mintNFT = async (name, imageCID, description) => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // 1. 驗證參數
      if (!name || !imageCID || !description) {
        throw new Error('NFT名稱、圖片CID和描述都不能為空');
      }
      
      if (!validateIPFSCID(imageCID)) {
        throw new Error('無效的IPFS CID格式');
      }
      
      // 2. 檢查PTC餘額
      const balance = await checkPTCBalance();
      if (parseFloat(balance) < 10) {
        throw new Error('PTC餘額不足，需要至少10 PTC');
      }
      
      // 3. 檢查授權額度
      const allowance = await checkPTCAllowance();
      if (parseFloat(allowance) < 10) {
        console.log('需要授權PTC...');
        await approvePTC("10");
      }
      
      // 4. 檢查CID唯一性
      console.log('檢查CID唯一性...');
      const isCIDUsed = await checkCIDUsed(imageCID);
      if (isCIDUsed) {
        throw new Error('此CID已被使用，請使用不同的圖片鑄造NFT');
      }
      
      // 5. 鑄造NFT
      const petNFTContract = new ethers.Contract(
        PETNFT_CONTRACT_ADDRESS, 
        PetNFTABI, 
        signer
      );
      
      console.log('開始鑄造NFT，參數:', { name, imageCID, description });
      const tx = await petNFTContract.mint(name, imageCID, description);
      
      console.log('NFT鑄造交易已發送:', tx.hash);
      await tx.wait();
      console.log('NFT鑄造成功!');
      
      return { 
        success: true, 
        txHash: tx.hash,
        imageCID: imageCID
      };
    } catch (error) {
      console.error('NFT鑄造失敗:', error);
      
      let errorMessage = '鑄造失敗';
      if (error.message.includes('approve first')) {
        errorMessage = '請先授權PTC給NFT合約';
      } else if (error.message.includes('imageCID already used')) {
        errorMessage = '此圖片CID已被使用，無法重複鑄造';
      } else if (error.message.includes('name cannot be empty')) {
        errorMessage = 'NFT名稱不能為空';
      } else if (error.message.includes('imageCID cannot be empty')) {
        errorMessage = '圖片CID不能為空';
      } else if (error.message.includes('description cannot be empty')) {
        errorMessage = 'NFT描述不能為空';
      } else if (error.message.includes('此CID已被使用')) {
        errorMessage = error.message; // 使用我們自定義的中文錯誤訊息
      } else if (error.message.includes('NFT名稱、圖片CID和描述都不能為空')) {
        errorMessage = error.message;
      } else if (error.message.includes('insufficient')) {
        errorMessage = 'PTC餘額不足';
      } else if (error.message.includes('user rejected')) {
        errorMessage = '用戶取消了交易';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }
  
  return { 
    success: false, 
    error: '請安裝並連接MetaMask' 
  };
};

// 獲取用戶擁有的NFT數量
export const getUserNFTBalance = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      
      const petNFTContract = new ethers.Contract(
        PETNFT_CONTRACT_ADDRESS, 
        PetNFTABI, 
        provider
      );
      
      const balance = await petNFTContract.balanceOf(userAddress);
      return balance.toString();
    } catch (error) {
      console.error('獲取NFT餘額失敗:', error);
      throw error;
    }
  }
  throw new Error('請連接錢包');
};

// 獲取NFT的tokenURI
export const getNFTTokenURI = async (tokenId) => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      const petNFTContract = new ethers.Contract(
        PETNFT_CONTRACT_ADDRESS, 
        PetNFTABI, 
        provider
      );
      
      const tokenURI = await petNFTContract.tokenURI(tokenId);
      return tokenURI;
    } catch (error) {
      console.error('獲取NFT TokenURI失敗:', error);
      throw error;
    }
  }
  throw new Error('請連接錢包');
};

// 監聽NFT鑄造事件
export const listenForNFTMinted = (callback) => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      const petNFTContract = new ethers.Contract(
        PETNFT_CONTRACT_ADDRESS, 
        PetNFTABI, 
        provider
      );
      
      const filter = petNFTContract.filters.Minted();
      
      petNFTContract.on(filter, (owner, tokenId, name, imageCID, description, event) => {
        console.log('NFT鑄造事件:', { owner, tokenId: tokenId.toString(), name, imageCID, description });
        callback({
          owner,
          tokenId: tokenId.toString(),
          name,
          imageCID,
          description,
          txHash: event.transactionHash
        });
      });
      
      // 返回清理函數
      return () => {
        petNFTContract.removeAllListeners(filter);
      };
    } catch (error) {
      console.error('監聽NFT事件失敗:', error);
      return () => {};
    }
  }
  return () => {};
};

// 獲取用戶的所有NFT
export const getUserNFTs = async (userAddress) => {
  try {
    if (!userAddress) {
      return { success: false, error: 'User address is required' };
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const petNFTContract = new ethers.Contract(
      PETNFT_CONTRACT_ADDRESS, 
      PetNFTABI, 
      provider
    );

    // 使用新的合約功能：直接獲取用戶的NFT列表
    const userTokenIds = await petNFTContract.getUserNFTs(userAddress);
    
    if (userTokenIds.length === 0) {
      return { success: true, nfts: [] };
    }

    // 獲取每個NFT的詳細元數據
    const nfts = [];
    for (let i = 0; i < userTokenIds.length; i++) {
      try {
        const tokenId = userTokenIds[i];
        // 使用新的函數獲取完整的NFT元數據
        const metadata = await petNFTContract.getNFTMetadata(tokenId);
        
        nfts.push({
          tokenId: tokenId.toString(),
          name: metadata.name,
          description: metadata.description,
          imageCID: metadata.imageCID,
          owner: metadata.owner,
          timestamp: metadata.timestamp.toString(),
          image: `https://gateway.pinata.cloud/ipfs/${metadata.imageCID}`,
          tokenURI: `ipfs://${metadata.imageCID}`
        });
      } catch (error) {
        console.error(`Error fetching NFT metadata for token ${userTokenIds[i]}:`, error);
        // 如果獲取metadata失敗，使用fallback方法
        try {
          const tokenURI = await petNFTContract.tokenURI(userTokenIds[i]);
          nfts.push({
            tokenId: userTokenIds[i].toString(),
            name: `PetNFT #${userTokenIds[i].toString()}`,
            description: 'NFT描述不可用',
            imageCID: tokenURI.replace('ipfs://', ''),
            image: tokenURI.startsWith('ipfs://') ? 
              `https://gateway.pinata.cloud/ipfs/${tokenURI.replace('ipfs://', '')}` : 
              tokenURI,
            tokenURI: tokenURI
          });
        } catch (fallbackError) {
          console.error(`Fallback also failed for token ${userTokenIds[i]}:`, fallbackError);
        }
      }
    }

    return { success: true, nfts };
  } catch (error) {
    console.error('Error getting user NFTs:', error);
    return { 
      success: false, 
      error: error.reason || error.message || '獲取NFT失敗' 
    };
  }
};

// 獲取NFT的完整元數據
export const getNFTMetadata = async (tokenId) => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const petNFTContract = new ethers.Contract(
        PETNFT_CONTRACT_ADDRESS, 
        PetNFTABI, 
        provider
      );
      
      const metadata = await petNFTContract.getNFTMetadata(tokenId);
      return {
        success: true,
        metadata: {
          tokenId: metadata.tokenId.toString(),
          name: metadata.name,
          description: metadata.description,
          imageCID: metadata.imageCID,
          owner: metadata.owner,
          timestamp: metadata.timestamp.toString(),
          image: `https://gateway.pinata.cloud/ipfs/${metadata.imageCID}`
        }
      };
    } catch (error) {
      console.error('獲取NFT元數據失敗:', error);
      return { 
        success: false, 
        error: error.reason || error.message || '獲取NFT元數據失敗' 
      };
    }
  }
  return { success: false, error: '請連接錢包' };
};

// 獲取用戶擁有的NFT數量
export const getUserNFTCount = async (userAddress) => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const petNFTContract = new ethers.Contract(
        PETNFT_CONTRACT_ADDRESS, 
        PetNFTABI, 
        provider
      );
      
      const count = await petNFTContract.getUserNFTCount(userAddress);
      return count.toString();
    } catch (error) {
      console.error('獲取用戶NFT數量失敗:', error);
      throw error;
    }
  }
  throw new Error('請連接錢包');
}; 