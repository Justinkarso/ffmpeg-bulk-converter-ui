import { Film, FolderOpen, Music } from "lucide-react";
import React, { useEffect, useState } from "react";
import ConvertToMp4 from "./components/page/convert-to-mp4";
import Gallery from "./components/page/gallery";
import VideoToAudio from "./components/page/video-to-audio";
import Card from "./components/ui/card";

const pages = [
  { id: "home", title: "Home" },
  { id: "convert-to-mp4", title: "Convert to MP4" },
  { id: "video-to-audio", title: "Video to Audio" },
  { id: "gallery", title: "Gallery" },
];

const renderPage = (currentPage, navigateTo) => {
  switch (currentPage) {
    case "convert-to-mp4":
      return <ConvertToMp4 />;
    case "gallery":
      return <Gallery />;
    case "video-to-audio":
      return <VideoToAudio />;
    case "home":
      return (
        <div className="max-w-4xl mx-auto px-4 pb-12 pt-28">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            Welcome to Video Converter
          </h1>
          <p className="text-xl mb-12 text-center text-gray-600">
            Convert your videos to MP4 format and manage your converted files
            with ease.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card
              title="Convert to MP4"
              description="Upload and convert your videos to MP4 format quickly and easily."
              icon={<Film className="w-12 h-12" />}
              gradient="from-blue-400 to-indigo-600"
              onClick={() => navigateTo("convert-to-mp4")}
            />
            <Card
              title="Video to Audio"
              description="Extract audio from videos and manage your converted files with ease."
              icon={<Music className="w-12 h-12" />}
              gradient="from-red-400 to-orange-600"
              onClick={() => navigateTo("video-to-audio")}
            />
            <Card
              title="Gallery"
              description="View and manage your converted videos in a gallery interface."
              icon={<FolderOpen className="w-12 h-12" />}
              gradient="from-green-400 to-teal-600"
              onClick={() => navigateTo("gallery")}
            />
          </div>
        </div>
      );
    default:
      return <div>Page not found</div>;
  }
};

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");
    if (page && pages.some((p) => p.id === page)) {
      setCurrentPage(page);
    }
  }, []);

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    window.history.pushState({}, "", `?page=${pageId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white rounded-full shadow-lg p-2">
          <ul className="flex space-x-2">
            {pages.map((page) => (
              <li key={page.id}>
                <button
                  onClick={() => navigateTo(page.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    currentPage === page.id
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <main>{renderPage(currentPage, navigateTo)}</main>
    </div>
  );
}

export default App;
