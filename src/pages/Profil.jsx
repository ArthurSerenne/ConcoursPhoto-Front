import { useAuth } from '../components/AuthContext';
<<<<<<< HEAD
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import MyProfilTab from '../components/profil/MyProfilTab';
import MyPreferencesTab from '../components/profil/MyPreferencesTab';
import MyOrganizationTab from '../components/profil/MyOrganizationTab';
import ContestOrganizationTab from '../components/profil/ContestOrganizationTab';
import ContestParticipationTab from '../components/profil/ContestParticipationTab';
import AdTab from '../components/profil/AdTab';

const Profil = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  console.log(user);

  if (isLoading) {
    return (
      <div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div>
        <p>Veuillez vous connecter pour accéder à cette page.</p>
      </div>
    );
  }

  const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  return (
    <div className='mx-6 xl:mx-12'>
      <div className="mx-auto mt-10 mb-8 flex flex-wrap justify-between items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
        <p><span>Accueil</span> {'>'} <span className="font-bold">Mon compte</span></p>
      </div>
      <div className="mx-auto mt-8 mb-6 flex flex-wrap justify-between items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
        <p className="text-4xl font-bold not-italic leading-[160%] text-black leading-tight">Mon compte</p>
      </div>
      <div className="mx-auto mb-12 flex flex-wrap justify-between items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
        <Tabs>
            <TabList className={'mb-10 flex flex-col lg:flex-row'}>
                <Tab>Mon profil</Tab>
                <Tab>Mes préférences</Tab>
                <Tab>Mon organisation</Tab>
                <Tab>Concours crées par mon organisation</Tab>
                <Tab>Concours auxquels j'ai participé</Tab>
                <Tab>Mes publicités</Tab>
            </TabList>

            <TabPanel>
                <MyProfilTab />
            </TabPanel>
            <TabPanel>
                <MyPreferencesTab />
            </TabPanel>
            <TabPanel>
                <MyOrganizationTab />
            </TabPanel>
            <TabPanel>
                <ContestOrganizationTab />
            </TabPanel>
            <TabPanel>
                <ContestParticipationTab />
            </TabPanel>
            <TabPanel>
                <AdTab />
            </TabPanel>
        </Tabs>
      </div>
    </div>
  );
=======

const Profil = () => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return (
            <div>
                <p>Veuillez vous connecter pour accéder à cette page.</p>
            </div>
        );
    }

    return (
        <div className='mx-12 md:mx-24'>
            <div className="mx-auto mt-10 mb-8 flex flex-wrap justify-between items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <p><span>Accueil</span> {'>'} <span className="font-bold">Mon compte</span></p>
            </div>
            <div className="mx-auto mt-8 mb-12 flex flex-wrap justify-between items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <p className="text-4xl font-bold not-italic leading-[160%] text-black leading-tight">Mon compte</p>
                <p>ID utilisateur : {user && user.id}</p>
            </div>
        </div>
    );
>>>>>>> 6b9b2da (test)
}

export default Profil;
