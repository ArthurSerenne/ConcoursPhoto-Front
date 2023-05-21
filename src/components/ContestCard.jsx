import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import ImageDisplay from '../components/ImageDisplay';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { BiLike } from 'react-icons/bi';
import { RiUserShared2Line } from 'react-icons/ri';
import { MdOutlineCameraAlt } from 'react-icons/md';
import ContestDateStatus from './ContestDateStatus';
import axios from 'axios';

const ContestCard = (props) => {
  const navigate = useNavigate();
  const formattedDate = format(
    new Date(props.contest.resultsDate),
    'dd/MM/yyyy'
  );

  const handleClick = (contest) => {
    return async () => {
      const viewCount = contest.view ? contest.view + 1 : 1;
      
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/contests/${contest.id}`, 
        { view: viewCount },
        {
          headers: {
            'Content-Type': 'application/merge-patch+json',
          },
        }
      );
  
      navigate(`/concours-photo/${contest.id}`, { state: { contest: {...contest, view: viewCount } } });
    };
  };   

    console.log(props.contest);

    return (
        <div className='max-w-lg max-h-[465px] sm:max-h-[500px] rounded-b-lg shadow-xl hover:scale-105 ease-in-out duration-300 cursor-pointer' onClick={handleClick(props.contest)}>
            <div className="max-h-[260px] w-full overflow-hidden">
                <ImageDisplay imageName={props.contest.visual} radius='rounded-t-lg w-full' />
            </div>
            <div className='p-3'>
                <div className='h-12'>
                    <p className='text-base font-bold not-italic leading-[160%] text-black overflow-hidden w-full' style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>{props.contest.name}</p>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                    {props.contest.organization.name ? <p className="rounded-full bg-gray-100 px-3 py-2 text-xs uppercase">
                        <span
                        style={{
                            maxWidth: '25ch',
                            display: 'inline-block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                        >
                        {props.contest.organization.name}
                        </span>
                    </p> : <></>}
                    <p className="bg-gray-100 rounded-full py-2 px-3 text-xs uppercase">
                        {props.contest.themes
                        .map((theme) => theme.name)
                        .join(", ")
                        .split(", ")
                        .slice(0,1)
                        .map((themeName) => (
                            <span key={themeName} style={{ maxWidth: '15ch', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '4px' }}>{themeName} </span>
                        ))}
                    </p>
                    <ContestDateStatus contest={props.contest} />
                </div>
                <div className="flex flex-wrap gap-1 mt-6 justify-between">
                    <div className="flex gap-1">
                        <p className="bg-gray-100 rounded-full py-2 px-3 text-xs"><RiUserShared2Line /> 121</p>
                        <p className="bg-gray-100 rounded-full py-2 px-3 text-xs"><MdOutlineCameraAlt /> {props.contest.photos.filter((photo) => photo.status === true).length}</p>
                        <p className="bg-gray-100 rounded-full py-2 px-3 text-xs"><BiLike /> 458</p>
                    </div>
                    <div>
                        <p className="py-2 px-3 text-xs">Jusqu'au {formattedDate} <AiOutlineClockCircle /></p>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default ContestCard;
