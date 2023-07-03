import { useNavigate } from 'react-router-dom';
import { RiCameraLensLine } from 'react-icons/ri';
import SituationEnum from './enums/SituationEnum';
import CategoryEnum from './enums/CategoryEnum';
import { useState } from 'react';

const PhotographerCard = (props) => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const imagePath = `${baseUrl}${props.photographer.member?.photo}`;
  const defaultImagePath =
    'https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive.jpg';
  const [imageSrc, setImageSrc] = useState(imagePath);

  const handleClick = () => {
    navigate(`/photographes/${props.photographer.id}`);
  };

  const handleError = () => {
    setImageSrc(defaultImagePath);
  };

  return (
    <div
      className="max-h-[465px] max-w-lg cursor-pointer rounded-b-lg p-5 shadow-xl duration-300 ease-in-out hover:scale-105 sm:max-h-[500px]"
      onClick={handleClick}
    >
      <div className="grid grid-cols-5">
        <img
          src={imageSrc}
          onError={handleError}
          className="h-20 w-24 rounded-full"
        />
        <div className="col-span-3 ml-2 h-12">
          <p
            className="w-full overflow-hidden text-lg font-bold not-italic leading-[160%] text-black"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {props.photographer.member.username}
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-row justify-between">
        <div className="flex flex-row gap-4">
          <p className="rounded-full bg-gray-100 px-2 py-1">
            {SituationEnum[props.photographer.member.situation]}
          </p>
          <p className="rounded-full bg-gray-100 px-2 py-1">
            {CategoryEnum[props.photographer.member.category]}
          </p>
        </div>
        <div className="float-right flex flex-wrap justify-between gap-1">
          <p className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-2 text-xs">
            <RiCameraLensLine />
            {
              props.photographer.member.photos.filter(
                (photo) => photo.status === true
              ).length
            }
            <span>
              photo
              {props.photographer.member.photos.filter(
                (photo) => photo.status === true
              ).length > 1
                ? 's'
                : ''}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotographerCard;
