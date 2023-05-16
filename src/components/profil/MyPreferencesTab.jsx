import { useAuth } from '../AuthContext';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axiosInstance from '../AxiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = Yup.object().shape({
    newContest: Yup.boolean(),
    voteContest: Yup.boolean(),
    endContest: Yup.boolean(),
    resultContest: Yup.boolean(),
    blog: Yup.boolean(),
    newContestProfil: Yup.boolean(),
    submissionContest: Yup.boolean(),
    endSubmissionContest: Yup.boolean(),
});

const MyPreferencesTab = () => {
    const { user, reloadUser } = useAuth();

    console.log(user.preferencies);
  
    const separateEntityData = (values) => {
        const entity1Data = {
            newContest: values.newContest,
            voteContest: values.voteContest,
            endContest: values.endContest,
            resultContest: values.resultContest,
            blog: values.blog,
            newContestProfil: values.newContestProfil,
            submissionContest: values.submissionContest,
            endSubmissionContest: values.endSubmissionContest,
        };

        return { entity1Data };
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        const { entity1Data } = separateEntityData(values);

        const data = {
            entity1Data,
        };

        try {
            const response = await axiosInstance.patch(
                `${process.env.REACT_APP_API_URL}/preferencies_update`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                console.log("Formulaire soumis avec succès");
                await reloadUser();
                toast.success('Préférences mises à jour avec succès !');
            } else {
                console.error("Erreur lors de la soumission du formulaire");
                toast.error('Erreur lors de la mise à jour des préférences. Veuillez réessayer.');
            }
        } catch (error) {
            console.error("Erreur lors de la soumission du formulaire:", error);
            toast.error('Erreur lors de la mise à jour des préférences. Veuillez réessayer.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            initialValues={{
                newContest: user.preferencies?.newContest ?? false,
                voteContest: user.preferencies?.voteContest ?? false,
                endContest: user.preferencies?.endContest ?? false,
                resultContest: user.preferencies?.resultContest ?? false,
                blog: user.preferencies?.blog ?? false,
                newContestProfil: user.preferencies?.newContestProfil ?? false,
                submissionContest: user.preferencies?.submissionContest ?? false,
                endSubmissionContest: user.preferencies?.endSubmissionContest ?? false,
            }}
        >
            <Form>
                <div>
                    <div className='mt-10'>
                        <p className='font-bold mb-4'>Si vous êtes simple membre</p>
                        <div className='w-full bg-gray-100 p-4 grid grid-cols-1 space-y-2'>
                            <label>
                                <Field type='checkbox' name='newContest' className='mr-3 scale-150' />
                                Être informé par email lorsqu’un nouveau concours est publié
                                <ErrorMessage name='newContest' component='div' className='text-red-500' />
                            </label>
                            <label>
                                <Field type='checkbox' name='voteContest' className='mr-3 scale-150' />
                                Être informé par email lorsqu’un concours entre en phase de vote
                                <ErrorMessage name='voteContest' component='div' className='text-red-500' />
                            </label>
                            <label>
                                <Field type='checkbox' name='endContest' className='mr-3 scale-150' />
                                Être informé par email 48h avant la date de fin des votes d’un concours
                                <ErrorMessage name='endContest' component='div' className='text-red-500' />
                            </label>
                            <label>
                                <Field type='checkbox' name='resultContest' className='mr-3 scale-150' />
                                Être informé par email lorsque les résultats d’un concours sont publiés
                                <ErrorMessage name='resultContest' component='div' className='text-red-500' />
                            </label>
                            <label>
                                <Field type='checkbox' name='blog' className='mr-3 scale-150' />
                                Être informé par email lorsqu’une nouvel article/actualité est publiée dans le blog
                                <ErrorMessage name='blog' component='div' className='text-red-500' />
                            </label>
                        </div>
                    </div>
                    <div className='mt-10'>
                        <p className='font-bold mb-4'>Si vous êtes photographe</p>
                        <div className='w-full bg-gray-100 p-4 grid grid-cols-1 space-y-2'>
                            <label>
                                <Field type='checkbox' name='newContestProfil' className='mr-3 scale-150' />
                                Être informé lorsqu’un nouveau concours est publié et que mon profil satisfait les critères de participation
                                <ErrorMessage name='newContestProfil' component='div' className='text-red-500' />
                            </label>
                            <label>
                                <Field type='checkbox' name='submissionContest' className='mr-3 scale-150' />
                                Être informé lorsqu’un concours entre en phase de soumissions
                                <ErrorMessage name='submissionContest' component='div' className='text-red-500' />
                            </label>
                            <label>
                                <Field type='checkbox' name='endSubmissionContest' className='mr-3 scale-150' />
                                Être informé 48h avant la date de fin des soumissions d’un concours
                                <ErrorMessage name='endSubmissionContest' component='div' className='text-red-500' />
                            </label>
                        </div>
                    </div>
                    <button className='bg-black text-white font-semibold px-14 py-5 rounded-full mt-10 hover:bg-gray-500' type='submit'>Mettre à jour</button>
                </div>
            </Form>
        </Formik>
    );
};

export default MyPreferencesTab;
