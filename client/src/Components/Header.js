import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import logo from "../Assets/images/logo-blue.svg";
import burgerMenu from "../Assets/icons/menu-icon.svg";
import { Row, Col } from 'reactstrap';
import { Constants } from '../Configurations/Constants';
import { useDispatch, useSelector } from 'react-redux';

export default function Header() {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const [active, setActive] = useState(0);
  const auth = useSelector((state) => {
    return state.auth.user;
  });
  const userName=auth?.userName;
  const dispatch=useDispatch();
  const navigate = useNavigate();
  // const menuOptions = [{ text: translations.BrowseVenues, path: "/venueList" },
  // { text: translations.Wishlist, path: "/wishlists" },
  // { text: translations.ContactUs, path: `/contact` }
  // ]
 
  const logout = () => {
    dispatch({ type: "LOGOUT"});
   navigate("/login")
  }
  const handleModalClose = () => {
    setShowSignupModal(false);
  }
 
  const toggleMenu = (value = !showLeftMenu) => {
    setShowLeftMenu(value);
  }
  return (
    <>
      <header>
        <Row className="header-block">
          <Col xl={6} lg={6} md={6} sm={6} xs={6} className="header-img" onClick={() => { navigate("/home") }}>
            {Constants.appName}
          </Col>
          {/* <Col xl={9} className="large-hidden">
            <nav>
              <ul className="menu-items">
                {getMenuOptions()?.map((item, i) => <li className={`menu-item ${i === active ? "active" : ""}`} key={i}>
                 <NavLink  activeclassname="active" to={item.path}>{item.text}
                 </NavLink> 
                </li>
                )}
              </ul>
            </nav>
          </Col> */}
          <Col xl={6} className={`header-right`} >
                <ul className="menu-items">
               <li className={`menu-item text-capitalize`}>
                 {userName}
                </li>
                <li className={`menu-item text-uppercase`} onClick={()=>logout()}>
              Logout
                </li>
              </ul>
                
              
                
          
          </Col>
        </Row>
      </header >
      {/* <LeftMenu menuOptions={getMenuOptions()} showLeftMenu={showLeftMenu} toggleMenu={toggleMenu} logout={logout}
        setShowSignupModal={setShowSignupModal} active={active} setActive={setActive} /> */}
    </>
  )
}
