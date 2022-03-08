import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import { Header } from "antd/lib/layout/layout";
import jwt from "jwt-decode";

export default class UserHead extends Component {
  config = {
    token: localStorage.getItem("token"),
  };
  render() {
    if (jwt(this.config.token).role == "ADMIN") {
      return (
        <Header id="header">
          <NavLink id="inOfficeLogo" to="/admin/dashboard">
            inOffice
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
            Logout
          </NavLink>
        </Header>
      );
    }
    return (
      <Header id="header">
        <NavLink id="inOfficeLogo" to="/employee/home">
          inOffice
        </NavLink>
        <NavLink className={"link"} to="/employee/informations">
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
          Logout
        </NavLink>
      </Header>
    );
  }
}
