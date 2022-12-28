import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { Header } from "antd/lib/layout/layout";
import placeholderAvatar from "../../assets/avatar.png";
import HeaderImg from "./HeaderImg";
import { Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { LogoutOutlined } from "@ant-design/icons";
import { setLoggedUser } from "../../redux/User/user";
import { clearAvatar } from "../../redux/Avatar/Avatar";

const HeaderBar = (props) => {
  const media = window.matchMedia("(max-width: 820px)");

  const user = useSelector((state) => state.user.loggedUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { avatar } = useSelector((state) => state.avatar);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(setLoggedUser(null));
    dispatch(clearAvatar());
    navigate("/");
  };

  return (
    <Header className={props?.isHome ? styles.headerHome : styles.header}>
      <div>{props?.isHome && <HeaderImg />}</div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.items}>
            {!media.matches && (
              <img
                src={avatar ?? placeholderAvatar}
                alt="avatar"
                className={styles.avatar}
              />
            )}
            <NavLink
              data-cy="user-header-link"
              className={styles.link}
              to="/employee/reservations"
            >
              {media.matches ? "Dashboard" : user?.name}
            </NavLink>
            <Tooltip title="Log out">
              <LogoutOutlined
                style={{ color: "white" }}
                className={`${styles.link} ${styles.logoutBtn}`}
                data-cy="logout-button"
                to="/"
                onClick={handleLogout}
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

export default HeaderBar;
