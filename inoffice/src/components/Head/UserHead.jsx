import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { Header } from "antd/lib/layout/layout";
import jwt from "jwt-decode";

import HeaderImg from "./HeaderImg";
import placeholderAvatar from "../../assets/avatar.png";
import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../utils/fetchEmployees";
import api from "../../helper/api";

const UserHead = (props) => {
  const dispatch = useDispatch();
  const media = window.matchMedia("(max-width: 820px)");
  const getUsers = async () => {
    fetchEmployees(api, dispatch, notification);
  };
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(placeholderAvatar);

  useEffect(() => {
    if (employees.length === 0) {
      getUsers();
    }
    getProfile();
  }, []);

  const config = {
    token: localStorage.getItem("msal.idtoken"),
    decoded: jwt(localStorage.getItem("msal.idtoken")),
  };
  const { employees } = useSelector((state) => state.employees);

  const ls = [];
  for (let i = 0; i < localStorage.length; i++) {
    ls.push(localStorage.key(i));
  }
  const auth = ls.find((item) => item.includes("authority"));
  const { accessToken } = JSON.parse(localStorage.getItem(auth));

  const getProfile = async () => {
    fetch("https://graph.microsoft.com/v1.0/me/photos/64x64/$value", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.blob())
      .then((imgBlob) => {
        const imageObjURL = URL.createObjectURL(imgBlob);
        setAvatar(imageObjURL);
      });
  };

  return (
    <Header className={styles.header}>
      {/* Hello x user here without the my account tab, same as the admin page*/}

      <div>{props?.isHome && <HeaderImg />}</div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div>
            {!media.matches && (
              <img src={avatar} alt="avatar" className={styles.avatar} />
            )}
            <NavLink className={styles.link} to="/employee/reservations">
              {media.matches ? "Dashboard" : config.decoded.name}
            </NavLink>
            <NavLink
              className={styles.link}
              to="/"
              onClick={() => {
                localStorage.removeItem("msal.idtoken");
                navigate("/");
              }}
            >
              Logout
            </NavLink>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default UserHead;
