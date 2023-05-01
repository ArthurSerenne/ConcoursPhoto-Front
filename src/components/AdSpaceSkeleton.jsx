import React from 'react';

const AdSpaceSkeleton = () => {
  return (
    <div className="flex h-full w-full animate-pulse flex-col items-center justify-center bg-gray-200">
      <div className="h-8 w-3/4 rounded bg-gray-300"></div>
      <div className="mt-4 h-44 w-1/2 rounded bg-gray-300"></div>
    </div>
  );
};

export default AdSpaceSkeleton;
