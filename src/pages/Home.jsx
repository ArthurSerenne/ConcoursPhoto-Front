import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper';
import ContestCard from '../components/ContestCard';
import ContestCardSkeleton from '../components/ContestCardSkeleton';
import SwiperSlideSkeleton from '../components/SwiperSlideSkeleton';
import AdSpaceSkeleton from '../components/AdSpaceSkeleton';
import ReactPaginate from 'react-paginate';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../sass/pages/home.scss';
import { useNavigate } from 'react-router-dom';
import ImageDisplay from '../components/ImageDisplay';
import { RiArrowRightSLine, RiArrowLeftSLine } from 'react-icons/ri';

const Home = () => {
  const [contests, setContests] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAds, setLoadingAds] = useState(true);
  const [ads, setAds] = useState([]);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [totalOrganizations, setTotalOrganizations] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalPhotographers, setTotalPhotographers] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: contestsData }, { data: membersData }, { data: adsData }] =
        await Promise.all([
          axios.get(process.env.REACT_APP_API_URL + '/contests.json'),
          axios.get(process.env.REACT_APP_API_URL + '/members.json'),
          axios.get(process.env.REACT_APP_API_URL + '/ad_spaces.json'),
        ]);

      setContests(contestsData);
      setLoading(false);
      setMembers(membersData);
      setAds(adsData);
      setLoadingAds(false);

      const uniquePhotographers = new Set();

      contestsData.forEach((contest) => {
        contest.photos?.forEach((photo) => {
          uniquePhotographers.add(photo.member.id);
        });
      });

      const uniqueOrganizations = contestsData.reduce((acc, contest) => {
        acc.add(contest.organization.id);
        return acc;
      }, new Set());

      setTotalPhotos(
        contestsData.reduce(
          (total, contest) =>
            total + (contest.photos ? contest.photos.length : 0),
          0
        )
      );
      setTotalPhotographers(uniquePhotographers.size);
      setTotalOrganizations(uniqueOrganizations.size);
    };
    fetchData();
  }, []);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(0);
  };

  const totalPages = Math.ceil(contests.length / itemsPerPage);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const sortedContests = contests.sort(
    (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
  );

  const handleClick = (contest) => {
    return () => {
      navigate(`/concours-photo/${contest.id}`, { state: { contest } });
    };
  };

  return (
    <div>
      <div className="mx-auto mb-12 mt-10 flex max-w-screen-2xl flex-wrap items-center justify-between">
        <div>
          <p className="text-4xl font-bold not-italic leading-[160%] text-black">
            Le portail des concours photo
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-6 align-baseline">
          <p>{contests.length} concours publiés</p>
          <p className="text-2xl text-gray-300">|</p>
          <p>{totalOrganizations} organisateurs</p>
          <p className="text-2xl text-gray-300">|</p>
          <p>{totalPhotographers} photographes</p>
          <p className="text-2xl text-gray-300">|</p>
          <p>{totalPhotos} photos</p>
          <p className="text-2xl text-gray-300">|</p>
          <p>{members.length} membres</p>
        </div>
      </div>
      <div className="mx-auto mb-10 mt-10 grid max-w-screen-2xl grid-cols-3 gap-12">
        <div className="relative col-span-2 h-full max-h-[36rem]">
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
            className="mySwiper h-full w-full"
          >
            {loading
              ? Array.from({ length: 5 }, (_, i) => (
                  <SwiperSlide key={i} className="h-[450px]">
                    <SwiperSlideSkeleton />
                  </SwiperSlide>
                ))
              : contests
                  .filter(
                    (contest) =>
                      contest.deletionDate === undefined &&
                      contest.trend === true
                  )
                  .map((contest) => (
                    <SwiperSlide
                      key={contest.id}
                      onClick={handleClick(contest)}
                      className="h-[450px] hover:cursor-pointer"
                    >
                      <ImageDisplay
                        key={contest.id}
                        imageName={contest.visual}
                      />
                    </SwiperSlide>
                  ))}
          </Swiper>
        </div>
        <div className="col-span-1 flex h-full flex-col space-y-7">
          {loadingAds
            ? Array.from({ length: 2 }, (_, i) => (
                <div
                  key={i}
                  className="flex max-h-[18rem] flex-grow items-center justify-center"
                >
                  <AdSpaceSkeleton />
                </div>
              ))
            : ads.map((ad, index) => (
                <div
                  key={index}
                  className="flex max-h-[18rem] flex-grow items-center justify-center"
                >
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gray-200">
                    <p>{ad.name}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
      <div className="mx-auto mb-12 mt-12 max-w-screen-2xl">
        <p className="mb-12 text-3xl">Derniers concours photo publiés</p>
        <div className="grid grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: itemsPerPage }, (_, i) => (
                <ContestCardSkeleton key={i} />
              ))
            : sortedContests
                .filter((contest) => contest.deletionDate === undefined)
                .slice(
                  currentPage * itemsPerPage,
                  currentPage * itemsPerPage + itemsPerPage
                )
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

export default Home;
