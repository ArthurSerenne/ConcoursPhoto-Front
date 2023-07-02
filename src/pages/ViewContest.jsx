import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { useParams } from 'react-router';
import '../sass/components/tabs.scss';
import { Spinner } from 'react-spinners-css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { differenceInDays, format } from 'date-fns';
import { AiOutlineEye } from 'react-icons/ai';
import { TbClockHour3 } from 'react-icons/tb';
import { BiLike } from 'react-icons/bi';
import { RiUserShared2Line } from 'react-icons/ri';
import { MdOutlineCameraAlt } from 'react-icons/md';
import ImageDisplay from '../components/ImageDisplay';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import Breadcrumb from '../components/Breadcrumb';
import ContestDateStatus from '../components/ContestDateStatus';
import { useAuth } from '../components/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import DescriptionContestTab from '../components/contest/DescriptionContestTab';
import RulesContestTab from '../components/contest/RulesContestTab';
import PrizesContestTab from '../components/contest/PrizesContestTab';
import JuryMembersContestTab from '../components/contest/JuryMembersContestTab';
import PhotosContestTab from '../components/contest/PhotosContestTab';
import ResultsContestTab from '../components/contest/ResultsContestTab';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { RiCloseLine, RiUpload2Line } from 'react-icons/ri';

