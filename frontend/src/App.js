import React, { useState, useEffect } from 'react';
import './App.css';
import TopNavbar from './components/TopNavbar';
import HealthReportUploadArea from './components/HealthReportUploadArea';
import PetNFTMintArea from './components/PetNFTMintArea';
import HistorySection from './components/HistorySection';
import Notification from './components/Notification';
import useNotification from './hooks/useNotification';
import { ethers } from 'ethers';
import createPetCoinContract, { checkNetwork } from './utils/petcoin';

function App() {
  const [account, setAccount] = useState('');
  const [ethBalance, setEthBalance] = useState('0');
  const [ptcBalance, setPtcBalance] = useState('0');
  const [petCoinContract, setPetCoinContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [activeTab, setActiveTab] = useState('healthreport'); // 新增 tab 狀態
  
  // 使用新的通知系統
  const { notification, showSuccess, showError, showWarning, showInfo, showProcess, showReward, hideNotification } = useNotification();

  // 刷新PTC餘額的函數
  const refreshPtcBalance = async () => {
    if (petCoinContract && account) {
      try {
        const ptcBalance = await petCoinContract.getBalanceOf(account);
        setPtcBalance(ptcBalance);
        console.log("PTC餘額已更新:", ptcBalance);
      } catch (error) {
        console.error("刷新PTC餘額失敗:", error);
      }
    }
  };

  // 連接 MetaMask
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        setAccount(address);
        setProvider(provider);
        
        // 檢查網絡
        await checkNetwork(provider);
        
        // 初始化 PetCoin 合約
        const petCoin = createPetCoinContract(provider, signer);
        setPetCoinContract(petCoin);
        
        // 獲取 ETH 余額（Sepolia）
        const ethBalance = await provider.getBalance(address);
        setEthBalance(ethers.utils.formatEther(ethBalance));
        
        // 獲取 PTC 余額
        const ptcBalance = await petCoin.getBalanceOf(address);
        setPtcBalance(ptcBalance);
        
        console.log("已連接到 MetaMask:", address);
        console.log("Sepolia ETH 余額:", ethers.utils.formatEther(ethBalance));
        console.log("PTC 余額:", ptcBalance);
        
        // 監聽健康報告獎勵事件
        petCoin.onHealthReportReward((rewardData) => {
          console.log("收到健康報告獎勵:", rewardData);
          if (rewardData.user.toLowerCase() === address.toLowerCase()) {
            // 顯示獎勵通知
            showReward(rewardData.amount);
            // 延遲一下再刷新餘額，確保區塊鏈狀態已更新
            setTimeout(() => {
              refreshPtcBalance();
            }, 2000);
          }
        });
      } else {
        showError("請安裝 MetaMask!");
      }
    } catch (error) {
      console.error("連接錢包失敗:", error);
    }
  };

  // 檢查是否已連接
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setProvider(provider);
          
          // 檢查網絡
          await checkNetwork(provider);
          
          const signer = provider.getSigner();
          const petCoin = createPetCoinContract(provider, signer);
          setPetCoinContract(petCoin);
          
          // 獲取 ETH 余額（Sepolia）
          const ethBalance = await provider.getBalance(accounts[0]);
          setEthBalance(ethers.utils.formatEther(ethBalance));
          
          // 獲取 PTC 余額
          const ptcBalance = await petCoin.getBalanceOf(accounts[0]);
          setPtcBalance(ptcBalance);
          
          // 監聽健康報告獎勵事件
          petCoin.onHealthReportReward((rewardData) => {
            console.log("收到健康報告獎勵:", rewardData);
            if (rewardData.user.toLowerCase() === accounts[0].toLowerCase()) {
              // 顯示獎勵通知
              showReward(rewardData.amount);
              // 延遲一下再刷新餘額，確保區塊鏈狀態已更新
              setTimeout(() => {
                refreshPtcBalance();
              }, 2000);
            }
          });
        }
      }
    };
    
    checkConnection();

    // 清理函數
    return () => {
      if (petCoinContract) {
        petCoinContract.removeAllListeners();
      }
    };
  }, []);

  return (
    <div className="App">
      <TopNavbar 
        account={account} 
        ethBalance={ethBalance}
        ptcBalance={ptcBalance}
        connectWallet={connectWallet}
      />
      
      <main className="main-content">
        {activeTab === 'healthreport' && (
          <>
            <HealthReportUploadArea 
              onReportUploaded={refreshPtcBalance}
              notification={{ showSuccess, showError, showWarning, showInfo, showProcess, hideNotification }}
            />
            <div className="switch-container">
              <button 
                className="switch-btn switch-btn-right"
                onClick={() => setActiveTab('nftmint')}
              >
                鑄造寵物NFT
                <span className="arrow">▶</span>
              </button>
            </div>
          </>
        )}
        {activeTab === 'nftmint' && (
          <>
            <PetNFTMintArea 
              onNFTMinted={refreshPtcBalance}
              notification={{ showSuccess, showError, showWarning, showInfo, showProcess, hideNotification }}
            />
            <div className="switch-container">
              <button 
                className="switch-btn switch-btn-left"
                onClick={() => setActiveTab('healthreport')}
              >
                <span className="arrow">◀</span>
                健康報告上鏈
              </button>
            </div>
          </>
        )}
        
        {/* 歷史紀錄區域 */}
        <HistorySection account={account} />
      </main>
      
      {/* 通用通知 */}
      <Notification 
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={hideNotification}
        autoCloseTime={notification.autoCloseTime}
        allowManualClose={notification.allowManualClose}
        rewardAmount={notification.rewardAmount}
      />
    </div>
  );
}

export default App; 