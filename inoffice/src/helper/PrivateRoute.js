import { Navigate, useNavigate } from "react-router-dom";
import jwt from "jwt-decode";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAvatar } from "../redux/Avatar/Avatar";
import { openNotification } from "../components/notification/Notification";

/**
 * If the user is authenticated, then return the component, otherwise return the Navigate component.
 * @returns The component that is being returned is the component that is being passed in as a prop.
 */
const PrivateRoute = ({ component: RouteComponent, compRoles }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAvatar());
  }, []);
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
    return <Navigate to="/denied" />;
  }
  return <Navigate to="/" />;
};

export default PrivateRoute;
