import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div className="mx-auto mt-10 mb-12 flex flex-wrap justify-between items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <div className="w-full md:w-[1010px] h-[300px] bg-[rgba(217,217,217,1)]">
                    <img src='https://blog.auto-selection.com/wp-content/uploads/2018/03/DS-7-CROSSBACK-Launch-Campaign-vF.png' alt='' className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-[490px] h-[300px] mt-5 md:mt-0 box-border bg-[rgba(217,217,217,1)]">
                    <img src='https://foodgeekandlove.fr/wp-content/uploads/2015/06/choose-happiness-coca-cola.jpg' alt='' className="w-full h-full object-cover" />
                </div>
            </div>
            <ul className='flex flex-col md:flex-row justify-center items-center gap-5 md:gap-30 mb-10'>
                <li className="font-bold not-italic text-sm">
                    <Link to="/">ConcoursPhotos.com &copy; Tous droits réservés</Link>
                </li>
                <li className='not-italic font-normal text-sm flex items-center text-center text-black'>
                    <Link to="/">A propos</Link>
                </li>
                <li className='not-italic font-normal text-sm flex items-center text-center text-black'>
                    <Link to="/">Mentions légales</Link>
                </li>
                <li className='not-italic font-normal text-sm flex items-center text-center text-black'>
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
