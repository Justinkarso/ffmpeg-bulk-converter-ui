import React, { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import AudioFileList from "../ui/audio-filelist";
import ConvertButton from "../ui/convert-button";
import FileDropZone from "../ui/file-dropzone";

const socket = io("http://localhost:3000");

const VideoToAudio = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState({});
  const [conversionResults, setConversionResults] = useState([]);

  useEffect(() => {
    const handleConversionProgress = (data) => {
      setConversionProgress((prev) => ({
        ...prev,
        [data.file]: Math.round(data.percent),
      }));
    };

    socket.on("conversionProgress", handleConversionProgress);

    return () => {
      socket.off("conversionProgress", handleConversionProgress);
    };
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  }, []);

  const handleFileInput = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  }, []);

  const handleUploadAndConvert = useCallback(async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("videos", file));

    try {
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadResult = await uploadResponse.json();

      setIsUploading(false);
      setIsConverting(true);
      setConversionProgress({});

      const conversionResponse = await fetch("/api/convert-to-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: uploadResult.files,
          outputFormat: "mp3",
        }),
      });
      const conversionResult = await conversionResponse.json();

      setConversionResults(conversionResult.results);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsUploading(false);
      setIsConverting(false);
    }
  }, [files]);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-6">
              Convert Video to MP3
            </h1>
            <FileDropZone onDrop={handleDrop} onFileInput={handleFileInput} />
            {files.length > 0 && (
              <AudioFileList
                files={files}
                conversionProgress={conversionProgress}
              />
            )}
            <ConvertButton
              onClick={handleUploadAndConvert}
              disabled={isUploading || isConverting || files.length === 0}
              isUploading={isUploading}
              isConverting={isConverting}
              name="Extract Audio"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoToAudio;
