import ImageDisplay from '../components/ImageDisplay';
import { RiUserShared2Line } from 'react-icons/ri';
import { AiOutlineEye } from 'react-icons/ai';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import LikeButton from './Like';

const PhotoCard = (props) => {
  const [viewCount, setViewCount] = useState(
    props.photo.view ? props.photo.view : 0
  );
  const [voted, setVoted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setViewCount(props.photo.view ? props.photo.view : 0);
  }, [props.photo.view]);

  useEffect(() => {
    localStorage.setItem(`voted_${props.photo.id}`, voted.toString());
  }, [voted, props.photo.id]);

  const updateViewCount = async () => {
    const newViewCount = viewCount + 1;
    await axios.patch(
      `${process.env.REACT_APP_API_URL}/photos/${props.photo.id}`,
      { view: newViewCount },
      {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      }
    );

    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/photos/${props.photo.id}`
    );

    setViewCount(res.data.view);
  };

  return (
    <div className="mb-12 max-h-[330px] max-w-lg rounded-b-lg">
      <div className="flex max-h-[300px] cursor-pointer items-center justify-center duration-300 ease-in-out hover:scale-105">
        <ImageDisplay
          imageName={props.photo.file}
          name={props.photo.member?.username}
          radius="items-center justify-center rounded-xl max-h-[300px] w-full object-cover"
          modalEnabled={true}
          photo={props.photo}
          viewCount={viewCount}
          onViewCountChange={updateViewCount}
        />
      </div>
      <div className="mt-4">
        <div className="flex justify-between">
          <p className="flex items-end rounded-full bg-gray-100 px-2 py-2 text-xs not-italic">
            <RiUserShared2Line className="mr-2 text-base" />{' '}
            {props.photo.member?.username}
          </p>
          <div className="flex">
            <p className="mr-4 flex items-end rounded-full bg-gray-100 px-2 py-2 text-xs uppercase">
              <AiOutlineEye className="mr-2 text-base" /> {viewCount}
            </p>
            <LikeButton user={user} photo={props.photo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
