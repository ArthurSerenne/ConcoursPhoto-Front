import { isBefore, isAfter } from 'date-fns';

const ContestDateStatus = (props) => {
    const today = new Date();
    let text = '';
    let color = props.color ? props.color : 'bg-gray-100 text-black rounded-full py-2 px-2 text-xs uppercase w-fit';
    const parsedDate = (date) => {
        return new Date(date);
    };

    if (isAfter(parsedDate(props.contest.publicationDate), today)) {
        text = 'A venir';
        color = 'bg-gray-100 text-black rounded-full py-2 px-2 text-xs uppercase w-fit';
    } else if (isBefore(parsedDate(props.contest.publicationDate), today) && isAfter(parsedDate(props.contest.submissionStartDate), today)) {
        text = 'Va bientôt commencé'
    } else if (isBefore(parsedDate(props.contest.submissionStartDate), today) && isAfter(parsedDate(props.contest.submissionEndDate), today)) {
        text = 'Phase de soumission';
    } else if (isBefore(parsedDate(props.contest.submissionEndDate), today) && isAfter(parsedDate(props.contest.votingStartDate), today)) {
        text = 'Récupération des photos';
    } else if (isBefore(parsedDate(props.contest.votingStartDate), today) && isAfter(parsedDate(props.contest.votingEndDate), today)) {
        text = 'Phase de vote';
    } else if (isBefore(parsedDate(props.contest.votingEndDate), today) && isAfter(parsedDate(props.contest.resultsDate), today)) {
        text = 'Phase d\'attente des résultats';
    } else {
        text = 'Phase de résultats'
    }

    return (
        <p className={`${color}`}>{text}</p>
    );
}

export default ContestDateStatus;
