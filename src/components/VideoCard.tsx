
import { useWallet } from "@/hooks/useWallet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Lock, Euro } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import channels from "@/data/channels.json";

interface VideoCardProps {
  videoId: string;
  title: string;
  description?: string;
  channelId: string;
  isPremium?: boolean;
  price?: string;
}

export const VideoCard = ({ 
  videoId, 
  title, 
  description,
  channelId,
  isPremium = false,
  price = "0.01"
}: VideoCardProps) => {
  const { isConnected, makePayment } = useWallet();
  const [hasAccess, setHasAccess] = useState(!isPremium);
  const [isDonating, setIsDonating] = useState(false);
  const [channelInfo, setChannelInfo] = useState<any>(null);

  useEffect(() => {
    // Check if user already has access to this video
    const hasStoredAccess = localStorage.getItem(`video_access_${videoId}`) === 'true';
    setHasAccess(!isPremium || hasStoredAccess);
    
    // Find channel information
    const channel = channels.find(ch => ch.id === channelId);
    setChannelInfo(channel);
  }, [videoId, isPremium, channelId]);

  const handlePayment = async () => {
    if (!isConnected) return;
    
    const success = await makePayment(price);
    if (success) {
      // Store access information in localStorage
      localStorage.setItem(`video_access_${videoId}`, 'true');
      setHasAccess(true);
    }
  };

  const handleDonation = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet no conectada",
        description: "Conecta tu wallet para donar al creador",
        variant: "destructive"
      });
      return;
    }
    
    setIsDonating(true);
    try {
      const success = await makePayment("1");
      if (success) {
        toast({
          title: "¡Gracias por tu donación!",
          description: `Has donado 1 ETH a ${channelInfo?.name || 'este canal'}`,
        });
      }
    } catch (error) {
      console.error("Error en la donación:", error);
      toast({
        title: "Error en la donación",
        description: "No se pudo completar la donación",
        variant: "destructive"
      });
    } finally {
      setIsDonating(false);
    }
  };

  if (!channelInfo) return null;

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
            src={channelInfo.thumbnail} 
            alt={channelInfo.name} 
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <h3 className="font-bold line-clamp-2 text-europa-blue">{title}</h3>
            <Link to={`/channel/${channelId}`} className="text-sm text-gray-500 hover:text-europa-gold">
              {channelInfo.name}
            </Link>
          </div>
        </div>
        
        <div className="mt-3 flex space-x-2">
          {isPremium && !hasAccess && (
            <Button 
              onClick={handlePayment} 
              disabled={!isConnected}
              className="flex-1 bg-europa-gold hover:bg-yellow-600 text-white"
            >
              {isConnected ? `Pagar ${price} ETH` : 'Conecta tu wallet para pagar'}
            </Button>
          )}
          
          <Button 
            onClick={handleDonation} 
            disabled={isDonating || !isConnected}
            variant="outline"
            className="flex-1 border-europa-gold text-europa-blue hover:bg-europa-gold hover:text-white"
          >
            <Euro className="mr-2 h-4 w-4" />
            {isDonating ? 'Donando...' : 'Donar 1 ETH'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
