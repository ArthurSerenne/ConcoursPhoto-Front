import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className=" mx-auto mb-12 mt-10 flex max-w-screen-2xl flex-wrap items-center justify-between">
        <div className=" box-border h-[300px] w-[1010px] bg-[rgba(217,217,217,1)] px-[360px]  py-36">
          <p className=" font-inter flex flex-col  justify-center border-[#000000ff] text-center  text-xs  font-[400] leading-3">
            Pub home footer gauche
          </p>
        </div>
        <div className=" box-border h-[300px] w-[490px] bg-[rgba(217,217,217,1)] px-[147px]  py-36">
          <p className=" font-inter flex flex-col  justify-center border-[#000000ff] text-center  text-xs  font-[400] leading-3">
            Pub home footer droit
          </p>
        </div>
      </div>
      <ul className="mb-10 flex flex-row items-center justify-center gap-30">
        <li className="text-sm font-bold not-italic">
          <Link to="/">ConcoursPhotos.com &copy; Tous droits réservés</Link>
        </li>
        <li className="flex items-center text-center text-sm font-normal not-italic text-black">
          <Link to="/">A propos</Link>
        </li>
        <li className="flex items-center text-center text-sm font-normal not-italic text-black">
          <Link to="/">Mentions légales</Link>
        </li>
        <li>
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
