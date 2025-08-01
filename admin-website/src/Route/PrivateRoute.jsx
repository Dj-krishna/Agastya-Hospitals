import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const [login] = useState(JSON.parse(localStorage.getItem("login")));
  const [authenticated, setAuthenticated] = useState(false);
  
  // Get authentication state from Redux
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    setAuthenticated(JSON.parse(localStorage.getItem("authenticated")));
    localStorage.setItem("authenticated", authenticated);
    localStorage.setItem("login", login);
  }, []);
  
  // Check if user is authenticated (either from Redux or localStorage)
  const isUserAuthenticated = isAuthenticated || login || authenticated;
  
  return isUserAuthenticated ? <Outlet /> : <Navigate exact to={`/login`} />;
};

export default PrivateRoute;
