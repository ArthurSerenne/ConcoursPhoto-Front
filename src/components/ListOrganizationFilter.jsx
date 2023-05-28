import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import Switch from 'react-switch';

const ListOrganizationFilter = ({ applyFilters }) => {
    const [departments, setDepartments] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [checked, setChecked] = useState(false);
    const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  
    const loadCities = (inputValue) => {
      return axios
        .get(process.env.REACT_APP_API_URL + '/cities.json', {
          params: {
            name: inputValue,
          },
        })
        .then((res) => {
          return res.data.map((city) => ({
            value: city.id,
            label: city.name,
          }));
        });
    };
  
    const loadDepartments = (inputValue) => {
      return axios
        .get(process.env.REACT_APP_API_URL + '/departments.json', {
          params: {
            name: inputValue,
          },
        })
        .then((res) => {
          return res.data.map((department) => ({
            value: department.id,
            label: department.name,
          }));
        });
    };
  
    useEffect(() => {
      const fetchData = async () => {
        const { data: departmentsData } = await axios.get(
          process.env.REACT_APP_API_URL + '/departments.json'
        );
        setDepartments(departmentsData);
      };
      fetchData();
    }, []);
  
    const handleCityChange = (selectedCities) => {
      setSelectedCities(selectedCities || []);
      applyFilters(searchValue, selectedCities || [], selectedDepartment, checked);
    };
  
    const handleDepartmentChange = (selectedDepartment) => {
      setSelectedDepartment(selectedDepartment || []);
      applyFilters(searchValue, selectedCities, selectedDepartment || [], checked);
    };
  
    const handleInputChange = (event) => {
      setSearchValue(event.target.value);
    };
  
    const handleChange = (checked) => {
      setChecked(checked);
      applyFilters(searchValue, selectedCities, selectedDepartment, checked);
    };
  
    const handleSearchButtonClick = () => {
      setSearchButtonClicked(true);
      applyFilters(searchValue, selectedCities, selectedDepartment, checked);
    };
  
    return (
      <div className="mx-auto mt-10 mb-12 space-y-4 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
        <div className="grid grid-cols-1 md:flex flex-row justify-between gap-6">
          <div className="flex h-[55px] mb-4 md:mb-0 max-w-[500px] w-full">
            <input
              type="search"
              className="w-full rounded-l-lg bg-gray-100 pl-3 placeholder-black"
              placeholder="Nom de l'organisation, ville..."
              onChange={handleInputChange}
            />
            <button
              className="rounded-r-lg bg-gray-300 px-6 py-3 font-bold"
              onClick={handleSearchButtonClick}
            >
              Rechercher
            </button>
          </div>
          <div className="grid grid-cols-2 md:flex justify-between h-[55px] gap-6 w-full">
            <div className='w-full max-w-[200px]'>
                <Select
                placeholder="Pays"
                className="h-[55px] w-full max-w-[200px] bg-gray-100 p-2 gray-select"
                options={[{ value: 'FR', label: 'France' }]}
                />
            </div>
            <div className="w-full max-w-[200px]">
                <AsyncSelect
                    placeholder="Ville"
                    loadOptions={loadCities}
                    className="h-[55px] w-full max-w-[200px] bg-gray-100 p-2 gray-select"
                    isClearable={true}
                    isMulti={true}
                    onChange={handleCityChange}
                />
            </div>
            <div className="w-full max-w-[200px]">
                <AsyncSelect
                placeholder="Département"
                loadOptions={loadDepartments}
                className="h-[55px] w-full max-w-[200px] bg-gray-100 p-2 gray-select"
                isClearable={true}
                isMulti={true}
                onChange={handleDepartmentChange}
                defaultOptions={departments.map((department) => ({
                    value: department.id,
                    label: department.name,
                }))}
                />
            </div>
            <div className='w-full flex items-center'>
                <Switch
                    className='scale-50'
                    onChange={handleChange} 
                    checked={checked} 
                    uncheckedIcon={false}
                    checkedIcon={false}
                    offColor="#000000"
                    onColor="#959595"
                />
                <p className='text-xs'>Concours actifs uniquement</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default ListOrganizationFilter;
