import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";

const HeaderImg = ({ isHome }) => {
  return isHome ? (
    <div className={`${styles.sideBarLogo} sideBarLogo`}></div>
  ) : (
    <Link id="myDeskLogo" to="/employee/home">
      <div className={`${styles.sideBarLogo} sideBarLogo`}></div>
    </Link>
  );
};

export default HeaderImg;
