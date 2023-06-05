import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const JuryMembersContestTab = ({ contest, goBack }) => {
    return (
        <>
            <h2 className="flex items-center text-text-2xl font-normal not-italic mb-6">
                {contest.juryMembers?.length} membres du Jury
            </h2>
            {contest.juryMembers?.map((juryMember) => (
                <div key={juryMember.id} className='bg-[#F1F1F1] p-5 mt-2'>
                    <p><span className='font-bold'>{juryMember.member.user.firstname} {juryMember.member.user.lastname}</span>, {juryMember.fonction}</p>
                </div>
            ))}
            <div className="mx-auto mt-10 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                    <AiOutlineArrowLeft className='mr-2' /> Retour
                </Link>
            </div>
        </>
    );
};

export default JuryMembersContestTab;
