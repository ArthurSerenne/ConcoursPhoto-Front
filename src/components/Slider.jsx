import React, { useState } from 'react';

const Slider = (props) => {
  const [currentImage, setCurrentImage] = useState(1);
  const images = props.contests.map((contest) => contest.visual);

  const prevImage = () => {
    const newIndex = currentImage === 1 ? images.length : currentImage - 1;
    setCurrentImage(newIndex);
  };

  const nextImage = () => {
    const newIndex = currentImage === images.length ? 1 : currentImage + 1;
    setCurrentImage(newIndex);
  };

  return (
    <div className="relative w-full">
      <img
        className="w-full"
        src={images[currentImage - 1]}
        alt={`Image ${currentImage}`}
      />
      <div className="absolute inset-0 flex items-center">
        <button
          className="absolute left-0 flex h-full w-1/6 items-center justify-center border-none bg-transparent"
          onClick={prevImage}
        >
          <div className="h-10 w-10 rounded-full bg-white pr-1 text-2xl">
            {'<'}
          </div>
        </button>
        <button
          className="absolute right-0 flex h-full w-1/6 items-center justify-center border-none bg-transparent"
          onClick={nextImage}
        >
          <div className="h-10 w-10 rounded-full bg-white pl-1 text-2xl text-black">
            {'>'}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Slider;
