import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from './AuthContext';

const RegisterSchema = Yup.object().shape({
  gender: Yup.string().required('Le genre est requis'),
  firstname: Yup.string().required('Le prénom est requis'),
  lastname: Yup.string().required('Le nom est requis'),
  birthdate: Yup.date().required('La date de naissance est requise'),
  situation: Yup.string().required('La situation est requise'),
  email: Yup.string()
    .email('Adresse e-mail invalide')
    .required("L'adresse e-mail est requise"),
  password: Yup.string()
    .min(8, 'Le mot de passe doit comporter au moins 8 caractères')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .matches(/\d/, 'Le mot de passe doit contenir au moins un chiffre')
    .required('Le mot de passe est requis'),
  acceptTerms: Yup.boolean()
    .required('Les conditions générales d\'utilisation doivent être acceptées')
    .oneOf([true], 'Les conditions générales d\'utilisation doivent être acceptées'),
});

const RegisterForm = ({ closeModal }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + '/register', values);
      console.log(response);

      const loginResponse = await axios.post(process.env.REACT_APP_API_URL + '/login_check', {
        username: values.email,
        password: values.password,
      });

      const token = loginResponse.data.token;
      localStorage.setItem('jwt', token);
      login();
      closeModal();
      navigate('/');
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
};

  return (
    <Formik
      initialValues={{
        gender: '',
        firstname: '',
        lastname: '',
        birthdate: '',
        situation: '',
        email: '',
        password: '',
        acceptTerms: false,
      }}
      validationSchema={RegisterSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting  }) => (
        <Form>
          <div>
            <Field type="radio" name="gender" value="homme" required />
            <label>Homme</label>
            <Field type="radio" name="gender" value="femme" required />
            <label>Femme</label>
            <Field type="radio" name="gender" value="non-binaire" required />
            <label>Non binaire</label>
          </div>
          <div>
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black ml-7'>Prénom*</label>
            <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px]' type="text" name="firstname" required />
            <br />
            <ErrorMessage name="firstname" />
          </div>
          <br />
          <div>
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black ml-7'>Nom*</label>
            <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px]' type="text" name="lastname" required />
            <br />
            <ErrorMessage name="lastname" />
          </div>
          <br />
          <div className='flex justify-between'>
          <div>
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black ml-7'>Date de naissance*</label>
              <Field className='bg-[#f1f1f1] rounded-[5px] w-[210px] h-[43px]' type="date" name="birthdate" required />
              <br />
            <ErrorMessage name="birthdate" />
          </div>
          <div>
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black ml-7'>Vous êtes*</label>
            <Field className='bg-[#f1f1f1] rounded-[5px] w-[210px] h-[43px]' as="select" name="situation" required>
              <option value="">Cliquez ici</option>
              <option value="photographe">Photographe</option>
              <option value="organisateur">Organisateur</option>
              </Field>
              <br />
            <ErrorMessage name="situation" />
            </div>
          </div>
          <br />
          <div>
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black ml-7'>Email*</label>
            <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px]' type="email" name="email" required />
            <br />
            <ErrorMessage name="email" />
          </div>
          <br />
          <div>
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black ml-7'>Mot de passe*</label>
            <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px]' type="password" name="password" placeholder="8 caractères min dont 1 chiffre et 1 lettre majuscule" required />
            <br />
            <ErrorMessage name="password" />
          </div>
          <br />
          <div>
            <Field type="checkbox" name="acceptTerms" required />
            <label>En cochant cette case, j'accepte les conditions générales d'utilisation ainsi que la politique d'utilisation de mes données personnelles.</label>
            <br />
            <ErrorMessage name="acceptTerms" />
          </div>
          <button className='bg-[#000000] rounded-[44px] mt-5 not-italic font-bold w-[200px] h-[59px] text-base leading-[19px] text-white' type="submit" disabled={isSubmitting}>Créer mon compte</button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;