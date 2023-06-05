import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PrizesContestTab = ({ user, contest, setContest, goBack }) => {
    const handleEditorChange = (content) => {
        contest.prizes = content;
        const updatePrizesProcess = async () => {
            const response = await axios.put(process.env.REACT_APP_API_URL + `/contests/${contest.id}`, {
                prizes: content
            });
            if (response.status !== 200) {
                throw new Error('Error updating contest prizes');
            }
            setContest(response.data);
        };

        toast.promise(
            updatePrizesProcess(),
            {
                pending: 'Mise à jour de la dotation du concours...',
                success: 'La dotation du concours a bien été mise à jour !',
                error: 'Une erreur est survenue lors de la mise à jour de la dotation du concours.'
            }
        );
    };

    return (
        <>
            <h2 className="flex items-center text-text-2xl font-normal not-italic">Prix à gagner</h2>
            {user && user.organizations && contest.organization && user.organizations.some(org => org.id === contest.organization.id) ? (
                <Editor
                    apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                    initialValue={contest.prizes}
                    init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar: 'undo redo | formatselect | ' +
                            'bold italic backcolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                    onEditorChange={handleEditorChange}
                />
            ) : (
                <p dangerouslySetInnerHTML={{ __html: contest.prizes }}></p>
            )}
            <div className="mx-auto mt-10 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                    <AiOutlineArrowLeft className='mr-2' /> Retour
                </Link>
            </div>
        </>
    );
};

export default PrizesContestTab;
