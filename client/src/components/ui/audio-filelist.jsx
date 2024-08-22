import React from "react";
import ConversionProgressIndicator from "./progress-indicator";

const AudioFileList = React.memo(({ files, conversionProgress }) => (
  <div className="mt-4">
    <h3 className="text-lg font-medium text-gray-900">Selected files:</h3>
    <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
      {files.map((file, index) => (
        <li
          key={index}
          className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
        >
          <div className="w-0 flex-1 flex items-center">
            <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
          </div>
          <ConversionProgressIndicator
            progress={conversionProgress[file.name]}
          />
        </li>
      ))}
    </ul>
  </div>
));

export default AudioFileList;
