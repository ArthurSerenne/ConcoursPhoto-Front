import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import axiosInstance from './AxiosInstance';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PasswordChecklist from "react-password-checklist";
import SituationEnum from './enums/SituationEnum';

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
  const form = useRef();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    const registerProcess = async () => {
      const response = await axios.post(process.env.REACT_APP_API_URL + '/register', values);

      const loginResponse = await axios.post(process.env.REACT_APP_API_URL + '/login_check', {
        username: values.email,
        password: values.password,
      });

      const token = loginResponse.data.token;
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
      registerProcess(),
      {
        pending: 'Inscription en cours...',
        success: "Inscription réussie !",
        error: "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
      }
    ).finally(() => setSubmitting(false));
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
      className='z-100'
    >
      {({ isSubmitting, values  }) => (
        <Form ref={form}>
          <div className='flex gap-4 mb-4'>
            <div className='flex gap-2'>
              <Field type="radio" name="gender" value="homme" required className="scale-150" />
              <label>Homme</label>
            </div>
            <div className='flex gap-2'>
              <Field type="radio" name="gender" value="femme" required className="scale-150" />
              <label>Femme</label>
            </div>
            <div className='flex gap-2'>
              <Field type="radio" name="gender" value="non-binaire" required className="scale-150" />
              <label>Non binaire</label>
            </div>
          </div>
          <div>
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2'>Prénom*</label>
            <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="text" name="firstname" required />
            <br />
            <ErrorMessage name="firstname" component="div" className='text-red-500' />
          </div>
          <br />
          <div>
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2'>Nom*</label>
            <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="text" name="lastname" required />
            <br />
            <ErrorMessage name="lastname" component="div" className='text-red-500' />
          </div>
          <br />
          <div className='flex justify-between'>
          <div>
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-1'>Date de naissance*</label>
              <Field className='bg-[#f1f1f1] rounded-[5px] w-[210px] h-[43px] pl-3' type="date" name="birthdate" required />
              <br />
              <ErrorMessage name="birthdate" component="div" className='text-red-500' />
          </div>
          <div>
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-1'>Vous êtes*</label>
              <Field as='select' name='situation' className='bg-[#f1f1f1] rounded-[5px] w-[210px] h-[43px] pl-3' required>
                {Object.entries(SituationEnum).map(([key, value]) => (
                  <option value={key} key={key}>
                    {value}
                  </option>
                ))}
              </Field>
              <br />
              <ErrorMessage name="situation" component="div" className='text-red-500' />
            </div>
          </div>
          <br />
          <div>
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2'>Email*</label>
            <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="email" name="email" required />
            <br />
            <ErrorMessage name="email" component="div" className='text-red-500' />
          </div>
          <br />
          <div>
            <label className='not-italic font-normal text-sm leading-[17px] flex items-center text-black mb-2'>Mot de passe*</label>
            <Field className='bg-[#f1f1f1] rounded-[5px] w-[432px] h-[43px] pl-3' type="password" name="password" placeholder="8 caractères min dont 1 chiffre et 1 lettre majuscule" required />
            <br />
            <PasswordChecklist
                    rules={["minLength","number","capital"]}
                    minLength={8}
                    value={values.password}
                    messages={{
                            minLength: "Le mot de passe doit contenir au moins 8 caractères.",
                            number: "Le mot de passe doit contenir au moins un chiffre.",
                            capital: "Le mot de passe doit contenir au moins une lettre majuscule.",
				            }}
            />
          </div>
          <br />
          <div className='flex gap-2 align-top'>
            <Field type="checkbox" name="acceptTerms" required className="scale-150" />
            <label className='text-xs'>En cochant cette case, j'accepte les conditions générales d'utilisation ainsi que la politique d'utilisation de mes données personnelles.</label>
            <br />
            <ErrorMessage name="acceptTerms" component="div" className='text-red-500' />
          </div>
          <div className="flex justify-center">
            <button className="bg-[#000000] rounded-[44px] mt-5 not-italic font-bold w-[200px] h-[59px] text-base leading-[19px] text-white" type="submit" disabled={isSubmitting}>
              Créer mon compte
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
