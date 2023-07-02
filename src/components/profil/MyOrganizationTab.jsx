import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import OrganizationTab from './organization/OrganizationTab';
import AdminTab from './organization/AdminTab';
import ContestTab from './organization/ContestTab';
import AdTab from './organization/AdTab';
import axios from 'axios';
import { Spinner } from 'react-spinners-css';

const MyOrganizationTab = ({ organization, deselectOrganization }) => {
    const [adminData, setAdminData] = useState([]);
    const [adSpacesData, setAdSpacesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            const [adminResponse, adSpacesResponse] = await Promise.all([
              axios.get(`${process.env.REACT_APP_API_URL}/users`),
              axios.get(`${process.env.REACT_APP_API_URL}/rents`),
            ]);
      
            const filteredAdminData = adminResponse.data['hydra:member'].filter((user) =>
              user.organizations.some((org) => org.id === organization.id)
            );
      
            const relevantRents = adSpacesResponse.data['hydra:member'].filter(
              (rent) => rent.organization.id === organization.id
            );
      
            setAdminData(filteredAdminData);
            setAdSpacesData(relevantRents);
            setIsLoading(false);
          } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
          }
        };
      
        fetchData();
      }, [organization.id]);      

      const goBack = () => {
        deselectOrganization();
      };

      const refreshAdSpacesData = async () => {
        try {
          const response = await axios.get(
              `${process.env.REACT_APP_API_URL}/rents`
          );
      
          const relevantRents = response.data['hydra:member'].filter(rent => 
              rent.organization.id === organization.id
          );
      
          setAdSpacesData(relevantRents);
        } catch (error) {
          console.error("Error refreshing rents data:", error);
        }
      };

      return isLoading ? (
        <div><div className="flex items-center justify-center">
        <Spinner color="#000" />
      </div></div>
        ) : (
            <Tabs>
                <div className="grid gris-cols-1 md:grid-cols-5 sm:max-w-screen-sm 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md">
                    <div className='md:col-span-1'>
                        <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                            <AiOutlineArrowLeft className='mr-2' /> Retour
                        </Link>
                        <TabList className={'mt-6 flex flex-col space-y-2 w-full'}>
                            <Tab className={'tab-left w-full'}>Identité & coordonnées</Tab>
                            {organization.id && (
                                <>
                                    <Tab className={'tab-left w-full'}>Administrateurs</Tab>
                                    <Tab className={'tab-left w-full'}>Concours</Tab>
                                    <Tab className={'tab-left w-full'}>Publicités</Tab>
                                </>
                            )}
                        </TabList>
                    </div>
                    <div className='md:col-span-4 w-full'>
                        <p className="text-3xl font-bold not-italic leading-[160%] text-black leading-tight mb-6">{organization.name}</p>
                        <TabPanel>
                            <OrganizationTab organization={organization} />
                        </TabPanel>
                        {organization.id && (
                            <>
                            <TabPanel>
                                <AdminTab organization={organization} adminData={adminData} />
                            </TabPanel>
                            <TabPanel>
                                <ContestTab organization={organization} />
                            </TabPanel>
                            <TabPanel>
                                <AdTab organization={organization} adSpacesData={adSpacesData} refreshAdSpacesData={refreshAdSpacesData} />
                            </TabPanel>
                            </>
                        )}
                    </div>
                </div>
        </Tabs>
    );
};

export default MyOrganizationTab;