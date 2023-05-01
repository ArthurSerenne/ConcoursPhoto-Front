import React from 'react';

const AdSpaceSkeleton = () => {
  return (
    <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center animate-pulse">
      <div className="w-3/4 h-8 bg-gray-300 rounded"></div>
      <div className="w-1/2 h-44 mt-4 bg-gray-300 rounded"></div>
    </div>
  );
};

export default AdSpaceSkeleton;