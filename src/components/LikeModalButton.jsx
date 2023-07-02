import { BiLike } from 'react-icons/bi';
import { useState, useEffect } from 'react';
import axios from 'axios';

const LikeModalButton = ({ user, photo }) => {
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setTimeout(checkIfVoted, 1000);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`voted_${photo.id}`, voted.toString());
  }, [voted, photo.id]);

  const handleVoteClick = async (event) => {
    event.stopPropagation();
    if (user) {
      try {
        const now = new Date();
        const dateVote = now.toISOString().split('.')[0];

        if (voted) {
          setVoted(false);
          const voteResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/votes`,
            {
              params: {
                member: `${process.env.REACT_APP_API_URL}/members/${user.member.id}`,
                photo: `${process.env.REACT_APP_API_URL}/photos/${photo.id}`,
              },
            }
          );

          const votes = voteResponse.data['hydra:member'];
          const voteIndexToDelete = votes.findIndex((vote) => {
            return (
              vote.member.id === user.member.id && vote.photo.id === photo.id
            );
          });

          if (voteIndexToDelete !== -1) {
            const voteToDelete = votes[voteIndexToDelete];
            await axios.delete(
              `${process.env.REACT_APP_API_URL}/votes/${voteToDelete.id}`
            );
          }
        } else {
          const newVoteCount = photo.voteCount + 1;
          setVoted(true);

          await axios.patch(
            `${process.env.REACT_APP_API_URL}/photos/${photo.id}`,
            { voteCount: newVoteCount, lastVoteDate: dateVote },
            {
              headers: {
                'Content-Type': 'application/merge-patch+json',
              },
            }
          );

          if (dateVote) {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/votes`,
              {
                member: `${process.env.REACT_APP_API_URL}/members/${user.member.id}`,
                photo: `${process.env.REACT_APP_API_URL}/photos/${photo.id}`,
                date_vote: dateVote,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
          } else {
            console.log('La date du vote est nulle.');
          }
        }
      } catch (error) {
        console.error('Erreur lors du vote:', error);
      }
    } else {
      console.log('Vous devez être connecté pour voter.');
    }
  };

  const checkIfVoted = async () => {
    if (user) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/votes`,
          {
            params: {
              member: `${process.env.REACT_APP_API_URL}/members/${user.member.id}`,
              photo: `${process.env.REACT_APP_API_URL}/photos/${photo.id}`,
            },
          }
        );

        const votes = response.data['hydra:member'];
        const voted = votes.some((vote) => {
          const voteMatch =
            vote.member.id === user.member.id && vote.photo.id === photo.id;
          return voteMatch;
        });

        setVoted(voted);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la vérification du vote:', error);
        setLoading(false);
      }
    }
  };

  if (loading || !user) {
    return null;
  }

  return (
    <p
      className={`z-10 flex cursor-pointer items-end rounded-full bg-gray-400 px-2 py-2 text-xs uppercase text-white duration-300 ease-in-out hover:bg-gray-300 ${
        voted ? 'bg-green-500' : ''
      }`}
      onClick={handleVoteClick}
    >
      {!loading && voted ? (
        <>
          <BiLike className="mr-2 text-base" /> {photo.voteCount}
        </>
      ) : (
        <>
          <BiLike className="mr-2 text-base" /> Voter
        </>
      )}
    </p>
  );
};

export default LikeModalButton;
