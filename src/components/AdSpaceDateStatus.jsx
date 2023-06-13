import { isBefore, isAfter } from 'date-fns';

const AdSpaceDateStatus = ({adSpacesData}) => {
    console.log(adSpacesData);
    const today = new Date();
    let color = '';
    let text = '';
    const parsedDate = (date) => {
        return new Date(date);
    };

    if (isAfter(parsedDate(adSpacesData.start_date), today)) {
        text = 'A venir';
        color = 'uppercase text-xs font-bold text-black bg-gray-200 px-3 py-2 rounded-full w-fit';
    } else if (isBefore(parsedDate(adSpacesData.start_date), today) && isAfter(parsedDate(adSpacesData.end_date), today)) {
        text = 'En cours';
        color = 'uppercase text-xs font-bold text-white bg-green-400 px-3 py-2 rounded-full w-fit';
    } else {
        text = 'Terminé';
        color = 'uppercase text-xs font-bold text-white bg-blue-500 px-3 py-2 rounded-full';
    }

    return (
        <p className={`${color}`}>{text}</p>
    );
}

export default AdSpaceDateStatus;
