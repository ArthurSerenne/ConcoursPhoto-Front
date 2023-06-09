import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper';
import ContestCard from '../components/ContestCard';
import ContestCardList from '../components/ContestCardList';
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
import { BsGrid3X3GapFill } from 'react-icons/bs';
import { FaList } from 'react-icons/fa';
import { TbMap2 } from 'react-icons/tb';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

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

      contestsData
        .filter(
          (contest) => contest.status === true && contest.deletionDate !== null
        )
        .forEach((contest) => {
          contest.photos
            ?.filter((photo) => photo.status === true)
            .forEach((photo) => {
              uniquePhotographers.add(photo.member.id);
            });
        });

      const uniqueOrganizations = contestsData
        .filter(
          (contest) =>
            contest.status === true && contest.deletionDate === undefined
        )
        .reduce((acc, contest) => {
          acc.add(contest.organization.id);
          return acc;
        }, new Set());

      setTotalPhotos(
        contestsData
          .filter(
            (contest) =>
              contest.status === true && contest.deletionDate === undefined
          )
          .reduce(
            (total, contest) =>
              total +
              (contest.photos.filter((photo) => photo.status === true)
                ? contest.photos.filter((photo) => photo.status === true).length
                : 0),
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

  const totalPages = Math.ceil(
    contests.filter(
      (contest) => contest.status === true && contest.deletionDate === undefined
    ).length / itemsPerPage
  );

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const sortedContests = contests
    .filter(
      (contest) => contest.status === true && contest.deletionDate === undefined
    )
    .sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

  const handleClick = (contest) => {
    return async () => {
      const viewCount = contest.view ? contest.view + 1 : 1;

      await axios.patch(
        `${process.env.REACT_APP_API_URL}/contests/${contest.id}`,
        { view: viewCount },
        {
          headers: {
            'Content-Type': 'application/merge-patch+json',
          },
        }
      );

      navigate(`/concours-photo/${contest.id}`, {
        state: { contest: { ...contest, view: viewCount } },
      });
    };
  };

  const [isGridMode, setIsGridMode] = useState(true);
  const [isMap, setIsMap] = useState(false);

  return (
    <div className="mx-6 md:mx-24">
      <div className="mx-auto mb-12 mt-10 flex flex-wrap items-center justify-between sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div>
          <p className="text-4xl font-bold not-italic leading-[160%] text-black">
            Le portail des concours photo
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-6 align-baseline">
          <p>{sortedContests.length} concours publiés</p>
          <p className="text-2xl text-gray-300">|</p>
          <p>{totalOrganizations} organisateurs</p>
          <p className="text-2xl text-gray-300">|</p>
          <p>{totalPhotographers} photographes</p>
          <p className="text-2xl text-gray-300">|</p>
          <p>{totalPhotos} photos</p>
          <p className="text-2xl text-gray-300">|</p>
          <p>
            {members.filter((member) => member.status === true).length} membres
          </p>
        </div>
      </div>
      <div className="mx-auto mb-10 mt-10 grid grid-cols-1 gap-12 sm:max-w-screen-sm md:max-w-screen-md md:grid-cols-3 lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div className="relative h-full max-h-[36rem] md:col-span-2">
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
        <div className="col-span-1 flex h-full flex-row space-y-8 md:flex-col md:space-x-0">
          <div className="flex max-h-[18rem] flex-grow items-center justify-center">
            <div className="flex h-full w-full flex-col items-center justify-center bg-gray-200">
              <img
                src="https://cloudfront-eu-central-1.images.arcpublishing.com/ipmgroup/EDA47HSGDFDVHO3MU673WQDYTM.jpg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex max-h-[18rem] flex-grow items-center justify-center">
            <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gray-200">
              <img
                src="https://www.usine-digitale.fr/mediatheque/4/2/3/000275324_896x598_c.jpg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mb-12 mt-12 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div className="flex items-center justify-between">
          <p className="mb-12 text-3xl">Derniers concours photo publiés</p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsGridMode(true);
                setIsMap(false);
              }}
              className={isGridMode && !isMap ? 'text-black' : 'text-gray-300'}
            >
              <BsGrid3X3GapFill />
            </button>
            <button
              onClick={() => {
                setIsGridMode(false);
                setIsMap(false);
              }}
              className={!isGridMode && !isMap ? 'text-black' : 'text-gray-300'}
            >
              <FaList />
            </button>
            <button
              onClick={() => {
                setIsMap(true);
              }}
              className={isMap ? 'text-black' : 'text-gray-300'}
            >
              <TbMap2 />
            </button>
          </div>
        </div>
        {!isMap ? (
          <div>
            <div
              className={
                isGridMode
                  ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
                  : 'list'
              }
            >
              {loading
                ? Array.from({ length: itemsPerPage }, (_, i) => (
                    <ContestCardSkeleton key={i} />
                  ))
                : sortedContests
                    .filter(
                      (contest) =>
                        contest.deletionDate === undefined &&
                        contest.status === true
                    )
                    .slice(
                      currentPage * itemsPerPage,
                      currentPage * itemsPerPage + itemsPerPage
                    )
                    .map((contest) =>
                      isGridMode ? (
                        <ContestCard contest={contest} key={contest.id} />
                      ) : (
                        <ContestCardList contest={contest} key={contest.id} />
                      )
                    )}
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
        ) : (
          <div className="max-w-screen h-screen">
            <MapContainer
              center={[46.603354, 1.888334]}
              zoom={6}
              scrollWheelZoom={false}
              className="h-full w-full rounded-xl"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {contests.map((contest, index1) => {
                return contest.cities.map((city, index2) => {
                  return (
                    <Marker
                      key={`${index1}-${index2}`}
                      position={[city.gps_lat, city.gps_lng]}
                    >
                      <Popup>
                        <div>
                          <p>Concours : {contest.name}</p>
                          <p>
                            Ville : {city.name} - {city.zip_code}{' '}
                            <span
                              onClick={handleClick(contest)}
                              className="ml-2 rounded-full bg-gray-200 px-3 py-2 hover:cursor-pointer hover:bg-gray-100"
                            >
                              Voir
                            </span>
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                });
              })}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
