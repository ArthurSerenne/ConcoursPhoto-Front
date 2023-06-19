import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import {useParams} from 'react-router';
import '../sass/components/tabs.scss';
import {Spinner} from 'react-spinners-css';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {differenceInDays, format} from 'date-fns';
import {AiOutlineEye} from 'react-icons/ai';
import {TbClockHour3} from 'react-icons/tb';
import {BiLike} from 'react-icons/bi';
import {RiUserShared2Line,} from 'react-icons/ri';
import {MdOutlineCameraAlt} from 'react-icons/md';
import ImageDisplay from '../components/ImageDisplay';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Navigation, Pagination} from 'swiper';
import Breadcrumb from '../components/Breadcrumb';
import ContestDateStatus from '../components/ContestDateStatus';
import {useAuth} from '../components/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import DescriptionContestTab from "../components/contest/DescriptionContestTab";
import RulesContestTab from "../components/contest/RulesContestTab";
import PrizesContestTab from "../components/contest/PrizesContestTab";
import JuryMembersContestTab from "../components/contest/JuryMembersContestTab";
import PhotosContestTab from "../components/contest/PhotosContestTab";
import ResultsContestTab from "../components/contest/ResultsContestTab";
import Modal from 'react-modal';
import {RiCloseLine, RiUpload2Line} from 'react-icons/ri';

