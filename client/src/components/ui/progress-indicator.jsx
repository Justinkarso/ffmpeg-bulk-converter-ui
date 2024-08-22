import { CheckCircleIcon } from "lucide-react";
import React from "react";

const ConversionProgressIndicator = React.memo(({ progress }) => {
  if (progress === undefined) return null;
  return progress === 100 ? (
    <CheckCircleIcon className="w-4 h-4 text-green-500" />
  ) : (
    <div className="w-20 bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
});

export default ConversionProgressIndicator;
