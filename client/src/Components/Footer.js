import React from 'react';
import logo from "../Assets/images/main-logo.svg";
import phone from "../Assets/icons/phone.svg";
import mail from "../Assets/icons/mail.svg";
import location from "../Assets/icons/location1.svg";
import { faFacebookF, faTwitter, faYoutube, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col } from 'reactstrap';
import { Constants } from '../../Configurations/Constants';
import { useNavigate } from 'react-router-dom';
const Footer = () => {
    const navigate=useNavigate();
    return (
        <footer className=''>
            <div className='top-section'>
                <Row>
                  
                   
                   
                    

                </Row >
            </div >
            
        </footer >
    );
};



export default Footer;