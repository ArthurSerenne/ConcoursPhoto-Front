import React from 'react';
import RegisterForm from '../components/RegisterForm';

const Register = ({ closeModal }) => {
  return (
    <div className='text-center'>
      <div className='mb-5'>
        <h1 className='not-italic font-bold text-text-2xl leading-[29px] flex items-center text-black mb-5 ml-7'>Inscription</h1>
        <p className='not-italic font-bold text-sm leading-[22px] flex items-center text-black ml-7'>Créez votre compte membre, c'est gratuit !</p>
        <p className='not-italic font-normal text-sm leading-[22px] flex items-center text-black ml-7'>Vous pourrez voter et participer en tant que photographe aux concours proposés. Si vous représentez une organisation et souhaitez publier un concours, créez d'abord votre compte.</p>
      </div>
      <RegisterForm closeModal={closeModal} />
      <p className='not-italic font-normal text-sm mt-5 leading-[17px] text-black'>Vous avez déjà un compte ? Connectez-vous</p>
    </div>
  );
};

export default Register;