const ViewContest = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const passedContest = location.state && location.state.contest;
  const [contest, setContest] = useState(passedContest || []);
  const [loading, setLoading] = useState(true);
  const [uniquePhotographers, setTotalPhotographers] = useState(0);
  const formattedDate = format(new Date(contest.resultsDate), 'dd/MM/yyyy');
  const daysDifference = differenceInDays(
    new Date(contest.resultsDate),
    new Date()
  );
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newVisual, setNewVisual] = useState(null);

  const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  //const imagePath = `${baseUrl}${imageName}`;

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      axios.post(`${process.env.REACT_APP_IMAGE_BASE_URL}`, formData)
        .then(response => {
          // Mettre à jour le visuel dans l'état local
          console.log(response.data);
          setContest({ ...contest, visual: response.data.filename });
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      console.error('Aucun fichier sélectionné');
    }
  }

  function handleDelete() {
    axios.delete(`${process.env.REACT_APP_IMAGE_BASE_URL}/${contest.visual}`)
      .then(response => {
        // Mettre à jour le visuel dans l'état local
        setContest({ ...contest, visual: null });
      })
      .catch(error => {
        console.error(error);
      });
  }

  function handleSave() {
    axios.put(`${process.env.REACT_APP_API_URL}/contests/${id}`, { visual: contest.visual })
      .then(response => {
        console.log(response.data);
        console.log('Visuel enregistré dans la base de données');
      })
      .catch(error => {
        console.error(error);
      });
  }



  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/contests/${id}`);
      setContest(res.data);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (contest.photos) {
      const uniquePhotographers = contest.photos.filter((photo) => photo.status === true).reduce((acc, photo) => {
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

  const totalPages = Math.ceil(contest.photos.filter((photo) => photo.status === true).length / itemsPerPage);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const emptyContent = (content) => {
    return (!content || /^\s*$/.test(content));
  };

  return (
    <div className='mx-6 md:mx-24'>
      <div>
        <div className="mx-auto mt-10 mb-10 flex flex-wrap justify-between items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
          <Breadcrumb  contest={contest} />
        </div>
        <div className="mx-auto mt-10 mb-10 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-24 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
          <div className='w-full sm:w-2/3'>
            <p className="text-4xl font-bold not-italic leading-[160%] text-black leading-tight">Concours photo "{contest.name}"</p>
          </div>
          <div className='w-full sm:w-1/3'>
            <p>Organisateur : <span className='underline font-bold'>{contest.organization.name}</span></p>
            <div className="mx-auto flex flex-wrap items-baseline mt-6 space-x-4 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
              <ContestDateStatus contest={contest} color={'bg-black text-white rounded-full py-1 px-4 max-w-fit mt-4 text-sm'} />
              <p>Fin le {formattedDate} ({daysDifference} jours) <TbClockHour3 /></p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-4 mb-4 flex flex-col items-center justify-center items-baseline lg:flex-row lg:justify-between lg:gap-24 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
          <div className='w-full lg:w-2/3 flex flex-wrap gap-2 justify-center lg:justify-start'>
            <p className="bg-gray-100 rounded-full py-2 px-4 max-w-fit text-xs">
              THEME(S) :{" "}
              {contest.themes && contest.themes
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
            <p className="max-w-fit rounded-full bg-gray-100 px-4 py-2 text-xs">
              REGION(S):{' '}
              {contest.regions && contest.regions
                .map((region) => region.name)
                .join(', ')
                .split(', ')
                .map((regionName, index) => (
                  <span key={index} className="font-extrabold uppercase">
                    {regionName}{' '}
                  </span>
              ))}
            </p>
            <p className="max-w-fit rounded-full bg-gray-100 px-4 py-2 text-xs">
              CATEGORIES(S) :{' '}
              {contest.categories && contest.categories
                .map((category) => category.name)
                .join(', ')
                .split(', ')
                .map((categoryName, index) => (
                  <span key={index} className="font-extrabold uppercase">
                    {categoryName}{' '}
                  </span>
              ))}
            </p>
            <p className="max-w-fit rounded-full bg-gray-100 px-4 py-2 text-xs">
              ÂGE :{' '}
              <span className="font-extrabold uppercase">
                {contest.ageMin} - {contest.ageMax} ans
              </span>
            </p>
            <p className="max-w-fit rounded-full bg-gray-100 px-4 py-2 text-xs">
              DOTATION :{' '}
              <span className="font-extrabold uppercase">Cadeaux</span>
            </p>
          </div>
          <div className='w-full lg:w-1/3 flex flex-wrap justify-center lg:justify-start gap-6 items-center mt-4 lg:mt-0'>
            <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit"><RiUserShared2Line /> {uniquePhotographers}</p>
            <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit"><MdOutlineCameraAlt /> {contest.photos.filter((photo) => photo.status === true).length}</p>
            <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit"><BiLike /> {contest.photos.filter((photo) => photo.status === true).reduce((total, photo) => total + photo.voteCount, 0)}</p>
            <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit"><AiOutlineEye /> {contest.view ? contest.view : '0'}</p>
          </div>
        </div>
        <div className="mx-auto mt-10 mb-10 grid grid-cols-1 md:grid-cols-3 md:gap-12 items-stretch 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
          <div className="col-span-2 max-h-[38rem]">
          <div className="relative h-[38rem]">
          <ImageDisplay
                imageName={contest.visual ? contest.visual : 'https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive.jpg'}
                radius="rounded-xl object-cover h-full w-full cursor-default"
            />
            <button
                className="absolute bottom-0 right-0 gap-2.5 rounded-[30px] bg-black px-[15px] py-[5px] text-center text-[8px] font-bold uppercase not-italic leading-[10px] text-white"
                onClick={openModal}
            >
                Éditer
            </button>
          </div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
            <button className="absolute right-2.5 top-2.5">
                            <RiCloseLine/>
                        </button>
            <h2 className="font-bold">Visuel principal de présentation du concours</h2>
            <p>Formats supportés : JPG, PNG, GIF | Taille : 420x250 pixels minimum | Poids : 1 Mo max</p>
            <input className="gap-5 rounded-[44px] bg-black px-[30px] py-3.5 text-base font-bold not-italic leading-[19px] text-white"
                style={{ display: 'none' }}
                id="fileUpload"
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor="fileUpload" className="gap-5 rounded-[44px] bg-[#D9D9D9] px-[30px] py-3.5 text-sm font-bold not-italic cursor-pointer leading-[17px] text-[#333333]">
                Télécharger  <RiUpload2Line/>
            </label>
            <button className="gap-5 rounded-[44px] bg-[#F1F1F1] px-[30px] py-3.5 text-sm font-bold not-italic leading-[17px] text-[#333333]" onClick={handleDelete}>Supprimer</button>
            <p className="not-italic text-sm font-bold leading-[17px] flex items-center text-[#666666]">Nom du fichier actuel:  <span className="font-normal">{contest.visual}</span></p>
            <img src={contest.visual ? baseUrl + contest.visual : 'https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive.jpg'} alt="Visuel du concours actuel" />
            <button className="gap-5 rounded-[44px] bg-regal-grey px-[30px] py-3.5 text-base font-bold not-italic leading-[19px] text-white" onClick={closeModal}>Annuler</button>
            <button className="gap-5 rounded-[44px] bg-black px-[30px] py-3.5 text-base font-bold not-italic leading-[19px] text-white" onClick={handleSave}>Sauvegarder</button>
          </Modal>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 md:flex md:flex-col md:space-y-7 md:mt-0">
            <div className="flex flex-grow justify-center max-h-[18rem]">
              <ImageDisplay imageName={contest.organization.logo ? contest.organization.logo : 'https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive.jpg'} radius="rounded-xl cursor-default" />
            </div>
            <div className="z-0 flex max-h-[18rem] flex-grow justify-center">
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
                {contest.photos
                  .filter((photo) => photo.status === true)
                  .map((photo) => (
                    <SwiperSlide key={photo.id}>
                      <ImageDisplay key={photo.id} imageName={photo.file} radius="rounded-xl cursor-default" />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
      <div>
      <div className={`mx-auto mt-10 mb-10 grid grid-cols-1 md:${activeTab === 4 ? 'grid-cols-1' : 'grid-cols-3'} md:gap-12 items-stretch 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm`}>
        <div className={`col-span-2 h-full relative ${activeTab === 4 ? 'col-span-3' : 'col-span-2'}`}>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner color="#000" />
          </div>
        ) : (
          <Tabs onSelect={handleTabChange} className={'mb-6'}>
            <TabList className={'mb-10'}>
            {!emptyContent(contest.description) && <Tab>Le concours</Tab>}
            {!emptyContent(contest.rules) && <Tab>Réglement</Tab>}
            {!emptyContent(contest.prizes) && <Tab>Prix à gagner</Tab>}
            {!emptyContent(contest.juryMembers) && <Tab>Membres du Jury</Tab>}
              <Tab>Les photos</Tab>
              <Tab>Résultats</Tab>
            </TabList>
                  {!emptyContent(contest.description) && (
                    <TabPanel>
                      <DescriptionContestTab user={user} contest={contest} setContest={setContest} goBack={goBack} />
                    </TabPanel>
                  )}
                  {!emptyContent(contest.rules) && (
                      <TabPanel>
                        <RulesContestTab user={user} contest={contest} setContest={setContest} goBack={goBack} />
                      </TabPanel>
                  )}
                  {!emptyContent(contest.prizes) && (
                    <TabPanel>
                      <PrizesContestTab user={user} contest={contest} setContest={setContest} goBack={goBack} />
                    </TabPanel>
                  )}
                  {!emptyContent(contest.juryMembers) && (
                    <TabPanel>
                      <JuryMembersContestTab user={user} contest={contest} setContest={setContest} goBack={goBack} />
                    </TabPanel>
                  )}
            <TabPanel>
              <PhotosContestTab contest={contest} uniquePhotographers={uniquePhotographers} goBack={goBack} />
            </TabPanel>
            <TabPanel>
              <ResultsContestTab contest={contest} goBack={goBack} />
            </TabPanel>
          </Tabs>
        )}
        </div>
        <div className={`${activeTab === 4 ? 'hidden' : ''}`}>
          <p className="text-xl font-bold not-italic leading-[160%] text-black mb-8">Dernières photos soumises</p>
          <div className='grid grid-cols-2 gap-5 mb-10'>
            {contest.photos
              .filter((photo) => photo.status === true)
              .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
              .slice(0, 8)
              .map(
                (photo) => <ImageDisplay key={photo.id} name={photo.member?.username} imageName={photo.file} modalEnabled={false} />
              )}
          </div>
          <Link onClick={goBack} className="rounded-[44px] bg-gray-400 text-white px-[30px] py-3.5 mt-8 hover:bg-gray-300">
            Voir les photos et voter
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ViewContest;
