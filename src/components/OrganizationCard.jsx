import { useNavigate } from 'react-router-dom';
import ImageDisplay from '../components/ImageDisplay';
import { RiCameraLensLine } from 'react-icons/ri';

const OrganizationCard = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/organisateurs/${props.organization.id}`);
  };

  return (
    <div
      className="max-h-[465px] max-w-lg cursor-pointer rounded-b-lg shadow-xl duration-300 ease-in-out hover:scale-105 sm:max-h-[500px]"
      onClick={handleClick}
    >
      <div className="max-h-[260px] w-full overflow-hidden">
        <ImageDisplay
          imageName={props.organization.logo}
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
            {props.organization.name}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap justify-between gap-1">
          <p className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-2 text-xs">
            <RiCameraLensLine />
            {
              props.organization.contests.filter(
                (contest) =>
                  contest.status === true &&
                  new Date(contest.publicationDate) <= new Date() &&
                  new Date(contest.resultsDate) >= new Date()
              ).length
            }
            <span>
              concours actif
              {props.organization.contests.filter(
                (contest) =>
                  contest.status === true &&
                  new Date(contest.publicationDate) <= new Date() &&
                  new Date(contest.resultsDate) >= new Date()
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

export default OrganizationCard;
