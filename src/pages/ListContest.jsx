import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ContestCard from '../components/ContestCard';
import ReactPaginate from 'react-paginate';
import ThemeFilter from '../components/ListContestFilter';
import ContestCardSkeleton from '../components/ContestCardSkeleton';
import { RiArrowRightSLine, RiArrowLeftSLine } from 'react-icons/ri';

const ListContest = () => {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [filterValues, setFilterValues] = useState({
    themes: [],
    status: { value: null },
    search: '',
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [loading, setLoading] = useState(true);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(0);
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + '/contests.json'
      );
      setContests(response.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (contests.length === 0) return;

    const today = new Date();
    const filtered = contests.filter((contest) => {
      const themesMatch =
        filterValues.themes.length === 0 ||
        filterValues.themes.some((theme) =>
          contest.themes.some((t) => t.id === theme.value)
        );

      const searchMatch =
        filterValues.search.trim() === '' ||
        contest.name
          .toLowerCase()
          .includes(filterValues.search.trim().toLowerCase()) ||
        contest.themes.some((t) =>
          t.name
            .toLowerCase()
            .includes(filterValues.search.trim().toLowerCase())
        );

        let statusMatch = false;

        switch (filterValues.status?.value) {
          case 'active':
            statusMatch = true;
            break;
          case 'publication':
            statusMatch = new Date(contest.publicationDate) > today;
            break;
          case 'vote':
            statusMatch =
              new Date(contest.votingStartDate) <= today &&
              new Date(contest.votingEndDate) >= today;
            break;
          case 'submission':
            statusMatch =
              new Date(contest.submissionStartDate) <= today &&
              new Date(contest.submissionEndDate) >= today;
            break;
          default:
            statusMatch = true;
        }
    
        return (
          contest.deletionDate === undefined &&
          themesMatch &&
          statusMatch &&
          searchMatch
        );
      });
      setFilteredContests(filtered);
    }, [contests, filterValues]);

  const applyFilters = (themes, status, search) => {
    setFilterValues({ themes, status, search });
  };

  const sortedContests = filteredContests.filter((contest) => contest.status === true).sort(
    (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
  );

  const totalPages = Math.ceil(sortedContests.length / itemsPerPage);

  return (
    <div className='mx-6 md:mx-24'>
      <div className="mx-auto mt-10 mb-12 flex flex-wrap justify-between items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
        <div>
          <p className="text-4xl font-bold not-italic leading-[160%] text-black">
            Rechercher un concours photo
          </p>
        </div>
      </div>
      <div>
        <ThemeFilter applyFilters={applyFilters} />
      </div>
      <div className="mx-auto mt-12 mb-12 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
        <p className='text-3xl mb-8'>{sortedContests.length} résultats</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: itemsPerPage }, (_, i) => (
              <ContestCardSkeleton key={i} />
            ))
          : sortedContests
            .slice(currentPage * itemsPerPage, (currentPage * itemsPerPage) + itemsPerPage)
            .map((contest) => (
              <ContestCard contest={contest} key={contest.id} />
            ))}
        </div>
        <div>
          <div className="mb-6 mt-6">
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
            breakLabel={'...'}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={
              'flex items-center place-content-center justify-center content-center justify-self-center'
            }
            activeClassName={'text-black'}
            breakClassName={'mx-2'}
            pageClassName={'page-item mx-1'}
            previousClassName={'page-item mx-1'}
            nextClassName={'page-item mx-1 text-lg'}
            pageLinkClassName={
              'page-link px-4 pt-2.5 pb-3 bg-gray-200 rounded-full text-xl hover:bg-gray-100'
            }
            previousLinkClassName={
              'bg-gray-200 px-2.5 pt-2 pb-2.5 text-2xl rounded-full hover:bg-gray-100'
            }
            nextLinkClassName={
              'bg-gray-200 px-2.5 pt-2 pb-2.5 text-2xl rounded-full hover:bg-gray-100'
            }
            forcePage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ListContest;
