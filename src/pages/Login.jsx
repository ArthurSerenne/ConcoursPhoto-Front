import React from 'react';
import LoginForm from '../components/LoginForm';

const Login = ({ closeModal }) => {
  return (
    <div className="text-center">
      <div className='mb-5'>
      <h1 className='not-italic font-bold text-text-2xl leading-[29px] flex items-center text-black mb-5 ml-7'>Connexion</h1>
        <p className='not-italic font-bold text-sm leading-[22px] flex items-center text-black ml-7'>Veuillez vous identifier pour pouvoir voter et participer.</p>
        <p className='not-italic font-normal text-sm leading-[22px] flex items-center text-black ml-7'>Si vous n'avez pas de compte, inscrivez-vous, c'est gratuit.</p>
      </div>
      <LoginForm closeModal={closeModal} />
      <p className='not-italic font-normal text-sm mt-5 leading-[17px] text-black'>Vous avez oublié votre mot de passe ? Cliquez ici</p>
    </div>
  );
};

export default Login;
