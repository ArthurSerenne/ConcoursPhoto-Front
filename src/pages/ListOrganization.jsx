import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import ContestCardSkeleton from '../components/ContestCardSkeleton';
import { RiArrowRightSLine, RiArrowLeftSLine } from 'react-icons/ri';
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaList } from "react-icons/fa";
import { TbMap2 } from "react-icons/tb";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { useNavigate } from 'react-router-dom';
import OrganizationCard from '../components/OrganizationCard';
import OrganizationCardList from '../components/OrganizationCardList';
import ListOrganizationFilter from '../components/ListOrganizationFilter';

const ListOrganization = () => {
    const [organizations, setOrganizations] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [filterValues, setFilterValues] = useState({
        search: '',
        city: [],
        department: [],
        checked: false,
      });      
    const [filteredOrganization, setFilteredOrganization] = useState([]);
  
    const handleItemsPerPageChange = (event) => {
      setItemsPerPage(parseInt(event.target.value));
      setCurrentPage(0);
    };
  
    const handlePageClick = (selectedPage) => {
      setCurrentPage(selectedPage.selected);
    };
  
    const handleClick = (organization) => {
        navigate(`/organisateurs/${organization.id}`);
    };
  
    useEffect(() => {
      const fetchData = async () => {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + '/organizations.json'
        );
        setOrganizations(response.data);
        setLoading(false);
      };
      fetchData();
    }, []);
  
    useEffect(() => {
        const today = new Date();
      
        const filtered = organizations.filter((organization) => {
          const searchMatch =
            filterValues.search.trim() === '' ||
            organization.name
              .toLowerCase()
              .includes(filterValues.search.trim().toLowerCase());
      
              const cityMatch =
                filterValues.city.length === 0 ||
                (organization.city && filterValues.city.some((city) => organization.city.id === city.value));

            const departmentMatch =
                filterValues.department.length === 0 ||
                (organization.zipCode && filterValues.department.some((department) => organization.zipCode.id === department.value));     
      
                const contestsMatch =
                !filterValues.checked ||
                organization.contests?.some((contest) => {
                  const publicationDate = new Date(contest.publicationDate);
                  const votingEndDate = new Date(contest.votingEndDate);
                  return today >= publicationDate && today <= votingEndDate;
                });
              
              if (!contestsMatch) {
                return false;
              }
              
              return (
                organization.status === true &&
                organization.deletionDate === undefined &&
                searchMatch &&
                cityMatch &&
                departmentMatch
              );
        });
      
        setFilteredOrganization(filtered);
      }, [organizations, filterValues]);
      
      const applyFilters = (search, city, department, checked) => {
        setFilterValues({ search, city, department, checked });
      };      
  
    const totalPages = Math.ceil(filteredOrganization.length / itemsPerPage);

    console.log(filteredOrganization);
  
    const [isGridMode, setIsGridMode] = useState(true);
    const [isMap, setIsMap] = useState(false);

    return (
        <div className='mx-6 md:mx-24'>
      <div className="mx-auto mt-10 mb-12 flex flex-wrap justify-between items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
        <div>
          <p className="text-4xl font-bold not-italic leading-[160%] text-black">
            Rechercher un organisateur de concours
          </p>
        </div>
      </div>
      <ListOrganizationFilter applyFilters={applyFilters} className="z-10" />
      <div>
      </div>
      <div className="mx-auto mt-12 mb-12 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">    
        <div className="flex justify-between items-center">
        <p className='text-3xl mb-8'>{filteredOrganization.length} résultats</p>
          <div className="flex gap-4">
          <button
              onClick={() => {
                setIsGridMode(true);
                setIsMap(false);
              }}
              className={isGridMode && !isMap ? "text-black" : "text-gray-300"}
            >
              <BsGrid3X3GapFill />
            </button>
            <button
              onClick={() => {
                setIsGridMode(false);
                setIsMap(false);
              }}
              className={!isGridMode && !isMap ? "text-black" : "text-gray-300"}
            >
              <FaList />
            </button>
            <button
              onClick={() => {
                setIsMap(true);
              }}
              className={isMap ? "text-black" : "text-gray-300"}
            >
              <TbMap2 />
            </button>
          </div>
        </div>
        {!isMap ?
            <div>
              <div className={isGridMode ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "list"}>
              {loading
                  ? Array.from({ length: itemsPerPage }, (_, i) => (
                        <ContestCardSkeleton key={i} />
                    ))
                  : filteredOrganization
                      .slice(currentPage * itemsPerPage, (currentPage * itemsPerPage) + itemsPerPage)
                      .map((organization) => (
                        isGridMode ? (
                          <OrganizationCard organization={organization} key={organization.id} />
                        ) : (
                          <OrganizationCardList organization={organization} key={organization.id} />
                        )
                    ))}
          </div>
          <div>
            <div className="mb-6 mt-6">
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
              breakLabel={'...'}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={
                'flex items-center place-content-center justify-center content-center justify-self-center'
              }
              activeClassName={'text-black'}
              breakClassName={'mx-2'}
              pageClassName={'page-item mx-1'}
              previousClassName={'page-item mx-1'}
              nextClassName={'page-item mx-1 text-lg'}
              pageLinkClassName={
                'page-link px-4 pt-2.5 pb-3 bg-gray-200 rounded-full text-xl hover:bg-gray-100'
              }
              previousLinkClassName={
                'bg-gray-200 px-2.5 pt-2 pb-2.5 text-2xl rounded-full hover:bg-gray-100'
              }
              nextLinkClassName={
                'bg-gray-200 px-2.5 pt-2 pb-2.5 text-2xl rounded-full hover:bg-gray-100'
              }
              forcePage={currentPage}
            />
          </div>
        </div> : 
          <div className='max-w-screen h-screen'>
            <MapContainer center={[46.603354, 1.888334]} zoom={6} scrollWheelZoom={false} className='w-full h-full rounded-xl z-0'>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
        
                {filteredOrganization.map((organization, index1) => {
                    return (
                        <Marker key={`${index1}`} position={[organization.city.gps_lat, organization.city.gps_lng]}>
                            <Popup>
                                <div>
                                    <p>Organisateur : {organization.name}</p>
                                    <p>Ville : {organization.city.name} - {organization.city.zip_code} <span onClick={() => handleClick(organization)} className='ml-2 bg-gray-200 py-2 px-3 rounded-full hover:bg-gray-100 hover:cursor-pointer'>Voir</span></p>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
        }
      </div>
    </div>
    );
}

export default ListOrganization;
