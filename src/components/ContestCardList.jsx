import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import ImageDisplay from '../components/ImageDisplay';
import { AiOutlineClockCircle, AiOutlineArrowRight } from 'react-icons/ai';
import { BiLike } from 'react-icons/bi';
import { RiUserShared2Line } from 'react-icons/ri';
import { MdOutlineCameraAlt } from 'react-icons/md';
import ContestDateStatus from './ContestDateStatus';
import axios from 'axios';

const ContestCardList = (props) => {
  const navigate = useNavigate();
  const formattedDate = format(
    new Date(props.contest.resultsDate),
    'dd/MM/yyyy'
    );

    const totalVotes = props.contest.photos.reduce((total, photo) => {
        if (photo.status) {
          return total + photo.voteCount;
        } else {
          return total + 0;
        }
      }, 0);

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

    return (
        <div className='grid grid-cols-3 w-full max-h-[440px] sm:max-h-[500px] rounded-b-lg shadow-xl mb-10 flex flex-col justify-between'>
            <div className="max-w-lg col-span-1">
                <ImageDisplay imageName={props.contest.visual} radius='rounded-l-lg w-full' />
            </div>
            <div className='py-6 pl-6 pr-12 col-span-2 flex flex-col justify-between'>
                <div className='h-12'>
                    <p className='text-2xl font-bold not-italic leading-[160%] text-black overflow-hidden w-full' style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>{props.contest.name}</p>
                </div>
                <div className="flex flex-wrap gap-1 mt-10">
                    {props.contest.organization.name ?
                        <p className="rounded-full bg-gray-100 px-3 py-2 text-xs uppercase">
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
                    </p>
                    : ''}
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
                <div className="flex flex-col sm:flex-row flex-wrap gap-1 justify-end md:justify-between mt-auto">
                    <div className="flex flex-wrap sm:flex-row gap-1">
                        {
                            new Date(props.contest.publicationDate) < new Date() ?
                            (
                                <>
                                    <p className="bg-gray-100 rounded-full py-2 px-3 text-xs">
                                        <RiUserShared2Line /> 121
                                    </p>
                                    <p className="bg-gray-100 rounded-full py-2 px-3 text-xs">
                                        <MdOutlineCameraAlt /> {props.contest.photos.filter((photo) => photo.status === true).length}
                                    </p>
                                    <p className="bg-gray-100 rounded-full py-2 px-3 text-xs">
                                        <BiLike /> {totalVotes}
                                    </p>
                                </>
                            )
                            :
                            ''
                        }
                        {new Date(props.contest.publicationDate) < new Date() ?
                            (
                                new Date(props.contest.submissionStartDate) < new Date() && new Date() < new Date(props.contest.votingEndDate) ?
                                <p className="py-2 px-3 text-sm">
                                    Jusqu'au {formattedDate} <AiOutlineClockCircle />
                                </p> :
                                <p className="py-2 px-3 text-sm">
                                    Clôturé le {formattedDate} <AiOutlineClockCircle />
                                </p>
                            ) :
                            <p className="py-2 px-3 text-sm">
                                <AiOutlineClockCircle /> Commence le {formattedDate}
                            </p>
                        }
                    </div>
                    <div className="flex justify-end md:inline w-full md:w-auto">
                        <a
                            className='text-xs md:text-base text-white bg-gray-400 px-4 py-3 md:px-9 py-2 md:py-5 rounded-full hover:cursor-pointer hover:bg-gray-300'
                            onClick={handleClick(props.contest)}
                        >
                            <span className="md:hidden"><AiOutlineArrowRight className='scale-150' /></span>
                            <span className="hidden md:inline">Voir le concours</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContestCardList;
