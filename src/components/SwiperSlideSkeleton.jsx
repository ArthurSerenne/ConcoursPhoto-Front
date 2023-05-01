import React from 'react';
import ContentLoader from 'react-content-loader';

const SwiperSlideSkeleton = () => {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height="100%"
      viewBox="0 0 997 576"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="5" ry="5" width="997" height="576" />
    </ContentLoader>
  );
};


export default SwiperSlideSkeleton;
