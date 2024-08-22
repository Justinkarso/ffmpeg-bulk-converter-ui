import React from "react";

const FormatSelector = React.memo(({ value, onChange }) => (
  <div>
    <label htmlFor="format" className="block text-sm font-medium text-gray-700">
      Output Format
    </label>
    <select
      id="format"
      name="format"
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="mp4">MP4</option>
    </select>
  </div>
));

export default FormatSelector;
