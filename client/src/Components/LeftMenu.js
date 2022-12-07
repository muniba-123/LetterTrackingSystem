import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { Constants } from "../Configurations/Constants";

const LeftMenu = (props) => {
  const navigate = useNavigate();
  const auth = useSelector((state) => {
    return state.auth.user;
  });
  const userName = auth?.userName;
  return (
        <ProSidebar className="menu-wrapper">
          <SidebarContent>
            <Menu iconShape="circle">
              <MenuItem onClick={() => {navigate("/") }}>Home</MenuItem>
              {
                (userName===Constants.adminName) ?
                <SubMenu title="Admin" className="submenu">
                <MenuItem onClick={() => {navigate("/createOrganization") }}>Create Organization</MenuItem>
                <MenuItem onClick={() => {navigate("/createUser") }}>Create User</MenuItem>
                <MenuItem onClick={() => {navigate("/changePassword") }}>Change Password</MenuItem>
              </SubMenu>
              :
              <></>
              }
              <SubMenu title="Mail" className="submenu">
                <MenuItem onClick={() => {navigate("/sendMail") }}>Send Mail</MenuItem>
                <MenuItem onClick={() => {navigate("/receiveMail") }}>Receive Mail</MenuItem>
                <MenuItem onClick={() => {navigate("/trackMail") }}>Track Mail</MenuItem>
                <MenuItem onClick={() => {navigate("/forwardMail") }}>Forward Mail</MenuItem>
              </SubMenu>
              <SubMenu title="Batch" className="submenu">
                <MenuItem onClick={() => {navigate("/sendBatch") }}>Send Batch</MenuItem>
                <MenuItem onClick={() => {navigate("/receiveBatch") }}>Receive Batch</MenuItem>
                <MenuItem onClick={() => {navigate("/trackBatch") }}>Track Batch</MenuItem>
                <MenuItem onClick={() => {navigate("/forwardBatch") }}>Forward Batch</MenuItem>
              </SubMenu>
            </Menu>
          </SidebarContent>
        </ProSidebar>
  );
};

export default LeftMenu;
