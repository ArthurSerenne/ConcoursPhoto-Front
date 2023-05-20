import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../sass/components/tabs.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { useParams } from 'react-router';
import ContestCardList from '../ContestCardList';

const UpcomingContestsTab = () => {
    const { id } = useParams();
    const location = useLocation();
    const [viewCount, setViewCount] = useState(0);
    const navigate = useNavigate();
    const passedOrganization = location.state && location.state.contest;
    const [organization, setOrganization] = useState(passedOrganization || []);
    const [sortedContests, setSortedContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const today = new Date();
  
    useEffect(() => {
      axios
        .get(process.env.REACT_APP_API_URL + `/organizations/${id}`)
        .then((res) => {
          setOrganization(res.data);
          const contests = res.data.contests;
          if (contests && contests.length > 0) {
            const activeContests = contests
              .filter((contest) => contest.deletionDate === undefined && contest.status === true && today < new Date(contest.publicationDate))
              .sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
            setSortedContests(activeContests);
          }
        });
    }, [id]);
  
    useEffect(() => {
      if (!passedOrganization) {
        axios
          .get(process.env.REACT_APP_API_URL + `/organizations/${id}`)
          .then((res) => {
            setOrganization(res.data);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }, [id, !passedOrganization]);
  
    console.log(organization);

  const goBack = () => {
    navigate(-1);
  };

  const incrementViewCount = () => {
    setViewCount(viewCount + 1);
  };

  useEffect(() => {
    incrementViewCount();
  }, []);

    return (
        <div>
            <div className="mx-auto mt-10 mb-10 grid grid-cols-1 md:gap-6 items-center 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <p className='text-2xl'>{sortedContests.length} concours à venir</p>
                {loading ? 
                    <div> 
                        <div className='h-[300px] animate-pulse rounded-b-lg bg-gray-200 p-3 shadow-xl w-full mb-10'></div>
                        <div className='h-[300px] animate-pulse rounded-b-lg bg-gray-200 p-3 shadow-xl w-full mb-10'></div>
                        <div className='h-[300px] animate-pulse rounded-b-lg bg-gray-200 p-3 shadow-xl w-full mb-10'></div>
                    </div> :
                    (sortedContests ? sortedContests.map((contest) => <ContestCardList contest={contest} />) : '')
                }
            </div>
        </div>
    );
}

export default UpcomingContestsTab;
