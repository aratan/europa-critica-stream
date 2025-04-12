
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import channels from "@/data/channels.json";

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
