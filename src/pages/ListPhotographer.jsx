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
import ListPhotographerFilter from '../components/ListPhotographerFilter';
import PhotographerCard from '../components/PhotographerCard';
import PhotographerCardList from '../components/PhotographerCardList';
import ResizeObserverCorrection from '../components/ResizeObserverCorrection';

const ListPhotographer = () => {
    ResizeObserverCorrection();
    const [photographers, setPhotographers] = useState([]);
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
    const [filteredPhotographers, setFilteredPhotographers] = useState([]);
  
    const handleItemsPerPageChange = (event) => {
      setItemsPerPage(parseInt(event.target.value));
      setCurrentPage(0);
    };
  
    const handlePageClick = (selectedPage) => {
      setCurrentPage(selectedPage.selected);
    };
  
    const handleClick = (photographer) => {
        navigate(`/photographes/${photographer.id}`);
    };
  
    useEffect(() => {
      const fetchData = async () => {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + '/users.json'
        );
        const photos = response.data.filter((user) => user.member?.photos?.length > 0);
        setPhotographers(photos);
        setLoading(false);
      };
      fetchData();
    }, []);
  
    useEffect(() => {      
        const filtered = photographers.filter((photographer) => {
            const searchMatch = 
                filterValues.search.trim() === '' ||
                (photographer.member?.username && photographer.member?.username.toLowerCase().includes(filterValues.search.trim().toLowerCase())) ||
                (photographer.lastname && photographer.lastname.toLowerCase().includes(filterValues.search.trim().toLowerCase())) ||
                (photographer.firstname && photographer.firstname.toLowerCase().includes(filterValues.search.trim().toLowerCase()));               
              
              return (
                photographer.status === true &&
                photographer.deletionDate === undefined &&
                searchMatch
              );
        });
      
        setFilteredPhotographers(filtered);
      }, [photographers, filterValues]);
      
      const applyFilters = (search, city, department, checked) => {
        setFilterValues({ search, city, department, checked });
      };      
  
    const totalPages = Math.ceil(filteredPhotographers.length / itemsPerPage);

    console.log(filteredPhotographers);
  
    const [isGridMode, setIsGridMode] = useState(true);
    const [isMap, setIsMap] = useState(false);

    return (
        <div className='mx-6 md:mx-24'>
      <div className="mx-auto mt-10 mb-12 flex flex-wrap justify-between items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
        <div>
          <p className="text-4xl font-bold not-italic leading-[160%] text-black">
            Rechercher un photographe
          </p>
        </div>
      </div>
      <ListPhotographerFilter applyFilters={applyFilters} className="z-10" />
      <div>
      </div>
      <div className="mx-auto mt-12 mb-12 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">    
        <div className="flex justify-between items-center">
        <p className='text-3xl mb-8'>{filteredPhotographers.length} résultats</p>
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
                  : filteredPhotographers
                      .slice(currentPage * itemsPerPage, (currentPage * itemsPerPage) + itemsPerPage)
                      .map((photographer) => (
                        isGridMode ? (
                          <PhotographerCard photographer={photographer} key={photographer.id} />
                        ) : (
                          <PhotographerCardList photographer={photographer} key={photographer.id} />
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
        
                {filteredPhotographers.map((photographer, index1) => {
                    return (
                        <Marker key={`${index1}`} position={[photographer.city.gps_lat, photographer.city.gps_lng]}>
                            <Popup>
                                <div>
                                    <p>Photographe : {photographer.member.username}</p>
                                    <p>Ville : {photographer.city.name} - {photographer.city.zip_code} <span onClick={() => handleClick(photographer)} className='ml-2 bg-gray-200 py-2 px-3 rounded-full hover:bg-gray-100 hover:cursor-pointer'>Voir</span></p>
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

export default ListPhotographer;
