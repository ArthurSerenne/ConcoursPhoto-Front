import { useAuth } from '../AuthContext';
import { Formik, Form, Field } from 'formik';
import axiosInstance from '../AxiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyPreferencesTab = () => {
    const { isAuthenticated, user, isLoading, reloadUser } = useAuth();

    console.log(user.preferencies);

    if (isLoading) {
        return (
        <div>
            <p>Chargement...</p>
        </div>
        );
    }

    if (!isAuthenticated) {
        return (
        <div>
            <p>Veuillez vous connecter pour accéder à cette page.</p>
        </div>
        );
    }

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
                            </label>
                            <label>
                                <Field type='checkbox' name='voteContest' className='mr-3 scale-150' />
                                Être informé par email lorsqu’un concours entre en phase de vote
                            </label>
                            <label>
                                <Field type='checkbox' name='endContest' className='mr-3 scale-150' />
                                Être informé par email 48h avant la date de fin des votes d’un concours
                            </label>
                            <label>
                                <Field type='checkbox' name='resultContest' className='mr-3 scale-150' />
                                Être informé par email lorsque les résultats d’un concours sont publiés
                            </label>
                            <label>
                                <Field type='checkbox' name='blog' className='mr-3 scale-150' />
                                Être informé par email lorsqu’une nouvel article/actualité est publiée dans le blog
                            </label>
                        </div>
                    </div>
                    <div className='mt-10'>
                        <p className='font-bold mb-4'>Si vous êtes photographe</p>
                        <div className='w-full bg-gray-100 p-4 grid grid-cols-1 space-y-2'>
                            <label>
                                <Field type='checkbox' name='newContestProfil' className='mr-3 scale-150' />
                                Être informé lorsqu’un nouveau concours est publié et que mon profil satisfait les critères de participation
                            </label>
                            <label>
                                <Field type='checkbox' name='submissionContest' className='mr-3 scale-150' />
                                Être informé lorsqu’un concours entre en phase de soumission
                            </label>
                            <label>
                                <Field type='checkbox' name='endSubmissionContest' className='mr-3 scale-150' />
                                Être informé 48h avant la date de fin des soumissions d’un concours
                            </label>
                        </div>
                    </div>
                    <button className='bg-black text-white font-semibold px-14 py-5 rounded-full mt-10' type='submit'>Mettre à jour</button>
                </div>
            </Form>
        </Formik>
    );
}

export default MyPreferencesTab;
