import axios from 'axios';
import CryptoJS from 'crypto-js';

// Configuración
const API_URL = 'http://localhost:8080/api';
const WS_URL = 'ws://localhost:8081/ws';
const ENCRYPTION_KEY = 'europa-critica-secure-chat-key';

// Interfaz para mensajes
export interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: Date | string;
  encrypted?: boolean;
}

// Interfaz para la respuesta de autenticación
interface AuthResponse {
  token: string;
  user_id: string;
  username: string;
  roles: string;
}

class DBP2PService {
  private token: string | null = null;
  private userId: string | null = null;
  private username: string | null = null;
  private ws: WebSocket | null = null;
  private messageCallbacks: ((message: ChatMessage) => void)[] = [];

  // Función para iniciar sesión y obtener token JWT
  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/login`, {
        username,
        password
      });
      
      this.token = response.data.token;
      this.userId = response.data.user_id;
      this.username = response.data.username;
      
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión en DBP2P:', error);
      return false;
    }
  }

  // Función para obtener headers con token de autenticación
  private getHeaders() {
    if (!this.token) {
      throw new Error('No hay sesión iniciada. Usa login() primero.');
    }
    
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  // Función para cifrar mensaje
  encryptMessage(text: string): string {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  }

  // Función para descifrar mensaje
  decryptMessage(encryptedText: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error al descifrar mensaje:', error);
      return 'Mensaje cifrado (error al descifrar)';
    }
  }

  // Función para guardar un mensaje en la base de datos
  async saveMessage(collectionName: string, message: ChatMessage): Promise<ChatMessage | null> {
    if (!this.token) {
      console.error('No hay sesión iniciada');
      return null;
    }

    try {
      // Si el mensaje no está cifrado, lo ciframos
      const messageToSave = { ...message };
      if (!messageToSave.encrypted && typeof messageToSave.text === 'string') {
        messageToSave.text = this.encryptMessage(messageToSave.text);
        messageToSave.encrypted = true;
      }

      const response = await axios.post(
        `${API_URL}/collections/${collectionName}`,
        messageToSave,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error al guardar mensaje en DBP2P:', error);
      return null;
    }
  }

  // Función para obtener mensajes de una colección
  async getMessages(collectionName: string): Promise<ChatMessage[]> {
    if (!this.token) {
      console.error('No hay sesión iniciada');
      return [];
    }

    try {
      const response = await axios.get(
        `${API_URL}/collections/${collectionName}`,
        { headers: this.getHeaders() }
      );

      // Descifrar los mensajes
      const messages = response.data || [];
      return messages.map((msg: any) => {
        const message: ChatMessage = {
          id: msg.id,
          text: msg.data.text,
          sender: msg.data.sender,
          timestamp: new Date(msg.data.timestamp || msg.created_at)
        };

        // Descifrar si está cifrado
        if (msg.data.encrypted) {
          message.text = this.decryptMessage(message.text);
        }

        return message;
      });
    } catch (error) {
      console.error('Error al obtener mensajes de DBP2P:', error);
      return [];
    }
  }

  // Función para conectar al WebSocket y recibir actualizaciones en tiempo real
  connectWebSocket(): boolean {
    if (!this.token) {
      console.error('No hay sesión iniciada');
      return false;
    }

    // Cerrar conexión existente si hay alguna
    if (this.ws) {
      this.ws.close();
    }

    // Crear nueva conexión
    this.ws = new WebSocket(`${WS_URL}?token=${this.token}`);

    // Configurar eventos
    this.ws.onopen = () => {
      console.log('Conexión WebSocket establecida con DBP2P');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Procesar solo eventos de tipo 'create' para mensajes de chat
        if (data.type === 'create' && data.collection.startsWith('chat_')) {
          const rawMessage = data.document.data;
          
          const message: ChatMessage = {
            id: data.document.id,
            text: rawMessage.text,
            sender: rawMessage.sender,
            timestamp: new Date(rawMessage.timestamp || data.document.created_at)
          };

          // Descifrar si está cifrado
          if (rawMessage.encrypted) {
            message.text = this.decryptMessage(message.text);
          }

          // Notificar a todos los callbacks registrados
          this.messageCallbacks.forEach(callback => callback(message));
        }
      } catch (error) {
        console.error('Error al procesar mensaje WebSocket:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('Error en la conexión WebSocket:', error);
    };

    this.ws.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };

    return true;
  }

  // Función para suscribirse a una colección
  subscribeToCollection(collectionName: string): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('No hay conexión WebSocket activa');
      return false;
    }

    this.ws.send(JSON.stringify({
      action: 'subscribe',
      collection: collectionName,
      document_id: ''
    }));

    return true;
  }

  // Función para registrar un callback para nuevos mensajes
  onNewMessage(callback: (message: ChatMessage) => void): void {
    this.messageCallbacks.push(callback);
  }

  // Función para cerrar la conexión WebSocket
  closeConnection(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Función para verificar si está conectado
  isConnected(): boolean {
    return this.token !== null;
  }

  // Función para obtener el nombre de usuario actual
  getCurrentUsername(): string | null {
    return this.username;
  }
}

// Exportar una instancia única del servicio
export const dbp2pService = new DBP2PService();
