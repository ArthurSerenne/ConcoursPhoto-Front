import { useNavigate } from 'react-router-dom';
import ImageDisplay from '../components/ImageDisplay';
import { RiCameraLensLine } from 'react-icons/ri';
import SituationEnum from './enums/SituationEnum';
import CategoryEnum from './enums/CategoryEnum';

const PhotographerCardList = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/photographes/${props.photographer.id}`);
  };   

    return (
        <div className='grid grid-cols-2 md:grid-cols-3 w-full max-h-[440px] sm:max-h-[500px] rounded-b-lg shadow-xl mb-10 flex flex-col justify-between relative'>
            <div className="max-h-[260px] w-full overflow-hidden">
                <ImageDisplay imageName={props.photographer.member.photo} radius='rounded-t-lg w-full' />
            </div>
            <div className='p-5 flex flex-col justify-between relative md:col-span-2'>
                <div className='h-12'>
                    <p className='text-lg font-bold not-italic leading-[160%] text-black overflow-hidden w-full' style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>{props.photographer.lastname}</p>
                </div>
                <div className='flex justify-between'>
                    <div className="items-center flex justify-start gap-4">
                        <p className="bg-gray-100 rounded-full py-2 px-3 text-xs flex items-center gap-1 md:text-base">
                        <RiCameraLensLine /> 
                        {props.photographer.member.photos.filter(
                            (photo) => photo.status === true
                        ).length}
                        <span>photo{props.photographer.member.photos.filter(
                            (photo) => photo.status === true
                        ).length > 1 ? 's' : ''}</span>
                        </p>
                        <p className='bg-gray-100 px-3 py-2 rounded-full'>{SituationEnum[props.photographer.member.situation]}</p>
                        <p className='bg-gray-100 px-3 py-2 rounded-full'>{CategoryEnum[props.photographer.member.category]}</p>
                    </div>
                    <a className="bg-gray-400 rounded-full text-white py-2 px-3 text-xs flex items-center gap-1 md:text-base md:px-9 py-2 md:py-5 hover:cursor-pointer hover:bg-gray-300 absolute bottom-5 right-5" onClick={handleClick}>Voir <span className='hidden md:inline'>le photographe</span></a>
                </div>
            </div>
        </div>
  );
};

export default PhotographerCardList;
