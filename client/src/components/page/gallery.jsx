import React, { useCallback, useEffect, useState } from "react";
import useMediaFetch from "../../hooks/useMediaFetch";
import API_ENDPOINTS from "../../lib/endpoints";
import MediaGallery from "../ui/media-gallery";
import MediaPlayer from "../ui/media-player";

function Gallery() {
  const { media: videos, error: videoError } = useMediaFetch(
    API_ENDPOINTS.VIDEOS
  );
  const { media: audios, error: audioError } = useMediaFetch(
    API_ENDPOINTS.AUDIO
  );
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleEscape = useCallback((e) => {
    if (e.key === "Escape") {
      setSelectedMedia(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  if (videoError || audioError) {
    return <div className="text-red-500">{videoError || audioError}</div>;
  }

  return (
    <div className="container pt-20 mx-auto px-4 pb-8">
      <MediaGallery
        title="Video Gallery"
        media={videos.map((name) => ({ name, type: "video" }))}
        onPlay={setSelectedMedia}
      />
      <MediaGallery
        title="Audio Gallery"
        media={audios.map((name) => ({ name, type: "audio" }))}
        onPlay={setSelectedMedia}
      />
      {selectedMedia && (
        <MediaPlayer
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}

export default Gallery;
