import "antd/dist/antd.css";
import { Form, Input, Button, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "../../index.css";
import React, { Component } from "react";
import api from "../../helper/api";
import jwt from "jwt-decode";
import UserHead from "../Head/UserHead";
import EmailComponent from "../inputs/EmailComponent"
import PasswordComponent from "../inputs/PasswordComponent"

class Login extends Component {
  config = {
    token: localStorage.getItem("token"),
  };
  state={}

  handleSubmit = (e) => {
    const data = {
      email: e.email,
      password: e.password,
    };

    api
      .post("login", data)
      .then((res) => {
        const user = jwt(res.data);
        localStorage.setItem("token", res.data);
        if (user.role == "ADMIN") {
          window.location = "/admin/dashboard";
        } else if (user.role == "EMPLOYEE") {
          window.location = "/employee/home";
        }
      })
      .catch((err) => {
        this.setState({
          error: "invalid credentials",
        });
      });
  };
  render() {
    if (this.config.token != null) {
      return (
        <div>
          <UserHead />
          <h1>Logged in as {jwt(this.config.token).role}</h1>
        </div>
      );
    } else {
      return (
        <div className="FormLogin">
            <h1 className="header">inOffice</h1>
          <Form
            name="normal_login"
            className="login-form"
            onFinish={this.handleSubmit}
          >
            <EmailComponent />
            <PasswordComponent />
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="rememberMe" style={{ color: "white" }}>
                  Remember me
                </Checkbox>
              </Form.Item>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{ backgroundColor: "white", color: "blue" }}
              >
                LOG IN
              </Button>
              <Link to="/register" style={{ color: "white", display:"flex", justifyContent:"center" }}>
                Register
              </Link>
            </Form.Item>
          </Form>
          {this.state.error == "invalid credentials" ? (
            <p style={{ color: "red" }}>Invalid credentials</p>
          ) : (
            <p></p>
          )}
        </div>
      );
    }
  }
}

export default Login;
