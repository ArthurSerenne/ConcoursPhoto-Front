import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useParams } from 'react-router';
import '../sass/components/tabs.scss';
import { Spinner } from 'react-spinners-css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { AiOutlineEye, AiOutlineArrowLeft } from 'react-icons/ai';
import { TbClockHour3 } from 'react-icons/tb';
import {
  RiUserShared2Line,
  RiArrowRightSLine,
  RiArrowLeftSLine,
} from 'react-icons/ri';
import { MdOutlineCameraAlt } from 'react-icons/md';
import ImageDisplay from '../components/ImageDisplay';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper';
import PhotoCard from '../components/PhotoCard';
import ReactPaginate from 'react-paginate';
import Breadcrumb from '../components/Breadcrumb';
import { Editor } from '@tinymce/tinymce-react';
import ContestDateStatus from '../components/ContestDateStatus';
import { useAuth } from '../components/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit"><AiOutlineEye /> {contest.view ? contest.view : '0'}</p>
          </div>
        </div>
        <div className="mx-auto mt-10 mb-10 grid grid-cols-1 md:grid-cols-3 md:gap-12 items-stretch 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
          <div className="col-span-2 max-h-[38rem]">
            <ImageDisplay imageName={contest.visual ? contest.visual : 'https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive.jpg'} radius="rounded-xl object-cover h-[38rem] w-full cursor-default" />
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
              <Tab>Membres du Jury</Tab>
              <Tab>Les photos</Tab>
              <Tab>Résultats</Tab>
            </TabList>

                  {!emptyContent(contest.description) && (
                    <TabPanel>
                      <h2 className="flex items-center text-text-2xl font-normal not-italic">
                        Présentation du concours photo
                      </h2>
                      {user && user.organizations && contest.organization && user.organizations.some(org => org.id === contest.organization.id) ? (
                        <Editor
                          apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                          initialValue={contest.description}
                          init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                              'advlist autolink lists link image charmap print preview anchor',
                              'searchreplace visualblocks code fullscreen',
                              'insertdatetime media table paste code help wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                            'bold italic backcolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                          }}
                          onEditorChange={(content) => {
                            contest.description = content;
                            const updateDescriptionProcess = async () => {
                              const response = await axios.put(process.env.REACT_APP_API_URL + `/contests/${id}`, {
                                description: content
                              });
                              if (response.status !== 200) {
                                throw new Error('Error updating contest description');
                              }
                              setContest(response.data);
                            };

                            toast.promise(
                              updateDescriptionProcess(),
                              {
                                pending: 'Mise à jour de la description du concours...',
                                success: 'La description du concours a bien été mise à jour !',
                                error: 'Une erreur est survenue lors de la mise à jour de la description du concours.'
                              }
                            );
                          }}
                        />
                      ) : (
                        <p dangerouslySetInnerHTML={{ __html: contest.description }}></p>
                      )}
                      <div className=" mx-auto mt-10 flex 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                        <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex">
                          <AiOutlineArrowLeft className='mr-2' /> Retour
                        </Link>
                        <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5">
                          Télécharger la version PDF
                        </Link>
                      </div>
                    </TabPanel>
                  )}
                  {!emptyContent(contest.rules) && (
                    <TabPanel>
                      <h2 className="flex items-center text-text-2xl font-normal not-italic">
                        Règlement du concours
                      </h2>
                      {user && user.organizations && contest.organization && user.organizations.some(org => org.id === contest.organization.id) ? (
                      <Editor
                        apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                        initialValue={contest.rules}
                        init={{
                          height: 500,
                          menubar: false,
                          plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                          ],
                          toolbar: 'undo redo | formatselect | ' +
                          'bold italic backcolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | help',
                          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                        onEditorChange={(content) => {
                          contest.rules = content;
                          const updateRulesProcess = async () => {
                            const response = await axios.put(process.env.REACT_APP_API_URL + `/contests/${id}`, {
                              rules: content
                            });
                            if (response.status !== 200) {
                              throw new Error('Error updating contest rules');
                            }
                            setContest(response.data);
                          };

                          toast.promise(
                            updateRulesProcess(),
                            {
                              pending: 'Mise à jour des règles du concours...',
                              success: 'Le règlement du concours a bien été mis à jour !',
                              error: 'Une erreur est survenue lors de la mise à jour du règlement du concours.'
                            }
                          );
                        }}
                      />
                      ) : (
                        <p dangerouslySetInnerHTML={{ __html: contest.rules }}></p>
                      )}
                      <div className="mx-auto mt-10 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                        <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                          <AiOutlineArrowLeft className='mr-2' /> Retour
                        </Link>
                      </div>
                    </TabPanel>
                  )}
                  {!emptyContent(contest.prizes) && (
                    <TabPanel>
                      <h2 className="flex items-center text-text-2xl font-normal not-italic">
                        Prix à gagner
                      </h2>
                      {user && user.organizations && contest.organization && user.organizations.some(org => org.id === contest.organization.id) ? (
                      <Editor
                        apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                        initialValue={contest.prizes}
                        init={{
                          height: 500,
                          menubar: false,
                          plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                          ],
                          toolbar: 'undo redo | formatselect | ' +
                          'bold italic backcolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | help',
                          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                        onEditorChange={(content) => {
                          contest.prizes = content;
                          const updatePrizesProcess = async () => {
                            const response = await axios.put(process.env.REACT_APP_API_URL + `/contests/${id}`, {
                              prizes: content
                            });
                            if (response.status !== 200) {
                              throw new Error('Error updating contest prizes');
                            }
                            setContest(response.data);
                          };

                          toast.promise(
                            updatePrizesProcess(),
                            {
                              pending: 'Mise à jour de la dotation du concours...',
                              success: 'La dotation du concours a bien été mise à jour !',
                              error: 'Une erreur est survenue lors de la mise à jour de la dotation du concours.'
                            }
                          );
                        }}
                      />
                      ) : (
                        <p dangerouslySetInnerHTML={{ __html: contest.prizes }}></p>
                      )}
                      <div className="mx-auto mt-10 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                        <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                          <AiOutlineArrowLeft className='mr-2' /> Retour
                        </Link>
                      </div>
                    </TabPanel>
                  )}
            <TabPanel>
              <h2 className="flex items-center text-text-2xl font-normal not-italic mb-6">
                {contest.juryMembers?.length} membres du Jury
              </h2>
              {contest.juryMembers?.map((juryMember) => (
                <div key={juryMember.id} className='bg-[#F1F1F1] p-5 mt-2'>
                  <p><span className='font-bold'>{juryMember.member.user.firstname} {juryMember.member.user.lastname}</span>, {juryMember.fonction}</p>
                </div>
              ))}
              <div className="mx-auto mt-10 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                  <AiOutlineArrowLeft className='mr-2' /> Retour
                </Link>
              </div>
            </TabPanel>
            <TabPanel>
              <h2 className="flex items-center text-text-2xl font-normal not-italic mb-10">
                {contest.photos.filter((photo) => photo.status === true).length} photos soumises par {uniquePhotographers} photographes
              </h2>
              <div className="grid md:grid-cols-3 gap-5">
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
              <div className="mx-auto mt-10 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                  <AiOutlineArrowLeft className='mr-2' /> Retour
                </Link>
              </div>
            </TabPanel>
            <TabPanel>
              <h2 className="flex items-center text-text-2xl font-normal not-italic">
                Résultats du concours photo
              </h2><br/>
              <p>LAURÉAT PAR THÈME</p><br/>
              <p>{contest.themes
                .map((theme) => theme.name)
                .join(", ")
                .split(", ")
                .map((themeName, index) => (
                  <span key={index} className="font-extrabold uppercase">{themeName} </span>
                ))}</p>
                <p>1er prix : Jean MARTIN, 2e prix : Kevin DUTOIT, 3e prix : Lucile FAUBEUGE</p><br/>
                <p>{contest.themes
                .map((theme) => theme.name)
                .join(", ")
                .split(", ")
                .map((themeName, index) => (
                  <span key={index} className="font-extrabold uppercase">{themeName} </span>
                ))}</p>
                <p>1er prix : Gil PALUTIN, 2e prix : Justine FAULENT, 3e prix : Jules DUBOIS</p><br/>
                <p>{contest.themes
                .map((theme) => theme.name)
                .join(", ")
                .split(", ")
                .map((themeName, index) => (
                  <span key={index} className="font-extrabold uppercase">{themeName} </span>
                ))}</p>
                <p>1er prix : Michel DEBOUT, 2e prix : Aline MAUCOUD, 3e prix : Guillaume KOULION</p><br/>
                <p>{contest.themes
                .map((theme) => theme.name)
                .join(", ")
                .split(", ")
                .map((themeName, index) => (
                  <span key={index} className="font-extrabold uppercase">{themeName} </span>
                ))}</p>
                <p>1er prix : Adrien OBUSIER, 2e prix : Clara MORGANE, 3e prix : Xavier GRENADE</p><br/>
                <p>{contest.themes
                .map((theme) => theme.name)
                .join(", ")
                .split(", ")
                .map((themeName, index) => (
                  <span key={index} className="font-extrabold uppercase">{themeName} </span>
                ))}</p>
                <p>1er prix : Lucien FORGE, 2e prix : Gabriel LABEUR, 3e prix : Gilles SUEUR</p><br/>
                <p>{contest.themes
                .map((theme) => theme.name)
                .join(", ")
                .split(", ")
                .map((themeName, index) => (
                  <span key={index} className="font-extrabold uppercase">{themeName} </span>
                ))}</p>
                <p>1er prix : Andreas MAISONNEUVE, 2e prix : Corinne ISOLANT, 3e prix : Jean-Philippe RENARD</p><br/><br/>
                <p><b>PRIX SPÉCIAUX</b></p><br/>
                <p><b>Le prix spécial du jury</b> a été décerné à Julien PILLON</p>
                <p><b>Le prix spécial des membres</b> a été décerné à Christine CHEVRON</p>
              <div className="mx-auto mt-10 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
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
