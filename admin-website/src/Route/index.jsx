import React from "react";
import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../Layout/Loader";
import { authRoutes } from "./AuthRoutes";
import LayoutRoutes from "../Route/LayoutRoutes";
import Signin from "../Auth/Signin";
import PrivateRoute from "./PrivateRoute";
import { classes } from "../Data/Layouts";

// setup fake backend

const Routers = () => {
  const login = useState(JSON.parse(localStorage.getItem("login")))[0];
  const [authenticated, setAuthenticated] = useState(false);
  const defaultLayoutObj = classes.find((item) => Object.values(item).pop(1) === "compact-wrapper");
  const layout = localStorage.getItem("layout") || Object.keys(defaultLayoutObj).pop();
  
  // Get authentication state from Redux
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    let abortController = new AbortController();
    setAuthenticated(JSON.parse(localStorage.getItem("authenticated")));
    console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
    console.disableYellowBox = true;
    return () => {
      abortController.abort();
    };
  }, []);

  // Check if user is authenticated (either from Redux or localStorage)
  const isUserAuthenticated = isAuthenticated || login || authenticated;

  return (
    <BrowserRouter basename={"/"}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path={"/"} element={<PrivateRoute />}>
            {isUserAuthenticated ? (
              <>
                <Route exact path={`/`} element={<Navigate to={`/dashboard`} />} />
                <Route exact path={`/`} element={<Navigate to={`/dashboard`} />} />
              </>
            ) : (
              ""
            )}
            <Route path={`/*`} element={<LayoutRoutes />} />
          </Route>

          <Route exact path={`/login`} element={<Signin />} />
          {authRoutes.map(({ path, Component }, i) => (
            <Route path={path} element={Component} key={i} />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routers;
