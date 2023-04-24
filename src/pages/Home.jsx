import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import ContestCard from '../components/ContestCard';
import ReactPaginate from 'react-paginate';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../sass/pages/home.scss";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [contests, setContests] = useState([]);
  const [members, setMembers] = useState([]);
  const [ads, setAds] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalPhotographers, setTotalPhotographers] = useState(0);
  const navigate = useNavigate();

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
  
      const uniquePhotographers = response.data.reduce((acc, contest) => {
        contest.photos?.forEach((photo) => {
          acc.add(photo.member);
        });
        return acc;
      }, new Set());
      
      setTotalPhotographers(uniquePhotographers.size);      
    };
    fetchData();
  }, []);  

  useEffect(() => {
    const fetchData = async () => {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + '/members.json'
        );
        setMembers(response.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + '/ad_spaces.json'
        );
        setAds(response.data);
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    const allOrganizations = contests.map(contest => contest.organization.id);

    const uniqueOrgSet = new Set(allOrganizations);

    setOrganizations([...uniqueOrgSet]);
  }, [contests]);

  useEffect(() => {
    const totalPhotosCount = contests.reduce(
      (total, contest) =>
        total + (contest.photos ? contest.photos.length : 0),
      0
    );

    setTotalPhotos(totalPhotosCount);
  }, [contests]);

  const handleClick = (contest) => {
    return () => {
        navigate(`/contest/${contest.id}`, { state: { contest } });
    };
};

  return (
    <div>
      <div className="max-w-screen-2xl mx-auto mt-10 mb-12 flex flex-wrap justify-between items-center">
        <div>
          <p className="text-4xl font-bold not-italic leading-[160%] text-black">Le portail des concours photo</p>
        </div>
        <div className='gap-6 flex flex-wrap justify-between align-baseline items-center'>
          <p>{contests.length} concours publiés</p>
          <p className='text-gray-300 text-2xl'>|</p>
          <p>{organizations.length} organisateurs</p>
          <p className='text-gray-300 text-2xl'>|</p>
          <p>{totalPhotographers} photographes</p>
          <p className='text-gray-300 text-2xl'>|</p>
          <p>{totalPhotos} photos</p>
          <p className='text-gray-300 text-2xl'>|</p>
          <p>{members.length} membres</p>
        </div>
      </div>
      <div className="flex items-center justify-center">
      <div className="w-full md:w-2/3 flex flex-col md:flex-row items-center justify-center">
        <div className="w-[861px] h-[542px] md:w-2/3">
        <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {contests
            .filter(
              (contest) =>
                contest.deletionDate === undefined && contest.trend === true
            )
            .map((contest) => (
              <SwiperSlide><img src={contest.visual} alt={contest.name} onClick={handleClick(contest)} className='hover:cursor-pointer' /></SwiperSlide>
            ))}
        </Swiper>
        </div>
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center md:pl-8">
        {ads
            .map((ad) => (
              <div className='w-[421px] h-[262px] mb-2 mt-2 bg-gray-200 flex flex-col items-center justify-center'>
                <p>{ad.name}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
      <div className="max-w-screen-2xl mx-auto mt-12 mb-12">
        <p className="text-3xl mb-12">Derniers concours photo publiés</p>
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
            previousLabel={"<"}
            nextLabel={">"}
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
            nextClassName={"page-item mx-1"}
            pageLinkClassName={"page-link px-4 py-3 bg-gray-200 rounded-full hover:bg-gray-100"}
            previousLinkClassName={"bg-gray-200 px-4 p-3 rounded-full hover:bg-gray-100"}
            nextLinkClassName={"bg-gray-200 px-4 p-3 rounded-full hover:bg-gray-100"}
            forcePage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
