import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import axiosInstance from './AxiosInstance';
import { useAuth } from './AuthContext';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Adresse e-mail invalide')
    .required("L'adresse e-mail est requise"),
  password: Yup.string()
    .min(3, 'Le mot de passe doit comporter au moins 3 caractères')
    .required('Le mot de passe est requis'),
});

const LoginForm = () => {
  const { login } = useAuth();
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axiosInstance.post(
        process.env.REACT_APP_API_URL + '/login_check',
        {
          username: values.email,
          password: values.password,
        }
      );

      const token = response.data.token;
      localStorage.setItem('jwt', token);
      login();
      // Redirigez l'utilisateur vers la page souhaitée après l'authentification réussie.
      console.log(response);
    } catch (err) {
      setErrors({
        form: "Erreur d'authentification. Veuillez vérifier vos identifiants.",
      });
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <h1>Connexion</h1>
          <ErrorMessage name="form" component="p" />
          <div>
            <label htmlFor="email">Email</label>
            <Field type="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="span" />
          </div>
          <div>
            <label htmlFor="password">Mot de passe</label>
            <Field type="password" name="password" placeholder="Mot de passe" />
            <ErrorMessage name="password" component="span" />
          </div>
          <button type="submit" disabled={isSubmitting}>
            Se connecter
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
