
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ChannelList from "@/components/ChannelList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { VideoCard } from "@/components/VideoCard";
import channels from "@/data/channels.json";
import videos from "@/data/videos.json";

const Channels = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Filter videos for featured tab
  const featuredVideos = videos.slice(0, 3);
  
  // Filter videos for recent tab
  const recentVideos = [...videos].sort(() => 0.5 - Math.random()).slice(0, 3);
  
  // Filter videos for critical thinking tab
  const criticalVideos = videos.filter(video => 
    video.title.toLowerCase().includes("crítico") || 
    video.description.toLowerCase().includes("crítico")
  );

  return (
    <div className="min-h-screen flex flex-col bg-europa-light">
      <Navbar />
      
      <main className="flex-grow europa-container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-europa-blue mb-2">
              Canales de Pensamiento Crítico
            </h1>
            <p className="text-gray-600 mb-6">
              Explora canales independientes con diferentes perspectivas y análisis críticos
            </p>
          </div>
          
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">Todos los Canales</TabsTrigger>
              <TabsTrigger value="featured">Destacados</TabsTrigger>
              <TabsTrigger value="recent">Recientes</TabsTrigger>
              <TabsTrigger value="critical">Pensamiento Crítico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-8">
              <div className="space-y-6">
                <ChannelList />
              </div>
            </TabsContent>
            
            <TabsContent value="featured" className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-europa-blue">Videos Destacados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredVideos.map(video => (
                    <VideoCard 
                      key={video.id}
                      videoId={video.id}
                      title={video.title}
                      channelId={video.channelId}
                      isPremium={video.isPremium}
                      price={video.price}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-europa-blue">Últimos Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentVideos.map(video => (
                    <VideoCard 
                      key={video.id}
                      videoId={video.id}
                      title={video.title}
                      channelId={video.channelId}
                      isPremium={video.isPremium}
                      price={video.price}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="critical" className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-europa-blue">Videos de Pensamiento Crítico</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map(video => (
                    <VideoCard 
                      key={video.id}
                      videoId={video.id}
                      title={video.title}
                      channelId={video.channelId}
                      isPremium={video.isPremium}
                      price={video.price}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-europa-blue text-white py-6">
        <div className="europa-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-europa-gold">Europa Crítica</h3>
              <p className="text-sm">Plataforma de pensamiento alternativo</p>
            </div>
            <div className="text-sm text-gray-300">
              &copy; {new Date().getFullYear()} Europa Crítica Stream. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Channels;
