import { useNavigate } from 'react-router-dom';
import ImageDisplay from '../components/ImageDisplay';
import { RiCameraLensLine } from 'react-icons/ri';

const OrganizationCard = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/organisateurs/${props.organization.id}`);
  };   

    return (
        <div className='max-w-lg max-h-[465px] sm:max-h-[500px] rounded-b-lg shadow-xl hover:scale-105 ease-in-out duration-300 cursor-pointer' onClick={handleClick}>
            <div className="max-h-[260px] w-full overflow-hidden">
                <ImageDisplay imageName={props.organization.logo} radius='rounded-t-lg w-full' />
            </div>
            <div className='p-3'>
                <div className='h-12'>
                    <p className='text-base font-bold not-italic leading-[160%] text-black overflow-hidden w-full' style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>{props.organization.name}</p>
                </div>
                <div className="flex flex-wrap gap-1 mt-6 justify-between">
                    <p className="bg-gray-100 rounded-full py-2 px-3 text-xs flex items-center gap-1">
                        <RiCameraLensLine /> 
                        {props.organization.contests.filter(
                            (contest) => contest.status === true && new Date(contest.publicationDate) <= new Date() && new Date(contest.resultsDate) >= new Date()
                        ).length}
                        <span>concours actif{props.organization.contests.filter(
                            (contest) => contest.status === true && new Date(contest.publicationDate) <= new Date() && new Date(contest.resultsDate) >= new Date()
                        ).length > 1 ? 's' : ''}</span>
                    </p> 
                </div>
            </div>
        </div>
  );
};

export default OrganizationCard;
