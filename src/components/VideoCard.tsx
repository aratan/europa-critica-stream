
import { useWallet } from "@/hooks/useWallet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface VideoCardProps {
  videoId: string;
  title: string;
  channelName: string;
  channelImage: string;
  channelId: string;
  isPremium?: boolean;
  price?: string;
}

export const VideoCard = ({ 
  videoId, 
  title, 
  channelName, 
  channelImage, 
  channelId,
  isPremium = false,
  price = "0.01"
}: VideoCardProps) => {
  const { isConnected, makePayment } = useWallet();
  const [hasAccess, setHasAccess] = useState(!isPremium);

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
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-video bg-black">
        <img 
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
          alt={title}
          className="w-full h-full object-cover"
        />
        {isPremium && !hasAccess ? (
          <div className="absolute inset-0 bg-europa-dark bg-opacity-70 flex flex-col items-center justify-center">
            <Lock size={32} className="text-europa-gold mb-2" />
            <span className="text-white text-sm">Contenido Premium</span>
          </div>
        ) : (
          <Link to={`/video/${videoId}`} className="absolute inset-0 flex items-center justify-center">
            <div className="bg-europa-blue bg-opacity-70 rounded-full p-3 hover:bg-opacity-90 transition-all">
              <Play size={24} className="text-white" fill="white" />
            </div>
          </Link>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <img 
            src={channelImage} 
            alt={channelName} 
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <h3 className="font-bold line-clamp-2 text-europa-blue">{title}</h3>
            <Link to={`/channel/${channelId}`} className="text-sm text-gray-500 hover:text-europa-gold">
              {channelName}
            </Link>
          </div>
        </div>
        
        {isPremium && !hasAccess && (
          <Button 
            onClick={handlePayment} 
            disabled={!isConnected}
            className="mt-3 w-full bg-europa-gold hover:bg-yellow-600 text-white"
          >
            {isConnected ? `Pagar ${price} ETH` : 'Conecta tu wallet para pagar'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
