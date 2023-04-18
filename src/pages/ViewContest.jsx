import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useParams } from 'react-router';
import '../sass/components/tabs.scss';
import { Spinner } from 'react-spinners-css';
import { Link } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { AiOutlineUserAdd, AiOutlineCamera } from "react-icons/ai";

const ViewContest = () => {
  const { id } = useParams();
  const location = useLocation();
  const passedContest = location.state && location.state.contest;
  const [contest, setContest] = useState(passedContest || []);
  const [loading, setLoading] = useState(true);
  const [uniquePhotographers, setTotalPhotographers] = useState(0);
  const formattedDate = format(new Date(contest.resultsDate), 'dd/MM/yyyy');

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
      console.log("Contest data:", contest); // Log contest data
      console.log("Photos:", contest.photos); // Log photos
  
      const uniquePhotographers = contest.photos.reduce((acc, photo) => {
        console.log("Photo:", photo); // Log individual photo
        console.log("Member:", photo.member); // Log member
        acc.add(photo.member);
        return acc;
      }, new Set());
  
      setTotalPhotographers(uniquePhotographers.size);
    }
  }, [contest]);

  return (
    <div>
      <div>
        <div className="max-w-screen-2xl mx-auto mt-10 mb-10 flex flex-wrap justify-between items-center">
          <p><span>Accueil</span> {'>'} <span>Concours photos</span> {'>'} <span className='font-bold'>Concours photo "{contest.name}"</span></p>
        </div>
        <div className="max-w-screen-2xl mx-auto mt-10 mb-10 flex justify-center gap-12">
          <div className='w-2/3'>
            <p className="text-4xl font-bold not-italic leading-[160%] text-black leading-tight">Concours photo "{contest.name}"</p>
          </div>
          <div className='gap-6 items-center w-1/3'>
            <p>Organisateur : <span className='underline font-bold'>{contest.organization.name}</span></p>
            <div className="max-w-screen-2xl mx-auto flex flex-wrap items-end space-x-4">
              <p className="bg-black text-white rounded-full py-1 px-4 max-w-fit mt-4 text-xs">PHASE DE VOTE</p>
              <p>Fin le {formattedDate}</p>
            </div>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto mt-4 mb-4 flex justify-center gap-12">
          <div className='w-2/3 flex flex-wrap gap-2'>
          <p className="bg-gray-100 rounded-full py-2 px-4 max-w-fit text-xs">
            THEME(S) :{" "}
            {contest.themes
              .map((theme) => theme.name)
              .join(", ")
              .split(", ")
              .map((themeName) => (
                <span className="font-extrabold uppercase">{themeName}</span>
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
                .map((regionName) => (
                  <span className="font-extrabold uppercase">{regionName}</span>
                ))}
            </p>
            <p className="bg-gray-100 rounded-full py-2 px-4 max-w-fit text-xs">
              CATEGORIES(S) :{" "}
              {contest.categories
                .map((category) => category.name)
                .join(", ")
                .split(", ")
                .map((categoryName) => (
                  <span className="font-extrabold uppercase">{categoryName}</span>
                ))}
            </p>
            <p className="bg-gray-100 rounded-full py-2 px-4 max-w-fit text-xs">
              ÂGE : <span className="font-extrabold uppercase">{contest.ageMin} - {contest.ageMax} ans</span>
            </p>
            <p className="bg-gray-100 rounded-full py-2 px-4 max-w-fit text-xs">DOTATION : <span className='font-extrabold uppercase'>Cadeaux</span></p>
          </div>
          <div className='gap-6 items-center w-1/3'>
            <div className="max-w-screen-2xl mx-auto flex flex-wrap items-end space-x-4">
              <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit"><AiOutlineUserAdd /> {uniquePhotographers}</p>
              <p className="bg-gray-100 rounded-full py-1 px-4 max-w-fit"><AiOutlineCamera /> {contest.photos.length}</p>
            </div>
          </div>
        </div>
          <div className="max-w-screen-2xl mx-auto mt-10 mb-10 flex justify-center items-center gap-12">
            <div className='w-2/3'>
              <img className='w-full h-auto' src={contest.visual} alt={`Image ${contest.name}`} />
            </div>
            <div className='w-1/3'>
              <div>
                <img className='w-full max-h-full ' src={contest.visual} alt={`Image ${contest.name}`} />
              </div>
              <div>
                <img className='w-full max-h-full' src={contest.visual} alt={`Image ${contest.name}`} />
              </div>
            </div>
          </div>
        </div>
      <div>
      <div className="max-w-screen-2xl mx-auto mt-10 mb-10 flex gap-12">
        <div className='w-2/3'>
        {loading ? (
          <Spinner color="#000" />
        ) : (
          <Tabs>
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
            </TabPanel>
            <TabPanel>
              <h2 className="flex items-center text-text-2xl font-normal not-italic">
                Règlement du concours
              </h2>
              {contest.rules}
            </TabPanel>
            <TabPanel>
              <h2 className="flex items-center text-text-2xl font-normal not-italic">
                Prix à gagner
              </h2>
              {contest.prizes}
            </TabPanel>
            <TabPanel>
              <h2 className="flex items-center text-text-2xl font-normal not-italic">
                {contest.juryMembers.length} membres du Jury
              </h2>
              {contest.juryMembers.map(
                (juryMember) => <p key={juryMember.id}>{juryMember.id}</p>
              )}
            </TabPanel>
            <TabPanel>
              <h2 className="flex items-center text-text-2xl font-normal not-italic">
                {contest.photos.length} photos soumises par 169 photographes
              </h2>
              {contest.description}
            </TabPanel>
            <TabPanel>
              <h2 className="flex items-center text-text-2xl font-normal not-italic">
                Résultats du concours photo
              </h2>
              {contest.description}
            </TabPanel>
          </Tabs>
        )}
        </div>
        <div className='w-1/3'>
          <p className="text-xl font-bold not-italic leading-[160%] text-black mb-8">Dernières photos soumises</p>
          <div className='grid grid-cols-2 gap-5'>
            {contest.photos.map(
                (photo) => <img src={photo.file} alt={`Photo de ${photo.name}`} />
              )}
          </div>
        </div>
      </div>
      </div>
      <div className="max-w-screen-2xl mx-auto">
        <Link to={`/`} className="rounded-[44px] bg-button-grey px-[30px] py-3.5">
          <RiArrowLeftLine /> Retour
        </Link>
      </div>
    </div>
  );
};

export default ViewContest;
