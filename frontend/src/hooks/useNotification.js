import { useState, useCallback } from 'react';

/**
 * 通知管理Hook
 * @returns {Object} 包含通知狀態和控制方法的對象
 */
const useNotification = () => {
  const [notification, setNotification] = useState({
    show: false,
    type: 'info',
    message: '',
    autoCloseTime: 5000,
    allowManualClose: true,
    rewardAmount: null
  });

  // 顯示通知的通用方法
  const showNotification = useCallback((type, message, options = {}) => {
    setNotification({
      show: true,
      type,
      message,
      autoCloseTime: options.autoCloseTime ?? 5000,
      allowManualClose: options.allowManualClose ?? true,
      rewardAmount: options.rewardAmount ?? null
    });
  }, []);

  // 關閉通知
  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      show: false
    }));
  }, []);

  // 顯示成功通知
  const showSuccess = useCallback((message, options = {}) => {
    showNotification('success', message, options);
  }, [showNotification]);

  // 顯示錯誤通知
  const showError = useCallback((message, options = {}) => {
    showNotification('error', message, options);
  }, [showNotification]);

  // 顯示警告通知
  const showWarning = useCallback((message, options = {}) => {
    showNotification('warning', message, options);
  }, [showNotification]);

  // 顯示資訊通知
  const showInfo = useCallback((message, options = {}) => {
    showNotification('info', message, options);
  }, [showNotification]);

  // 顯示流程通知（不能手動關閉）
  const showProcess = useCallback((message, options = {}) => {
    showNotification('process', message, {
      ...options,
      allowManualClose: false,
      autoCloseTime: 0 // 流程通知不自動關閉
    });
  }, [showNotification]);

  // 顯示獎勵通知
  const showReward = useCallback((amount, options = {}) => {
    showNotification('reward', '', {
      ...options,
      rewardAmount: amount,
      autoCloseTime: 5000 // 獎勵通知5秒後自動關閉
    });
  }, [showNotification]);

  return {
    notification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showProcess,
    showReward,
    hideNotification
  };
};

export default useNotification; 