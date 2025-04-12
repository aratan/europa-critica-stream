
import { useWallet as useWalletContext } from '@/context/WalletContext';

export const useWallet = () => {
  const walletContext = useWalletContext();
  
  const formatAddress = (address: string | null): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return {
    ...walletContext,
    formattedAddress: formatAddress(walletContext.account)
  };
};

// Add Ethereum to Window interface
declare global {
  interface Window {
    ethereum: any;
    Web3: any;
  }
}
