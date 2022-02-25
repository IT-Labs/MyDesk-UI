import React, { Component } from "react";
import axios from "axios";
import Header from "../../components/Header/Header";

export default class Home extends Component {
  state = {};
  componentDidMount() {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    axios.get("employee/home", config).then(
      (res) => {
        console.log(res.data);
        this.setState({
          user: res.data,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  render() {
    if (this.state.user) {
      return (
        <div>
          <h1>You are logged in as employee!</h1>
          <Header />
        </div>
      );
    }
    return (
      <div>
        <h1>Must be logged in as employee!</h1>
        <Header />
      </div>
    );
  }
}
