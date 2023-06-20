import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams } from 'react-router';
import AsyncSelect from 'react-select/async';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';

import Breadcrumb from '../components/Breadcrumb';

const AddContest = () => {
  const { organization } = useParams();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    axios
      .post('/mon-concours', values)
      .then(response => {
        console.log(response.data);
        resetForm();
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const goBack = () => {
    navigate(-1);
  };
  const navigate = useNavigate();
  const loadZipCode = (inputValue) => {
    return axios.get(process.env.REACT_APP_API_URL + '/cities.json', {
        params: {
            zip_code: inputValue
        }
    }).then(res => {
        return res.data.map(city => ({
            value: city.id,
            label: city.zip_code
        }));
    });
};

  const LoginSchema = Yup.object().shape({
    organizationName: Yup.string().required('Champ requis'),
    firstname: Yup.string().required('Champ requis'),
    email: Yup.string().email('Email invalide').required('Champ requis'),
    phone: Yup.string().required('Champ requis'),
    website: Yup.string(),
    adress: Yup.string().required('Champ requis'),
    cityCode: Yup.string().required('Champ requis'),
    pays: Yup.string().required('Champ requis'),
    city: Yup.string().required('Champ requis'),
    acceptTerms: Yup.bool().oneOf([true], 'Veuillez accepter les termes et conditions'),
  });

  return (
    <div className='mx-6 md:mx-24'>
        <div className="mx-auto mt-10 mb-10 flex flex-wrap justify-between items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
        <h1 className="font-bold text-3xl pb-10">Créez votre concours</h1>
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
                <h3 className="font-bold">Qui peut créer un concours photo ?</h3><br/>
                <p className='pb-2'>La création de concours photo est ouvert aux organisations suivantes : </p>
                <ul className='list-disc pl-6'>
                    <li className='text'>Mairies</li>
                    <li>Offices de tourisme</li>
                    <li>Agglomérations</li>
                    <li>Départements</li>
                    <li>Régions</li>
                    <li>Collectivités territoriales</li>
                    <li>Organisations gouvernementales</li>
                    <li>Organismes de droit public</li>
                    <li>Entreprises privées</li>
                    <li>Associations, ONG</li>
                </ul>
            </div>
            <div className="col-span-1">
                <h3 className="font-bold">Combien ça coûte ?</h3><br/>
                <p className='pb-2'>Le prix est établi pour chaque concours publié et il dépend de plusieurs critères :</p>
                <ul className='list-disc pl-6'>
                    <li>Nature de votre organisation (privée, publique, association/ONG)</li>
                    <li>Taille de votre organisation (moyens budgétaires)</li>
                    <li>Objet du concours photo, étendue, audience visée.</li>
                </ul>
                <p className='pt-4'>Pour recevoir un devis, veuillez renseigner le formulaire de demande de création suivant qui va créer automatiquement un compte membre et une fiche organisme associée. Votre demande sera étudiée et vous recevrez un devis. Après avoir encaissé le paiement, vous pourrez paramétrer et publier votre concours.</p>
                <p>Si vous avez déjà créé un compte membre, veuillez vous connecter puis rendez-vous dans “Mon profil {'>'} Mes organisations {'>'} Concours”</p>
            </div>
        </div>
        
        <Formik
        initialValues={{
          organizationName: '',
          firstname: '',
          email: '',
          phone: '',
          website: 'https://',
          address: '',
          cityCode: '',
          pays: '',
          city: '',
          message:'Présentez brièvement la finalité du concours, sa portée, les sponsors, les lots mis en jeu...',
          acceptTerms: false,
        }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
        className='z-100'
      >
        {({ isSubmitting }) => (
          <Form className="mt-16">
            <ErrorMessage name="form" component="div" />
            <h3 className="font-bold">Vous êtes ?</h3><br/>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div>
                    <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2' htmlFor="organizationName">Nom de l'organisation*</label>
                    <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="text" id="organizationName" name="organizationName" />
                    <ErrorMessage name="organizationName" component="div" className='text-red-500' />
                    </div>

                    <div>
                    <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2 pt-6' htmlFor="firstname">Nom*</label>
                    <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="text" id="firstname" name="firstname" />
                    <ErrorMessage name="firstname" component="div" className='text-red-500' />
                    </div>

                    <div>
                    <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2 pt-6' htmlFor="email">Email*</label>
                    <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="email" id="email" name="email" />
                    <ErrorMessage name="email" component="div" className='text-red-500' />
                    </div>

                    <div>
                    <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2 pt-6' htmlFor="phone">Téléphone*</label>
                    <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="text" id="phone" name="phone" />
                    <ErrorMessage name="phone" component="div" className='text-red-500' />
                    </div>

                    <div>
                    <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2 pt-6' htmlFor="website">Site web</label>
                    <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="text" id="website" name="website" />
                    <ErrorMessage name="website" component="div" className='text-red-500' />
                    </div>
                </div>

                <div>
                    <div>
                    <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2' htmlFor="address">Adresse*</label>
                    <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="text" id="address" name="address" />
                    <ErrorMessage name="address" component="div" className='text-red-500' />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2 pt-6' htmlFor="cityCode">Code postal*</label>
                        <Field name="zipcode">
                            {({ field, form }) => (
                                <AsyncSelect
                                {...field}
                                className='bg-gray-100 rounded-md p-1 w-[210px] h-[43px] mt-1 mb-4 gray-select'
                                loadOptions={loadZipCode}
                                onChange={option => form.setFieldValue(field.name, option)}
                                />
                            )}  
                        </Field>
                        <ErrorMessage name="cityCode" component="div" className='text-red-500' />
                        </div>

                        <div>
                        <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2 pt-5' htmlFor="city">Ville*</label>
                        <Field className='bg-gray-100 rounded-md p-1 w-[210px] h-[43px] mt-1 mb-4 gray-select' type="text" id="city" name="city" />
                        <ErrorMessage name="city" component="div" className='text-red-500' />
                        </div>
                    </div>

                    <div>
                    <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2' htmlFor="pays">Pays*</label>
                    <Field className='bg-gray-100 rounded-md p-1 w-[210px] h-[43px] mt-1 mb-4 gray-select' type="text" id="pays" name="pays" />
                    <ErrorMessage name="pays" component="div" className='text-red-500' />
                    </div>
                </div>
            </div>

            <div>
            <p className='font-bold mt-28'>A propos du concours que vous souhaitez créer</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2 pt-6' htmlFor="info1">Quelle est l'étendue/zone de visibilité du concours ? *</label>
                <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="text" id="info1" name="info1" />
                <ErrorMessage name="info1" component="div" className='text-red-500' />
              </div>
              <div>
                <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2 pt-6' htmlFor="info2">Combien y-a-t-il de prix à gagner ? *</label>
                <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="text" id="info2" name="info2" />
                <ErrorMessage name="info2" component="div" className='text-red-500' />
              </div>
              <div>
                <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2 pt-6' htmlFor="info3">Combien y-a-t-il de sponsors ? *</label>
                <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="text" id="info3" name="info3" />
                <ErrorMessage name="info3" component="div" className='text-red-500' />
              </div>
              <div>
                <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2 pt-6' htmlFor="info4">Quelle est la valeur totale des dotations/prix à gagner ? *</label>
                <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="text" id="info4" name="info4" />
                <ErrorMessage name="info4" component="div" className='text-red-500' />
              </div>
            </div>
              <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2 pt-6' htmlFor="message">Quelle est le thème et la nature du concours ? *</label>
              <Field className='bg-gray-100 rounded-md p-1 w-full h-[300px] mt-1 mb-4 textarea pt-2 text-gray-600' as="textarea" id="message" name="message" />
              <ErrorMessage name="city" component="div" className='text-red-500' />
              </div>
              <div>
                <label className="not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2 pt-2 pb-6" htmlFor="info4">
                  <input
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 mr-1"
                    type="checkbox"
                    id="info4"
                    name="info4"
                  />
                  En validant ce formulaire, j'accepte qu'un compte membre soit créé pour traiter ma demande.
                </label>
                <ErrorMessage name="info4" component="div" className="text-red-500" />
              </div>
            <div className="flex inline-flex">
              <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] h-[59px] py-3.5 mr-4 items-center flex w-fit">
                  <AiOutlineArrowLeft className='mr-2' /> Retour
              </Link>

              <button
                className='bg-[#000000] rounded-[44px] not-italic font-bold w-[250px] h-[59px] text-base leading-[19px] text-white'
                type="submit"
                disabled={isSubmitting}
              >
                Soumettre mon concours
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
    </div>
  );
};

export default AddContest;