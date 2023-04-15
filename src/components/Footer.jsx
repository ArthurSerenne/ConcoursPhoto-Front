import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <ul className='flex flex-row justify-center items-center gap-30'>
                <li className="font-bold not-italic text-sm">
                    <Link to="/">ConcoursPhotos.com &copy; Tous droits réservés</Link>
                </li>
                <li className='not-italic font-normal text-sm flex items-center text-center text-black'>
                    <Link to="/">A propos</Link>
                </li>
                <li className='not-italic font-normal text-sm flex items-center text-center text-black'>
                    <Link to="/">Mentions légales</Link>
                </li>
                <li>
                    <Link to="/">Données personnelles</Link>
                </li>
                <li className='not-italic font-normal text-sm flex items-center text-center text-black'>
                    <Link to="/">Annoncer sur ce site</Link>
                </li>
                <li className='not-italic font-normal text-sm flex items-center text-center text-black'>
                    <Link to="/">Nous contacter</Link>
                </li>
            </ul>
        </footer>
    );
};

export default Footer;
