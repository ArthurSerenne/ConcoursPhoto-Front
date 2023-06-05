import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const ResultsContestTab = ({ contest, goBack }) => {
    return (
        <>
            <h2 className="flex items-center text-text-2xl font-normal not-italic">
                Résultats du concours photo
            </h2>
            <br/>
            <p>LAURÉAT PAR THÈME</p>
            <br/>
            {contest.themes.map((theme) => (
                <React.Fragment key={theme.id}>
                    <p>{theme.name}</p>
                    <br/>
                    <p>1er prix : Jean MARTIN, 2e prix : Kevin DUTOIT, 3e prix : Lucile FAUBEUGE</p>
                    <br/>
                </React.Fragment>
            ))}
            <br/>
            <p><b>PRIX SPÉCIAUX</b></p>
            <br/>
            <p><b>Le prix spécial du jury</b> a été décerné à Julien PILLON</p>
            <p><b>Le prix spécial des membres</b> a été décerné à Christine CHEVRON</p>
            <div className="mx-auto mt-10 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                    <AiOutlineArrowLeft className='mr-2' /> Retour
                </Link>
            </div>
        </>
    );
};

export default ResultsContestTab;
