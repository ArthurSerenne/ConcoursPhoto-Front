import React, { useState } from 'react';

const ListPhotographerFilter = ({ applyFilters }) => {
    const [searchValue, setSearchValue] = useState('');
  
    const handleInputChange = (event) => {
      setSearchValue(event.target.value);
    };

    const handleSearchButtonClick = () => {
      applyFilters(searchValue);
    };
  
    return (
      <div className="mx-auto mt-10 mb-12 space-y-4 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
        <div className="grid grid-cols-1 md:flex flex-row justify-between gap-6">
          <div className="flex h-[55px] mb-4 md:mb-0 max-w-[650px] w-full">
            <input
              type="search"
              className="w-full rounded-l-lg bg-gray-100 pl-3 placeholder-black"
              placeholder="Nom du photographe, prénom, pseudo..."
              onChange={handleInputChange}
            />
            <button
              className="rounded-r-lg bg-gray-300 px-6 py-3 font-bold"
              onClick={handleSearchButtonClick}
            >
              Rechercher
            </button>
          </div>
        </div>
      </div>
    );
  };

export default ListPhotographerFilter;
