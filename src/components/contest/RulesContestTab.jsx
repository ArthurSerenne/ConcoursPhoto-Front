import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RulesContestTab = ({ user, contest, setContest, goBack }) => {
    const handleEditorChange = (content) => {
        contest.rules = content;
        const updateRulesProcess = async () => {
            const response = await axios.put(process.env.REACT_APP_API_URL + `/contests/${contest.id}`, {
                rules: content
            });
            if (response.status !== 200) {
                throw new Error('Error updating contest rules');
            }
            setContest(response.data);
        };

        toast.promise(
            updateRulesProcess(),
            {
                pending: 'Mise à jour des règles du concours...',
                success: 'Le règlement du concours a bien été mis à jour !',
                error: 'Une erreur est survenue lors de la mise à jour du règlement du concours.'
            }
        );
    };

    return (
        <>
            <h2 className="flex items-center text-text-2xl font-normal not-italic">Règlement du concours</h2>
            {user && user.organizations && contest.organization && user.organizations.some(org => org.id === contest.organization.id) ? (
                <Editor
                    apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                    initialValue={contest.rules}
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
                <p dangerouslySetInnerHTML={{ __html: contest.rules }}></p>
            )}
            <div className="mx-auto mt-10 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                    <AiOutlineArrowLeft className='mr-2' /> Retour
                </Link>
            </div>
        </>
    );
};

export default RulesContestTab;
