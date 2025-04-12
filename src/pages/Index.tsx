
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import ChannelList from "@/components/ChannelList";
import WalletConnect from "@/components/WalletConnect";
import ChatInterface from "@/components/ChatInterface";
import { WalletProvider } from "@/context/WalletContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

const Index = () => {
  const featuredVideoId = "SvXYG-8RW2c"; // IAVIC video ID

  return (
    <WalletProvider>
      <div className="min-h-screen flex flex-col bg-europa-light">
        <Navbar />
        
        <main className="flex-grow europa-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-europa-blue mb-2">
                  Europa Crítica Stream
                </h1>
                <p className="text-gray-600 mb-6">
                  Plataforma de streams dedicada al pensamiento crítico y la cultura europea
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-europa-blue mb-4">Video Destacado</h2>
                <VideoPlayer 
                  videoId={featuredVideoId}
                  title="Análisis cultural europeo - IAVIC"
                />
              </div>
              
              <Separator className="my-8" />
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-europa-blue">Canales Destacados</h2>
                </div>
                <ChannelList limit={3} />
              </div>
            </div>
            
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-europa-blue">Conecta tu Wallet</CardTitle>
                  <CardDescription>
                    Usa MetaMask para acceder a contenido exclusivo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WalletConnect />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-europa-blue">Chat Comunitario</CardTitle>
                  <CardDescription>
                    Participa en nuestra comunidad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="custom">
                    <TabsList className="mb-4">
                      <TabsTrigger value="custom">Chat Europa</TabsTrigger>
                      <TabsTrigger value="youtube">Chat YouTube</TabsTrigger>
                    </TabsList>
                    <TabsContent value="custom">
                      <ChatInterface />
                    </TabsContent>
                    <TabsContent value="youtube">
                      <ChatInterface useYoutubeChat channelId={featuredVideoId} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <Card className="bg-europa-blue text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info size={18} />
                    <span>Sobre Europa Crítica</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Europa Crítica es una plataforma dedicada a promover el pensamiento crítico y los valores culturales europeos a través de streams y contenido audiovisual.
                  </p>
                  <p>
                    Nuestro objetivo es fomentar el diálogo y el análisis sobre temas relevantes para Europa y su legado cultural e intelectual.
                  </p>
                </CardContent>
              </Card>
            </div>
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
    </WalletProvider>
  );
};

export default Index;
