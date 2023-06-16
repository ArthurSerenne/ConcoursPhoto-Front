import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {AiOutlineArrowLeft} from 'react-icons/ai';
import {Editor} from '@tinymce/tinymce-react';
import axios from 'axios';
import Modal from 'react-modal';
import {toast} from 'react-toastify';
import {RiCloseLine} from 'react-icons/ri';
import ContestForm from './ContestForm';

const DescriptionContestTab = ({user, contest, setContest, goBack}) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [TempDescription, setTempDescription] = useState(contest.description);

    const handleEditorChange = (content) => {
        setTempDescription(content);
    };

    const handleEditClick = () => {
        setModalOpen(true);
    };

    const handleSaveClick = async () => {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/contests/${contest.id}`, {
            description: TempDescription
        });

        if (response.status !== 200) {
            throw new Error('Une erreur est survenue lors de la mise à jour du règlement du concours.');
        } else {
            setContest(response.data);
        }

        setModalOpen(false);
    };

    const updateDescriptionProcess = () => handleSaveClick();

    const saveAndUpdate = () => {
        toast.promise(
            updateDescriptionProcess(),
            {
                pending: 'Mise à jour de la description du concours...',
                success: 'Le règlement du concours a bien été mis à jour !',
                error: 'Une erreur est survenue lors de la mise à jour du règlement du concours.'
            }
        );
    };

    const handleCancelClick = () => {
        setTempDescription(contest.description);
        setModalOpen(false);
    };

    const updateContest = async (updatedData) => {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/contests/${contest.id}`, updatedData);

        if (response.status !== 200) {
            throw new Error('Une erreur est survenue lors de la mise à jour du concours.');
        } else {
            setContest(response.data);
        }
    };

    const closeModalWhenClickedOutside = (e) => {
        if (e.target.classList.contains('fixed')) {
            handleCancelClick();
        }
    };

    return (
        <>
            <div className="flex justify-start items-center space-x-8">
                <h2 className="text-2xl font-normal not-italic">Le concours</h2>
                {user && user.organizations && contest.organization && user.organizations.some(org => org.id === contest.organization.id) && (
                    <button
                        className="gap-2.5 rounded-[30px] bg-black px-[15px] py-[5px] text-center text-[8px] font-bold uppercase not-italic leading-[10px] text-white"
                        onClick={handleEditClick}>Editer</button>
                )}
            </div>
            <p dangerouslySetInnerHTML={{__html: contest.description}}></p>
            {user && user.organizations && contest.organization && user.organizations.some(org => org.id === contest.organization.id) ? (
                <>
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={handleCancelClick}
                        contentLabel="Edit Description Modal"
                        overlayClassName=""
                        className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-80 p-4"
                        overlayRef={overlay => {
                            if (overlay) {
                                overlay.addEventListener('click', closeModalWhenClickedOutside);
                            }
                        }}
                    >
                        <div className='bg-white p-7 rounded-lg max-w-[1172px] max-h-[750px] overflow-auto'>
                            <div className='flex justify-between'>
                                <h1 className='font-bold text-xl mb-2'>Concours {'>'} onglet “Présentation” : édition</h1>
                                <button onClick={handleCancelClick}>
                                    <RiCloseLine/>
                                </button>
                            </div>
                            <ContestForm contest={contest} updateContest={updateContest}/>
                            <div className='mt-4'>
                                <button
                                    className="gap-5 mr-4 rounded-[44px] bg-regal-grey px-12 py-3.5 text-base font-bold not-italic leading-[19px] text-white"
                                    onClick={handleCancelClick}>Annuler
                                </button>
                                <button
                                    className="gap-5 rounded-[44px] bg-black px-12 py-3.5 text-base font-bold not-italic leading-[19px] text-white"
                                    onClick={saveAndUpdate}>Sauvegarder
                                </button>
                            </div>
                        </div>
                    </Modal>
                </>
            ) : (
                <></>
            )}
            <div
                className="mx-auto mt-10 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <Link onClick={goBack}
                      className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                    <AiOutlineArrowLeft className="mr-2"/> Retour
                </Link>
            </div>
        </>
    );
};

export default DescriptionContestTab;
