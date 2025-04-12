
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { Wallet, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const WalletConnect = () => {
  const { connectWallet, isConnected, formattedAddress, isConnecting } = useWallet();

  return (
    <div className="space-y-4">
      {!window.ethereum && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>MetaMask no detectado</AlertTitle>
          <AlertDescription>
            Por favor instala MetaMask para poder conectar tu wallet y acceder a todas las funcionalidades.
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mt-2 text-europa-gold underline"
            >
              Descargar MetaMask
            </a>
          </AlertDescription>
        </Alert>
      )}
      
      {isConnected ? (
        <div className="p-4 border border-europa-gold rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-europa-blue">Wallet Conectada</h3>
              <p className="text-sm text-gray-600">Dirección: {formattedAddress}</p>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Conectado
            </div>
          </div>
        </div>
      ) : (
        <Button 
          className="w-full bg-europa-blue hover:bg-blue-800"
          onClick={connectWallet}
          disabled={isConnecting || !window.ethereum}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnecting ? 'Conectando...' : 'Conectar con MetaMask'}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
