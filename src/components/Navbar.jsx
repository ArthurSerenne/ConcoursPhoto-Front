import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RiUserAddLine,
  RiUserSharedLine,
  RiMenu3Line,
  RiCloseLine,
} from 'react-icons/ri';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="left-0 top-0 w-full bg-gray-400">
      <div className="mx-auto flex flex-wrap items-center justify-between p-6 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <a
          href="/"
          className="flex items-center rounded bg-white px-8 py-4 font-bold"
        >
          ConcoursPhoto.com
        </a>
        <div className="flex gap-2 md:order-2">
          {!isAuthenticated && (
            <>
              <Link
                to="/register"
                className="w-32 justify-between rounded bg-neutral-100 px-2 py-2.5 text-sm"
              >
                <RiUserAddLine /> <span>S'inscrire</span>
              </Link>
              <Link
                to="/login"
                className="w-32 justify-between rounded bg-neutral-100 px-2 py-2.5 text-sm"
              >
                <RiUserSharedLine /> <span>Se connecter</span>
              </Link>
            </>
          )}
          {isAuthenticated && (
            <button
              onClick={logout}
              className="w-32 justify-between rounded bg-neutral-100 px-2 py-2.5 text-sm"
            >
              <RiUserSharedLine /> <span>Déconnexion</span>
            </button>
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
          <ul className="mt-4 flex flex-col gap-8 rounded-lg border border-gray-100 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0">
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
  );
};

export default Navbar;
