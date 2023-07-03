import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="mx-auto mb-12 mt-10 flex flex-wrap items-center justify-between sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div className="h-[300px] w-full bg-[rgba(217,217,217,1)] md:w-[1010px]">
          <img
            src="https://blog.auto-selection.com/wp-content/uploads/2018/03/DS-7-CROSSBACK-Launch-Campaign-vF.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-5 box-border h-[300px] w-full bg-[rgba(217,217,217,1)] md:mt-0 md:w-[490px]">
          <img
            src="https://foodgeekandlove.fr/wp-content/uploads/2015/06/choose-happiness-coca-cola.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <ul className="mb-10 flex flex-col items-center justify-center gap-5 md:flex-row md:gap-30">
        <li className="text-sm font-bold not-italic">
          <Link to="/">ConcoursPhotos.com &copy; Tous droits réservés</Link>
        </li>
        <li className="flex items-center text-center text-sm font-normal not-italic text-black">
          <Link to="/">A propos</Link>
        </li>
        <li className="flex items-center text-center text-sm font-normal not-italic text-black">
          <Link to="/">Mentions légales</Link>
        </li>
        <li className="flex items-center text-center text-sm font-normal not-italic text-black">
          <Link to="/">Données personnelles</Link>
        </li>
        <li className="flex items-center text-center text-sm font-normal not-italic text-black">
          <Link to="/">Annoncer sur ce site</Link>
        </li>
        <li className="flex items-center text-center text-sm font-normal not-italic text-black">
          <Link to="/">Nous contacter</Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
