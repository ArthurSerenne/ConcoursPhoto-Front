import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../sass/components/tabs.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import SituationEnum from '../enums/SituationEnum';
import CategoryEnum from '../enums/CategoryEnum';
import ImageDisplay from '../ImageDisplay';

const PresentationTab = () => {
  const { id } = useParams();
  const location = useLocation();
  const [viewCount, setViewCount] = useState(0);
  const passedPhotographer = location.state && location.state.contest;
  const [photographer, setPhotographer] = useState(passedPhotographer || null);
  const [loading, setLoading] = useState(true);
  const defaultImagePath =
    'https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive.jpg';
  const [imageSrc, setImageSrc] = useState(defaultImagePath);

  const incrementViewCount = () => {
    setViewCount(viewCount + 1);
  };

  useEffect(() => {
    if (!photographer) {
      axios
        .get(process.env.REACT_APP_API_URL + `/users/${id}`)
        .then((res) => {
          const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
          const imagePath = `${baseUrl}${res.data.member?.photo}`;
          setImageSrc(imagePath);
          setPhotographer(res.data);
          setLoading(false);
        })
        .catch((error) => {});
    } else {
      const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
      const imagePath = `${baseUrl}${photographer.member?.photo}`;
      setImageSrc(imagePath);
      setLoading(false);
    }
    incrementViewCount();
  }, [id]);

  const handleError = () => {
    setImageSrc(defaultImagePath);
  };

  return (
    <div className="grid md:grid-cols-2">
      <div className="mb-10 flex flex-row justify-center gap-6 md:justify-start md:gap-24">
        <div className="space-y-2">
          <p className="text-xl font-bold">
            {photographer?.lastname} {photographer?.firstname}
          </p>
          <p>Situation : {SituationEnum[photographer?.member?.situation]}</p>
          <p>
            Catégorié photographe :{' '}
            {CategoryEnum[photographer?.member?.category]}
          </p>
          <p>Tél : {photographer?.phone}</p>
          <p className="pb-10">
            Email :{' '}
            <span className="font-bold underline">{photographer?.email}</span>
          </p>
          <a
            className="rounded-full bg-gray-400 px-9 py-5 text-white hover:bg-gray-300"
            href={
              photographer?.member?.website ? photographer?.member?.website : ''
            }
            target="_blank"
          >
            Site Web
          </a>
        </div>
        <div>
          <img
            src={imageSrc}
            className="h-32 w-32 rounded-full"
            onError={handleError}
            alt="Photographer"
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xl font-bold">Dernières photos soumises</p>
        <div className="grid grid-cols-2 gap-4">
          {photographer?.member?.photos
            ?.filter((photo) => photo.status === true)
            .sort(
              (a, b) => new Date(b.submissionDate) - new Date(a.submissionDate)
            )
            .map((photo) => (
              <ImageDisplay imageName={photo} radius={'rounded-lg'} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PresentationTab;
