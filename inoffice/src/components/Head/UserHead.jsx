import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { Header } from "antd/lib/layout/layout";
import jwt from "jwt-decode";

import HeaderImg from "./HeaderImg";

import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../utils/fetchEmployees";
import api from "../../helper/api";
import { LogoutOutlined } from "@ant-design/icons";

const UserHead = (props) => {
  const dispatch = useDispatch();
  const media = window.matchMedia("(max-width: 820px)");
  const getUsers = async () => {
    fetchEmployees(api, dispatch, notification);
  };
  const avatar = useSelector((state) => state.avatar.avatar);
  const navigate = useNavigate();
  // const [avatar, setAvatar] = useState(placeholderAvatar);

  useEffect(() => {
    if (employees.length === 0) {
      getUsers();
    }
    // getProfile();
  }, []);

  const config = {
    token: localStorage.getItem("msal.idtoken"),
    decoded: jwt(localStorage.getItem("msal.idtoken")),
  };
  const { employees } = useSelector((state) => state.employees);

  useEffect(() => {
    const ls = [];
    for (let i = 0; i < localStorage.length; i++) {
      ls.push(localStorage.getItem(localStorage.key(i)));
    }

    const auth = ls.find((item) => item.includes("accessToken"));

    const { accessToken } = JSON.parse(auth);
    localStorage.setItem("accessToken", accessToken);
  }, []);

  // const getProfile = async () => {
  //   fetch("https://graph.microsoft.com/v1.0/me/photos/64x64/$value", {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   })
  //     .then((res) => res.blob())
  //     .then((imgBlob) => {
  //       const imageObjURL = URL.createObjectURL(imgBlob);
  //       setAvatar(imageObjURL);
  //     });
  // };

  return (
    <Header className={styles.header}>
      {/* Hello x user here without the my account tab, same as the admin page*/}

      <div>{props?.isHome && <HeaderImg />}</div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.items}>
            {!media.matches && (
              <img src={avatar} alt="avatar" className={styles.avatar} />
            )}
            <NavLink className={styles.link} to="/employee/reservations">
              {media.matches ? "Dashboard" : config.decoded.name}
            </NavLink>
            <LogoutOutlined
              //css in jsx used here because of the API
              style={{ color: "white" }}
              className={`${styles.link} ${styles.logoutBtn}`}
              to="/"
              onClick={() => {
                localStorage.removeItem("msal.idtoken");
                navigate("/");
              }}
            >
              Logout
            </LogoutOutlined>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default UserHead;
