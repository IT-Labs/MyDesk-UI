import "antd/dist/antd.css";
import "../../index.css";
import React from "react";
import MicrosoftLogin from "react-microsoft-login";
import { useEffect } from "react";
import api from "../../helper/api";
import { useNavigate } from "react-router-dom";
import jwt from "jwt-decode";
import styles from "./Login.module.css";
import { useState } from "react";

const Login = () => {
  let navigate = useNavigate();
  const [info, setInfo] = useState();

  const loginHandler = (err, data) => {
    const userInfo = {
      Email: data.mail,
      Firstname: data.givenName,
      Surname: data.surname,
      JobTitle: data.jobTitle,
    };
    setInfo(userInfo);
    sendData(userInfo);
  };

  const sendData = (userInfo) => {
    const token = localStorage.getItem("msal.idtoken");
    api
      .post("/authentication", userInfo)
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
  //https://salmon-grass-030b2a503.1.azurestaticapps.net/
  //http://localhost:3000
  return (
    <div className={styles.bg}>
      <div className={styles.login}>
        <div className={styles.title}>
          <div className={styles.logo}></div>
          <p>Welcome back! Please login to continue</p>
        </div>
        <MicrosoftLogin
          clientId={"431c5d21-13d1-43af-a3bc-65484a0bca29"}
          authCallback={loginHandler}
          tenantUrl={
            "https://login.microsoftonline.com/{9a433611-0c81-4f7b-abae-891364ddda17}/"
          }
          redirectUri={"https://salmon-grass-030b2a503.1.azurestaticapps.net/"}
          forceRedirectStrategy={true}
          useLocalStorageCache={true}
          withUserData={true}
          className={styles.loginBtn}
        />
      </div>
    </div>
  );
};
export default Login;
