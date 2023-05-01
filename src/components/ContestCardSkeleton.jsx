import React from 'react';

const SkeletonContestCard = () => {
  return (
    <div className="h-[440px] max-w-lg animate-pulse rounded-b-lg bg-gray-200 p-3 shadow-xl">
      <div className="h-[260px] w-full overflow-hidden rounded-t-lg bg-gray-300"></div>
      <div className="mt-3 h-6 w-3/4 rounded bg-gray-300"></div>
      <div className="mt-2 h-4 w-full rounded bg-gray-300"></div>
      <div className="mt-2 flex gap-2">
        <div className="w-1/4 rounded-full bg-gray-300 px-3 py-1"></div>
        <div className="w-1/4 rounded-full bg-gray-300 px-3 py-1"></div>
        <div className="w-1/4 rounded-full bg-gray-300 px-3 py-1"></div>
      </div>
      <div className="mt-6 flex gap-2">
        <div className="w-1/6 rounded-full bg-gray-300 px-3 py-2"></div>
        <div className="w-1/6 rounded-full bg-gray-300 px-3 py-2"></div>
        <div className="w-1/6 rounded-full bg-gray-300 px-3 py-2"></div>
        <div className="ml-auto w-2/5 rounded bg-gray-300 px-3 py-2"></div>
      </div>
    </div>
  );
};

export default SkeletonContestCard;
