
import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  isPremium?: boolean;
  price?: string;
}

const VideoPlayer = ({ videoId, title, isPremium = false, price = "0.01" }: VideoPlayerProps) => {
  const [hasAccess, setHasAccess] = useState(!isPremium);
  const { isConnected, makePayment } = useWallet();

  useEffect(() => {
    // Check if the user has already paid for this video
    const checkAccess = () => {
      const accessData = localStorage.getItem(`video_access_${videoId}`);
      if (accessData) {
        setHasAccess(true);
      }
    };
    
    checkAccess();
  }, [videoId]);

  const handlePayment = async () => {
    if (!isConnected) return;
    
    const success = await makePayment(price);
    if (success) {
      // Store access information in localStorage
      localStorage.setItem(`video_access_${videoId}`, 'true');
      setHasAccess(true);
    }
  };

  return (
    <div className="w-full">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {hasAccess ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
            title={title}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-europa-dark bg-opacity-80">
            <Lock size={48} className="text-europa-gold mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">Contenido Premium</h3>
            <p className="text-white text-sm mb-4">Paga {price} ETH para acceder a este contenido</p>
            <Button 
              onClick={handlePayment} 
              disabled={!isConnected}
              className="bg-europa-gold hover:bg-yellow-600 text-white"
            >
              {isConnected ? `Pagar ${price} ETH` : 'Conecta tu wallet para pagar'}
            </Button>
          </div>
        )}
      </div>
      <h2 className="text-lg font-bold mt-2">{title}</h2>
    </div>
  );
};

export default VideoPlayer;
