import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../sass/components/tabs.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import ContestCardList from '../ContestCardList';
import ReactPaginate from 'react-paginate';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

const FinishedContestsTab = () => {
  const { id } = useParams();
  const location = useLocation();
  const [viewCount, setViewCount] = useState(0);
  const navigate = useNavigate();
  const passedOrganization = location.state && location.state.contest;
  const [organization, setOrganization] = useState(passedOrganization || []);
  const [sortedContests, setSortedContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const paginatedContests = sortedContests.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(0);
  };

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + `/organizations/${id}`)
      .then((res) => {
        setOrganization(res.data);
        const contests = res.data.contests;
        if (contests && contests.length > 0) {
          const activeContests = contests
            .filter(
              (contest) =>
                contest.deletionDate === undefined &&
                contest.status === true &&
                new Date(contest.resultsDate) < today
            )
            .sort(
              (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
            );
          setSortedContests(activeContests);
        }
      });
  }, [id]);

  useEffect(() => {
    if (!passedOrganization) {
      axios
        .get(process.env.REACT_APP_API_URL + `/organizations/${id}`)
        .then((res) => {
          setOrganization(res.data);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id, !passedOrganization]);

  console.log(organization);

  const goBack = () => {
    navigate(-1);
  };

  const incrementViewCount = () => {
    setViewCount(viewCount + 1);
  };

  useEffect(() => {
    incrementViewCount();
  }, []);

  return (
    <div>
      <div className="mx-auto mb-10 mt-10 grid grid-cols-1 items-center sm:max-w-screen-sm md:max-w-screen-md md:gap-6 lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <p className="text-2xl">
          {sortedContests.length} concours terminé
          {sortedContests.length > 1 ? 's' : ''}
        </p>
        {loading ? (
          <div>
            <div className="mb-10 h-[300px] w-full animate-pulse rounded-b-lg bg-gray-200 p-3 shadow-xl"></div>
            <div className="mb-10 h-[300px] w-full animate-pulse rounded-b-lg bg-gray-200 p-3 shadow-xl"></div>
            <div className="mb-10 h-[300px] w-full animate-pulse rounded-b-lg bg-gray-200 p-3 shadow-xl"></div>
          </div>
        ) : paginatedContests ? (
          paginatedContests.map((contest, index) => (
            <ContestCardList key={index} contest={contest} />
          ))
        ) : (
          ''
        )}
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
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={6}>6</option>
            <option value={8}>8</option>
          </select>
        </div>
        <ReactPaginate
          previousLabel={<RiArrowLeftSLine />}
          nextLabel={<RiArrowRightSLine />}
          breakLabel={'...'}
          pageCount={Math.ceil(sortedContests.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
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
  );
};

export default FinishedContestsTab;
