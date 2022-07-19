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
import { openError } from "../notification/Notification";

const Login = () => {
  let navigate = useNavigate();
  const [postedOnce, setPostedOnce] = useState(false);

  const url = process.env.REACT_APP_URL;

  const loginHandler = async (err, data, msal) => {
    localStorage.setItem("accessToken", data.accessToken);
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
          navigate("/employee/home");
        })
        .catch((err) => {
          openError("Error while loging in");
        });
    }

    return;
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
          clientId={process.env.REACT_APP_CLIENT_ID}
          authCallback={loginHandler}
          tenantUrl={`${process.env.REACT_APP_TENANT_URL}`}
          redirectUri={url}
          forceRedirectStrategy={true}
          withUserData={true}
          useLocalStorageCache={true}
          className={styles.loginBtn}
          graphScopes={["user.read", "user.readbasic.all"]}
          prompt={"select_account"}
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
