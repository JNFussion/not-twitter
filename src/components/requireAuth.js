import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

function RequireAuth({ children }) {
  const location = useLocation();

  if (!sessionStorage.getItem("currentUser")) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

RequireAuth.propTypes = {
  children: PropTypes.element.isRequired,
};

export default RequireAuth;
