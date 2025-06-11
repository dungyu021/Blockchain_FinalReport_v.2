import { ethers } from 'ethers';
import PetCoinABI from '../abi/petcoin.json';

// PetCoin 合約地址
export const PETCOIN_CONTRACT_ADDRESS = "0xd0D7899C8DB6456BE828e086ac89D803F0999E0B";

// PetCoin 合約類
export class PetCoinContract {
  constructor(provider, signer = null) {
    this.provider = provider;
    this.signer = signer;
    this.contract = new ethers.Contract(
      PETCOIN_CONTRACT_ADDRESS,
      PetCoinABI,
      signer || provider
    );
  }

  // 獲取代幣名稱
  async getName() {
    try {
      return await this.contract.name();
    } catch (error) {
      console.error('獲取代幣名稱失敗:', error);
      return 'PetCoin';
    }
  }

  // 獲取代幣符號
  async getSymbol() {
    try {
      return await this.contract.symbol();
    } catch (error) {
      console.error('獲取代幣符號失敗:', error);
      return 'PTC';
    }
  }

  // 獲取小數位數
  async getDecimals() {
    try {
      return await this.contract.decimals();
    } catch (error) {
      console.error('獲取小數位數失敗:', error);
      return 18;
    }
  }

  // 獲取總供應量
  async getTotalSupply() {
    try {
      const totalSupply = await this.contract.totalSupply();
      return ethers.utils.formatEther(totalSupply);
    } catch (error) {
      console.error('獲取總供應量失敗:', error);
      return '0';
    }
  }

  // 獲取指定地址的余額
  async getBalanceOf(address) {
    try {
      const balance = await this.contract.balanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('獲取余額失敗:', error);
      return '0';
    }
  }

  // 獲取健康報告獎勵數量
  async getHealthReportReward() {
    try {
      const reward = await this.contract.HEALTH_REPORT_REWARD();
      return ethers.utils.formatEther(reward);
    } catch (error) {
      console.error('獲取健康報告獎勵數量失敗:', error);
      return '10'; // 默認值
    }
  }

  // 獲取健康報告合約地址
  async getHealthRecordContract() {
    try {
      return await this.contract.healthRecordContract();
    } catch (error) {
      console.error('獲取健康報告合約地址失敗:', error);
      return ethers.constants.AddressZero;
    }
  }

  // 獲取合約擁有者
  async getOwner() {
    try {
      return await this.contract.owner();
    } catch (error) {
      console.error('獲取合約擁有者失敗:', error);
      return ethers.constants.AddressZero;
    }
  }

  // 轉帳代幣
  async transfer(to, amount) {
    try {
      if (!this.signer) {
        throw new Error('需要簽名者才能執行轉帳');
      }
      const amountWei = ethers.utils.parseEther(amount.toString());
      const tx = await this.contract.transfer(to, amountWei);
      return await tx.wait();
    } catch (error) {
      console.error('轉帳失敗:', error);
      throw error;
    }
  }

  // 授權代幣
  async approve(spender, amount) {
    try {
      if (!this.signer) {
        throw new Error('需要簽名者才能執行授權');
      }
      const amountWei = ethers.utils.parseEther(amount.toString());
      const tx = await this.contract.approve(spender, amountWei);
      return await tx.wait();
    } catch (error) {
      console.error('授權失敗:', error);
      throw error;
    }
  }

  // 獲取授權額度
  async getAllowance(owner, spender) {
    try {
      const allowance = await this.contract.allowance(owner, spender);
      return ethers.utils.formatEther(allowance);
    } catch (error) {
      console.error('獲取授權額度失敗:', error);
      return '0';
    }
  }

  // 燒毀代幣
  async burn(amount) {
    try {
      if (!this.signer) {
        throw new Error('需要簽名者才能執行燒毀');
      }
      const amountWei = ethers.utils.parseEther(amount.toString());
      const tx = await this.contract.burn(amountWei);
      return await tx.wait();
    } catch (error) {
      console.error('燒毀代幣失敗:', error);
      throw error;
    }
  }

  // 監聽轉帳事件
  onTransfer(callback) {
    this.contract.on('Transfer', (from, to, value, event) => {
      callback({
        from,
        to,
        value: ethers.utils.formatEther(value),
        event
      });
    });
  }

  // 監聽健康報告獎勵事件
  onHealthReportReward(callback) {
    this.contract.on('HealthReportReward', (user, amount, event) => {
      callback({
        user,
        amount: ethers.utils.formatEther(amount),
        event
      });
    });
  }

  // 移除所有監聽器
  removeAllListeners() {
    this.contract.removeAllListeners();
  }
}

// 工具函數：檢查是否連接到正確的網絡
export const checkNetwork = async (provider) => {
  try {
    const network = await provider.getNetwork();
    console.log('當前網絡:', network);
    return network;
  } catch (error) {
    console.error('檢查網絡失敗:', error);
    return null;
  }
};

// 工具函數：格式化地址顯示
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// 工具函數：格式化代幣數量顯示
export const formatTokenAmount = (amount, decimals = 4) => {
  if (!amount) return '0';
  const num = parseFloat(amount);
  if (num === 0) return '0';
  if (num < 0.0001) return '< 0.0001';
  return num.toFixed(decimals);
};

// 默認導出 PetCoin 合約實例創建函數
export default function createPetCoinContract(provider, signer = null) {
  return new PetCoinContract(provider, signer);
} 