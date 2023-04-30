import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ContestCard from '../components/ContestCard';
import ReactPaginate from 'react-paginate';
import ThemeFilter from '../components/filter';
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";

const ListContest = () => {
    const [contests, setContests] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(0);
  };
  
  const totalPages = Math.ceil(contests.length / itemsPerPage);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const sortedContests = contests.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + '/contests.json'
      );
      setContests(response.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="max-w-screen-2xl mx-auto mt-10 mb-12 flex flex-wrap justify-between items-center">
        <div>
          <p className="text-4xl font-bold not-italic leading-[160%] text-black">Rechercher un concours photo</p>
        </div>
      </div>
      <div>
        <ThemeFilter />
      </div>
      <div className="max-w-screen-2xl mx-auto mt-12 mb-12">
        <p>{contests.length} Résultats</p>
        <div className="grid grid-cols-3 gap-5">
          {sortedContests
            .filter(
              (contest) =>
                contest.deletionDate === undefined
            )
            .slice(currentPage * itemsPerPage, (currentPage * itemsPerPage) + itemsPerPage)
            .map((contest) => (
              <ContestCard contest={contest} key={contest.id} />
            ))}
        </div>
        <div>
          <div className="mt-6 mb-6">
            <label htmlFor="items-per-page" className="mr-2">
              Afficher par :
            </label>
            <select
              name="items-per-page"
              id="items-per-page"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="rounded border px-2 py-1"
            >
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
          </div>
          <ReactPaginate
            previousLabel={<RiArrowLeftSLine />}
            nextLabel={<RiArrowRightSLine />}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"flex items-center place-content-center justify-center content-center justify-self-center"}
            activeClassName={"text-black"}
            breakClassName={"mx-2"}
            pageClassName={"page-item mx-1"}
            previousClassName={"page-item mx-1"}
            nextClassName={"page-item mx-1 text-lg"}
            pageLinkClassName={"page-link px-4 pt-2.5 pb-3 bg-gray-200 rounded-full text-xl hover:bg-gray-100"}
            previousLinkClassName={"bg-gray-200 px-2.5 pt-2 pb-2.5 text-2xl rounded-full hover:bg-gray-100"}
            nextLinkClassName={"bg-gray-200 px-2.5 pt-2 pb-2.5 text-2xl rounded-full hover:bg-gray-100"}
            forcePage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ListContest;