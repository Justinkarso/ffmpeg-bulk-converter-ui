import { Folder, Play } from "lucide-react";

const MediaItem = ({ item, onPlay, onOpenLocation }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    {item.type === "video" && (
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <video src={`/output/${item.name}`} className="object-cover" />
      </div>
    )}
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2 truncate">{item.name}</h2>
      <div className="flex justify-between">
        <button
          onClick={() => onOpenLocation(item.name)}
          className="text-blue-500 hover:text-blue-600"
        >
          <Folder className="w-6 h-6" />
        </button>
        <button
          onClick={() => onPlay(item)}
          className="text-green-500 hover:text-green-600"
        >
          <Play className="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
);

export default MediaItem;
