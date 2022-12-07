import React, {  useState } from 'react';
import { useNavigate } from "react-router-dom";
import {  useSelector } from 'react-redux';
import TrackLetter from '../Views/Letters/TrackLetter';

function Home() {
    const auth = useSelector((state) => {
        return state.auth.user;
      });
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [eventTypesList, setEventTypesList] = useState([]);
    const [featuredVenuesList, setFeaturedVenuesList] = useState([]);
const navigate=useNavigate();
    const handleModalClose = () => {
        setShowSignupModal(false);
    }
    
   
    return (
        <div className="">
            <TrackLetter/>
    </div>
    );
}

export default Home;