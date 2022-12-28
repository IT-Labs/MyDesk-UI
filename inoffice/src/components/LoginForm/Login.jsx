import "antd/dist/antd.css";
import "../../index.scss";
import React, { useEffect, useState, useRef } from "react";
import MicrosoftLogin from "react-microsoft-login";
import api from "../../helper/api";
import { useNavigate } from "react-router-dom";
import jwt from "jwt-decode";
import styles from "./Login.module.scss";
import logo from "../../assets/Microsoft logo.png";
import { Alert, Button, Checkbox, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { openError } from "../notification/Notification";
import Loading from "../Loading/Loading";
import { encode as base64_encode } from "base-64";

const Login = () => {
  let navigate = useNavigate();
  const url = process.env.REACT_APP_URL;
  const [postedOnce, setPostedOnce] = useState(false);
  const [googleLogin, setGoogleLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [loadingData, setLoading] = useState(false);
  const inputRef = useRef();
  const unselectablePassword = document.getElementById("password");

  unselectablePassword?.addEventListener(
    "select",
    function () {
      this.selectionStart = this.selectionEnd;
    },
    false
  );

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    });

  const initializeGoogleAccount = (clId) => {
    const src = "https://accounts.google.com/gsi/client";
    loadScript(src)
      .then(() => {
        /*global google*/
        google.accounts.id.initialize({
          client_id: clId,
          callback: googleLoginCallbackHandler,
        });

        google.accounts.id.renderButton(document.getElementById("signInDiv"), {
          theme: "outline",
          size: "large",
        });
      })
      .catch(console.error);
  };

  const googleLoginCallbackHandler = (res) => {
    if (!res.credential) {
      return;
    }

    setGoogleLogin(true);
    const token = res.credential;
    localStorage.setItem("msal.idtoken", token);

    const data = jwt(token);
    const userInfo = {
      Email: data.email,
      Firstname: data.given_name,
      Surname: data.family_name,
      JobTitle: data.jobTitle ? data.jobTitle : "",
    };
    sendData(userInfo);
  };

  const microsoftLoginHandler = async (err, data, msal) => {
    if (googleLogin || !data) {
      return;
    }

    localStorage.setItem("accessToken", data.accessToken);
    if (Date.now() >= jwt(localStorage.getItem("msal.idtoken")).exp * 1000) {
      localStorage.removeItem("msal.idtoken");
      navigate("/");
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
          setLoading(false);
          setGoogleLogin(false);
          navigate("/employee/home");
        })
        .catch((err) => {
          setGoogleLogin(false);
          localStorage.removeItem("msal.idtoken");
          console.log(err.response);
          if (token.roles && token.roles.length === 0) {
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
        const accessToken = token.replace("Bearer ", "");
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("msal.idtoken", accessToken);
        navigate("/employee/home");
      })
      .catch((err) => {
        setErrorMsg(true);

        setTimeout(() => {
          setErrorMsg(false);
        }, 5000);
        console.log(err.response);
      });
  };

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  useEffect(() => {
    setErrorMsg(false);
  }, [email, password]);

  useEffect(() => {
    if (localStorage.getItem("msal.idtoken")) {
      setLoading(true);
    }

    const clId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    initializeGoogleAccount(clId);
  }, []);

  return (
    <>
      {loadingData && (
        <div className={styles.loading}>
          <Loading />
        </div>
      )}
      {!loadingData && (
        <div className={styles.bg}>
          <div className={styles.login}>
            <div className={styles.title} data-cy="login-logo-welcomebacktext">
              <div className={styles.logo}></div>
              <p>Welcome back! Please log in to continue</p>
            </div>
            <div>
              <Form className={styles.form} onFinish={handleSubmit}>
                <Form.Item>
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
                    ref={inputRef}
                  />
                  <Input.Password
                    className={styles.input}
                    id="password"
                    data-cy="login-password-input"
                    prefix={<LockOutlined />}
                    placeholder="Password"
                    defaultValue=""
                    required
                    autoComplete="false"
                    onChange={(e) => setPassword(e.target.value)}
                    onPaste={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    onCopy={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    onMouseDown={(e) => e.preventDefault()}
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
                    <Checkbox data-cy="remember-me">Remember me</Checkbox>
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

            <p className={styles.loginDivider}>
              Or Log in with your Microsoft account
            </p>
            <MicrosoftLogin
              clientId={process.env.REACT_APP_CLIENT_ID}
              authCallback={microsoftLoginHandler}
              tenantUrl={`https://login.microsoftonline.com/{${process.env.REACT_APP_TENANT_ID}}`}
              redirectUri={url}
              forceRedirectStrategy={true}
              withUserData={true}
              useLocalStorageCache={true}
              className={styles.loginBtn}
              graphScopes={["user.read", "user.readbasic.all"]}
              prompt={"select_account"}
            >
              <Button
                className={styles.btn}
                data-cy="login-microsoftssobtn-button"
              >
                <img
                  style={{ width: "150px", height: "50px" }}
                  src={logo}
                  alt="Sign on with microsoft"
                />
              </Button>
            </MicrosoftLogin>

            {/* Google login */}
            <div id="signInDiv"></div>
          </div>
        </div>
      )}
    </>
  );
};
export default Login;
