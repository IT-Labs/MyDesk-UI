import { Navigate } from "react-router-dom";
import jwt from "jwt-decode";

const token = localStorage.getItem("token");

export const PrivateRoute = ({ component: RouteComponent, roles }) => {
  var isAuthenticated = false;
  var dateNow = new Date();
  if (jwt(token).exp * 1000 < dateNow.getTime()) {
    localStorage.clear();
  }
  if (jwt(token).exp * 1000 > dateNow.getTime() && jwt(token).role == roles) {
    isAuthenticated = true;
  }

  if (isAuthenticated) {
    return <RouteComponent />;
  }
  if (jwt(token).exp * 1000 > dateNow.getTime() && jwt(token).role != roles) {
    return <Navigate to="/denied" />;
  }
  return <Navigate to="/" />;
};
