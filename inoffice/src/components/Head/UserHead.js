import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import { Header } from "antd/lib/layout/layout";
import jwt from "jwt-decode";
import { FileOutlined } from "@ant-design/icons";
import HeaderImg from "./HeaderImg";
import avatar from "../../assets/avatar.png";

export default class UserHead extends Component {
  config = {
    token: sessionStorage.getItem("msal.idtoken"),
    decoded: jwt(sessionStorage.getItem("msal.idtoken")),
  };

  render() {
    return (
      <Header id="header">
        {/* Hello x user here without the my account tab, same as the admin page*/}
        <div>{this.props.isHome && <HeaderImg />}</div>
        <div>
          <img src={avatar} alt="avatar" style={{ width: 90, height: 50 }} />
          <NavLink className={"link"} to="/employee/reservations">
            {this.config.decoded.name}
          </NavLink>
          <NavLink
            className={"link"}
            to="/"
            onClick={() => {
              sessionStorage.clear();
              localStorage.clear();
              window.location = "/";
            }}
          >
            Log out
          </NavLink>
        </div>
      </Header>
    );
  }
}
