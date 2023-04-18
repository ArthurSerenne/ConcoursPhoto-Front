import React from 'react';
import {Link} from 'react-router-dom';

const Navbar = () => {
    return (    
        <nav className="bg-gray-400 w-full top-0 left-0">
            <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-6">
                <a href="/" className="flex items-center bg-white p-4 rounded font-bold">
                    ConcoursPhoto.com
                </a>
                <div className="flex md:order-2 gap-2">
                    <Link to="/" className="flex flex-row items-center justify-center rounded bg-neutral-100 py-2.5 px-5 text-sm">S'inscrire</Link>
                    <Link to="/" className="flex flex-row items-center justify-center rounded bg-neutral-100 py-2.5 px-5 text-sm">Se connecter</Link>
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul className="gap-8 flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
                        <li>
                            <Link to="/" className="flex items-center text-center text-sm font-bold not-italic text-black hover:text-white">Accueil</Link>
                        </li>
                        <li>
                            <Link to="/contest" className="flex items-center text-center text-sm font-bold not-italic text-black hover:text-white">Concours photo</Link>
                        </li>
                        <li>
                            <Link to="/" className="flex items-center text-center text-sm font-bold not-italic text-black hover:text-white">Photographes</Link>
                        </li>
                        <li>
                            <Link to="/" className="flex items-center text-center text-sm font-bold not-italic text-black hover:text-white">Organisateurs</Link>
                        </li>
                        <li>
                            <Link to="/" className="flex items-center text-center text-sm font-bold not-italic text-black hover:text-white">Créez votre concours</Link>
                        </li>
                        <li>
                            <Link to="/" className="flex items-center text-center text-sm font-bold not-italic text-black hover:text-white">Blog</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
