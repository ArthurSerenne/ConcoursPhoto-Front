import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const ContestCard = (props) => {
    const navigate = useNavigate();
    const formattedDate = format(new Date(props.contest.resultsDate), 'dd/MM/yyyy');

    const handleClick = (contest) => {
        return () => {
            navigate(`/contest/${contest.id}`, { state: { contest } });
        };
    };
    
    return (
        <div className='max-w-lg shadow-xl rounded-b-lg hover:cursor-pointer' onClick={handleClick(props.contest)}>
            <img className='rounded-t-lg' src={props.contest.visual} alt={props.contest.name} />
            <div className='p-3'>
                <p className='text-base font-bold not-italic leading-[160%] text-black'>{props.contest.name}</p>
                <div className="flex gap-1 mt-2">
                    <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit">{props.contest.organization.name}</p>
                    {props.contest.themes
                    .map((theme) => (
                    <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit" key={theme.id}>{theme.name}</p>
                    ))}
                    <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit">{props.contest.status === true ? 'Actif' : 'Inactif'}</p>
                </div>
                <div className="flex gap-1 mt-6 justify-between">
                    <div className="flex gap-1">
                        <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit">121</p>
                        <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit">458</p>
                        <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit">458</p>
                    </div>
                    <div>
                        <p className="py-1 px-4 max-w-fit">Jusqu'au {formattedDate}</p>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default ContestCard;
