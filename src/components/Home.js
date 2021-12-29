import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isUserSignedIn } from "../firebase-config";
import Layout from "./Layout";

function Home(params) {
  const location = useLocation();

  if (!isUserSignedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Layout />;
}

export default Home;
