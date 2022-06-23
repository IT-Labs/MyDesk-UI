import { Navigate, useNavigate } from "react-router-dom";
import jwt from "jwt-decode";

const PrivateRoute = ({ component: RouteComponent, compRoles = [] }) => {
  const token = localStorage.getItem("msal.idtoken");
  const navigate = useNavigate();
  if (!token) {
    navigate("/");
  }

  let isAuthenticated = false;
  let dateNow = new Date();
  if (jwt(token).exp * 1000 < dateNow.getTime()) {
    localStorage.clear();
    navigate("/");
  }

  if (
    compRoles[0] === jwt(token).roles[0] ||
    compRoles[0] === jwt(token).roles[1]
  ) {
    isAuthenticated = true;
  }

  if (isAuthenticated) {
    return <RouteComponent />;
  }
  if (
    compRoles[0] !== jwt(token).roles[0] ||
    compRoles[0] !== jwt(token).roles[1]
  ) {
    alert("Your session has expired");
    return <Navigate to="/" />;
  }
  return <Navigate to="/" />;
};

export default PrivateRoute;
