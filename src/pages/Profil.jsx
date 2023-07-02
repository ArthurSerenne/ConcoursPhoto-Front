import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import MyProfilTab from '../components/profil/MyProfilTab';
import MyPreferencesTab from '../components/profil/MyPreferencesTab';
import MyOrganizationTab from '../components/profil/MyOrganizationTab';
import ContestOrganizationTab from '../components/profil/ContestOrganizationTab';
import ContestParticipationTab from '../components/profil/ContestParticipationTab';
import '../sass/components/tabs.scss';
import OrganizationsTab from '../components/profil/OrganizationsTab';

const Profil = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const deselectOrganization = () => {
    setSelectedOrganization(null);
  };

  if (isLoading) {
    return <></>;
  }

  if (!isAuthenticated) {
    return (
      <div className="py-36 text-center">
        <p className="text-lg">
          Veuillez vous connecter pour accéder à cette page.
        </p>
      </div>
    );
  }

  const totalContests = user.organizations.reduce(
    (acc, organization) =>
      acc + (organization.contests ? organization.contests.length : 0),
    0
  );

  const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  console.log(user.member.photos);

  return (
    <div className="mx-6 md:mx-24">
      <div className="mx-auto mb-8 mt-10 flex flex-wrap items-center justify-between sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <p>
          <span>Accueil</span> {'>'}{' '}
          <span className="font-bold">Mon compte</span>
        </p>
      </div>
      <div className="mx-auto mb-6 mt-8 flex flex-wrap items-center justify-between sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <p className="text-4xl font-bold not-italic leading-[160%] leading-tight text-black">
          Mon compte
        </p>
      </div>
      <div className="mx-auto mb-12 items-center justify-between sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <Tabs>
          <TabList className={'mb-10 flex flex-col lg:flex-row'}>
            <Tab>Mon profil</Tab>
            <Tab>Mes préférences</Tab>
            <Tab>Mes organisations</Tab>
            {totalContests > 0 ? <Tab>Concours que j’administre</Tab> : ''}
            {user.member.photos.length > 0 ? (
              <Tab>Concours auxquels j'ai participé</Tab>
            ) : (
              ''
            )}
          </TabList>

          <TabPanel>
            <MyProfilTab />
          </TabPanel>
          <TabPanel>
            <MyPreferencesTab />
          </TabPanel>
          <TabPanel>
            {selectedOrganization ? (
              <MyOrganizationTab
                organization={selectedOrganization}
                deselectOrganization={deselectOrganization}
              />
            ) : (
              <OrganizationsTab
                setSelectedOrganization={setSelectedOrganization}
              />
            )}
          </TabPanel>
          {totalContests > 0 ? (
            <TabPanel>
              <ContestOrganizationTab />
            </TabPanel>
          ) : (
            ''
          )}
          <TabPanel>
            <ContestParticipationTab />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default Profil;
