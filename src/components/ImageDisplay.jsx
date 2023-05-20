import React, { useState } from 'react';
import Modal from 'react-modal';
import { BiLike } from 'react-icons/bi';
import { RiUserShared2Line } from 'react-icons/ri';
import { AiOutlineEye } from 'react-icons/ai';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

const ImageDisplay = ({ imageName, name, radius, modalEnabled = false }) => {
  const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const imagePath = `${baseUrl}${imageName}`;
  const defaultImagePath =
    'https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive.jpg';

  const [imageSrc, setImageSrc] = useState(imagePath);
  const [loaded, setLoaded] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleError = () => {
    setImageSrc(defaultImagePath);
  };

  const handleImageLoad = () => {
    setLoaded(true);
  };

  const openModal = () => {
    if (modalEnabled) {
      setModalIsOpen(true);
      setViewCount(viewCount + 1);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setImageSrc(imageName[currentImageIndex - 1]);
      setLoaded(false);
    }
  };
  
  const handleNextImage = () => {
    if (currentImageIndex < imageName.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setImageSrc(imageName[currentImageIndex + 1]);
      setLoaded(false);
    }
  };

  return (
    <div
      className={`relative h-full w-full ${
        loaded ? '' : 'bg-gray-200'
      } ${radius}`}
      onClick={modalIsOpen ? closeModal : null}
    >
      <img
        src={imageSrc}
        alt={`Image ${currentImageIndex}`}
        onError={handleError}
        onLoad={handleImageLoad}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${radius}`}
        onClick={(e) => {
          openModal();
        }}
      />
      
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-80 p-4"
        overlayClassName="fixed inset-0">
        <button
          className="top-1/2 transform -translate-y-1/2 bg-white opacity-30 py-2 px-3"
          onClick={(e) => {
            handlePrevImage();
            e.stopPropagation();
          }}
          disabled={currentImageIndex === 0}
        >
          <RiArrowLeftSLine className="text-gray-500 text-lg" />
        </button>
        <div
          className="relative max-h-[1200px] max-w-[1024px]"
          onClick={closeModal}>
          <img
            src={imageSrc}
            alt={`Image ${imageName}`}
            className="max-h-full max-w-full"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={closeModal}
            className="absolute right-0 top-0 bg-white px-2 text-3xl text-black text-black"
          >
            &times;
          </button>
          <div className="mt-4">
            <div className="flex justify-between">
              <p
                className="flex items-end rounded-full bg-gray-100 px-2 py-2 text-xs not-italic"
                onClick={(e) => e.stopPropagation()}
              >
                <RiUserShared2Line className="mr-2 text-base" /> {name}
              </p>
              <div className="flex">
                <p
                  className="mr-4 flex items-end rounded-full bg-gray-100 px-2 py-2 text-xs uppercase"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AiOutlineEye className="mr-2 text-base" /> {viewCount}
                </p>
                <p
                  className="z-10 flex cursor-pointer items-end rounded-full bg-gray-400 px-2 py-2 text-xs uppercase text-white duration-300 ease-in-out hover:bg-gray-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BiLike className="mr-2 text-base" /> Voter
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          className="top-1/2 transform -translate-y-1/2 bg-white opacity-30 py-2 px-3"
          onClick={(e) => {
            handleNextImage();
            e.stopPropagation();
          }}
          disabled={currentImageIndex === imageName.length - 1}
        >
          <RiArrowRightSLine className="text-gray-500 text-lg" />
        </button>
      </Modal>
    </div>
  );
};

export default ImageDisplay;
