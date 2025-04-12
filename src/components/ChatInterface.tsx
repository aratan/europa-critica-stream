
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWallet } from "@/hooks/useWallet";
import { Send } from "lucide-react";
import mqtt from 'mqtt';
import CryptoJS from 'crypto-js';

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

// Encryption key (in a real app, this should be managed securely)
const ENCRYPTION_KEY = 'europa-critica-secure-chat-key';

const ChatInterface = ({ channelId, useYoutubeChat = false }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const { isConnected, formattedAddress } = useWallet();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mqttTopic, setMqttTopic] = useState('europa-critica/chat');

  // Encrypt message
  const encryptMessage = (text: string) => {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  };

  // Decrypt message
  const decryptMessage = (encryptedText: string) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Failed to decrypt message:', error);
      return 'Encrypted message';
    }
  };

  useEffect(() => {
    // Connect to a free public MQTT broker
    if (!mqttClient && !isConnecting && !useYoutubeChat) {
      setIsConnecting(true);
      
      // Using the HiveMQ public broker - replace with your preferred free MQTT broker
      const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
        clientId: `europa-critica-${Math.random().toString(16).substring(2, 10)}`,
        clean: true,
      });
      
      client.on('connect', () => {
        console.log('Connected to MQTT broker');
        setMqttClient(client);
        
        // Set channel-specific topic if channelId is provided
        const topic = channelId 
          ? `europa-critica/chat/${channelId}` 
          : 'europa-critica/chat/general';
        
        setMqttTopic(topic);
        
        // Subscribe to the chat topic
        client.subscribe(topic, (err) => {
          if (err) {
            console.error('Failed to subscribe to MQTT topic:', err);
          } else {
            console.log(`Subscribed to ${topic}`);
            
            // Add system message
            const welcomeMessage: Message = {
              id: Date.now().toString(),
              text: 'Bienvenidos al chat de Europa Crítica',
              sender: 'Sistema',
              timestamp: new Date()
            };
            setMessages([welcomeMessage]);
          }
        });
      });
      
      client.on('message', (topic, payload) => {
        try {
          const rawData = payload.toString();
          const data = JSON.parse(rawData);
          
          // Decrypt the message
          if (data.encrypted) {
            data.text = decryptMessage(data.text);
          }
          
          const newMessage: Message = {
            id: data.id || Date.now().toString(),
            text: data.text,
            sender: data.sender,
            timestamp: new Date(data.timestamp || Date.now())
          };
          
          setMessages(prev => [...prev, newMessage]);
        } catch (error) {
          console.error('Failed to process incoming message:', error);
        }
      });
      
      client.on('error', (err) => {
        console.error('MQTT connection error:', err);
        setIsConnecting(false);
      });
      
      return () => {
        if (client) {
          client.end();
        }
      };
    }
  }, [mqttClient, isConnecting, channelId, useYoutubeChat]);

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
    if (!messageText.trim() || !isConnected || !mqttClient) return;
    
    // Encrypt the message text
    const encryptedText = encryptMessage(messageText);
    
    const messageData = {
      id: Date.now().toString(),
      text: encryptedText,
      sender: formattedAddress || 'Anonymous',
      timestamp: new Date().toISOString(),
      encrypted: true
    };
    
    // Publish the encrypted message to MQTT
    mqttClient.publish(mqttTopic, JSON.stringify(messageData));
    
    // Also add to local state for immediate UI update (with decrypted version)
    const newMessage: Message = {
      id: messageData.id,
      text: messageText, // Use original text for local display
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
        <h3 className="font-bold">Chat Comunitario (MQTT Encriptado)</h3>
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
              disabled={!isConnected || !mqttClient}
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              disabled={!messageText.trim() || !isConnected || !mqttClient}
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
