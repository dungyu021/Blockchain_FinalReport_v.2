import React, { useState, useEffect } from 'react';
import './PetNFTMintArea.css';
import { mintNFT, connectWallet, getCurrentAccount, validateImageURL, validateIPFSCID, checkCIDUsed } from '../utils/petNFT';

const PetNFTMintArea = ({ onNFTMinted, notification }) => {
  const [formData, setFormData] = useState({
    imageName: '',
    imageCID: '',
    description: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState('');
  
  const { showSuccess, showError, showWarning, showInfo, showProcess, hideNotification } = notification || {};

  // 初始化時檢查錢包連接狀態
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // 檢查錢包連接狀態
  const checkWalletConnection = async () => {
    const currentAccount = await getCurrentAccount();
    setAccount(currentAccount || '');
  };

  // 處理輸入變更
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除通知
    if (hideNotification) {
      hideNotification();
    }
  };

  // 驗證表單
  const validateForm = () => {
    if (!formData.imageName.trim()) {
      showError && showError('請輸入圖片名稱');
      return false;
    }
    
    if (!formData.imageCID.trim()) {
      showError && showError('請輸入CID');
      return false;
    }
    
    if (!validateIPFSCID(formData.imageCID)) {
      showError && showError('請輸入有效的IPFS CID格式');
      return false;
    }

    if (!formData.description.trim()) {
      showError && showError('請輸入圖片描述');
      return false;
    }

    return true;
  };

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!account) {
      showError && showError('請先連接錢包');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    showProcess && showProcess('正在準備NFT metadata...');

    try {
      // 使用名稱、圖片CID和描述鑄造NFT
      const result = await mintNFT(formData.imageName, formData.imageCID, formData.description);

      if (result.success) {
        hideNotification && hideNotification();
        showSuccess && showSuccess(`NFT鑄造成功！交易哈希: ${result.txHash}`);
        
        // 清空表單
        setFormData({
          imageName: '',
          imageCID: '',
          description: ''
        });
        
        // 調用回調函數更新PTC餘額
        if (onNFTMinted) {
          onNFTMinted();
        }
      } else {
        hideNotification && hideNotification();
        showError && showError(result.error);
      }
    } catch (error) {
      console.error('鑄造過程中發生錯誤:', error);
      hideNotification && hideNotification();
      showError && showError('鑄造過程中發生錯誤');
    }

    setIsLoading(false);
  };

  return (
    <div className="pet-nft-mint-area">
      <div className="mint-container">
        <h2 className="mint-title">鑄造寵物NFT</h2>

        <form onSubmit={handleSubmit} className="mint-form">
          <div className="form-group">
            <label htmlFor="imageName">圖片名稱</label>
            <input
              type="text"
              id="imageName"
              name="imageName"
              value={formData.imageName}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageCID">請輸入CID</label>
            <input
              type="text"
              id="imageCID"
              name="imageCID"
              value={formData.imageCID}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">圖片描述</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>



          {/* 提交按鈕 */}
          <div className="button-container">
            <button
              type="submit"
              className="mint-btn"
              disabled={isLoading || !account}
            >
              {isLoading ? '鑄造中...' : '鑄造NFT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetNFTMintArea; 