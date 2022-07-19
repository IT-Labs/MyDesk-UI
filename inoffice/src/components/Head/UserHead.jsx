import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { Header } from "antd/lib/layout/layout";

import placeholderAvatar from "../../assets/avatar.png";

import HeaderImg from "./HeaderImg";

import { Tooltip } from "antd";
import { useSelector } from "react-redux";

import { LogoutOutlined } from "@ant-design/icons";

const UserHead = (props) => {
  const media = window.matchMedia("(max-width: 820px)");
  const user = useSelector((state) => state.user.decodedUser);
  const navigate = useNavigate();
  // const [avatar, setAvatar] = useState(placeholderAvatar);

  console.log(user);

  return (
    <Header className={styles.header}>
      {/* Hello x user here without the my account tab, same as the admin page*/}

      <div>{props?.isHome && <HeaderImg />}</div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.items}>
            {!media.matches && (
              <img
                src={localStorage.getItem("avatar")}
                alt="avatar"
                className={styles.avatar}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = placeholderAvatar;
                }}
              />
            )}
            <NavLink className={styles.link} to="/employee/reservations">
              {media.matches ? "Dashboard" : user.name}
            </NavLink>
            <Tooltip title="Log out">
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
            </Tooltip>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default UserHead;
