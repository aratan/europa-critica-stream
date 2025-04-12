
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { Home, Youtube, MessageCircle, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { connectWallet, disconnectWallet, isConnected, formattedAddress, isConnecting } = useWallet();

  return (
    <nav className="bg-europa-blue text-white py-4 shadow-md">
      <div className="europa-container">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-europa-gold font-bold text-xl">Europa Crítica</span>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="flex items-center space-x-1 hover:text-europa-gold transition-colors">
              <Home size={18} />
              <span>Inicio</span>
            </Link>
            <Link to="/channels" className="flex items-center space-x-1 hover:text-europa-gold transition-colors">
              <Youtube size={18} />
              <span>Canales</span>
            </Link>
            <Link to="/chat" className="flex items-center space-x-1 hover:text-europa-gold transition-colors">
              <MessageCircle size={18} />
              <span>Chat</span>
            </Link>
          </div>

          <div>
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <span className="text-europa-gold">{formattedAddress}</span>
                <Button 
                  variant="outline" 
                  className="border-europa-gold text-europa-gold hover:bg-europa-gold hover:text-white"
                  onClick={disconnectWallet}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Desconectar
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="border-europa-gold text-europa-gold hover:bg-europa-gold hover:text-white"
                onClick={connectWallet}
                disabled={isConnecting}
              >
                <Wallet className="mr-2 h-4 w-4" />
                {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
