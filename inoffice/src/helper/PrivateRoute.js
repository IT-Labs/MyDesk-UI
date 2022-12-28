import { Navigate, useNavigate } from "react-router-dom";
import jwt from "jwt-decode";

/**
 * If the user is authenticated, then return the component, otherwise return the Navigate component.
 * @returns The component that is being returned is the component that is being passed in as a prop.
 */
const PrivateRoute = ({ component: RouteComponent, compRoles }) => {
  const token = localStorage.getItem("msal.idtoken");
  const navigate = useNavigate();
  let dateNow = new Date();

  if (!token) {
    navigate("/");
    window.location.assign("/");
  }

  if (jwt(token).exp * 1000 < dateNow.getTime()) {
    localStorage.clear();
    navigate("/");
    window.location.assign("/");
  }

  if (
    jwt(token).name ||
    (jwt(token).roles &&
      (jwt(token).roles === compRoles[0] ||
        jwt(token).roles[0] === compRoles[0] ||
        jwt(token).roles[1] === compRoles[0]))
  ) {
    return <RouteComponent />;
  }

  localStorage.clear();
  return <Navigate to="/denied" />;
};

export default PrivateRoute;
