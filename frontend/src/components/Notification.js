import React, { useState, useEffect } from 'react';
import './Notification.css';

/**
 * 通用通知組件
 * @param {Object} props
 * @param {boolean} props.show - 是否顯示通知
 * @param {string} props.type - 通知類型: 'success', 'error', 'info', 'warning', 'process', 'reward'
 * @param {string} props.message - 通知訊息
 * @param {function} props.onClose - 關閉回調函數
 * @param {number} props.autoCloseTime - 自動關閉時間(毫秒)，0為不自動關閉，預設5000ms
 * @param {boolean} props.allowManualClose - 是否允許手動關閉，預設true
 * @param {string} props.rewardAmount - 獎勵金額（僅用於reward類型）
 */
const Notification = ({ 
  show, 
  type = 'info', 
  message, 
  onClose, 
  autoCloseTime = 5000,
  allowManualClose = true,
  rewardAmount = null
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
    }
  }, [show]);

  useEffect(() => {
    if (show && autoCloseTime > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [show, autoCloseTime]);

  const handleClose = () => {
    setVisible(false);
    // 等待動畫完成後調用回調
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  const handleManualClose = () => {
    if (allowManualClose) {
      handleClose();
    }
  };

  // 根據類型決定是否允許手動關閉
  const isProcessType = type === 'process';
  const canClose = allowManualClose && !isProcessType;

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'process':
        return '⏳';
      case 'reward':
        return '🎉';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`notification-overlay ${visible ? 'show' : 'hide'}`}>
      <div className={`notification ${type} ${visible ? 'slide-in' : 'slide-out'}`}>
        <div className="notification-content">
          <div className="notification-icon">
            {getIcon()}
          </div>
          <div className="notification-message">
            {type === 'reward' ? (
              <div className="reward-message">
                <div className="reward-title">恭喜獲得獎勵！</div>
                <div className="reward-amount">您收到了 <strong>{rewardAmount} PTC</strong> 代幣獎勵</div>
                <div className="reward-subtitle">感謝您上傳健康報告</div>
              </div>
            ) : (
              message
            )}
          </div>
          {canClose && (
            <button 
              className="notification-close-btn"
              onClick={handleManualClose}
              aria-label="關閉通知"
            >
              ✕
            </button>
          )}
        </div>
        {!canClose && type === 'process' && (
          <div className="notification-progress">
            <div className="progress-bar"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification; 