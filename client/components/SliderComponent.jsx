import ReactSlider from "react-slider";
import React from "react";

const SliderComponent = ({ label, value, onChange }) => {
  let trackClass = "bg-gray-500"; // Default grey color for the track

  // Change trackClass based on value
  if (value >= 1) {
    trackClass = "bg-blue-500"; // Set blue for the first mark
  }
  if (value >= 2) {
    trackClass = "bg-blue-500"; // Set blue for the second mark
  }

  return (
    <div className="space-y-4">
      <div className="text-gray-700 font-medium">{label}</div>
      <ReactSlider
        className="h-2 bg-gray-200 rounded-lg w-full"
        trackClassName={`h-2 rounded-lg ${trackClass}`}
        thumbClassName="w-4 h-4 bg-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        markClassName="hidden"
        min={1}
        max={5}
        value={value}
        onChange={onChange}
      />
      <div className="text-gray-700 font-medium">{value}</div>
    </div>
  );
};

export default SliderComponent;
