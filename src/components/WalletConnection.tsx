import React from 'react';
import { Wallet, ChevronDown, ExternalLink, X, AlertCircle } from 'lucide-react';
import { walletProviders } from '../utils/walletProviders';
import { WalletState } from '../types/wallet';

interface WalletConnectionProps {
  walletState: WalletState;
  onWalletStateChange: (state: WalletState) => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ 
  walletState, 
  onWalletStateChange 
}) => {
  const [showWalletModal, setShowWalletModal] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  const handleWalletSelect = async (providerId: string) => {
    const provider = walletProviders.find(p => p.id === providerId);
    if (!provider) return;

    setIsConnecting(true);
    setError('');

    try {
      if (!provider.isInstalled()) {
        if (provider.downloadUrl) {
          window.open(provider.downloadUrl, '_blank');
        }
        throw new Error(`${provider.name} is not installed`);
      }

      const address = await provider.connect();
      
      onWalletStateChange({
        address,
        isConnected: true,
        isCorrectNetwork: true, // Assume correct after successful connection
        chainId: parseInt(import.meta.env.VITE_SOMNIA_CHAIN_ID || '2648'),
        provider: (window as any).ethereum
      });

      setShowWalletModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    onWalletStateChange({
      isConnected: false,
      isCorrectNetwork: false
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = () => {
    setShowWalletModal(true);
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        {walletState.isConnected && walletState.address ? (
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
              walletState.isCorrectNetwork 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-orange-50 text-orange-700 border-orange-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                walletState.isCorrectNetwork ? 'bg-emerald-500' : 'bg-orange-500'
              }`}></div>
              <span className="text-sm font-medium">
                {walletState.isCorrectNetwork ? 'Somnia Network' : 'Wrong Network'}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer group">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {walletState.address.slice(2, 4).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{formatAddress(walletState.address)}</span>
              <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={handleDisconnect}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowWalletModal(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Wallet className="w-4 h-4" />
            <span className="font-medium">Connect Wallet</span>
          </button>
        )}
      </div>

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-yellow-400/10 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-yellow-400/20">
            <div className="flex items-center justify-between p-6 border-b border-yellow-400/20">
              <h3 className="text-lg font-semibold text-black">Connect Wallet</h3>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-black/60 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-black/80 mb-6">
                Choose a wallet to connect to Somnia Network
              </p>

              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-400/30 rounded-2xl mb-4">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}

              <div className="space-y-3">
                {walletProviders.map((provider) => {
                  const isInstalled = provider.isInstalled();
                  
                  return (
                    <button
                      key={provider.id}
                      onClick={() => handleWalletSelect(provider.id)}
                      disabled={isConnecting}
                      className={`w-full flex items-center justify-between p-4 border-2 rounded-2xl transition-all duration-200 ${
                        isInstalled
                          ? 'border-black/20 hover:border-black/40 hover:bg-black/10'
                          : 'border-black/10 bg-black/5'
                      } ${isConnecting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{provider.icon}</div>
                        <div className="text-left">
                          <div className="font-medium text-black">{provider.name}</div>
                          <div className="text-sm text-black/80">{provider.description}</div>
                        </div>
                      </div>
                      
                      {!isInstalled && provider.downloadUrl ? (
                        <ExternalLink className="w-4 h-4 text-black/60" />
                      ) : isInstalled ? (
                        <div className="text-sm text-green-600 font-medium">Installed</div>
                      ) : (
                        <div className="text-sm text-black/60">Coming Soon</div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-black/10 backdrop-blur-sm rounded-2xl border border-black/20">
                <div className="flex items-start space-x-2">
                  <div className="text-black/80 mt-0.5">ℹ️</div>
                  <div className="text-sm text-black/80">
                    <p className="font-medium mb-1">New to crypto wallets?</p>
                    <p>We recommend MetaMask for beginners. It's secure, easy to use, and works great with Somnia Network.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletConnection;