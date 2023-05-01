import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useParams } from 'react-router';
import '../sass/components/tabs.scss';
import { Spinner } from 'react-spinners-css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { AiOutlineEye, AiOutlineArrowLeft } from "react-icons/ai";
import { TbClockHour3 } from "react-icons/tb";
import { RiUserShared2Line, RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { MdOutlineCameraAlt } from "react-icons/md";
import ImageDisplay from '../components/ImageDisplay';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import PhotoCard from '../components/PhotoCard';
import ReactPaginate from 'react-paginate';

const ViewContest = () => {
  const { id } = useParams();
  const location = useLocation();
  const passedContest = location.state && location.state.contest;
  const [contest, setContest] = useState(passedContest || []);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);
  const [uniquePhotographers, setTotalPhotographers] = useState(0);
  const formattedDate = format(new Date(contest.resultsDate), 'dd/MM/yyyy');
  const daysDifference = differenceInDays(new Date(contest.resultsDate), new Date());
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  useEffect(() => {
    if (!passedContest) {
      axios
        .get(process.env.REACT_APP_API_URL + `/contests/${id}`)
        .then((res) => {
          setContest(res.data);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id, !passedContest]);

  useEffect(() => {
    if (contest.photos) {
      const uniquePhotographers = contest.photos.reduce((acc, photo) => {
        acc.add(photo.member);
        return acc;
      }, new Set());

      setTotalPhotographers(uniquePhotographers.size);
    }
  }, [contest]);

	const goBack = () => {
		navigate(-1);
	};

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(0);
  };

  const incrementViewCount = () => {
    setViewCount(viewCount + 1);
  };

  useEffect(() => {
    incrementViewCount();
  }, []);

  const totalPages = Math.ceil(contest.photos.length / itemsPerPage);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div>
      <div>
        <div className="max-w-screen-2xl mx-auto mt-10 mb-10 flex flex-wrap justify-between items-center">
          <p><span>Accueil</span> {'>'} <span>Concours photos</span> {'>'} <span className='font-bold'>Concours photo "{contest.name}"</span></p>
        </div>
        <div className="max-w-screen-2xl mx-auto mt-10 mb-10 flex justify-center gap-24">
          <div className='w-2/3'>
            <p className="text-4xl font-bold not-italic leading-[160%] text-black leading-tight">Concours photo "{contest.name}"</p>
          </div>
          <div className='gap-6 items-center w-1/3'>
            <p>Organisateur : <span className='underline font-bold'>{contest.organization.name}</span></p>
            <div className="max-w-screen-2xl mx-auto flex flex-wrap items-end space-x-4">
              <p className="bg-black text-white rounded-full py-1 px-4 max-w-fit mt-4 text-xs">PHASE DE VOTE</p>
              <p>Fin le {formattedDate} ({daysDifference} jours) <TbClockHour3 /></p>
            </div>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto mt-4 mb-4 flex justify-center gap-24">
          <div className='w-2/3 flex flex-wrap gap-2'>
          <p className="bg-gray-100 rounded-full py-2 px-4 max-w-fit text-xs">
            THEME(S) :{" "}
            {contest.themes
              .map((theme) => theme.name)
              .join(", ")
              .split(", ")
              .map((themeName, index) => (
                <span key={index} className="font-extrabold uppercase">{themeName} </span>
              ))}
          </p>
            <p className="bg-gray-100 rounded-full py-2 px-4 max-w-fit text-xs">
              PAYS : <span className="font-extrabold uppercase">France</span>
            </p>
            <p className="bg-gray-100 rounded-full py-2 px-4 max-w-fit text-xs">
              REGION(S):{" "}
              {contest.regions
                .map((region) => region.name)
                .join(", ")
                .split(", ")
                .map((regionName, index) => (
                  <span key={index} className="font-extrabold uppercase">{regionName} </span>
                ))}
            </p>
            <p className="bg-gray-100 rounded-full py-2 px-4 max-w-fit text-xs">
              CATEGORIES(S) :{" "}
              {contest.categories
                .map((category) => category.name)
                .join(", ")
                .split(", ")
                .map((categoryName, index) => (
                  <span key={index} className="font-extrabold uppercase">{categoryName} </span>
                ))}
            </p>
            <p className="bg-gray-100 rounded-full py-2 px-4 max-w-fit text-xs">
              ÂGE : <span className="font-extrabold uppercase">{contest.ageMin} - {contest.ageMax} ans</span>
            </p>
            <p className="bg-gray-100 rounded-full py-2 px-4 max-w-fit text-xs">DOTATION : <span className='font-extrabold uppercase'>Cadeaux</span></p>
          </div>
          <div className='gap-6 items-center w-1/3'>
            <div className="max-w-screen-2xl mx-auto flex flex-wrap items-end space-x-4">
              <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit"><RiUserShared2Line /> {uniquePhotographers}</p>
              <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit"><MdOutlineCameraAlt /> {contest.photos.length}</p>
              <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit"><AiOutlineEye /> {viewCount}</p>
            </div>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto mt-10 mb-10 grid grid-cols-3 gap-12 items-stretch">
          <div className="col-span-2 max-h-[38rem]">
            <ImageDisplay imageName={contest.visual} radius="rounded-xl object-cover h-[38rem] w-full" />
          </div>
          <div className="flex flex-col space-y-7">
            <div className="flex flex-grow justify-center max-h-[18rem]">
              <ImageDisplay imageName={contest.organization.logo} radius="rounded-xl" />
            </div>
            <div className="flex flex-grow justify-center max-h-[18rem] z-0">
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
                className="mySwiper w-full h-full"
              >
                {contest.photos
                  .map((photo) => (
                    <SwiperSlide key={photo.id}>
                      <ImageDisplay key={photo.id} imageName={photo.file} radius="rounded-xl" />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        </div>
        </div>
      <div>
      <div className={`max-w-screen-2xl mx-auto mt-10 mb-10 grid grid-cols-3 ${activeTab === 4 ? 'grid-cols-1' : 'grid-cols-3'} gap-12 items-stretch`}>
        <div className={`col-span-2 h-full relative ${activeTab === 4 ? 'col-span-3' : 'col-span-2'}`}>
        {loading ? (
          <Spinner color="#000" />
        ) : (
          <Tabs onSelect={handleTabChange}>
            <TabList className={'mb-10'}>
              <Tab>Le concours</Tab>
              <Tab>Réglement</Tab>
              <Tab>Prix à gagner</Tab>
              <Tab>Membres du Jury</Tab>
              <Tab>Les photos</Tab>
              <Tab>Résultats</Tab>
            </TabList>

            <TabPanel>
              <h2 className="flex items-center text-text-2xl font-normal not-italic">
                Présentation du concours photo
              </h2>
              {contest.description}
              <div className="max-w-screen-2xl mx-auto mt-10 flex">
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex">
                  <AiOutlineArrowLeft className='mr-2' /> Retour
                </Link>
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5">
                  Télécharger la version PDF
                </Link>
              </div>
            </TabPanel>
            <TabPanel>
              <h2 className="flex items-center text-text-2xl font-normal not-italic">
                Règlement du concours
              </h2>
              {contest.rules}
              <div className="max-w-screen-2xl mx-auto mt-10">
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                  <AiOutlineArrowLeft className='mr-2' /> Retour
                </Link>
              </div>
            </TabPanel>
            <TabPanel>
              <h2 className="flex items-center text-text-2xl font-normal not-italic">
                Prix à gagner
              </h2>
              {contest.prizes}
              <div className="max-w-screen-2xl mx-auto mt-10">
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                  <AiOutlineArrowLeft className='mr-2' /> Retour
                </Link>
              </div>
            </TabPanel>
            <TabPanel>
              <h2 className="flex items-center text-text-2xl font-normal not-italic mb-6">
                {contest.juryMembers.length} membres du Jury
              </h2>
              {contest.juryMembers.map((juryMember) => (
                <div key={juryMember.id} className='bg-[#F1F1F1] p-5 mt-2'>
                  <p><span className='font-bold'>{juryMember.member.user.firstname} {juryMember.member.user.lastname}</span>, {juryMember.fonction}</p>
                </div>
              ))}
              <div className="max-w-screen-2xl mx-auto mt-10">
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                  <AiOutlineArrowLeft className='mr-2' /> Retour
                </Link>
              </div>
            </TabPanel>
            <TabPanel>
              <h2 className="flex items-center text-text-2xl font-normal not-italic mb-10">
                {contest.photos.length} photos soumises par {uniquePhotographers} photographes
              </h2>
              <div className="grid grid-cols-3 gap-5">
                {contest.photos
                .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
                .filter(
                  (photo) =>
                    photo.status === true
                )
                .slice(currentPage * itemsPerPage, (currentPage * itemsPerPage) + itemsPerPage)
                .map(
                  (photo) => <PhotoCard photo={photo} key={photo.id} />
                )}
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
              <div className="max-w-screen-2xl mx-auto mt-10">
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                  <AiOutlineArrowLeft className='mr-2' /> Retour
                </Link>
              </div>
            </TabPanel>
            <TabPanel>
              <h2 className="flex items-center text-text-2xl font-normal not-italic">
                Résultats du concours photo
              </h2>
              {contest.description}
              <div className="max-w-screen-2xl mx-auto mt-10">
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                  <AiOutlineArrowLeft className='mr-2' /> Retour
                </Link>
              </div>
            </TabPanel>
          </Tabs>
        )}
        </div>
        <div className={`${activeTab === 4 ? 'hidden' : ''}`}>
          <p className="text-xl font-bold not-italic leading-[160%] text-black mb-8">Dernières photos soumises</p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-10'>
            {contest.photos
              .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
              .slice(0, 8)
              .map(
                (photo) => <ImageDisplay key={photo.id} name={photo.member.username} imageName={photo.file} modalEnabled={true} radius={'hover:scale-105 ease-in-out duration-300 cursor-pointer'} />
              )}
          </div>
          <Link onClick={goBack} className="rounded-[44px] bg-gray-400 text-white px-[30px] py-3.5 mt-8">
            Voir les photos et voter
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ViewContest;
