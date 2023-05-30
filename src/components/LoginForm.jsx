import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import axiosInstance from './AxiosInstance';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Adresse e-mail invalide')
    .required("L'adresse e-mail est requise"),
  password: Yup.string()
    .required('Le mot de passe est requis'),
});

const LoginForm = ({ closeModal }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    const loginProcess = async () => {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + '/login_check',
        {
          username: values.email,
          password: values.password,
        }
      );

      const token = response.data.token;
      localStorage.setItem('jwt', token);

      const userResponse = await axiosInstance.get(
        process.env.REACT_APP_API_URL + '/user_data',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            groups: ['user', 'member', 'social_network'],
            forceEager: true,
          },
        }
      );

      const userData = userResponse.data;
      login(userData);

      localStorage.setItem('user', JSON.stringify(userData));

      closeModal();
      navigate('/');
    };

    toast.promise(
      loginProcess(),
      {
        pending: 'Chargement...',
        success: 'Vous êtes connecté !',
        error: "Erreur d'authentification. Veuillez vérifier vos identifiants."
      }
    ).finally(() => setSubmitting(false));
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
      className='z-100'
    >
      {({ isSubmitting }) => (
        <Form>
          <ErrorMessage name="form" />
          <div>
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2' htmlFor="email">Email ou pseudo*</label>
            <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="email" name="email" />
            <br />
            <ErrorMessage name="email" component="div" className='text-red-500' />
          </div>
          <br />
          <div>
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2' htmlFor="password">Mot de passe*</label>
            <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="password" name="password" />
            <br />
            <ErrorMessage name="password" component="div" className='text-red-500' />
          </div>
          <button className='bg-[#000000] rounded-[44px] mt-5 not-italic font-bold w-[200px] h-[59px] text-base leading-[19px] text-white' type="submit" disabled={isSubmitting}>
            Se connecter
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
