import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useParams } from 'react-router';
import '../sass/components/tabs.scss';
import { Spinner } from 'react-spinners-css';
import { Link } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';

const ViewContest = () => {
  const { id } = useParams();

  const [contest, setContest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + `/contests/${id}`).then((res) => {
      setContest(res.data);
      setLoading(false);
    });
  }, [id]);

  return (
    <>
      {loading ? (
        <Spinner color="#000" />
      ) : (
        <Tabs>
          <TabList>
            <Tab>Le concours</Tab>
            <Tab>Réglement</Tab>
            <Tab>Prix à gagner</Tab>
            <Tab>Membres du Jury</Tab>
            <Tab>Les photos</Tab>
            <Tab>Résultats</Tab>
          </TabList>

          <TabPanel>
            <h2 className="flex items-center text-text-2xl font-normal not-italic leading-[29px]">
              Présentation du concours photo
            </h2>
            {contest.description}
          </TabPanel>
          <TabPanel>{contest.rules}</TabPanel>
          <TabPanel>{contest.prizes}</TabPanel>
            <TabPanel>

          </TabPanel>
          <TabPanel>
            <h2>Any content 5</h2>
          </TabPanel>
          <TabPanel>
            <h2>Any content 6</h2>
          </TabPanel>
        </Tabs>
      )}
      <div>
        <img
          src={contest.visual}
          alt="image"
          className="h-[132px] w-[202px] object-cover"
        />
      </div>
      <Link to={`/`} className="rounded-[44px] bg-button-grey px-[30px] py-3.5">
        <RiArrowLeftLine /> Retour
      </Link>
    </>
  );
};

export default ViewContest;
