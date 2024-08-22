import React from "react";
import { openFileLocation } from "../../lib/open-file-location";
import MediaItem from "./media-item";

const MediaGallery = ({ title, media, onPlay }) => (
  <>
    <h1 className="text-4xl font-bold my-8 text-center text-gray-800">
      {title}
    </h1>
    {media.length === 0 ? (
      <p className="text-xl mb-12 text-center text-gray-600">
        Nothing here yet.
      </p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {media.map((item) => (
          <MediaItem
            key={item.name}
            item={item}
            onPlay={onPlay}
            onOpenLocation={openFileLocation}
          />
        ))}
      </div>
    )}
  </>
);

export default MediaGallery;
