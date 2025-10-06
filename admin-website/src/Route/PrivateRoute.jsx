import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  // Get authentication state from Redux
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Always read login/authenticated directly from localStorage
  const login = JSON.parse(localStorage.getItem("login"));
  const authenticated = JSON.parse(localStorage.getItem("authenticated"));

  // Check if user is authenticated (either from Redux or localStorage)
  const isUserAuthenticated = isAuthenticated || login || authenticated;

  return isUserAuthenticated ? <Outlet /> : <Navigate exact to={`/login`} />;
};

export default PrivateRoute;
