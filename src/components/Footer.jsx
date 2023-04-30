import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div className=" max-w-screen-2xl mx-auto mt-10 mb-12 flex flex-wrap justify-between items-center">
                <div className=" w-[1010px] h-[300px] px-[360px] py-36 box-border  bg-[rgba(217,217,217,1)]">
                    <p className=" flex flex-col justify-center  border-[#000000ff] text-xs leading-3  font-inter  font-[400] text-center">
                        Pub home footer gauche
                    </p>
                </div>
                <div className=" w-[490px] h-[300px] px-[147px] py-36 box-border  bg-[rgba(217,217,217,1)]">
                    <p className=" flex flex-col justify-center  border-[#000000ff] text-xs leading-3  font-inter  font-[400] text-center">
                    Pub home footer droit
                    </p>
                </div>
            </div>
            <ul className='flex flex-row justify-center items-center gap-30 mb-10'>
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
