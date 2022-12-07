
import React from 'react';
import Header from '../Components/Header';
import LeftMenu from '../Components/LeftMenu';

export default function Layout(props) {
  return (
    <div className='main-container'>
      <Header /> <LeftMenu/>
      <div className='main-content'>
       
        {props.children}
      </div>
    </div>
  )
}