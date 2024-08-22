import React from "react";
import ConversionProgressIndicator from "./progress-indicator";

const VideoFileList = React.memo(
  ({
    files,
    isRenaming,
    renamedFiles,
    conversionProgress,
    onRename,
    getDisplayName,
    onToggleRename,
  }) => (
    <div className="mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Selected files:</h3>
        <button
          onClick={onToggleRename}
          className="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isRenaming ? "Save Names" : "Power Rename"}
        </button>
      </div>
      <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
        {files.map((file, index) => (
          <li
            key={index}
            className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
          >
            <div className="w-0 flex-1 flex items-center">
              {isRenaming ? (
                <input
                  type="text"
                  value={renamedFiles[file.name] || path.parse(file.name).name}
                  onChange={(e) => onRename(file.name, e.target.value)}
                  className="ml-2 flex-1 w-0 truncate border-gray-300 rounded-md"
                />
              ) : (
                <span className="ml-2 flex-1 w-0 truncate">
                  {getDisplayName(file)}
                </span>
              )}
            </div>
            <ConversionProgressIndicator
              progress={conversionProgress[getDisplayName(file)]}
            />
          </li>
        ))}
      </ul>
    </div>
  )
);

export default VideoFileList;
