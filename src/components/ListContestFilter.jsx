import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { IoIosArrowDown } from "react-icons/io";

const ThemeFilter = () => {
  const [moreCriteria, setMoreCriteria] = useState(false);
  const [themes, setThemes] = useState([]);

  const criteriaToggle = () => {
    setMoreCriteria(!moreCriteria);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: themesData } = await axios.get(process.env.REACT_APP_API_URL + '/themes.json');
      setThemes(themesData);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto mt-10 mb-12 space-y-4">
      <div className='grid grid-cols-2 gap-6'>
        <div className='flex h-[55px]'>
          <input
            type="search"
            className="bg-gray-100 w-full rounded-l-lg pl-2 placeholder-black"
            placeholder="Nom du concours, thème, catégorie..."
          />
          <button className='bg-gray-300 px-6 py-3 font-bold rounded-r-lg'>Rechercher</button>
        </div>
        <div className='gap-6 flex flex h-[55px]'>
          <Select className="bg-gray-100 p-2 w-full" options={themes.map(theme => ({ value: theme.id, label: theme.name }))} isMulti={true} placeholder='Thèmes: tous' Va />
          <Select className="bg-gray-100 p-2 w-full" />
          <button className="bg-gray-300 p-2 w-full flex items-center justify-around" onClick={criteriaToggle}>
            <p>Plus de critères</p>
            <IoIosArrowDown className={`${moreCriteria ? '-rotate-180 transition duration-300' : 'rotate-0 transition duration-300'}`} />
          </button>
        </div>
      </div>
      <div className={`flex gap-4 bg-gray-300 px-8 py-5 ${moreCriteria ? '' : 'hidden'}`}>
        <div className='w-full'>
          <p>Pays</p>
          <Select className="bg-gray-100 p-2 w-full mt-2 h-[55px]" />
        </div>
        <div className='w-full'>
          <p>Région</p>
          <Select className="bg-gray-100 p-2 w-full mt-2 h-[55px]" />
        </div>
        <div className='w-full'>
          <p>Départements</p>
          <Select className="bg-gray-100 p-2 w-full mt-2 h-[55px]" />
        </div>
        <div className='w-full'>
          <p>Catégorie (réservé aux)</p>
          <Select className="bg-gray-100 p-2 w-full mt-2 h-[55px]" />
        </div>
        <div className='w-full'>
          <p>Âge (réservé aux)</p>
          <Select className="bg-gray-100 p-2 w-full mt-2 h-[55px]" />
        </div>
        <div className='w-full'>
          <p>Prix/dotations</p>
          <Select className="bg-gray-100 p-2 w-full mt-2 h-[55px]" />
        </div>
      </div>
    </div>
  );
};

export default ThemeFilter;
