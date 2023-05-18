import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RiUserAddLine,
  RiUserSharedLine,
  RiMenu3Line,
  RiCloseLine,
} from 'react-icons/ri';
import { useAuth } from './AuthContext';
import Modal from 'react-modal';
import Login from '../pages/Login';
import Register from '../pages/Register'

Modal.setAppElement('#root');

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <nav className="left-0 top-0 w-full bg-[#A8A8A8] xl:px-24">
        <div className="mx-6 flex flex-wrap items-center justify-between py-6 sm:max-w-screen-sm md:mx-24 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          <a
            href="/"
            className="flex items-center rounded bg-white px-8 py-4 font-bold"
          >
            ConcoursPhoto.com
          </a>
          <div className="flex gap-2 md:order-2">
            {!isAuthenticated && (
              <>
                <button
                  onClick={openRegisterModal}
                  className="w-32 justify-between rounded bg-neutral-100 px-2 py-2.5 text-sm"
                >
                  <RiUserAddLine /> <span>S'inscrire</span>
                </button>
                <button
                  onClick={openLoginModal}
                  className="w-32 justify-between rounded bg-neutral-100 px-2 py-2.5 text-sm"
                >
                  <RiUserSharedLine /> <span>Se connecter</span>
                </button>
              </>
            )}
            {isAuthenticated && (
              <>
                <>
                <Link
                  to="/mon-compte"
                  className="w-32 justify-between rounded bg-neutral-100 px-2 py-2.5 text-sm"
                >
                  <RiUserAddLine /> <span>Mon profil</span>
                </Link>
                <button
                    onClick={logout}
                    className="w-32 justify-between rounded bg-neutral-100 px-2 py-2.5 text-sm"
                  >
                    <RiUserSharedLine /> <span>Déconnexion</span>
                  </button>
              </>
              </>
            )}
          </div>
          <button
            className="flex items-center rounded p-1 md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
          </button>
          <div
            className={`w-full items-center justify-between md:order-1 md:flex md:w-auto ${
              isMenuOpen ? 'flex' : 'hidden'
            }`}
            id="navbar-sticky"
          >
            <ul className="mt-4 flex flex-col gap-8 rounded-lg border border-gray-100 p-4 font-medium md:mt-0 md:flex-row md:space-x-4 md:border-0 md:p-0">
              <li>
                <Link
                  to="/"
                  className="flex items-center text-center text-sm font-bold not-italic text-black underline-offset-8 hover:text-white hover:underline"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/concours-photo"
                  className="flex items-center text-center text-sm font-bold not-italic text-black underline-offset-8 hover:text-white hover:underline"
                >
                  Concours photo
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="flex items-center text-center text-sm font-bold not-italic text-black underline-offset-8 hover:text-white hover:underline"
                >
                  Photographes
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="flex items-center text-center text-sm font-bold not-italic text-black underline-offset-8 hover:text-white hover:underline"
                >
                  Organisateurs
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="flex items-center text-center text-sm font-bold not-italic text-black underline-offset-8 hover:text-white hover:underline"
                >
                  Créez votre concours
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="flex items-center text-center text-sm font-bold not-italic text-black underline-offset-8 hover:text-white hover:underline"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {isLoginModalOpen && (
        <Modal
          isOpen={isLoginModalOpen}
          onRequestClose={closeLoginModal}
          contentLabel="Login Modal"
          overlayClassName="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          className="relative bg-white rounded-lg w-[530px] h-[491px] pt-6"
        >
          <div className="overflow-y-auto">
            <Login
              closeModal={closeLoginModal}
              openRegisterModal={openRegisterModal}
            />
          </div>
        </Modal>
      )}
      {isRegisterModalOpen && (
        <Modal
          isOpen={isRegisterModalOpen}
          onRequestClose={closeRegisterModal}
          contentLabel="Register Modal"
          overlayClassName="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          className="relative bg-white rounded-lg w-[530px] pt-6"
        >
          <div className="h-[80vh] overflow-y-auto">
            <Register
              closeModal={closeRegisterModal}
              openLoginModal={openLoginModal}
            />
          </div>
        </Modal>      
      )}
    </>
  );
};

export default Navbar;
