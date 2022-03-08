import React, { Component } from "react";
import api from "../../helper/api";
import UserHead from "../../components/Head/UserHead";

export default class Home extends Component {
  render() {
    return (
      <div>
        <UserHead />
        <h1>Home</h1>
      </div>
    );
  }
}
