import { ethers } from 'ethers';
import HealthReportABI from '../abi/healthreport.json';

// 合約地址 - 請更新為實際部署的地址
export const HEALTHREPORT_CONTRACT_ADDRESS = "0x73965Dd8eAbB638fD2Dd11272ac2769b66243c11";

/**
 * 獲取 HealthReport 合約實例
 * @param {object} signerOrProvider - ethers signer 或 provider
 * @returns {object} 合約實例
 */
export const getHealthReportContract = (signerOrProvider) => {
  return new ethers.Contract(HEALTHREPORT_CONTRACT_ADDRESS, HealthReportABI, signerOrProvider);
};

/**
 * 檢查 MetaMask 是否已安裝
 * @returns {boolean}
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

/**
 * 連接到 MetaMask
 * @returns {object} { success: boolean, account?: string, error?: string }
 */
export const connectWallet = async () => {
  try {
    if (!isMetaMaskInstalled()) {
      return { success: false, error: 'MetaMask is not installed' };
    }

    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    return { success: true, account: accounts[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 獲取目前連接的帳戶
 * @returns {string|null} 帳戶地址
 */
export const getCurrentAccount = async () => {
  try {
    if (!isMetaMaskInstalled()) return null;
    
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    });
    
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

/**
 * 檢查CID是否已被使用
 * @param {string} ipfsCID - IPFS CID
 * @returns {object} { success: boolean, isUsed?: boolean, error?: string }
 */
export const checkCIDUsed = async (ipfsCID) => {
  try {
    if (!isMetaMaskInstalled()) {
      return { success: false, error: 'MetaMask is not installed' };
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = getHealthReportContract(provider);

    const isUsed = await contract.isCIDUsed(ipfsCID.trim());
    
    return { 
      success: true, 
      isUsed: isUsed
    };
  } catch (error) {
    console.error('Error checking CID:', error);
    return { 
      success: false, 
      error: error.reason || error.message || '檢查CID失敗' 
    };
  }
};

/**
 * 上傳健康報告到區塊鏈
 * @param {string} petId - 寵物編號
 * @param {string} reportType - 報告類型
 * @param {string} reportName - 報告名稱
 * @param {string} ipfsCID - IPFS CID
 * @param {string} description - 描述
 * @returns {object} { success: boolean, txHash?: string, error?: string }
 */
export const uploadReport = async (petId, reportType, reportName, ipfsCID, description) => {
  try {
    if (!isMetaMaskInstalled()) {
      return { success: false, error: 'MetaMask is not installed' };
    }

    // 檢查輸入參數
    if (!petId || !reportType || !reportName || !ipfsCID) {
      return { success: false, error: '請填寫所有必要欄位' };
    }

    // 先檢查CID是否已被使用
    const cidCheck = await checkCIDUsed(ipfsCID);
    if (cidCheck.success && cidCheck.isUsed) {
      return { success: false, error: '此CID已被使用過，無法重複上傳' };
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = getHealthReportContract(signer);

    // 發送交易
    const tx = await contract.uploadReport(
      petId.trim(),
      reportType.trim(),
      reportName.trim(),
      ipfsCID.trim(),
      description.trim() || ""
    );

    // 等待交易確認
    const receipt = await tx.wait();
    
    return { 
      success: true, 
      txHash: receipt.transactionHash,
      reportId: receipt.logs[0]?.topics[1] // 獲取報告ID
    };
  } catch (error) {
    console.error('Error uploading report:', error);
    
    // 特別處理CID重複的錯誤
    if (error.message && error.message.includes('This CID has already been used')) {
      return { 
        success: false, 
        error: '此CID已被使用過，無法重複上傳' 
      };
    }
    
    return { 
      success: false, 
      error: error.reason || error.message || '上傳失敗' 
    };
  }
};

/**
 * 獲取用戶的所有健康報告
 * @param {string} userAddress - 用戶地址
 * @returns {object} { success: boolean, reports?: array, error?: string }
 */
export const getUserReports = async (userAddress) => {
  try {
    if (!userAddress) {
      return { success: false, error: 'User address is required' };
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = getHealthReportContract(provider);

    // 獲取用戶報告ID列表
    const reportIds = await contract.getUserReports(userAddress);
    
    if (reportIds.length === 0) {
      return { success: true, reports: [] };
    }

    // 獲取每個報告的詳細資訊
    const reports = [];
    for (const id of reportIds) {
      try {
        const report = await contract.getReport(id);
        reports.push({
          reportId: report.reportId.toString(),
          petId: report.petId,
          reportType: report.reportType,
          reportName: report.reportName,
          ipfsCID: report.ipfsCID,
          description: report.description,
          owner: report.owner,
          timestamp: new Date(report.timestamp.toNumber() * 1000),
          isValid: report.isValid
        });
      } catch (error) {
        console.error(`Error fetching report ${id}:`, error);
      }
    }

    return { success: true, reports };
  } catch (error) {
    console.error('Error getting user reports:', error);
    return { 
      success: false, 
      error: error.reason || error.message || '獲取報告失敗' 
    };
  }
};

/**
 * 獲取特定報告詳情
 * @param {number} reportId - 報告ID
 * @returns {object} { success: boolean, report?: object, error?: string }
 */
export const getReport = async (reportId) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = getHealthReportContract(provider);

    const report = await contract.getReport(reportId);
    
    return {
      success: true,
      report: {
        reportId: report.reportId.toString(),
        petId: report.petId,
        reportType: report.reportType,
        reportName: report.reportName,
        ipfsCID: report.ipfsCID,
        description: report.description,
        owner: report.owner,
        timestamp: new Date(report.timestamp.toNumber() * 1000),
        isValid: report.isValid
      }
    };
  } catch (error) {
    console.error('Error getting report:', error);
    return { 
      success: false, 
      error: error.reason || error.message || '獲取報告失敗' 
    };
  }
};

/**
 * 監聽報告上傳事件
 * @param {function} callback - 事件回調函數
 * @returns {function} 取消監聽的函數
 */
export const listenForReportUploaded = (callback) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = getHealthReportContract(provider);

    const handleEvent = (reportId, owner, petId, reportType, ipfsCID, timestamp, event) => {
      callback({
        reportId: reportId.toString(),
        owner,
        petId,
        reportType,
        ipfsCID,
        timestamp: new Date(timestamp.toNumber() * 1000),
        transactionHash: event.transactionHash
      });
    };

    contract.on("ReportUploaded", handleEvent);

    // 返回取消監聽的函數
    return () => {
      contract.off("ReportUploaded", handleEvent);
    };
  } catch (error) {
    console.error('Error setting up event listener:', error);
    return () => {}; // 返回空函數避免錯誤
  }
};

/**
 * 格式化地址顯示
 * @param {string} address - 完整地址
 * @returns {string} 格式化後的地址
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * 驗證 IPFS CID 格式
 * @param {string} cid - IPFS CID
 * @returns {boolean} 是否為有效格式
 */
export const validateIPFSCID = (cid) => {
  if (!cid) return false;
  
  // 基本的 CID 格式檢查
  const cidRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|f[0-9a-f]{50,})/;
  return cidRegex.test(cid.trim());
};

/**
 * 生成 IPFS Gateway URL
 * @param {string} cid - IPFS CID
 * @returns {string} Gateway URL
 */
export const getIPFSGatewayURL = (cid) => {
  if (!cid) return '';
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
};

// 預設導出所有功能
export default {
  HEALTHREPORT_CONTRACT_ADDRESS,
  getHealthReportContract,
  isMetaMaskInstalled,
  connectWallet,
  getCurrentAccount,
  uploadReport,
  getUserReports,
  getReport,
  listenForReportUploaded,
  formatAddress,
  validateIPFSCID,
  getIPFSGatewayURL
}; 