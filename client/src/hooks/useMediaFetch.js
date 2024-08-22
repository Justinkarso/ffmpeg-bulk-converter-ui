import { useEffect, useState } from "react";

const useMediaFetch = (endpoint) => {
  const [media, setMedia] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch(endpoint);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setMedia(data);
        } else {
          throw new Error("Data is not an array");
        }
      } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        setError(`Failed to load media. Please try again later.`);
      }
    };

    fetchMedia();
  }, [endpoint]);

  return { media, error };
};

export default useMediaFetch;
