
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWallet } from "@/hooks/useWallet";
import { Send } from "lucide-react";
import { dbp2pService, ChatMessage } from "@/services/DBP2PService";

// Reutilizamos la interfaz ChatMessage del servicio DBP2P

interface ChatInterfaceProps {
  channelId?: string;
  useYoutubeChat?: boolean;
}

// La clave de cifrado ahora se gestiona en el servicio DBP2P

const ChatInterface = ({ channelId, useYoutubeChat = false }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const { isConnected, formattedAddress } = useWallet();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chatCollection, setChatCollection] = useState('chat_general');

  // Las funciones de cifrado y descifrado ahora están en el servicio DBP2P

  useEffect(() => {
    // Conectar a DBP2P y cargar mensajes
    if (!isConnecting && !useYoutubeChat) {
      setIsConnecting(true);

      // Iniciar sesión en DBP2P (usando credenciales predeterminadas)
      const initializeDBP2P = async () => {
        try {
          // Iniciar sesión en DBP2P
          const loginSuccess = await dbp2pService.login('admin', 'admin123');

          if (loginSuccess) {
            // Establecer la colección específica del canal si se proporciona un channelId
            const collection = channelId
              ? `chat_${channelId}`
              : 'chat_general';

            setChatCollection(collection);

            // Cargar mensajes existentes
            const existingMessages = await dbp2pService.getMessages(collection);

            // Añadir mensaje de bienvenida si no hay mensajes
            if (existingMessages.length === 0) {
              const welcomeMessage: ChatMessage = {
                id: Date.now().toString(),
                text: 'Bienvenidos al chat de Europa Crítica',
                sender: 'Sistema',
                timestamp: new Date()
              };

              setMessages([welcomeMessage]);

              // Guardar mensaje de bienvenida en la base de datos
              await dbp2pService.saveMessage(collection, welcomeMessage);
            } else {
              setMessages(existingMessages);
            }

            // Conectar WebSocket para actualizaciones en tiempo real
            dbp2pService.connectWebSocket();
            dbp2pService.subscribeToCollection(collection);

            // Registrar callback para nuevos mensajes
            dbp2pService.onNewMessage((newMessage) => {
              setMessages(prev => [...prev, newMessage]);
            });
          } else {
            console.error('No se pudo iniciar sesión en DBP2P');
          }
        } catch (error) {
          console.error('Error al inicializar DBP2P:', error);
        } finally {
          setIsConnecting(false);
        }
      };

      initializeDBP2P();

      // Limpiar al desmontar
      return () => {
        dbp2pService.closeConnection();
      };
    }
  }, [isConnecting, channelId, useYoutubeChat]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !isConnected || !dbp2pService.isConnected()) return;

    // Crear objeto de mensaje
    const messageData: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: formattedAddress || 'Anonymous',
      timestamp: new Date(),
      encrypted: false // Se cifrará en el servicio
    };

    // Guardar mensaje en DBP2P (se cifrará en el servicio)
    await dbp2pService.saveMessage(chatCollection, messageData);

    // Añadir a estado local para actualización inmediata de la UI
    const newMessage: ChatMessage = {
      id: messageData.id,
      text: messageText, // Texto original para mostrar localmente
      sender: formattedAddress || 'Anonymous',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (useYoutubeChat && channelId) {
    return (
      <div className="h-[500px] w-full border border-gray-200 rounded-lg overflow-hidden">
        <iframe
          src={`https://www.youtube.com/live_chat?v=${channelId}&embed_domain=${window.location.hostname}`}
          width="100%"
          height="100%"
          title="YouTube live chat"
        ></iframe>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg flex flex-col h-[500px]">
      <div className="bg-europa-blue text-white py-2 px-4">
        <h3 className="font-bold">Chat Comunitario (DBP2P Encriptado)</h3>
      </div>

      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-europa-blue">{message.sender}</span>
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-gray-700">{message.text}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-gray-200">
        {isConnected ? (
          <div className="flex space-x-2">
            <Input
              placeholder="Escribe un mensaje (se enviará encriptado)..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!isConnected || !dbp2pService.isConnected()}
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              disabled={!messageText.trim() || !isConnected || !dbp2pService.isConnected()}
              className="bg-europa-blue hover:bg-blue-800"
            >
              <Send size={16} />
            </Button>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500">
            Conecta tu wallet para participar en el chat
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
