import React, { Component } from "react";
import UserHead from "../../components/Head/UserHead";

export default class NoPermissions extends Component {
  render() {
    return (
      <div>
        <UserHead />
        <h1 className="FormLogin" style={{ color: "red" }}>
          Sorry, You Are Not Allowed to Access This Page
        </h1>
      </div>
    );
  }
}
