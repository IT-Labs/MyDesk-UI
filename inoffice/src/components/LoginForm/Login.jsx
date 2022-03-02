import "antd/dist/antd.css";
import { Form, Input, Button, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "../../index.css";
import React, { Component } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import UserHead from "../Head/UserHead";

class Login extends Component {
  config = {
    token: localStorage.getItem("token"),
  };
  state = {};

  handleSubmit = (e) => {
    const data = {
      email: e.email,
      password: e.password,
    };

    axios
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
      console.log("jwt not null " + this.config.token);
      return (
        <div>
          <UserHead />
          <h1>Logged in as {jwt(this.config.token).role}</h1>
        </div>
      );
    } else {
      console.log(this.config.token);
      return (
        <div className="FormLogin">
          <h1 className="header">inOffice</h1>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.handleSubmit}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your Username!" },
                {
                  required: true,
                  pattern: new RegExp(
                    "^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+.)?[a-zA-Z]+.)?(inoffice).com$"
                  ),
                  message: "Wrong Format",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
                // {
                //   required: true,
                //   pattern: new RegExp(
                //     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
                //   ),
                //   message:
                //     "Password length must be between 8 and 20 characters, contains a minimum of 1 special character, 1 lowercase, 1 uppercase and a number!",
                // },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
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
              <Link to="/register" style={{ color: "white" }}>
                Register
              </Link>
              <a
                className="login-form-forgot"
                href=""
                style={{ color: "white" }}
              >
                Forgot password?
              </a>
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
