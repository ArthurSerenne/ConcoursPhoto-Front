import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import ImageDisplay from '../components/ImageDisplay';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { BiLike } from 'react-icons/bi';
import { RiUserShared2Line } from 'react-icons/ri';
import { MdOutlineCameraAlt } from 'react-icons/md';

const ContestCard = (props) => {
  const navigate = useNavigate();
  const formattedDate = format(
    new Date(props.contest.resultsDate),
    'dd/MM/yyyy'
  );

  const handleClick = (contest) => {
    return () => {
      navigate(`/concours-photo/${contest.id}`, { state: { contest } });
    };
  };

  return (
    <div
      className="max-h-[440px] max-w-lg cursor-pointer rounded-b-lg shadow-xl duration-300 ease-in-out hover:scale-105"
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
        <div className="mt-2 flex gap-1">
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
          <p className="rounded-full bg-gray-100 px-3 py-2 text-xs uppercase">
            {props.contest.themes
              .map((theme) => theme.name)
              .join(', ')
              .split(', ')
              .slice(0, 1)
              .map((themeName) => (
                <span
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
          <p className="rounded-full bg-gray-100 px-3 py-2 text-xs uppercase">
            {props.contest.status === true ? 'Actif' : 'Inactif'}
          </p>
        </div>
        <div className="mt-6 flex justify-between gap-1">
          <div className="flex gap-1">
            <p className="rounded-full bg-gray-100 px-3 py-2 text-xs">
              <RiUserShared2Line /> 121
            </p>
            <p className="rounded-full bg-gray-100 px-3 py-2 text-xs">
              <MdOutlineCameraAlt /> {props.contest.photos.length}
            </p>
            <p className="rounded-full bg-gray-100 px-3 py-2 text-xs">
              <BiLike /> 458
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
