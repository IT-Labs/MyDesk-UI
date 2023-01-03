import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { Header } from "antd/lib/layout/layout";
import placeholderAvatar from "../../assets/avatar.png";
import HeaderImg from "./HeaderImg";
import { Tooltip, Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { LogoutOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { setLoggedUser } from "../../redux/User/user";
import { clearAvatar } from "../../redux/Avatar/Avatar";
import MobileMenu from "../MobileMenu/MobileMenu";

const HeaderBar = (props) => {
  const media = window.matchMedia("(max-width: 820px)");

  const user = useSelector((state) => state.user.loggedUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { avatar } = useSelector((state) => state.avatar);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(setLoggedUser(null));
    dispatch(clearAvatar());
    navigate("/");
  };
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Header className={props?.isHome ? styles.headerHome : styles.header}>
      <div className={props.isHome ? styles.noDisplay : styles.logoMenu}>
        {props?.isHome ||
          (media.matches && (
            <MenuUnfoldOutlined
              className={styles.menuIcon}
              onClick={() => {
                showDrawer();
              }}
            />
          ))}

        <Drawer
          title="My Desk"
          placement="left"
          className={styles.drawerContent}
          onClose={onClose}
          getContainer={false}
          visible={open}
        >
          <MobileMenu></MobileMenu>
        </Drawer>
      </div>
      <div>{(props?.isHome || media.matches) && <HeaderImg />}</div>
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
