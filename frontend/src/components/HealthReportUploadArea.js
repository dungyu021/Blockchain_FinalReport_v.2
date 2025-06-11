import React, { useState, useEffect } from 'react';
import './HealthReportUploadArea.css';
import { uploadReport, connectWallet, getCurrentAccount, validateIPFSCID, listenForReportUploaded, checkCIDUsed } from '../utils/healthreport';

const HealthReportUploadArea = ({ onReportUploaded, notification }) => {
  const [formData, setFormData] = useState({
    petId: '',
    reportType: '',
    reportName: '',
    ipfsCID: '',
    description: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState('');
  
  const { showSuccess, showError, showWarning, showInfo, showProcess, hideNotification } = notification || {};
  const [cidCheckStatus, setCidCheckStatus] = useState({ checking: false, isUsed: false });

  // 初始化時檢查錢包連接狀態
  useEffect(() => {
    checkWalletConnection();
    
    // 監聽報告上傳事件
    const unsubscribe = listenForReportUploaded((eventData) => {
      console.log('報告上傳成功:', eventData);
      showSuccess && showSuccess(`報告上傳成功！報告ID: ${eventData.reportId}`);
      // 清空表單
      setFormData({
        petId: '',
        reportType: '',
        reportName: '',
        ipfsCID: '',
        description: ''
      });
    });

    return () => {
      unsubscribe();
      // 清理CID檢查定時器
      if (window.cidCheckTimeout) {
        clearTimeout(window.cidCheckTimeout);
      }
    };
  }, []);

  // 檢查錢包連接狀態
  const checkWalletConnection = async () => {
    const currentAccount = await getCurrentAccount();
    setAccount(currentAccount || '');
  };

  // 檢查CID是否已被使用
  const handleCIDCheck = async (cid) => {
    if (!cid || !validateIPFSCID(cid)) {
      setCidCheckStatus({ checking: false, isUsed: false });
      return;
    }

    setCidCheckStatus({ checking: true, isUsed: false });
    
    try {
      const result = await checkCIDUsed(cid);
      if (result.success) {
        setCidCheckStatus({ checking: false, isUsed: result.isUsed });
        if (result.isUsed) {
          showWarning && showWarning('⚠️ 此CID已被使用過，無法重複上傳');
        } else {
          hideNotification && hideNotification();
        }
      } else {
        setCidCheckStatus({ checking: false, isUsed: false });
      }
    } catch (error) {
      setCidCheckStatus({ checking: false, isUsed: false });
    }
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

    // 如果是CID欄位，進行即時檢查
    if (name === 'ipfsCID') {
      // 延遲檢查，避免頻繁請求
      clearTimeout(window.cidCheckTimeout);
      window.cidCheckTimeout = setTimeout(() => {
        handleCIDCheck(value.trim());
      }, 500);
    }
  };

  // 驗證表單
  const validateForm = () => {
    if (!formData.petId.trim()) {
      showError && showError('請輸入寵物編號');
      return false;
    }
    
    if (!formData.reportType.trim()) {
      showError && showError('請輸入報告類型');
      return false;
    }
    
    if (!formData.reportName.trim()) {
      showError && showError('請輸入報告名稱');
      return false;
    }
    
    if (!formData.ipfsCID.trim()) {
      showError && showError('請貼上IPFS CID');
      return false;
    }
    
    if (!validateIPFSCID(formData.ipfsCID)) {
      showError && showError('IPFS CID 格式不正確');
      return false;
    }

    if (cidCheckStatus.isUsed) {
      showError && showError('此CID已被使用過，無法重複上傳');
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
    showProcess && showProcess('正在上傳報告到區塊鏈...');

    try {
      const result = await uploadReport(
        formData.petId,
        formData.reportType,
        formData.reportName,
        formData.ipfsCID,
        formData.description
      );

      if (result.success) {
        hideNotification && hideNotification();
        showSuccess && showSuccess(`報告上傳成功！交易哈希: ${result.txHash}。您將很快收到 10 PTC 獎勵！`);
        
        // 清空表單
        setFormData({
          petId: '',
          reportType: '',
          reportName: '',
          ipfsCID: '',
          description: ''
        });
        
        // 延遲刷新PTC餘額，確保獎勵交易已被確認
        if (onReportUploaded) {
          setTimeout(() => {
            onReportUploaded();
          }, 3000); // 3秒後刷新，給足夠時間讓獎勵交易被確認
        }
      } else {
        hideNotification && hideNotification();
        showError && showError(result.error);
      }
    } catch (error) {
      hideNotification && hideNotification();
      showError && showError('上傳過程中發生錯誤');
    }

    setIsLoading(false);
  };

  return (
    <div className="health-report-upload-area">
      <div className="upload-container">
        <h2 className="upload-title">健康報告上鏈</h2>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="petId">寵物編號</label>
              <input
                type="text"
                id="petId"
                name="petId"
                value={formData.petId}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reportType">報告類型</label>
              <input
                type="text"
                id="reportType"
                name="reportType"
                value={formData.reportType}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reportName">報告名稱</label>
              <input
                type="text"
                id="reportName"
                name="reportName"
                value={formData.reportName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="ipfsCID">請貼上CID</label>
            <div className="cid-input-container">
              <input
                type="text"
                id="ipfsCID"
                name="ipfsCID"
                value={formData.ipfsCID}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`${cidCheckStatus.isUsed ? 'cid-used' : ''} ${cidCheckStatus.checking ? 'cid-checking' : ''}`}
              />
              <div className="cid-status">
                {cidCheckStatus.checking && <span className="checking">🔍</span>}
                {!cidCheckStatus.checking && cidCheckStatus.isUsed && <span className="used">❌</span>}
                {!cidCheckStatus.checking && !cidCheckStatus.isUsed && formData.ipfsCID && validateIPFSCID(formData.ipfsCID) && <span className="available">✅</span>}
              </div>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">請輸入描述</label>
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
              className="submit-btn"
              disabled={isLoading || !account}
            >
              {isLoading ? '上鏈中...' : '上鏈'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthReportUploadArea; 