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
import { Button, Checkbox, Form, Input, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { openError } from "../notification/Notification";
import RegisterUser from "../RegisterUser/RegisterUser";
import { encode as base64_encode } from "base-64";

const Login = () => {
  let navigate = useNavigate();
  const url = process.env.REACT_APP_URL;
  const [postedOnce, setPostedOnce] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerForm, setRegisterForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  useEffect(() => {
    setErrorMsg(false);
  }, [email, password]);

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
    const token = jwt(localStorage.getItem("msal.idtoken"));

    if (!postedOnce) {
      setPostedOnce(true);
      await api
        .post("/authentication", userInfo)
        .then((res) => {
          navigate("/employee/home");
        })
        .catch((err) => {
          if (token.roles.length === 0) {
            openError(
              "You do not posses the required roles to access this application"
            );
          } else {
            openError("Error while loging in");
          }
        });
    }

    return;
  };

  const handleSubmit = async () => {
    let encodedPassword = base64_encode(password);
    const body = {
      email: email,
      password: encodedPassword,
    };

    api
      .post("/token", body)
      .then((res) => {
        let token = res.data;
        const accessTocken = token.replace("Bearer ", "");
        localStorage.setItem("accessToken", accessTocken);
        localStorage.setItem("msal.idtoken", accessTocken);
        navigate("/employee/home");
      })
      .catch((err) => {
        setErrorMsg(true);
        console.log(err);
      });
  };

  const handleShowRegister = (showRegisterPage) => {
    setRegisterForm(showRegisterPage);
  };

  return !registerForm ? (
    <div className={styles.bg}>
      <div className={styles.login}>
        <div className={styles.title}>
          <div className={styles.logo}></div>
          <p>Welcome back! Please log in to continue</p>
        </div>
        <div>
          <Form className={styles.form} onFinish={handleSubmit}>
            <Form.Item name="login">
              <Input
                className={styles.input}
                data-cy="login-email-input"
                placeholder="Email"
                type="TextArea"
                defaultValue=""
                autoComplete="false"
                required
                prefix={<UserOutlined className="site-form-item-icon" />}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input.Password
                className={styles.input}
                data-cy="login-password-input"
                prefix={<LockOutlined />}
                placeholder="Password"
                defaultValue=""
                required
                autoComplete="false"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorMsg ? (
                <Alert
                  message="The password or email that you've entered is incorrect. Please try again."
                  data-cy="login-incorrect-credentials-message"
                  type="error"
                  className={`${styles.alert} ${styles.input}`}
                />
              ) : null}
              <div className={`${styles.rememberwrap}`}>
                <Checkbox>Remember me</Checkbox>
                <Button
                  className={`${styles.register}`}
                  type="link"
                  size="small"
                  data-cy="register-cta-button"
                  onClick={() => handleShowRegister(true)}
                >
                  Register
                </Button>
              </div>
              <Button
                htmlType="submit"
                data-cy="login-cta-button"
                className={`${styles.buttons} ${styles.tealBtn}`}
                block
                size="large"
              >
                Log In
              </Button>
            </Form.Item>
          </Form>
        </div>

        <p
          style={{
            fontSize: "1rem",
            marginTop: "-40px",
            marginBottom: "-22px",
          }}
        >
          Or Log in with your Microsoft account
        </p>
        <MicrosoftLogin
          clientId={process.env.REACT_APP_CLIENT_ID}
          authCallback={loginHandler}
          tenantUrl={`https://login.microsoftonline.com/{${process.env.REACT_APP_TENANT_ID}}`}
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
  ) : (
    <RegisterUser handleShowRegister={handleShowRegister}></RegisterUser>
  );
};
export default Login;
