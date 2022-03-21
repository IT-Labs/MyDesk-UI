import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import { Header } from "antd/lib/layout/layout";
import jwt from "jwt-decode";
import { FileOutlined } from '@ant-design/icons'

export default class UserHead extends Component {
  config = {
    token: localStorage.getItem("token"),
  };
  render() {
    if (jwt(this.config.token).role == "ADMIN") {
      return (
        <Header id="header">
          <NavLink className={"link"}  id="inOfficeLogo" to="/admin/dashboard">
            <FileOutlined className={"iconLogo"} /> inOffice
          </NavLink>
          <NavLink className={"link"} to="/myaccount">
            My account
          </NavLink>
          <NavLink
            className={"link"}
            to="/"
            onClick={() => {
              localStorage.clear();
              window.location = "/";
            }}
          >
            Log out
          </NavLink>
        </Header>
      );
    }
    return (
      <Header id="header">
        <NavLink className={"link"} id="inOfficeLogo" to="/employee/home">
          <FileOutlined className={"iconLogo"} /> inOffice
        </NavLink>
        <NavLink className={"link"} to="/employee/reservations">
          My account
        </NavLink>
        <NavLink
          className={"link"}
          to="/"
          onClick={() => {
            localStorage.clear();
            window.location = "/";
          }}
        >
          Log out
        </NavLink>
      </Header>
    );
  }
}
