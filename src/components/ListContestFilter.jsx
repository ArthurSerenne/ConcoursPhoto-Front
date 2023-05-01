import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { IoIosArrowDown } from "react-icons/io";

const ThemeFilter = ({ applyFilters }) => {
  const [moreCriteria, setMoreCriteria] = useState(false);
  const [themes, setThemes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({ value: null });
  const [searchValue, setSearchValue] = useState("");

  const criteriaToggle = () => {
    setMoreCriteria(!moreCriteria);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: themesData }, { data: regionsData }, { data: departmentsData }, { data: categoriesData }] = await Promise.all([
        axios.get(process.env.REACT_APP_API_URL + '/themes.json'),
        axios.get(process.env.REACT_APP_API_URL + '/regions.json'),
        axios.get(process.env.REACT_APP_API_URL + '/departments.json'),
        axios.get(process.env.REACT_APP_API_URL + '/categories.json'),
      ]);
      setThemes(themesData);
      setRegions(regionsData);
      setDepartments(departmentsData);
      setCategories(categoriesData);
    };
    fetchData();
  }, []);

  const handleThemeChange = (selectedThemes) => {
    setSelectedThemes(selectedThemes || []);
    applyFilters(selectedThemes || [], selectedStatus, searchValue);
  };
  
  const handleStatusChange = (selectedStatus) => {
    setSelectedStatus(selectedStatus || null);
    applyFilters(selectedThemes, selectedStatus || null, searchValue);
  };  

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };
  
  const handleSearchButtonClick = () => {
    applyFilters(selectedThemes, selectedStatus, searchValue);
  };  

  return (
    <div className="mx-auto mt-10 mb-12 space-y-4 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex h-[55px] mb-4 md:mb-0'>
          <input
            type="search"
            className="bg-gray-100 w-full rounded-l-lg pl-3 placeholder-black"
            placeholder="Nom du concours, thème, catégorie..."
            onChange={handleInputChange}
          />
          <button
            className="bg-gray-300 px-6 py-3 font-bold rounded-r-lg"
            onClick={handleSearchButtonClick}
          >
            Rechercher
          </button>
        </div>
        <div className='gap-6 flex flex h-[55px]'>
          <Select className="bg-gray-100 p-2 w-full" options={themes.map(theme => ({ value: theme.id, label: theme.name }))} isMulti={true} placeholder='Thèmes' onChange={handleThemeChange} />
          <Select className="bg-gray-100 p-2 w-full" options={[
            { value: 'true', label: 'concours actifs' },
            { value: 'false', label: 'concours inactifs' }
          ]} defaultValue={'true'} placeholder='Etat' isClearable={true} onChange={handleStatusChange} />
          <button className="bg-gray-300 p-2 w-full flex items-center justify-around" onClick={criteriaToggle}>
            <p>Plus de critères</p>
            <IoIosArrowDown className={`${moreCriteria ? '-rotate-180 transition duration-300' : 'rotate-0 transition duration-300'}`} />
          </button>
        </div>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-gray-300 px-8 py-5 ${moreCriteria ? '' : 'hidden'}`}>
        <div className='w-full'>
          <p>Pays</p>
          <Select className="bg-gray-100 p-2 w-full mt-2 h-[55px]" options={[
            { value: 'FR', label: 'France' },
          ]} />
        </div>
        <div className='w-full'>
          <p>Région</p>
          <Select className="bg-gray-100 p-2 w-full mt-2 h-[55px]" options={regions.map(region => ({ value: region.id, label: region.name }))} isMulti={true} />
        </div>
        <div className='w-full'>
          <p>Départements</p>
          <Select className="bg-gray-100 p-2 w-full mt-2 h-[55px]" options={departments.map(department => ({ value: department.id, label: department.name }))} isMulti={true} />
        </div>
        <div className='w-full'>
          <p>Catégorie (réservé aux)</p>
          <Select className="bg-gray-100 p-2 w-full mt-2 h-[55px]" options={categories.map(categorie => ({ value: categorie.id, label: categorie.name }))} isMulti={true} />
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
