import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { IoIosArrowDown } from 'react-icons/io';

const ThemeFilter = ({ applyFilters }) => {
  const [moreCriteria, setMoreCriteria] = useState(false);
  const [themes, setThemes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({ value: null });
  const [searchValue, setSearchValue] = useState('');

  const criteriaToggle = () => {
    setMoreCriteria(!moreCriteria);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [
        { data: themesData },
        { data: regionsData },
        { data: departmentsData },
        { data: categoriesData },
      ] = await Promise.all([
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
    <div className="mx-auto mb-12 mt-10 max-w-screen-2xl space-y-4">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex h-[55px]">
          <input
            type="search"
            className="w-full rounded-l-lg bg-gray-100 pl-3 placeholder-black"
            placeholder="Nom du concours, thème, catégorie..."
            onChange={handleInputChange}
          />
          <button
            className="rounded-r-lg bg-gray-300 px-6 py-3 font-bold"
            onClick={handleSearchButtonClick}
          >
            Rechercher
          </button>
        </div>
        <div className="flex flex h-[55px] gap-6">
          <Select
            className="w-full bg-gray-100 p-2"
            options={themes.map((theme) => ({
              value: theme.id,
              label: theme.name,
            }))}
            isMulti={true}
            placeholder="Thèmes"
            onChange={handleThemeChange}
          />
          <Select
            className="w-full bg-gray-100 p-2"
            options={[
              { value: 'true', label: 'concours actifs' },
              { value: 'false', label: 'concours inactifs' },
            ]}
            defaultValue={'true'}
            placeholder="Etat"
            isClearable={true}
            onChange={handleStatusChange}
          />
          <button
            className="flex w-full items-center justify-around bg-gray-300 p-2"
            onClick={criteriaToggle}
          >
            <p>Plus de critères</p>
            <IoIosArrowDown
              className={`${
                moreCriteria
                  ? '-rotate-180 transition duration-300'
                  : 'rotate-0 transition duration-300'
              }`}
            />
          </button>
        </div>
      </div>
      <div
        className={`flex gap-4 bg-gray-300 px-8 py-5 ${
          moreCriteria ? '' : 'hidden'
        }`}
      >
        <div className="w-full">
          <p>Pays</p>
          <Select
            className="mt-2 h-[55px] w-full bg-gray-100 p-2"
            options={[{ value: 'FR', label: 'France' }]}
          />
        </div>
        <div className="w-full">
          <p>Région</p>
          <Select
            className="mt-2 h-[55px] w-full bg-gray-100 p-2"
            options={regions.map((region) => ({
              value: region.id,
              label: region.name,
            }))}
            isMulti={true}
          />
        </div>
        <div className="w-full">
          <p>Départements</p>
          <Select
            className="mt-2 h-[55px] w-full bg-gray-100 p-2"
            options={departments.map((department) => ({
              value: department.id,
              label: department.name,
            }))}
            isMulti={true}
          />
        </div>
        <div className="w-full">
          <p>Catégorie (réservé aux)</p>
          <Select
            className="mt-2 h-[55px] w-full bg-gray-100 p-2"
            options={categories.map((categorie) => ({
              value: categorie.id,
              label: categorie.name,
            }))}
            isMulti={true}
          />
        </div>
        <div className="w-full">
          <p>Âge (réservé aux)</p>
          <Select className="mt-2 h-[55px] w-full bg-gray-100 p-2" />
        </div>
        <div className="w-full">
          <p>Prix/dotations</p>
          <Select className="mt-2 h-[55px] w-full bg-gray-100 p-2" />
        </div>
      </div>
    </div>
  );
};

export default ThemeFilter;
