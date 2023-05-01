import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiUserAddLine, RiUserSharedLine, RiMenu3Line, RiCloseLine } from 'react-icons/ri';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-gray-400 w-full top-0 left-0">
            <div className="flex flex-wrap items-center justify-between mx-auto p-6 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <a href="/" className="flex items-center bg-white px-8 py-4 rounded font-bold">
                    ConcoursPhoto.com
                </a>
                <div className="flex md:order-2 gap-2">
                    <Link to="/" className="justify-between rounded bg-neutral-100 py-2.5 px-2 text-sm w-32"><RiUserAddLine /> <span>S'inscrire</span></Link>
                    <Link to="/" className="justify-between rounded bg-neutral-100 py-2.5 px-2 text-sm w-32"><RiUserSharedLine /> <span>Se connecter</span></Link>
                </div>
                <button className="md:hidden flex items-center p-1 rounded" onClick={toggleMenu}>
                    {isMenuOpen ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
                </button>
                <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? 'flex' : 'hidden'}`} id="navbar-sticky">
                    <ul className="gap-8 flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
                        <li>
                            <Link to="/" className="flex items-center text-center text-sm font-bold not-italic text-black hover:underline underline-offset-8 hover:text-white">Accueil</Link>
                        </li>
                        <li>
                            <Link to="/concours-photo" className="flex items-center text-center text-sm font-bold not-italic text-black hover:underline underline-offset-8 hover:text-white">Concours photo</Link>
                        </li>
                        <li>
                            <Link to="/" className="flex items-center text-center text-sm font-bold not-italic text-black hover:underline underline-offset-8 hover:text-white">Photographes</Link>
                        </li>
                        <li>
                            <Link to="/" className="flex items-center text-center text-sm font-bold not-italic text-black hover:underline underline-offset-8 hover:text-white">Organisateurs</Link>
                        </li>
                        <li>
                            <Link to="/" className="flex items-center text-center text-sm font-bold not-italic text-black hover:underline underline-offset-8 hover:text-white">Créez votre concours</Link>
                        </li>
                        <li>
                            <Link to="/" className="flex items-center text-center text-sm font-bold not-italic text-black hover:underline underline-offset-8 hover:text-white">Blog</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;