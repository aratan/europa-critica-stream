import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { dbp2pService } from '@/services/DBP2PService';
import { useToast } from "@/components/ui/use-toast";

interface DBP2PConfigProps {
  onConnect?: () => void;
}

const DBP2PConfig = ({ onConnect }: DBP2PConfigProps) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!username || !password) {
      toast({
        title: "Error de conexión",
        description: "Usuario y contraseña son requeridos",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      const success = await dbp2pService.login(username, password);
      
      if (success) {
        setIsConnected(true);
        toast({
          title: "Conexión exitosa",
          description: "Conectado a la base de datos DBP2P",
        });
        
        // Conectar WebSocket
        dbp2pService.connectWebSocket();
        
        // Notificar al componente padre
        if (onConnect) {
          onConnect();
        }
      } else {
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar a la base de datos DBP2P",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error al conectar con DBP2P:', error);
      toast({
        title: "Error de conexión",
        description: "Ocurrió un error al conectar con DBP2P",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    dbp2pService.closeConnection();
    setIsConnected(false);
    toast({
      title: "Desconexión",
      description: "Desconectado de la base de datos DBP2P",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de DBP2P</CardTitle>
        <CardDescription>
          Conecta a la base de datos NoSQL descentralizada P2P
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Usuario</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isConnected}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isConnected}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="advanced"
            checked={showAdvanced}
            onCheckedChange={setShowAdvanced}
            disabled={isConnected}
          />
          <Label htmlFor="advanced">Mostrar configuración avanzada</Label>
        </div>
        
        {showAdvanced && (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="api-url">URL de la API</Label>
              <Input
                id="api-url"
                defaultValue="http://localhost:8080/api"
                disabled={isConnected}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ws-url">URL de WebSocket</Label>
              <Input
                id="ws-url"
                defaultValue="ws://localhost:8081/ws"
                disabled={isConnected}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isConnected ? (
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? 'Conectando...' : 'Conectar a DBP2P'}
          </Button>
        ) : (
          <Button 
            onClick={handleDisconnect} 
            variant="outline"
            className="w-full"
          >
            Desconectar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DBP2PConfig;
