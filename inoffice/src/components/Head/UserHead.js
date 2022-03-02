import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import { Header } from "antd/lib/layout/layout";

export default class UserHead extends Component {
  render() {
    return (
      <Header id="header">
        <NavLink id="inOfficeLogo" to="/">
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
}
