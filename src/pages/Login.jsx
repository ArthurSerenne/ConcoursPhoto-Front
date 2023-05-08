import React from 'react';
import LoginForm from '../components/LoginForm';

const Login = ({ closeModal, openRegisterModal }) => {
  return (
    <div className="text-center">
      <div className="mb-5">
        <h1 className="mb-5 ml-7 flex items-center text-text-2xl font-bold not-italic leading-[29px] text-black">
          Connexion
        </h1>
        <p className="ml-7 flex items-center text-sm font-bold not-italic leading-[22px] text-black">
          Veuillez vous identifier pour pouvoir voter et participer.
        </p>
        <p className="ml-7 flex items-center text-sm font-normal not-italic leading-[22px] text-black">
          Si vous n'avez pas de compte,{' '}
          <a
            href="#"
            className="underline"
            onClick={(e) => {
              e.preventDefault();
              closeModal();
              openRegisterModal();
            }}
          >
            inscrivez-vous
          </a>
          , c'est gratuit.
        </p>
    <div className="text-center bg-red">
      <div className='mb-5'>
      <h1 className='not-italic font-bold text-text-2xl leading-[29px] flex items-center text-black mb-5 ml-12'>Connexion</h1>
        <p className='not-italic font-bold text-sm leading-[22px] flex items-center text-black ml-12'>Veuillez vous identifier pour pouvoir voter et participer.</p>
        <p className='not-italic font-normal text-sm leading-[22px] flex items-center text-black ml-12'>Si vous n'avez pas de compte, inscrivez-vous, c'est gratuit.</p>
      </div>
      <LoginForm closeModal={closeModal} />
      <p className="mt-5 text-sm font-normal not-italic leading-[17px] text-black">
        Vous avez oublié votre mot de passe ? Cliquez ici
      </p>
    </div>
  );
};

export default Login;
