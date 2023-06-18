import { useNavigate } from 'react-router-dom';
import ImageDisplay from '../components/ImageDisplay';
import { RiCameraLensLine } from 'react-icons/ri';
import SituationEnum from './enums/SituationEnum';
import CategoryEnum from './enums/CategoryEnum';

const PhotographerCard = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/photographes/${props.photographer.id}`);
  };

    return (
        <div className='p-5 max-w-lg max-h-[465px] sm:max-h-[500px] rounded-b-lg shadow-xl hover:scale-105 ease-in-out duration-300 cursor-pointer' onClick={handleClick}>
            <div className='grid grid-cols-5'>
                <ImageDisplay imageName={props.photographer.member.photo} radius='rounded-full w-24 h-24' />
                <div className='h-12 text-center'>
                    <p className='text-lg font-bold not-italic leading-[160%] text-black overflow-hidden w-full' style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>{props.photographer.member.username}</p>
                </div>
            </div>
            <div className='flex flex-row justify-between mt-6'>
                <div className='flex flex-row gap-4'>
                    <p className='bg-gray-100 px-2 py-1 rounded-full'>{SituationEnum[props.photographer.member.situation]}</p>
                    <p className='bg-gray-100 px-2 py-1 rounded-full'>{CategoryEnum[props.photographer.member.category]}</p>
                </div>
                <div className="flex flex-wrap gap-1 justify-between float-right">
                    <p className="bg-gray-100 rounded-full py-2 px-3 text-xs flex items-center gap-1">
                        <RiCameraLensLine /> 
                        {props.photographer.member.photos.filter(
                            (photo) => photo.status === true
                        ).length}
                        <span>photo{props.photographer.member.photos.filter(
                            (photo) => photo.status === true
                        ).length > 1 ? 's' : ''}</span>
                    </p> 
                </div>
            </div>
        </div>
  );
};

export default PhotographerCard;
