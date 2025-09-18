import { WalletProvider, SomniaNetwork } from '../types/wallet';

// Somnia Network Configuration
export const SOMNIA_NETWORK: SomniaNetwork = {
  chainId: `0x${parseInt(import.meta.env.VITE_SOMNIA_CHAIN_ID || '2648').toString(16)}`,
  chainName: import.meta.env.VITE_SOMNIA_CHAIN_NAME || 'Somnia',
  nativeCurrency: {
    name: import.meta.env.VITE_SOMNIA_CURRENCY_NAME || 'STM',
    symbol: import.meta.env.VITE_SOMNIA_CURRENCY_SYMBOL || 'STM',
    decimals: parseInt(import.meta.env.VITE_SOMNIA_CURRENCY_DECIMALS || '18'),
  },
  rpcUrls: [import.meta.env.VITE_SOMNIA_RPC_URL || 'https://rpc.somnia.network'],
  blockExplorerUrls: [import.meta.env.VITE_SOMNIA_BLOCK_EXPLORER || 'https://explorer.somnia.network'],
};

// Add Somnia network to wallet
const addSomniaNetwork = async (provider: any): Promise<void> => {
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [SOMNIA_NETWORK],
    });
  } catch (error) {
    console.error('Failed to add Somnia network:', error);
    throw new Error('Failed to add Somnia network to wallet');
  }
};

// Switch to Somnia network
const switchToSomnia = async (provider: any): Promise<void> => {
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SOMNIA_NETWORK.chainId }],
    });
  } catch (error: any) {
    // If network doesn't exist, add it
    if (error.code === 4902) {
      await addSomniaNetwork(provider);
    } else {
      throw error;
    }
  }
};

// MetaMask Provider
const createMetaMaskProvider = (): WalletProvider => ({
  id: 'metamask',
  name: 'MetaMask',
  icon: '🦊',
  description: 'Connect using MetaMask browser extension',
  downloadUrl: 'https://metamask.io/download/',
  isInstalled: () => {
    return typeof window !== 'undefined' && !!(window as any).ethereum?.isMetaMask;
  },
  connect: async () => {
    const provider = (window as any).ethereum;
    if (!provider?.isMetaMask) {
      throw new Error('MetaMask not found');
    }

    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    });

    // Switch to Somnia network
    await switchToSomnia(provider);

    return accounts[0];
  },
  switchNetwork: async () => {
    const provider = (window as any).ethereum;
    await switchToSomnia(provider);
  },
});

// Core Wallet Provider
const createCoreWalletProvider = (): WalletProvider => ({
  id: 'core',
  name: 'Core Wallet',
  icon: '🔷',
  description: 'Connect using Core Wallet extension',
  downloadUrl: 'https://core.app/',
  isInstalled: () => {
    return typeof window !== 'undefined' && !!(window as any).ethereum?.isAvalanche;
  },
  connect: async () => {
    const provider = (window as any).ethereum;
    if (!provider?.isAvalanche) {
      throw new Error('Core Wallet not found');
    }

    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    });

    // Switch to Somnia network
    await switchToSomnia(provider);

    return accounts[0];
  },
  switchNetwork: async () => {
    const provider = (window as any).ethereum;
    await switchToSomnia(provider);
  },
});

// WalletConnect Provider
const createWalletConnectProvider = (): WalletProvider => ({
  id: 'walletconnect',
  name: 'WalletConnect',
  icon: '📱',
  description: 'Connect using mobile wallet via QR code',
  isInstalled: () => true, // WalletConnect is always available
  connect: async () => {
    // This would integrate with WalletConnect SDK
    // For now, we'll show a placeholder
    throw new Error('WalletConnect integration coming soon');
  },
});

// Coinbase Wallet Provider
const createCoinbaseWalletProvider = (): WalletProvider => ({
  id: 'coinbase',
  name: 'Coinbase Wallet',
  icon: '🔵',
  description: 'Connect using Coinbase Wallet extension',
  downloadUrl: 'https://wallet.coinbase.com/',
  isInstalled: () => {
    return typeof window !== 'undefined' && !!(window as any).ethereum?.isCoinbaseWallet;
  },
  connect: async () => {
    const provider = (window as any).ethereum;
    if (!provider?.isCoinbaseWallet) {
      throw new Error('Coinbase Wallet not found');
    }

    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    });

    // Switch to Somnia network
    await switchToSomnia(provider);

    return accounts[0];
  },
  switchNetwork: async () => {
    const provider = (window as any).ethereum;
    await switchToSomnia(provider);
  },
});

// Export all wallet providers
export const walletProviders: WalletProvider[] = [
  createMetaMaskProvider(),
  createCoreWalletProvider(),
  createCoinbaseWalletProvider(),
  createWalletConnectProvider(),
];