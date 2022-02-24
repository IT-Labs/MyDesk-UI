import "antd/dist/antd.css";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "../../index.css";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Login extends Component {
  handleSubmit = (e) => {
    console.log("Received values of form: ", e);

    const data = {
      email: e.email,
      password: e.password,
    };

    axios
      .post("http://localhost:8080/login", data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
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
              {
                required: true,
                pattern: new RegExp(
                  "^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$"
                ),
                message:
                  "Password length must be between 8 and 20 characters, contains a minimum of 1 special character, 1 lowercase, 1 uppercase and a number!",
              },
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
            <a className="login-form-forgot" href="" style={{ color: "white" }}>
              Forgot password?
            </a>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Login;
