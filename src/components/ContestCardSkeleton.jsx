import React from 'react';
import ContentLoader from 'react-content-loader';

const SkeletonContestCard = () => {
  return (
    <ContentLoader
    speed={2}
    width={400}
    height={440}
    viewBox="0 0 400 440"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="0" y="0" rx="5" ry="5" width="400" height="260" />
    <rect x="15" y="280" rx="4" ry="4" width="370" height="20" />
    <rect x="15" y="315" rx="4" ry="4" width="150" height="15" />
    <rect x="250" y="315" rx="4" ry="4" width="135" height="15" />
    <rect x="15" y="340" rx="4" ry="4" width="75" height="15" />
    <rect x="100" y="340" rx="4" ry="4" width="75" height="15" />
    <rect x="185" y="340" rx="4" ry="4" width="75" height="15" />
    <rect x="270" y="340" rx="4" ry="4" width="120" height="15" />
  </ContentLoader>
  );
};

export default SkeletonContestCard;
