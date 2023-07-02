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
import PresentationTab from '../components/organization/PresentationTab';
import ActiveContestsTab from '../components/organization/ActiveContestsTab';
import UpcomingContestsTab from '../components/organization/UpcomingContestsTab';
import FinishedContestsTab from '../components/organization/FinishedContestsTab';

const ViewOrganization = () => {
  const { id } = useParams();
  const location = useLocation();
  const [viewCount, setViewCount] = useState(0);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
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
            .filter(
              (contest) =>
                contest.deletionDate === undefined && contest.status === true
            )
            .sort(
              (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
            );
          setRecentContest(sortedContests[0]);
        }
        setLoading(false);
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

  console.log(organization);

  const goBack = () => {
    navigate(-1);
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const incrementViewCount = () => {
    setViewCount(viewCount + 1);
  };

  useEffect(() => {
    incrementViewCount();
  }, []);

  return (
    <div className="mx-6 md:mx-24">
      <div className="mx-auto mb-10 mt-10 flex flex-wrap items-center justify-between sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <Breadcrumb contest={organization} />
      </div>
      <div
        className={`mx-auto mb-10 mt-10 grid grid-cols-1 items-stretch sm:max-w-screen-sm md:max-w-screen-md md:gap-6 lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl`}
      >
        <p className="text-4xl font-bold not-italic leading-[160%] leading-tight text-black">
          {organization.name}
        </p>
        <div
          className={`relative col-span-2 h-full ${
            activeTab === 4 ? 'col-span-3' : 'col-span-2'
          }`}
        >
          <Tabs onSelect={handleTabChange} className={'mb-6'}>
            <TabList className={'mb-10'}>
              <Tab>Présentation</Tab>
              {!loading &&
                organization.contests &&
                organization.contests.length > 0 && (
                  <>
                    <Tab>Concours photos en cours</Tab>
                    <Tab>Concours photos à venir</Tab>
                    <Tab>Concours photos terminés</Tab>
                  </>
                )}
            </TabList>
            <TabPanel>
              <PresentationTab />
            </TabPanel>
            {!loading &&
              organization.contests &&
              organization.contests.length > 0 && (
                <>
                  <TabPanel>
                    <ActiveContestsTab />
                  </TabPanel>
                  <TabPanel>
                    <UpcomingContestsTab />
                  </TabPanel>
                  <TabPanel>
                    <FinishedContestsTab />
                  </TabPanel>
                </>
              )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ViewOrganization;
