
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface Channel {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  url: string;
}

const channels: Channel[] = [
  {
    id: "IAVIC",
    name: "IAVIC",
    description: "Canal dedicado al pensamiento crítico y cultural propio de Europa",
    thumbnail: "https://yt3.googleusercontent.com/ytc/APkrFKY5uBJ0AuKmzEaHlhA_9TnHRaCFGDlBgCR08PnU=s176-c-k-c0x00ffffff-no-rj",
    url: "https://www.youtube.com/@IAVIC"
  },
  {
    id: "LaContraTv",
    name: "La Contra TV",
    description: "Política, filosofía y pensamiento alternativo",
    thumbnail: "https://yt3.googleusercontent.com/ytc/APkrFKbPP9gpcAH7UbG5VIvHdTEP7RWP2hbfH3QKJuua=s176-c-k-c0x00ffffff-no-rj",
    url: "https://www.youtube.com/@LaContraTV"
  },
  {
    id: "IdeasRadicales",
    name: "Ideas Radicales",
    description: "Contenido sobre libertad, economía y política",
    thumbnail: "https://yt3.googleusercontent.com/ytc/APkrFKZzSV9WZyZxP0aqRLFFqsyJQp1YfZKbV_ysLNUm=s176-c-k-c0x00ffffff-no-rj",
    url: "https://www.youtube.com/@IdeasRadicales"
  },
  {
    id: "ElTemplarioModerno",
    name: "El Templario Moderno",
    description: "Historia y tradiciones de Europa",
    thumbnail: "https://yt3.googleusercontent.com/ytc/APkrFKZupQbhTHtjn3ftXcOYxjFcle9Grs4Wg7ZhJIyW=s176-c-k-c0x00ffffff-no-rj",
    url: "https://www.youtube.com/@eltemplariomoderno"
  },
  {
    id: "Un_Abogado_Contra_la_Demagogia",
    name: "Un Abogado Contra la Demagogia",
    description: "Análisis jurídico y político de la actualidad desde una perspectiva crítica",
    thumbnail: "https://yt3.googleusercontent.com/ytc/AL5GRJWDiebjD3o7x7_ERRQIEzBQi9DUlsJx-7LBB6c=s176-c-k-c0x00ffffff-no-rj",
    url: "https://www.youtube.com/@Un_Abogado_Contra_la_Demagogia"
  },
  {
    id: "begonagerpe7757",
    name: "Begoña Gerpe",
    description: "Análisis político independiente sobre la actualidad española y europea",
    thumbnail: "https://yt3.googleusercontent.com/ytc/APkrFKbTOUXZqJNGiXv2tRLyEZHGH-v6u_qK2nuIqT0MuA=s176-c-k-c0x00ffffff-no-rj",
    url: "https://www.youtube.com/@begonagerpe7757"
  }
];

interface ChannelListProps {
  limit?: number;
}

const ChannelList = ({ limit }: ChannelListProps) => {
  const displayedChannels = limit ? channels.slice(0, limit) : channels;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedChannels.map((channel) => (
        <Card key={channel.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <Link to={`/channel/${channel.id}`} className="block">
            <div className="p-4">
              <div className="flex items-start space-x-4">
                <img 
                  src={channel.thumbnail} 
                  alt={channel.name} 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-europa-blue">{channel.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{channel.description}</p>
                </div>
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default ChannelList;
