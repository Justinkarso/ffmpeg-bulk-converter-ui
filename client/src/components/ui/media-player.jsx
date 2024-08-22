import { X } from "lucide-react";

const MediaPlayer = ({ media, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-black/75 z-10 inset-0 fixed" onClick={onClose} />
    <button
      onClick={onClose}
      className="absolute z-20 top-4 right-4 text-white hover:text-gray-300"
    >
      <X className="w-8 h-8" />
    </button>
    <div className="relative z-20 w-full h-full max-w-4xl max-h-full">
      {media.type === "video" ? (
        <video
          src={`/output/${media.name}`}
          className="w-full h-full"
          controls
          autoPlay
        />
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          <audio
            src={`/output/${media.name}`}
            className="w-full"
            controls
            autoPlay
          />
        </div>
      )}
    </div>
  </div>
);

export default MediaPlayer;
