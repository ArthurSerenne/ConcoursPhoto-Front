import React from 'react';
import RegisterForm from '../components/RegisterForm';

const Register = ({ closeModal, openLoginModal }) => {
  return (
    <div className="mx-12">
      <div className="mb-5">
        <h1 className="mb-5 flex items-center text-text-2xl font-bold not-italic leading-[29px] text-black">
          Inscription
        </h1>
        <p className="flex items-center text-sm font-bold not-italic leading-[22px] text-black">
          Créez votre compte membre, c'est gratuit !
        </p>
        <p className="flex items-center text-sm font-normal not-italic leading-[22px] text-black">
          Vous pourrez voter et participer en tant que photographe aux concours
          proposés. Si vous représentez une organisation et souhaitez publier un
          concours, créez d'abord votre compte.
        </p>
      </div>
      <RegisterForm closeModal={closeModal} />
      <p className="mt-7 text-center text-sm font-normal not-italic leading-[17px] text-black">
        Vous avez déjà un compte ?{' '}
        <a
          href="#"
          className="underline"
          onClick={(e) => {
            e.preventDefault();
            closeModal();
            openLoginModal();
          }}
        >
          Connectez-vous
        </a>
      </p>
    </div>
  );
};

export default Register;
