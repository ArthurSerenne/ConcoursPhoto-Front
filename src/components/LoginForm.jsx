import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from './AuthContext';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Adresse e-mail invalide')
    .required("L'adresse e-mail est requise"),
  password: Yup.string()
    .min(8, 'Le mot de passe doit comporter au moins 8 caractères')
    .required('Le mot de passe est requis'),
});

const LoginForm = ({ closeModal }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  // ...
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + '/login_check',
        {
          username: values.email,
          password: values.password,
        }
      );
  
      const token = response.data.token;
      localStorage.setItem('jwt', token);
  
<<<<<<< HEAD
<<<<<<< HEAD
      const userResponse = await axiosInstance.get(
        process.env.REACT_APP_API_URL + '/user_data',
=======
      // Récupérez les données de l'utilisateur
      const userResponse = await axiosInstance.get(
        process.env.REACT_APP_API_URL + '/users/me', // Modifiez cette URL pour correspondre à l'endpoint qui renvoie les données de l'utilisateur
>>>>>>> 6b9b2da (test)
=======
      const userResponse = await axiosInstance.get(
        process.env.REACT_APP_API_URL + '/user_data',
>>>>>>> d68c59c (test)
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d68c59c (test)
          params: {
            groups: ['user', 'member', 'social_network'],
            forceEager: true,
          },
<<<<<<< HEAD
        }
      );
  
      const userData = userResponse.data;
      login(userData);

=======
=======
>>>>>>> d68c59c (test)
        }
      );
  
      const userData = userResponse.data;
      login(userData);
<<<<<<< HEAD
  
      console.log(response);
>>>>>>> 6b9b2da (test)
=======

>>>>>>> d68c59c (test)
      closeModal();
      navigate('/');
    } catch (err) {
      setErrors({
        form: "Erreur d'authentification. Veuillez vérifier vos identifiants.",
      });
      console.log(err);
    } finally {
      setSubmitting(false);
    }
<<<<<<< HEAD
<<<<<<< HEAD
  };
  
// ...
=======
  };  
>>>>>>> 6b9b2da (test)
=======
  };
  
// ...
>>>>>>> d68c59c (test)

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
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black ml-12 mb-2' htmlFor="email">Email ou pseudo*</label>
            <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="email" name="email" />
            <br />
            <ErrorMessage name="email" />
          </div>
          <br />
          <div>
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black ml-12 mb-2' htmlFor="password">Mot de passe*</label>
            <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="password" name="password" />
            <br />
            <ErrorMessage name="password" />
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
