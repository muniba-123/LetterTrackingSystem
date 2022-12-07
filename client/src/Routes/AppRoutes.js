import React from "react";
import {
  Route,
  Routes,
} from "react-router-dom";
import Layout from "../Layout/Layout";
import Home from "../Views/Home";
import { useDispatch, useSelector } from 'react-redux';
import Login from "../Views/Signup/Login";
import CreateUser from "../Views/Admin/CreateUser";
import ChangePassword from "../Views/Admin/ChangePassword";
import SendLetter from "../Views/Letters/SendLetter";
import ReceiveLetter from "../Views/Letters/ReceiveLetter";
import TrackLetter from "../Views/Letters/TrackLetter";
import ForwardLetter from "../Views/Letters/ForwardLetter";
import SendBatch from "../Views/Batch/SendBatch";
import ReceiveBatch from "../Views/Batch/ReceiveBatch";
import TrackBatch from "../Views/Batch/TrackBatch";
import ForwardBatch from "../Views/Batch/ForwardBatch";
import CreateOrganization from "../Views/Admin/CreateOrganization";

let AppRoutes = () => {
  const auth = useSelector((state) => {
    return state.auth.user;
  });
  return (
    <>
      {auth?.userName ? (
        <Layout>
          <Routes>
            {/* Auth routes */}
            <Route path="/" exact element={<Home />} />
            <Route path="/home" exact element={<Home />} />
            <Route path="/sendMail" exact element={<SendLetter />} />
            <Route path="/receiveMail" exact element={<ReceiveLetter />} />
            <Route path="/trackMail" exact element={<TrackLetter />} />
            <Route path="/forwardMail" exact element={<ForwardLetter />} />
            <Route path="/createUser" exact element={<CreateUser />} />
            <Route path="/createOrganization" exact element={<CreateOrganization />} />
            <Route path="/changePassword" exact element={<ChangePassword />} />
            <Route path="/sendBatch" exact element={<SendBatch />} />
            <Route path="/receiveBatch" exact element={<ReceiveBatch />} />
            <Route path="/trackBatch" exact element={<TrackBatch />} />
            <Route path="/forwardBatch" exact element={<ForwardBatch />} />

            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          {/* Non-auth routes */}
          <Route
            path="/"
            exact
            element={
                <Login />
            }
          />
         
  
          <Route path="/login" exact element={<Login />} />
      
        
         
        
        </Routes>
      )}
    </>
  );
};
export default AppRoutes;
