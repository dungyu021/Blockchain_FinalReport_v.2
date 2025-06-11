import React, { useState, useEffect } from 'react';
import './TopNavbar.css';
import { formatTokenAmount } from '../utils/petcoin';

const TopNavbar = ({ account, ethBalance, ptcBalance, connectWallet }) => {
  const [prevPtcBalance, setPrevPtcBalance] = useState(ptcBalance);
  const [ptcBalanceUpdated, setPtcBalanceUpdated] = useState(false);

  // 檢測PTC餘額變化
  useEffect(() => {
    if (ptcBalance !== prevPtcBalance && prevPtcBalance !== '0') {
      setPtcBalanceUpdated(true);
      const timer = setTimeout(() => {
        setPtcBalanceUpdated(false);
      }, 600);
      
      return () => clearTimeout(timer);
    }
    setPrevPtcBalance(ptcBalance);
  }, [ptcBalance, prevPtcBalance]);
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="top-navbar">
      <div className="navbar-left">
        <div className="logo">
          <img src="/assets/icons/title.png" alt="PetHealthChain DApp" className="logo-image" />
        </div>
      </div>
      <div className="navbar-right">
        {account ? (
          <div className="wallet-info">
            <span className="balance">Sepolia ETH: {formatTokenAmount(ethBalance)}</span>
            <span className={`balance ${ptcBalanceUpdated ? 'updated' : ''}`}>
              PTC: {formatTokenAmount(ptcBalance)}
            </span>
            <span className="account">{formatAddress(account)}</span>
          </div>
        ) : (
          <button className="connect-wallet-btn" onClick={connectWallet}>
            連接 MetaMask
          </button>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar; 