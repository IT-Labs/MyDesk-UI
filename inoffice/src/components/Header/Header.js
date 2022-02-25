import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import jwt from "jwt-decode";
const Header = () => {
  let user = localStorage.getItem("token");

  return (
    <div>
      {user != null && <p onClick={null}>My account</p>}
      <span> | </span>
      {user != null ? (
        <p
          onClick={() => {
            localStorage.clear();
            window.location = "/";
          }}
        >
          Logout
        </p>
      ) : (
        <p onClick={() => (window.location = "/")}>Login</p>
      )}
      {user != null && <p>Hello {jwt(user).role}</p>}
    </div>
  );
};

export default Header;
