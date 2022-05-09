import "antd/dist/antd.css";
import "../../index.css";
import React, { Component } from "react";
import MicrosoftLogin from "react-microsoft-login";
import { useEffect } from "react";
import api from "../../helper/api";
import { useNavigate } from "react-router-dom";
import jwt from "jwt-decode";

function Login(props) {
  let navigate = useNavigate();

  const loginHandler = (err, data) => {
    const info = {
      Email: data.mail,
      Firstname: data.givenName,
      Surname: data.surname,
      JobTitle: data.jobTitle,
    };

    const token = localStorage.getItem("msal.idtoken");

    api
      .post("/authentication", info)
      .then((res) => {
        roleRouting(token);
      })
      .catch((err) => {
        console.error("error");
      });
  };

  const roleRouting = (token) => {
    const decodedToken = jwt(token);
    if (decodedToken.roles.includes("ADMIN")) {
      navigate("/admin/dashboard");
    } else {
      navigate("/employee/home");
    }
  };

  useEffect(() => {}, []);

  return (
    <MicrosoftLogin
      clientId={"431c5d21-13d1-43af-a3bc-65484a0bca29"}
      authCallback={loginHandler}
      tenantUrl={
        "https://login.microsoftonline.com/{9a433611-0c81-4f7b-abae-891364ddda17}/"
      }
      redirectUri={"http://localhost:3000"}
      forceRedirectStrategy={true}
      useLocalStorageCache={true}
      withUserData={true}
    />
  );
}
export default Login;
