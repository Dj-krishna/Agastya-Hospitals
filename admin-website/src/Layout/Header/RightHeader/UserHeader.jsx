import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FileText, LogIn, Mail, User } from "react-feather";
import man from "../../../assets/images/dashboard/profile.png";

import { LI, UL, Image, P } from "../../../AbstractElements";
import CustomizerContext from "../../../_helper/Customizer";
import { Account, Admin, Inbox, LogOut, MyProfile, Taskboard } from "../../../Constant";
import { logout } from "../../../slices/authSlice";

const UserHeader = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState("");
  const [name, setName] = useState("");
  const { layoutURL } = useContext(CustomizerContext);
  
  // Get authentication state from Redux
  const { isAuthenticated, userDetails } = useSelector((state) => state.auth);
  const authenticated = JSON.parse(localStorage.getItem("authenticated"));
  const auth0_profile = JSON.parse(localStorage.getItem("auth0_profile"));

  useEffect(() => {
    setProfile(localStorage.getItem("profileURL") || man);
    setName(localStorage.getItem("Name") ? localStorage.getItem("Name") : userDetails?.userName);
  }, []);

  // Handle logout when Redux state changes
  useEffect(() => {
    if (!isAuthenticated && !authenticated) {
      // User is not authenticated, redirect to login
      history("/login");
    }
  }, [isAuthenticated, authenticated, history]);

  const Logout = () => {
    // Dispatch Redux logout action
    dispatch(logout());
    
    // Clear all localStorage items
    localStorage.removeItem("profileURL");
    localStorage.removeItem("token");
    localStorage.removeItem("auth0_profile");
    localStorage.removeItem("Name");
    localStorage.removeItem("login");
    localStorage.removeItem("userDetails");
    localStorage.removeItem("authenticated");
    
    // Navigate to login page
    history("/login");
  };

  const UserMenuRedirect = (redirect) => {
    history(redirect);
  };

  return (
    <li className="profile-nav onhover-dropdown pe-0 py-0">
      <div className="media profile-media">
        {/* <Image
          attrImage={{
            className: "b-r-10 m-0",
            src: `${authenticated ? auth0_profile.picture : profile}`,
            alt: "",
          }}
        /> */}
        <div className="media-body">
          <span className="capitalize">{authenticated ? userDetails.userName : name}</span>
          <P attrPara={{ className: "mb-0 font-roboto" }}>
            {Admin} <i className="middle fa fa-angle-down"></i>
          </P>
        </div>
      </div>
      <UL attrUL={{ className: "simple-list profile-dropdown onhover-show-div" }}>
        <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`/app/users/profile/${layoutURL}`),
          }}>
          <User />
          <span>{MyProfile} </span>
        </LI>
        <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`/app/email-app/${layoutURL}`),
          }}>
          <Mail />
          <span>{Inbox}</span>
        </LI>
        <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`/app/todo-app/todo/${layoutURL}`),
          }}>
          <FileText />
          <span>{Taskboard}</span>
        </LI>
        <LI attrLI={{ onClick: Logout }}>
          <LogIn />
          <span>{LogOut}</span>
        </LI>
      </UL>
    </li>
  );
};

export default UserHeader;
