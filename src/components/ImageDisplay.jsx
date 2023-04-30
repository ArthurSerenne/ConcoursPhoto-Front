import React, { useState } from 'react';
import Modal from 'react-modal';
import { BiLike } from "react-icons/bi";
import { RiUserShared2Line } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";

const ImageDisplay = ({ imageName, name, radius, modalEnabled = false }) => {
  const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const imagePath = `${baseUrl}${imageName}`;
  const defaultImagePath = 'https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive.jpg';

  const [imageSrc, setImageSrc] = useState(imagePath);
  const [loaded, setLoaded] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleError = () => {
    setImageSrc(defaultImagePath);
  };

  const handleImageLoad = () => {
    setLoaded(true);
  };

  const openModal = () => {
    if (modalEnabled) {
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className={`relative w-full h-full ${loaded ? '' : 'bg-gray-200'} ${radius}`} onClick={modalIsOpen ? closeModal : null}>
      <img
        src={imageSrc}
        alt={`Image ${imageName}`}
        onError={handleError}
        onLoad={handleImageLoad}
        className={`object-cover w-full h-full transition-opacity duration-500 cursor-pointer ${loaded ? 'opacity-100' : 'opacity-0'} ${radius}`}
        onClick={(e) => {
          openModal();
        }}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed top-0 left-0 w-full h-full flex items-center justify-center p-4 bg-black bg-opacity-80"
        overlayClassName="fixed inset-0"
      >
        <div className="relative max-w-[1024px] max-h-[728px]" onClick={closeModal}>
          <img
            src={imageSrc}
            alt={`Image ${imageName}`}
            className="max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={closeModal}
            className="absolute top-0 right-0 text-3xl text-black bg-white text-black px-2"
          >
            &times;
          </button>
          <div className='mt-4'>
                <div className='flex justify-between'>
                    <p className='text-xs not-italic bg-gray-100 rounded-full py-2 px-2 flex items-end'
                       onClick={(e) => e.stopPropagation()}
                    >
                        <RiUserShared2Line className='mr-2 text-base' /> {name}
                    </p>
                    <div className='flex'>
                        <p className="bg-gray-100 rounded-full py-2 px-2 text-xs uppercase flex items-end mr-4"
                           onClick={(e) => e.stopPropagation()}
                        >
                          <AiOutlineEye className='mr-2 text-base' /> 1257
                        </p>
                        <p className="z-10 bg-gray-400 text-white rounded-full py-2 px-2 text-xs uppercase flex items-end hover:bg-gray-300 ease-in-out duration-300 cursor-pointer"
                           onClick={(e) => e.stopPropagation()}
                        >
                          <BiLike className='mr-2 text-base' /> Voter
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default ImageDisplay;
