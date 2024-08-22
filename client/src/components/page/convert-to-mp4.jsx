import path from "path-browserify";
import React, { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import ConvertButton from "../ui/convert-button";
import FileDropZone from "../ui/file-dropzone";
import FormatSelector from "../ui/format-selector";
import VideoFileList from "../ui/video-filelist";

const socket = io("http://localhost:3000");

const ConvertToMp4 = () => {
  const [files, setFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState("mp4");
  const [isUploading, setIsUploading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState({});
  const [conversionResults, setConversionResults] = useState([]);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renamedFiles, setRenamedFiles] = useState({});

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
    const fileMap = {};

    files.forEach((file) => {
      const newName = renamedFiles[file.name] || path.parse(file.name).name;
      const newFileName = `${newName}${path.extname(file.name)}`;
      const renamedFile = new File([file], newFileName, { type: file.type });
      formData.append("videos", renamedFile);
      fileMap[newFileName] = file.name;
    });

    try {
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadResult = await uploadResponse.json();

      setIsUploading(false);
      setIsConverting(true);
      setConversionProgress({});

      const conversionResponse = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: uploadResult.files,
          outputFormat,
          fileMap,
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
  }, [files, outputFormat, renamedFiles]);

  const toggleRenaming = useCallback(() => {
    setIsRenaming((prev) => !prev);
    if (!isRenaming) {
      const initialRenames = Object.fromEntries(
        files.map((file) => [file.name, path.parse(file.name).name])
      );
      setRenamedFiles(initialRenames);
    }
  }, [files, isRenaming]);

  const handleRename = useCallback((originalName, newName) => {
    setRenamedFiles((prev) => ({ ...prev, [originalName]: newName }));
  }, []);

  const getDisplayName = useCallback(
    (file) => {
      const newName = renamedFiles[file.name] || path.parse(file.name).name;
      return `${newName}${path.extname(file.name)}`;
    },
    [renamedFiles]
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Convert to MP4</h1>
            <FileDropZone onDrop={handleDrop} onFileInput={handleFileInput} />
            {files.length > 0 && (
              <VideoFileList
                files={files}
                isRenaming={isRenaming}
                renamedFiles={renamedFiles}
                conversionProgress={conversionProgress}
                onRename={handleRename}
                getDisplayName={getDisplayName}
                onToggleRename={toggleRenaming}
              />
            )}
            <FormatSelector value={outputFormat} onChange={setOutputFormat} />
            <ConvertButton
              onClick={handleUploadAndConvert}
              disabled={isUploading || isConverting || files.length === 0}
              isUploading={isUploading}
              isConverting={isConverting}
              name="Convert Video"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvertToMp4;
