
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ChannelList from "@/components/ChannelList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { VideoCard } from "@/components/VideoCard";

const Channels = () => {
  const [activeTab, setActiveTab] = useState("all");

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
                  <VideoCard 
                    channelId="IAVIC"
                    videoId="SvXYG-8RW2c"
                    title="Análisis cultural europeo"
                    channelName="IAVIC"
                    channelImage="https://yt3.googleusercontent.com/ytc/APkrFKY5uBJ0AuKmzEaHlhA_9TnHRaCFGDlBgCR08PnU=s176-c-k-c0x00ffffff-no-rj"
                  />
                  <VideoCard 
                    channelId="Un_Abogado_Contra_la_Demagogia"
                    videoId="Pt2KrBfQ9hw"
                    title="Análisis jurídico de actualidad"
                    channelName="Un Abogado Contra la Demagogia"
                    channelImage="https://yt3.googleusercontent.com/ytc/AL5GRJWDiebjD3o7x7_ERRQIEzBQi9DUlsJx-7LBB6c=s176-c-k-c0x00ffffff-no-rj"
                  />
                  <VideoCard 
                    channelId="begonagerpe7757"
                    videoId="MnH-05WyxRw"
                    title="Análisis político independiente"
                    channelName="Begoña Gerpe"
                    channelImage="https://yt3.googleusercontent.com/ytc/APkrFKbTOUXZqJNGiXv2tRLyEZHGH-v6u_qK2nuIqT0MuA=s176-c-k-c0x00ffffff-no-rj"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-europa-blue">Últimos Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <VideoCard 
                    channelId="begonagerpe7757"
                    videoId="MnH-05WyxRw"
                    title="Análisis político actual"
                    channelName="Begoña Gerpe"
                    channelImage="https://yt3.googleusercontent.com/ytc/APkrFKbTOUXZqJNGiXv2tRLyEZHGH-v6u_qK2nuIqT0MuA=s176-c-k-c0x00ffffff-no-rj"
                  />
                  <VideoCard 
                    channelId="Un_Abogado_Contra_la_Demagogia"
                    videoId="Pt2KrBfQ9hw"
                    title="Perspectiva legal sobre temas actuales"
                    channelName="Un Abogado Contra la Demagogia"
                    channelImage="https://yt3.googleusercontent.com/ytc/AL5GRJWDiebjD3o7x7_ERRQIEzBQi9DUlsJx-7LBB6c=s176-c-k-c0x00ffffff-no-rj"
                  />
                  <VideoCard 
                    channelId="IdeasRadicales"
                    videoId="O4xf_B1xIxs"
                    title="Libertad y economía"
                    channelName="Ideas Radicales"
                    channelImage="https://yt3.googleusercontent.com/ytc/APkrFKZzSV9WZyZxP0aqRLFFqsyJQp1YfZKbV_ysLNUm=s176-c-k-c0x00ffffff-no-rj"
                  />
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
