import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../sass/components/tabs.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import ContestCardList from '../ContestCardList';

const ContestTab = () => {
    const { id } = useParams();
    const location = useLocation();
    const [viewCount, setViewCount] = useState(0);
    const passedPhotographer = location.state && location.state.contest;
    const [photographer, setPhotographer] = useState(passedPhotographer || []);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      axios
        .get(process.env.REACT_APP_API_URL + `/users/${id}`)
        .then((res) => {
          setPhotographer(res.data);
          const photos = res.data.member.photos;
          if (photos && photos.length > 0) {
            const activePhotos = photos
              .filter((photo) => photo.status === true);
              setPhotos(activePhotos);
          }
        });
    }, [id]);
  
    useEffect(() => {
      if (!passedPhotographer) {
        axios
          .get(process.env.REACT_APP_API_URL + `/users/${id}`)
          .then((res) => {
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

    return (
        <div>
            <div className="mx-auto mt-10 mb-10 grid grid-cols-1 md:gap-6 items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <p className='text-2xl'>{photos.length} concours</p>
                {loading ? 
                    <div> 
                        <div className='h-[300px] animate-pulse rounded-b-lg bg-gray-200 p-3 shadow-xl w-full mb-10'></div>
                        <div className='h-[300px] animate-pulse rounded-b-lg bg-gray-200 p-3 shadow-xl w-full mb-10'></div>
                        <div className='h-[300px] animate-pulse rounded-b-lg bg-gray-200 p-3 shadow-xl w-full mb-10'></div>
                    </div> :
                    (photos ? photos.map((photo) => <ContestCardList contest={photo.contest} />) : '')
                }
            </div>
        </div>
    );
}

export default ContestTab;
