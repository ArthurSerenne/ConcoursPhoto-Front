import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { IoIosArrowDown } from 'react-icons/io';
import AsyncSelect from 'react-select/async';
import Slider from "react-slider";

const ThemeFilter = ({ applyFilters }) => {
  const [moreCriteria, setMoreCriteria] = useState(false);
  const [themes, setThemes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({ value: null });
  const [searchValue, setSearchValue] = useState('');
  const [selectedAge, setSelectedAge] = useState([0, 100]);

  const criteriaToggle = () => {
    setMoreCriteria(!moreCriteria);
  };

  const loadDepartments = (inputValue) => {
    return axios.get(process.env.REACT_APP_API_URL + '/departments.json', {
        params: {
            name: inputValue
        }
    }).then(res => {
        return res.data.map(department => ({
            value: department.id,
            label: department.name
        }));
    });
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
    applyFilters(selectedThemes || [], selectedStatus, searchValue, selectedRegions, selectedCategory, selectedDepartment, selectedAge);
  };

  const handleRegionChange = (selectedRegions) => {
    setSelectedRegions(selectedRegions || []);
    applyFilters(selectedThemes, selectedStatus, searchValue, selectedRegions || [], selectedCategory, selectedDepartment, selectedAge);
  }

  const handleCategoryChange = (selectedCategory) => {
    setSelectedCategory(selectedCategory || []);
    applyFilters(selectedThemes, selectedStatus, searchValue, selectedRegions, selectedCategory || [], selectedDepartment, selectedAge);
  }

  const handleDepartmentChange = (selectedDepartment) => {
    setSelectedDepartment(selectedDepartment || []);
    applyFilters(selectedThemes, selectedStatus, searchValue, selectedRegions, selectedCategory, selectedDepartment || [], selectedAge);
  }

  const handleStatusChange = (selectedStatus) => {
    setSelectedStatus(selectedStatus || null);
    applyFilters(selectedThemes, selectedStatus || null, searchValue, selectedRegions, selectedCategory, selectedDepartment, selectedAge);
  };

  const handleAgeChange = (selectedAge) => {
    setSelectedAge(selectedAge);
    applyFilters(selectedThemes, selectedStatus, searchValue, selectedRegions, selectedCategory, selectedDepartment, selectedAge || [0, 100]);
  };

  const handleSearchButtonClick = () => {
    applyFilters(selectedThemes, selectedStatus, searchValue, selectedRegions, selectedCategory, selectedDepartment, selectedAge);
  };

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="mx-auto mt-10 mb-12 space-y-4 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex h-[55px] mb-4 md:mb-0'>
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
        <div className="flex h-[55px] gap-6">
          <Select
            className="w-full bg-gray-100 p-2 gray-select"
            options={themes.map((theme) => ({
              value: theme.id,
              label: theme.name,
            }))}
            isMulti={true}
            placeholder="Thèmes"
            onChange={handleThemeChange}
          />
          <Select
            className="w-full bg-gray-100 p-2 gray-select"
            options={[
              { value: 'active', label: 'Concours actifs' },
              { value: 'publication', label: 'En phase de publication' },
              { value: 'vote', label: 'En phase de vote' },
              { value: 'submission', label: 'En phase de soumission' },
              { value: 'result', label: 'En phase de résultat' },
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
      <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-gray-300 px-8 py-5 ${moreCriteria ? '' : 'hidden'}`}>
        <div className='w-full'>
          <p>Pays</p>
          <Select
            className="mt-2 h-[55px] w-full bg-gray-100 p-2 gray-select"
            options={[{ value: 'FR', label: 'France' }]}
          />
        </div>
        <div className="w-full">
          <p>Région</p>
          <Select
            className="mt-2 h-[55px] w-full bg-gray-100 p-2 gray-select"
            options={regions.map((region) => ({
              value: region.id,
              label: region.name,
            }))}
            isMulti={true}
            onChange={handleRegionChange}
          />
        </div>
        <div className="w-full">
          <p>Départements</p>
          <AsyncSelect
            loadOptions={loadDepartments}
            className="mt-2 h-[55px] w-full bg-gray-100 p-2 gray-select"
            isClearable={true}
            isMulti={true}
            onChange={handleDepartmentChange}
            defaultOptions={departments.map((region) => ({
              value: region.id,
              label: region.name,
            }))}
          />
        </div>
        <div className="w-full">
          <p>Catégorie (réservé aux)</p>
          <Select
            className="mt-2 h-[55px] w-full bg-gray-100 p-2 gray-select"
            options={categories.map((categorie) => ({
              value: categorie.id,
              label: categorie.name,
            }))}
            isMulti={true}
            onChange={handleCategoryChange}
          />
        </div>
        <div className="w-full">
          <p>Âge (réservé aux)</p>
          <Slider
            value={selectedAge}
            className="horizontal-slider mt-2 h-[55px] w-full bg-gray-100 p-2 gray-select"
            renderThumb={(props, state) => <div {...props} >{state.valueNow}</div>}
            pearling
            min={0}
            max={100}
            ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
            renderTrack={(props) => (
              <div {...props} className='mx-2 mt-5 h-1 bg-gray-400 rounded-full' />
            )}
            minDistance={1}
            withTracks
            onChange={handleAgeChange}
          />
        </div>
        <div className="w-full">
          <p>Prix/dotations</p>
          <Select className="mt-2 h-[55px] w-full bg-gray-100 p-2 gray-select" />
        </div>
      </div>
    </div>
  );
};

export default ThemeFilter;
