import React from 'react';
import Skeleton from 'react-loading-skeleton';
import ContentLoader from 'react-content-loader';


const SwiperSlideSkeleton = () => {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height="100%"
      viewBox="0 0 1200 450" // Mettez à jour les dimensions ici
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="5" ry="5" width="1200" height="450" /> // Mettez à jour les dimensions ici
    </ContentLoader>
  );
};


export default SwiperSlideSkeleton;
