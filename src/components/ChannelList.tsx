
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
