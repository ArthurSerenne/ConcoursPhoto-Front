import React from 'react';
import LoginForm from '../components/LoginForm';

const Login = ({ closeModal, openRegisterModal }) => {
  return (
    <div className="text-center mx-12 pt-4">
      <div className="mb-5">
        <h1 className="mb-5 flex items-center text-text-2xl font-bold not-italic leading-[29px] text-black">
          Connexion
        </h1>
        <p className="flex items-center text-sm font-bold not-italic leading-[22px] text-black">
          Veuillez vous identifier pour pouvoir voter et participer.
        </p>
        <p className="flex items-center text-sm font-normal not-italic leading-[22px] text-black">
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
      </div>
      <LoginForm closeModal={closeModal} />
      <p className='not-italic font-normal text-sm mt-5 leading-[17px] text-black'>Vous avez oublié votre mot de passe ? Cliquez ici</p>
    </div>
  );
};

export default Login;
