import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../sass/components/tabs.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { useParams } from 'react-router';

const ViewPhotographer = () => {
    const { id } = useParams();
    const location = useLocation();
    const [viewCount, setViewCount] = useState(0);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const passedOrganization = location.state && location.state.contest;
    const [photographer, setPhotographer] = useState(passedOrganization || []);
    const [loading, setLoading] = useState(true);
    const [recentContest, setRecentContest] = useState(null);
  
    useEffect(() => {
      axios
        .get(process.env.REACT_APP_API_URL + `/users/${id}`)
        .then((res) => {
            setPhotographer(res.data);
        });
    }, [id]);

    return (
        <div>
            {photographer.id}
        </div>
    )
}

export default ViewPhotographer;