const ViewContest = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const passedContest = location.state && location.state.contest;
  const [contest, setContest] = useState(passedContest || []);
  const [loading, setLoading] = useState(true);
  const [uniquePhotographers, setTotalPhotographers] = useState(0);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageName, setUploadedImageName] = useState('');

  const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  const handleEditClick = () => {
    setModalOpen(true);
  };

  const closeModalWhenClickedOutside = (e) => {
    if (e.target.classList.contains('fixed')) {
      handleCancelClick();
    }
  };

  const handleCancelClick = () => {
    setModalOpen(false);
    setUploadedImage(null);
    setUploadedImageName('');
  };

  const handleUploadProcess = (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return axios
      .post(`${process.env.REACT_APP_IMAGE_BASE_URL}`, formData)
      .then((response) => {
        setUploadedImage(response.data.newFilename);
        setUploadedImageName(file.name);
      });
  };

  const handleUploadClick = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier l'extension du fichier
      const validExtensions = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validExtensions.includes(file.type)) {
        alert(
          'Format de fichier non supporté. Seuls les formats JPG, PNG, et GIF sont autorisés.'
        );
        return;
      }

      // Vérifier la taille du fichier (1 Mo max)
      const maxSizeInBytes = 1048576;
      if (file.size > maxSizeInBytes) {
        alert('La taille du visuel dépasse la limite autorisée de 1 Mo.');
        return;
      }

      // Vérifier la résolution minimale (420x250 pixels)
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          if (img.width < 420 || img.height < 250) {
            alert(
              "La résolution de l'image doit être de 420x250 pixels minimum."
            );
            return;
          }

          // Continuer le processus d'upload si toutes les conditions sont remplies
          toast.promise(handleUploadProcess(file), {
            pending: 'Téléchargement du visuel...',
            success: 'Visuel téléchargé avec succès !',
            error: 'Une erreur est survenue lors du téléchargement du visuel.',
          });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProcess = () => {
    const deleteUrl = `${process.env.REACT_APP_IMAGE_BASE_URL}`;
    const params = { filename: uploadedImage };

    return axios.delete(deleteUrl, { data: params }).then((response) => {
      // par défaut on affiche le visuel du concours
      setUploadedImage(contest.visual);
      setUploadedImageName(contest.visual);
    });
  };

  const handleDeleteClick = () => {
    if (uploadedImage) {
      // Utilisation de toasts
      toast.promise(handleDeleteProcess(), {
        pending: 'Suppression du visuel...',
        success: 'Visuel supprimé avec succès !',
        error: 'Une erreur est survenue lors de la suppression du visuel.',
      });
    }
  };

  const saveAndUpdateProcess = () => {
    return axios
      .put(`${process.env.REACT_APP_API_URL}/contests/${id}`, {
        visual: uploadedImage,
      })
      .then((response) => {
        setModalOpen(false);
        // Handle success
      });
  };

  const saveAndUpdate = () => {
    // Utilisation de toasts
    toast.promise(saveAndUpdateProcess(), {
      pending: 'Enregistrement du visuel...',
      success: 'Visuel enregistré avec succès !',
      error: "Une erreur est survenue lors de l'enregistrement du visuel.",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/contests/${id}`
      );
      setContest(res.data);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (contest.photos) {
      const uniquePhotographers = contest.photos
        .filter((photo) => photo.status === true)
        .reduce((acc, photo) => {
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

  const emptyContent = (content) => {
    return !content || /^\s*$/.test(content);
  };

  const formattedDate = format(new Date(contest.resultsDate), 'dd/MM/yyyy');
  const daysDifference = differenceInDays(
    new Date(contest.resultsDate),
    new Date()
  );

  return (
    <div className="mx-6 md:mx-24">
      <div>
        <div className="mx-auto mb-10 mt-10 flex flex-wrap items-center justify-between sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          <Breadcrumb contest={contest} />
        </div>
        <div className="mx-auto mb-10 mt-10 flex flex-col items-center justify-center gap-4 sm:max-w-screen-sm sm:flex-row sm:gap-24 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          <div className="w-full sm:w-2/3">
            <p className="text-4xl font-bold not-italic leading-[160%] leading-tight text-black">
              Concours photo "{contest.name}"
            </p>
          </div>
          <div className="w-full sm:w-1/3">
            <p>
              Organisateur :{' '}
              <span className="font-bold underline">
                {contest.organization.name}
              </span>
            </p>
            <div className="mx-auto mt-6 flex flex-wrap items-baseline space-x-4 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
              <ContestDateStatus
                contest={contest}
                color={
                  'bg-black text-white rounded-full py-1 px-4 max-w-fit mt-4 text-sm'
                }
              />
              <p>
                Fin le {formattedDate} ({daysDifference} jours) <TbClockHour3 />
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto mb-4 mt-4 flex flex-col items-center items-baseline justify-center sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg lg:flex-row lg:justify-between lg:gap-24 xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          <div className="flex w-full flex-wrap justify-center gap-2 lg:w-2/3 lg:justify-start">
            <p className="max-w-fit rounded-full bg-gray-100 px-4 py-2 text-xs">
              THEME(S) :{' '}
              {contest.themes &&
                contest.themes
                  ?.map((theme) => theme.name)
                  .join(', ')
                  .split(', ')
                  .map((themeName, index) => (
                    <span key={index} className="font-extrabold uppercase">
                      {themeName}{' '}
                    </span>
                  ))}
            </p>
            <p className="max-w-fit rounded-full bg-gray-100 px-4 py-2 text-xs">
              PAYS : <span className="font-extrabold uppercase">France</span>
            </p>
            <p className="max-w-fit rounded-full bg-gray-100 px-4 py-2 text-xs">
              REGION(S):{' '}
              {contest.regions &&
                contest.regions
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
              {contest.categories &&
                contest.categories
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
          <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-6 lg:mt-0 lg:w-1/3 lg:justify-start">
            <p className="max-w-fit rounded-full bg-gray-100 px-4 py-1">
              <RiUserShared2Line /> {uniquePhotographers}
            </p>
            <p className="max-w-fit rounded-full bg-gray-100 px-4 py-1">
              <MdOutlineCameraAlt />{' '}
              {contest.photos?.filter((photo) => photo.status === true).length}
            </p>
            <p className="max-w-fit rounded-full bg-gray-100 px-4 py-1">
              <BiLike />{' '}
              {contest.photos
                ?.filter((photo) => photo.status === true)
                .reduce((total, photo) => total + photo.voteCount, 0)}
            </p>
            <p className="max-w-fit rounded-full bg-gray-100 px-4 py-1">
              <AiOutlineEye /> {contest.view ? contest.view : '0'}
            </p>
          </div>
        </div>
        <div className="mx-auto mb-10 mt-10 grid grid-cols-1 items-stretch sm:max-w-screen-sm md:max-w-screen-md md:grid-cols-3 md:gap-12 lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          <div className="col-span-2 max-h-[38rem]">
            <div className="relative h-[38rem]">
              <ImageDisplay
                imageName={
                  contest.visual
                    ? contest.visual
                    : 'https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive.jpg'
                }
                radius="rounded-xl object-cover h-full w-full cursor-default"
              />
              {user &&
                user.organizations &&
                contest.organization &&
                user.organizations.some(
                  (org) => org.id === contest.organization.id
                ) && (
                  <button
                    className="absolute bottom-0 right-0 gap-2.5 rounded-[30px] bg-black px-[15px] py-[5px] text-center text-[8px] font-bold uppercase not-italic leading-[10px] text-white"
                    onClick={handleEditClick}
                  >
                    Éditer
                  </button>
                )}
            </div>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={handleCancelClick}
              contentLabel="Edit Visual Modal"
              overlayClassName=""
              className=""
              overlayRef={(overlay) => {
                if (overlay) {
                  overlay.addEventListener(
                    'click',
                    closeModalWhenClickedOutside
                  );
                }
              }}
            >
              <div className="flex justify-between">
                <h1 className="mb-2 text-xl font-bold">
                  Concours {'>'} onglet visuel principal : édition
                </h1>
                <button
                  onClick={handleCancelClick}
                  className="absolute right-2.5 top-2.5"
                >
                  <RiCloseLine />
                </button>
              </div>
              <h2 className="font-bold">
                Visuel principal de présentation du concours
              </h2>
              <p>
                Formats supportés : JPG, PNG, GIF | Taille : 420x250 pixels
                minimum | Poids : 1 Mo max
              </p>
              <div className="mt-4">
                {uploadedImage ? (
                  <>
                    <img
                      src={`${baseUrl}/${uploadedImage}`}
                      alt={uploadedImageName}
                    />
                    <p>Fichier actuel: {uploadedImageName}</p>
                  </>
                ) : (
                  <>
                    {contest.visual && (
                      <>
                        <img
                          src={`${baseUrl}/${contest.visual}`}
                          alt="Current visual"
                        />
                        <p>Fichier actuel: {contest.visual}</p>
                      </>
                    )}
                  </>
                )}
              </div>
              <input
                className="gap-5 rounded-[44px] bg-black px-[30px] py-3.5 text-base font-bold not-italic leading-[19px] text-white"
                style={{ display: 'none' }}
                id="visual-upload"
                name="visual-upload"
                type="file"
                onChange={handleUploadClick}
              />
              <label
                htmlFor="visual-upload"
                className="mr-4 cursor-pointer gap-5 rounded-[44px] bg-[#D9D9D9] px-[30px] py-3.5 text-sm font-bold not-italic leading-[17px] text-[#333333]"
              >
                Télécharger <RiUpload2Line />
              </label>
              <button
                className="gap-5 rounded-[44px] bg-[#F1F1F1] px-[30px] py-3.5 text-sm font-bold not-italic leading-[17px] text-[#333333]"
                onClick={handleDeleteClick}
              >
                Supprimer
              </button>
              <div className="mt-4">
                <button
                  className="mr-4 gap-5 rounded-[44px] bg-regal-grey px-12 py-3.5 text-base font-bold not-italic leading-[19px] text-white"
                  onClick={handleCancelClick}
                >
                  Annuler
                </button>
                <button
                  className="gap-5 rounded-[44px] bg-black px-12 py-3.5 text-base font-bold not-italic leading-[19px] text-white"
                  onClick={saveAndUpdate}
                >
                  Sauvegarder
                </button>
              </div>
            </Modal>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:mt-0 md:flex md:flex-col md:space-y-7">
            <div className="flex max-h-[18rem] flex-grow justify-center">
              <ImageDisplay
                imageName={
                  contest.organization.logo
                    ? contest.organization.logo
                    : 'https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive.jpg'
                }
                radius="rounded-xl cursor-default"
              />
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
                {contest.sponsors?.map((sponsor) => (
                  <SwiperSlide key={sponsor.id}>
                    <a
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ cursor: 'grab' }}
                    >
                      <ImageDisplay
                        key={sponsor.id}
                        imageName={sponsor.logo}
                        radius="rounded-xl cursor-default"
                      />
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          className={`mx-auto mb-10 mt-10 grid grid-cols-1 md:${
            activeTab === 4 ? 'grid-cols-1' : 'grid-cols-3'
          } items-stretch sm:max-w-screen-sm md:max-w-screen-md md:gap-12 lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl`}
        >
          <div
            className={`relative col-span-2 h-full ${
              activeTab === 4 ? 'col-span-3' : 'col-span-2'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Spinner color="#000" />
              </div>
            ) : (
              <Tabs onSelect={handleTabChange} className={'mb-6'}>
                <TabList className={'mb-10'}>
                  {!emptyContent(contest.description) && <Tab>Le concours</Tab>}
                  {!emptyContent(contest.rules) && <Tab>Réglement</Tab>}
                  {!emptyContent(contest.prizes) && <Tab>Prix à gagner</Tab>}
                  {!emptyContent(contest.juryMembers) && (
                    <Tab>Membres du Jury</Tab>
                  )}
                  {!emptyContent(contest.photos) && <Tab>Les photos</Tab>}
                  {!emptyContent(contest.wins) && <Tab>Résultats</Tab>}
                </TabList>
                {!emptyContent(contest.description) && (
                  <TabPanel>
                    <DescriptionContestTab
                      user={user}
                      contest={contest}
                      setContest={setContest}
                      goBack={goBack}
                    />
                  </TabPanel>
                )}
                {!emptyContent(contest.rules) && (
                  <TabPanel>
                    <RulesContestTab
                      user={user}
                      contest={contest}
                      setContest={setContest}
                      goBack={goBack}
                    />
                  </TabPanel>
                )}
                {!emptyContent(contest.prizes) && (
                  <TabPanel>
                    <PrizesContestTab
                      user={user}
                      contest={contest}
                      setContest={setContest}
                      goBack={goBack}
                    />
                  </TabPanel>
                )}
                {!emptyContent(contest.juryMembers) && (
                  <TabPanel>
                    <JuryMembersContestTab
                      user={user}
                      contest={contest}
                      setContest={setContest}
                      goBack={goBack}
                    />
                  </TabPanel>
                )}
                {!emptyContent(contest.photos) && (
                  <TabPanel>
                    <PhotosContestTab
                      user={user}
                      contest={contest}
                      setContest={setContest}
                      uniquePhotographers={uniquePhotographers}
                      goBack={goBack}
                    />
                  </TabPanel>
                )}
                {!emptyContent(contest.wins) && (
                  <TabPanel>
                    <ResultsContestTab
                      user={user}
                      contest={contest}
                      setContest={setContest}
                      goBack={goBack}
                    />
                  </TabPanel>
                )}
              </Tabs>
            )}
          </div>
          <div className={`${activeTab === 4 ? 'hidden' : ''}`}>
            <p className="mb-8 text-xl font-bold not-italic leading-[160%] text-black">
              Dernières photos soumises
            </p>
            <div className="mb-10 grid grid-cols-2 gap-5">
              {contest.photos
                .filter((photo) => photo.status === true)
                .sort(
                  (a, b) =>
                    new Date(b.submissionDate) - new Date(a.submissionDate)
                )
                .slice(0, 8)
                .map((photo) => (
                  <ImageDisplay
                    key={photo.id}
                    name={photo.member?.username}
                    imageName={photo.file}
                    modalEnabled={false}
                  />
                ))}
            </div>
            <Link
              onClick={goBack}
              className="mt-8 rounded-[44px] bg-gray-400 px-[30px] py-3.5 text-white hover:bg-gray-300"
            >
              Voir les photos et voter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContest;
