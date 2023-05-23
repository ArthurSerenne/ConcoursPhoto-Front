import ImageDisplay from '../components/ImageDisplay';
import { BiLike } from 'react-icons/bi';
import { RiUserShared2Line } from 'react-icons/ri';
import { AiOutlineEye } from 'react-icons/ai';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from  '../components/AuthContext';

const PhotoCard = (props) => {
  const [viewCount, setViewCount] = useState(props.photo.view ? props.photo.view : 0);
  const { user } = useAuth();

  useEffect(() => {
    setViewCount(props.photo.view ? props.photo.view : 0);
  }, [props.photo.view]);

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

    const res = await axios.get(`${process.env.REACT_APP_API_URL}/photos/${props.photo.id}`);

    setViewCount(res.data.view);
  };

  const handleVoteClick = async () => {
    if (user) {
      try {
        const newVoteCount = props.photo.voteCount + 1;
        await axios.patch(
          `${process.env.REACT_APP_API_URL}/photos/${props.photo.id}`,
          { voteCount: newVoteCount },
          {
            headers: {
              'Content-Type': 'application/merge-patch+json',
            },
          }
        );

        await axios.post(
          `${process.env.REACT_APP_API_URL}/votes`,
          {
            member_id: user.member.id,
            photo_id: props.photo.id,
            date_vote: new Date().toISOString(),
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        props.photo.voteCount = newVoteCount;
      } catch (error) {
        console.error('Erreur lors du vote:', error);
      }
    } else {
      console.log('Vous devez être connecté pour voter.');
    }
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
            <p
              className="flex cursor-pointer items-end rounded-full bg-gray-400 px-2 py-2 text-xs uppercase text-white duration-300 ease-in-out hover:bg-gray-300" onClick={handleVoteClick}>
              {props.photo.voteCount === 0 ? (
                <>
                    <BiLike className="mr-2 text-base" /> Voter
                </>
              ) : (
                <>
                  <BiLike className="mr-2 text-base" /> {props.photo.voteCount}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
