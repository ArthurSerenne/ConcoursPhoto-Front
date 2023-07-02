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
    <div className="mx-auto mb-12 mt-10 space-y-4 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
      <div className="grid grid-cols-1 flex-row justify-between gap-6 md:flex">
        <div className="mb-4 flex h-[55px] w-full max-w-[650px] md:mb-0">
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
