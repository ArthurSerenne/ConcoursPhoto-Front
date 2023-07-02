import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../sass/components/tabs.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { useParams } from 'react-router';
import ImageDisplay from '../../components/ImageDisplay';
import ContestCard from '../../components/ContestCard';
import ContestCardSkeleton from '../../components/ContestCardSkeleton';
import { GrLinkedin, GrFacebook, GrYoutube, GrTwitter } from 'react-icons/gr';
import { FaTiktok } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';

const PresentationTab = () => {
    const { id } = useParams();
    const location = useLocation();
    const [viewCount, setViewCount] = useState(0);
    const navigate = useNavigate();
    const passedOrganization = location.state && location.state.contest;
    const [organization, setOrganization] = useState(passedOrganization || []);
    const [loading, setLoading] = useState(true);
    const [recentContest, setRecentContest] = useState(null);
  
    useEffect(() => {
      axios
        .get(process.env.REACT_APP_API_URL + `/organizations/${id}`)
        .then((res) => {
          setOrganization(res.data);
          const contests = res.data.contests;
          if (contests && contests.length > 0) {
            const sortedContests = contests
              .filter((contest) => contest.deletionDate === undefined && contest.status === true)
              .sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
            setRecentContest(sortedContests[0]);
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
  
    console.log(recentContest);

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
            <div className="mx-auto mt-10 mb-10 grid grid-cols-1 md:grid-cols-3 md:gap-12 items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
            <div className="col-span-2 max-h-[40rem]">
                {loading ? (
                    <div className="rounded-xl object-cover bg-gray-200 md:h-[40rem] w-full cursor-default" />
                ) : (
                    organization.logo && <ImageDisplay imageName={organization.logo} radius="rounded-xl object-cover md:h-[40rem] w-full cursor-default" />
                )}
                </div>
                <div className="grid grid-cols-2 max-h-[40rem] gap-4 mt-4 md:flex md:flex-col md:space-y-3 md:mt-0">
                <div className="flex flex-grow justify-center md:h-[20rem]">
                    {loading ? (
                        <div className="bg-gray-200 w-full h-full rounded-xl" />
                    ) : (
                    organization.logo && <ImageDisplay imageName={organization.logo} radius="w-full h-full rounded-xl" />
                    )}
                </div>
                <div className="z-0 flex flex-grow justify-center w-full md:h-[20rem]">
                    {loading ? (
                        <div className="bg-gray-200 w-full h-full rounded-xl" />
                    ) : (
                    organization && organization.city && (
                        <MapContainer center={[organization.city.gps_lat, organization.city.gps_lng]} zoom={7} scrollWheelZoom={false} className='w-full h-full rounded-xl'>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[organization.city.gps_lat, organization.city.gps_lng]}>
                                <Popup>
                                {organization.city.name} <br /> {organization.city.zip_code}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    )
                    )}
                </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mx-auto mt-16 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <div className='md:col-span-2'>
                    <div className='mb-12'>
                        {organization.description}
                    </div>
                    <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center">
                        <AiOutlineArrowLeft className='mr-2' /> Retour
                    </Link>
                </div>
                <div className='md:col-span-1'>
                {loading
                    ? Array.from({ length: 1 }, (_, i) => (
                        <ContestCardSkeleton key={i} />
                        ))
                    : recentContest
                        ? <ContestCard contest={recentContest} key={recentContest.id} />
                        : null
                    }
                <div className='mt-10'>
                    <p className='text-2xl'>Nous contacter</p>
                    <p className='font-bold mt-5'>Adresse</p>
                    <div className='mt-2'>
                        <p>{organization.address}</p>
                        <p>{organization.city ? organization.city.zip_code : ''} {organization.city ? organization.city.name : ''}</p>
                    </div>
                    <div className='mt-2 mb-10'>
                        <p>Tél : {organization.phone}</p>
                        <p>Email : <span className='underline'>{organization.email}</span></p>
                        <p className='text-xs mt-2'>Dernière mise à jour : 24/03/2023</p>
                        {organization.socialNetwork ? 
                            <div className='flex flex-row gap-2 mt-6'>
                                {organization.socialNetwork.linkedin ? <a href={organization.socialNetwork.linkedin} target='_blank' rel='noopener noreferrer'><GrLinkedin /></a> : ''}
                                {organization.socialNetwork.facebook ? <a href={organization.socialNetwork.facebook} target='_blank' rel='noopener noreferrer'><GrFacebook /></a> : ''}
                                {organization.socialNetwork.instagram ? <a href={organization.socialNetwork.instagram} target='_blank' rel='noopener noreferrer'><RiInstagramFill /></a> : ''}
                                {organization.socialNetwork.youtube ? <a href={organization.socialNetwork.youtube} target='_blank' rel='noopener noreferrer'><GrYoutube /></a> : ''}
                                {organization.socialNetwork.twitter ? <a href={organization.socialNetwork.twitter} target='_blank' rel='noopener noreferrer'><GrTwitter /></a> : ''}
                                {organization.socialNetwork.tiktok ? <a href={organization.socialNetwork.tiktok} target='_blank' rel='noopener noreferrer'><FaTiktok /></a> : ''}
                            </div>
                        : ''}
                    </div>
                    <a className='text-white bg-gray-400 px-9 py-5 rounded-full hover:bg-gray-300' href={organization.website ? organization.website : ''} target='_blank'>Site Web</a>
                </div>
              </div>
            </div>
        </div>
    )
}

export default PresentationTab;
