import React, { Component } from "react";
import axios from "axios";

export default class Home extends Component {
  state = {};
  componentDidMount() {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user"),
      },
    };
    axios.get("home", config).then(
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
      return <h1>You are logged in {this.state.user}</h1>;
    }
    return <div>Home</div>;
  }
}
