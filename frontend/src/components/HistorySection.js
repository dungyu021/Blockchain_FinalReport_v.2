import React, { useState, useEffect } from 'react';
import { getUserReports } from '../utils/healthreport';
import { getUserNFTs } from '../utils/petNFT';
import './HistorySection.css';

const HistorySection = ({ account }) => {
  const [activeHistoryTab, setActiveHistoryTab] = useState('nft');
  const [healthReports, setHealthReports] = useState([]);
  const [nftList, setNftList] = useState([]);
  const [loading, setLoading] = useState(false);


  // 獲取健康報告
  const fetchHealthReports = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      const result = await getUserReports(account);
      if (result.success) {
        setHealthReports(result.reports || []);
      } else {
        console.error('獲取健康報告失敗:', result.error);
        setHealthReports([]);
      }
    } catch (error) {
      console.error('獲取健康報告錯誤:', error);
      setHealthReports([]);
    } finally {
      setLoading(false);
    }
  };

  // 獲取NFT列表
  const fetchNFTs = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      const result = await getUserNFTs(account);
      if (result.success) {
        setNftList(result.nfts || []);
      } else {
        console.error('獲取NFT失敗:', result.error);
        setNftList([]);
      }
    } catch (error) {
      console.error('獲取NFT錯誤:', error);
      setNftList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      if (activeHistoryTab === 'healthreport') {
        fetchHealthReports();
      } else {
        fetchNFTs();
      }
    }
  }, [account, activeHistoryTab]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 生成IPFS檔案位置URL
  const getIPFSFileURL = (cid) => {
    if (!cid) return '';
    return `https://${cid}.ipfs.w3s.link/`;
  };



  return (
    <div className="history-section">
      {/* 分隔線 */}
      <div className="divider"></div>
      
      {/* 標籤頁切換按鈕 */}
      <div className="history-tabs">
        <button 
          className={`tab-btn ${activeHistoryTab === 'nft' ? 'active' : ''}`}
          onClick={() => setActiveHistoryTab('nft')}
        >
          我的NFT
        </button>
        <button 
          className={`tab-btn ${activeHistoryTab === 'healthreport' ? 'active' : ''}`}
          onClick={() => setActiveHistoryTab('healthreport')}
        >
          我的健康報告
        </button>
      </div>

      {/* 歷史紀錄內容區域 */}
      <div className="history-content">
        {loading ? (
          <div className="loading">載入中...</div>
        ) : (
          <>
            {activeHistoryTab === 'nft' && (
              <div className="nft-list">
                {nftList.length === 0 ? (
                  <div className="empty-state">尚未鑄造任何NFT</div>
                ) : (
                  nftList.map((nft, index) => (
                    <div key={index} className="nft-item">
                      <div className="nft-info">
                        <div className="nft-row">
                          <span className="label">NFT名稱</span>
                          <span className="value">{nft.name || '未命名NFT'}</span>
                        </div>
                        <div className="nft-row">
                          <span className="label">NFT描述</span>
                          <span className="value">{nft.description || '無描述'}</span>
                        </div>
                        <div className="nft-row">
                          <span className="label">NFT位置</span>
                          <span className="value">
                            <a 
                              href={getIPFSFileURL(nft.imageCID)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="file-link"
                              title="點擊開啟圖片"
                            >
                              {getIPFSFileURL(nft.imageCID)}
                            </a>
                          </span>
                        </div>
                      </div>
                      <div className="nft-meta">
                        <div className="meta-item">
                          <span className="meta-label">NFT編號</span>
                          <span className="meta-value">{nft.tokenId}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">鑄造時間</span>
                          <span className="meta-value">{formatDate(nft.timestamp * 1000)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeHistoryTab === 'healthreport' && (
              <div className="report-list">
                {healthReports.length === 0 ? (
                  <div className="empty-state">尚無健康報告紀錄</div>
                ) : (
                  healthReports.map((report, index) => (
                    <div key={index} className="report-item">
                      <div className="report-info">
                        <div className="report-row">
                          <span className="label">報告名稱</span>
                          <span className="value">{report.reportName}</span>
                        </div>
                        <div className="report-row">
                          <span className="label">報告描述</span>
                          <span className="value">{report.description || '無描述'}</span>
                        </div>
                        <div className="report-row">
                          <span className="label">檔案位置</span>
                          <span className="value">
                            <a 
                              href={getIPFSFileURL(report.ipfsCID)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="file-link"
                              title="點擊開啟檔案"
                            >
                              {getIPFSFileURL(report.ipfsCID)}
                            </a>
                          </span>
                        </div>
                      </div>
                      <div className="report-meta">
                        <div className="meta-item">
                          <span className="meta-label">寵物編號</span>
                          <span className="meta-value">{report.petId}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">報告類型</span>
                          <span className="meta-value">{report.reportType}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistorySection; 