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
        <img className='w-full' src={images[currentImage - 1]} alt={`Image ${currentImage}`} />
        <div className="absolute inset-0 flex items-center">
            <button className="absolute left-0 flex items-center justify-center w-1/6 h-full bg-transparent border-none" onClick={prevImage}>
            <div className="w-10 h-10 bg-white rounded-full text-2xl pr-1">{'<'}</div>
            </button>
            <button className="absolute right-0 flex items-center justify-center w-1/6 h-full bg-transparent border-none" onClick={nextImage}>
                <div className="w-10 h-10 bg-white rounded-full text-2xl text-black pl-1">{'>'}</div>
            </button>
        </div>
    </div>
  );
};

export default Slider;
