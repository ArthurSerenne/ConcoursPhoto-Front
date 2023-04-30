import React from 'react';

const SkeletonContestCard = () => {
  return (
    <div className="animate-pulse bg-gray-200 p-3 max-w-lg max-h-[440px] rounded-b-lg shadow-xl">
      <div className="max-h-[260px] w-full overflow-hidden bg-gray-300 rounded-t-lg"></div>
      <div className="mt-3 h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="mt-2 h-4 bg-gray-300 rounded w-full"></div>
      <div className="mt-2 flex gap-2">
        <div className="bg-gray-300 rounded-full py-1 px-3 w-1/4"></div>
        <div className="bg-gray-300 rounded-full py-1 px-3 w-1/4"></div>
        <div className="bg-gray-300 rounded-full py-1 px-3 w-1/4"></div>
      </div>
      <div className="mt-6 flex gap-2">
        <div className="bg-gray-300 rounded-full py-2 px-3 w-1/6"></div>
        <div className="bg-gray-300 rounded-full py-2 px-3 w-1/6"></div>
        <div className="bg-gray-300 rounded-full py-2 px-3 w-1/6"></div>
        <div className="ml-auto bg-gray-300 rounded py-2 px-3 w-2/5"></div>
      </div>
    </div>
  );
};

export default SkeletonContestCard;
