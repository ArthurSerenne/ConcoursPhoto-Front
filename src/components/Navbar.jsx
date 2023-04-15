import React from 'react';
import {Link} from 'react-router-dom';
import ConcoursPhotoHeader from '../assets/images/concoursphoto.png';

const Navbar = () => {
    return (
        <nav className="bg-regal-grey h-24">
            <div className="pt-6">
                <img
                    src={ConcoursPhotoHeader}
                    className="absolute ml-3 h-6 rounded sm:h-9"
                    alt="logo"
                />
            </div>
            <div className="flex flex-row justify-center items-center gap-35">
            <Link to="/" className="flex items-center text-center text-sm font-bold not-italic text-black">Accueil</Link>
            <Link to="/contest" className="flex items-center text-center text-sm font-bold not-italic text-black">Concours photo</Link>
            <Link to="/" className="flex items-center text-center text-sm font-bold not-italic text-black">Photographes</Link>
            <Link to="/" className="flex items-center text-center text-sm font-bold not-italic text-black">Organisateurs</Link>
            <Link to="/" className="flex items-center text-center text-sm font-bold not-italic text-black">Créez votre concours</Link>
            <Link to="/" className="flex flex-row items-center justify-center rounded bg-neutral-100 py-2.5 px-5">S'inscrire</Link>
            <Link to="/" className="flex flex-row items-center justify-center rounded bg-neutral-100 py-2.5 px-5">Se connecter</Link>
            </div>
        </nav>
    );
};

export default Navbar;
