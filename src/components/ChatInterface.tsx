
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWallet } from "@/hooks/useWallet";
import { Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  channelId?: string;
  useYoutubeChat?: boolean;
}

const ChatInterface = ({ channelId, useYoutubeChat = false }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const { isConnected, formattedAddress } = useWallet();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // For demo: Add some initial messages
    const initialMessages: Message[] = [
      {
        id: '1',
        text: 'Bienvenidos al chat de Europa Crítica',
        sender: 'Sistema',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        text: '¿Qué opináis del último video?',
        sender: 'Usuario123',
        timestamp: new Date(Date.now() - 1800000)
      },
      {
        id: '3',
        text: 'Muy interesante el análisis sobre la situación actual',
        sender: 'EuropeoLibre',
        timestamp: new Date(Date.now() - 900000)
      }
    ];
    
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !isConnected) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
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
        <h3 className="font-bold">Chat Comunitario</h3>
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
              placeholder="Escribe un mensaje..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!isConnected}
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              disabled={!messageText.trim() || !isConnected}
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
