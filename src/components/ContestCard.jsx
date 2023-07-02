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

  const totalVotes = props.contest.photos.reduce((total, photo) => {
    if (photo.status) {
      return total + photo.voteCount;
    } else {
      return total + 0;
    }
  }, 0);

  const uniquePhotographers = props.contest.photos
    .filter((photo) => photo.status === true)
    .reduce((acc, photo) => {
      acc.add(photo.member);
      return acc;
    }, new Set());

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

      navigate(`/concours-photo/${contest.id}`, {
        state: { contest: { ...contest, view: viewCount } },
      });
    };
  };

  return (
    <div
      className="max-h-[465px] max-w-lg cursor-pointer rounded-b-lg shadow-xl duration-300 ease-in-out hover:scale-105 sm:max-h-[500px]"
      onClick={handleClick(props.contest)}
    >
      <div className="max-h-[260px] w-full overflow-hidden">
        <ImageDisplay
          imageName={props.contest.visual}
          radius="rounded-t-lg w-full"
        />
      </div>
      <div className="p-3">
        <div className="h-12">
          <p
            className="w-full overflow-hidden text-base font-bold not-italic leading-[160%] text-black"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {props.contest.name}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {props.contest.organization.name ? (
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
          ) : (
            <></>
          )}
          <p className="rounded-full bg-gray-100 px-3 py-2 text-xs uppercase">
            {props.contest.themes
              .map((theme) => theme.name)
              .join(', ')
              .split(', ')
              .slice(0, 1)
              .map((themeName) => (
                <span
                  key={themeName}
                  style={{
                    maxWidth: '15ch',
                    display: 'inline-block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginRight: '4px',
                  }}
                >
                  {themeName}{' '}
                </span>
              ))}
          </p>
          <ContestDateStatus contest={props.contest} />
        </div>
        <div className="mt-6 flex flex-wrap justify-between gap-1">
          <div className="flex gap-1">
            <p className="rounded-full bg-gray-100 px-3 py-2 text-xs">
              <RiUserShared2Line /> {uniquePhotographers.size}
            </p>
            <p className="rounded-full bg-gray-100 px-3 py-2 text-xs">
              <MdOutlineCameraAlt />{' '}
              {
                props.contest.photos.filter((photo) => photo.status === true)
                  .length
              }
            </p>
            <p className="rounded-full bg-gray-100 px-3 py-2 text-xs">
              <BiLike /> {totalVotes}
            </p>
          </div>
          <div>
            <p className="px-3 py-2 text-xs">
              Jusqu'au {formattedDate} <AiOutlineClockCircle />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
