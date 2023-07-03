import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../sass/components/tabs.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import ReactPaginate from 'react-paginate';
import ImageDisplay from '../ImageDisplay';
import { RiArrowRightSLine, RiArrowLeftSLine } from 'react-icons/ri';

const PhotoTab = () => {
  const { id } = useParams();
  const location = useLocation();
  const [viewCount, setViewCount] = useState(0);
  const passedPhotographer = location.state && location.state.contest;
  const [photographer, setPhotographer] = useState(passedPhotographer || []);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + `/users/${id}`).then((res) => {
      setPhotographer(res.data);
      const photos = res.data.member.photos;
      if (photos && photos.length > 0) {
        const activePhotos = photos.filter((photo) => photo.status === true);
        setPhotos(activePhotos);
      }
    });
  }, [id]);

  useEffect(() => {
    if (!passedPhotographer) {
      axios.get(process.env.REACT_APP_API_URL + `/users/${id}`).then((res) => {
        setPhotographer(res.data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id, !passedPhotographer]);

  const incrementViewCount = () => {
    setViewCount(viewCount + 1);
  };

  useEffect(() => {
    incrementViewCount();
  }, []);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(0);
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const totalPages = Math.ceil(
    photos.filter((photo) => photo.status === true).length / itemsPerPage
  );

  return (
    <div>
      <div className="mx-auto mb-10 mt-10 grid grid-cols-1 items-center sm:max-w-screen-sm md:max-w-screen-md md:gap-6 lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <p className="text-2xl">
          {photos.length} photo{photos.length > 1 ? 's' : ''}
        </p>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="mb-10 h-[300px] w-full animate-pulse rounded-b-lg bg-gray-200 p-3 shadow-xl"></div>
            <div className="mb-10 h-[300px] w-full animate-pulse rounded-b-lg bg-gray-200 p-3 shadow-xl"></div>
            <div className="mb-10 h-[300px] w-full animate-pulse rounded-b-lg bg-gray-200 p-3 shadow-xl"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {photos
              ? photos.map((photo) => <ImageDisplay imageName={photo} />)
              : ''}
          </div>
        )}
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
    </div>
  );
};

export default PhotoTab;
