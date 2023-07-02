import { useNavigate } from 'react-router-dom';
import ImageDisplay from '../components/ImageDisplay';
import { RiCameraLensLine } from 'react-icons/ri';

const OrganizationCardList = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/organisateurs/${props.organization.id}`);
  };

  return (
    <div className="relative mb-10 flex grid max-h-[440px] w-full grid-cols-2 flex-col justify-between rounded-b-lg shadow-xl sm:max-h-[500px] md:grid-cols-3">
      <div className="max-h-[260px] w-full overflow-hidden">
        <ImageDisplay
          imageName={props.organization.logo}
          radius="rounded-t-lg w-full"
        />
      </div>
      <div className="relative flex flex-col justify-between p-5 md:col-span-2">
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
        <div className="flex justify-between">
          <div className="flex items-center justify-start">
            <p className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-2 text-xs md:text-base">
              <RiCameraLensLine className="mr-0.5" />
              {
                props.organization.contests.filter(
                  (contest) =>
                    contest.status === true &&
                    new Date(contest.publicationDate) <= new Date() &&
                    new Date(contest.resultsDate) >= new Date()
                ).length
              }
              <span className="ml-0.5 md:ml-0">
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
          <a
            className="absolute bottom-5 right-5 flex items-center gap-1 rounded-full bg-gray-400 px-3 py-2 py-2 text-xs text-white hover:cursor-pointer hover:bg-gray-300 md:px-9 md:py-5 md:text-base"
            onClick={handleClick}
          >
            Voir <span className="hidden md:inline">l'organisateur</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCardList;
