export interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  downloadUrl?: string;
  isInstalled: () => boolean;
  connect: () => Promise<string>;
  disconnect?: () => Promise<void>;
  switchNetwork?: () => Promise<void>;
}

export interface SomniaNetwork {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export interface WalletState {
  address?: string;
  chainId?: number;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  provider?: any;
}