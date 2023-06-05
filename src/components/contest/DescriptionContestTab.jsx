import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DescriptionContestTab = ({ user, contest, setContest, goBack }) => {
    const handleEditorChange = (content) => {
        contest.description = content;
        const updateDescriptionProcess = async () => {
            const response = await axios.put(process.env.REACT_APP_API_URL + `/contests/${contest.id}`, {
                description: content
            });
            if (response.status !== 200) {
                throw new Error('Error updating contest description');
            }
            setContest(response.data);
        };

        toast.promise(
            updateDescriptionProcess(),
            {
                pending: 'Mise à jour de la description du concours...',
                success: 'La description du concours a bien été mise à jour !',
                error: 'Une erreur est survenue lors de la mise à jour de la description du concours.'
            }
        );
    };

    return (
        <>
            <h2 className="flex items-center text-text-2xl font-normal not-italic">Présentation du concours photo</h2>
            {user && user.organizations && contest.organization && user.organizations.some(org => org.id === contest.organization.id) ? (
                <Editor
                    apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                    initialValue={contest.description}
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
                <p dangerouslySetInnerHTML={{ __html: contest.description }}></p>
            )}
            <div className=" mx-auto mt-10 flex 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex">
                    <AiOutlineArrowLeft className='mr-2' /> Retour
                </Link>
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5">
                    Télécharger la version PDF
                </Link>
            </div>
        </>
    );
};

export default DescriptionContestTab;
