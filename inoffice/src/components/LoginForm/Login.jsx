import "antd/dist/antd.css";
import "../../index.scss";
import React from "react";
import MicrosoftLogin from "react-microsoft-login";
import { useEffect } from "react";
import api from "../../helper/api";
import { useNavigate } from "react-router-dom";
import jwt from "jwt-decode";
import styles from "./Login.module.scss";
import { useState } from "react";
import logo from "../../assets/Microsoft logo.png";
import { Button } from "antd";

const Login = () => {
  let navigate = useNavigate();
  const [postedOnce, setPostedOnce] = useState(false);

  const url =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://salmon-grass-030b2a503.1.azurestaticapps.net/";

  const loginHandler = async (err, data) => {
    if (Date.now() >= jwt(localStorage.getItem("msal.idtoken")).exp * 1000) {
      localStorage.removeItem("msal.idtoken");
    }
    const userInfo = {
      Email: data.mail,
      Firstname: data.givenName,
      Surname: data.surname,
      JobTitle: data.jobTitle,
    };
    sendData(userInfo);
    return;
  };

  const sendData = async (userInfo) => {
    const token = localStorage.getItem("msal.idtoken");

    if (!postedOnce) {
      setPostedOnce(true);
      await api
        .post("/authentication", userInfo)
        .then((res) => {
          roleRouting(token);
        })
        .catch((err) => {
          console.error("error");
        });
    }

    return;
  };

  const roleRouting = async (token) => {
    navigate("/employee/home");
  };

  return (
    <div className={styles.bg}>
      <div className={styles.login}>
        <div className={styles.title}>
          <div className={styles.logo}></div>
          <p style={{ fontSize: "1rem" }}>
            Welcome back! Please log in to continue
          </p>
        </div>
        <MicrosoftLogin
          clientId={"431c5d21-13d1-43af-a3bc-65484a0bca29"}
          authCallback={loginHandler}
          tenantUrl={
            "https://login.microsoftonline.com/{9a433611-0c81-4f7b-abae-891364ddda17}/"
          }
          redirectUri={url}
          forceRedirectStrategy={true}
          withUserData={true}
          useLocalStorageCache={true}
          className={styles.loginBtn}
        >
          <Button className={styles.btn}>
            <img
              style={{ width: "150px", height: "50px" }}
              src={logo}
              alt="Sign on with microsoft"
            />
          </Button>
        </MicrosoftLogin>
      </div>
    </div>
  );
};
export default Login;
