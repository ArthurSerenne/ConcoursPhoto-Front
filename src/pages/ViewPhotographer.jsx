import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../sass/components/tabs.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { useParams } from 'react-router';
import Breadcrumb from '../components/Breadcrumb';
import PresentationTab from '../components/photographer/PresentationTab';
import ContestTab from '../components/photographer/ContestTab';
import PhotoTab from '../components/photographer/PhotosTab';

const ViewPhotographer = () => {
    const { id } = useParams();
    const location = useLocation();
    const passedPhotographer = location.state && location.state.contest;
    const [photographer, setPhotographer] = useState(passedPhotographer || []);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
  
    useEffect(() => {
      axios
        .get(process.env.REACT_APP_API_URL + `/users/${id}`)
        .then((res) => {
            setPhotographer(res.data);
        });
        setLoading(false);
    }, [id]);

    const handleTabChange = (index) => {
        setActiveTab(index);
      };

    return (
        <div className='mx-6 md:mx-24'>
        <div className="mx-auto mt-10 mb-10 flex flex-wrap justify-between items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
          <Breadcrumb contest={photographer} />
        </div>
        <div className={`mx-auto mt-10 mb-10 grid grid-cols-1 md:gap-6 items-stretch 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm`}>
            <p className="text-4xl font-bold not-italic leading-[160%] text-black leading-tight">{photographer.member?.username}</p>
        <div className={`col-span-2 h-full relative ${activeTab === 4 ? 'col-span-3' : 'col-span-2'}`}>
          <Tabs onSelect={handleTabChange} className={'mb-6'}>
            <TabList className={'mb-10'}>
              <Tab>Présentation</Tab>
              {!loading && photographer.member?.photos && photographer.member?.photos.length > 0 && (
              <>
                <Tab>Participations</Tab>
                <Tab>Photos soumises aux concours</Tab>
              </>
            )}
            </TabList>
            <TabPanel>
                <PresentationTab />
            </TabPanel>
            {!loading && photographer.member?.photos && photographer.member?.photos.length > 0 && (
              <>
                <TabPanel>
                  <ContestTab />
                </TabPanel>
                <TabPanel>
                  <PhotoTab />
                </TabPanel>
              </>
              )}
          </Tabs>
        </div>
      </div>
    </div>
    )
}

export default ViewPhotographer;
