import React, { Component } from "react";
import jwt from "jwt-decode";
import axios from "axios";
import { Form, Input, Button } from "antd";

export default class AddOffice extends Component {
  state = {};

  handleSubmit = (e) => {
    const data = {
      name: e.name,
      location: e.location,
    };

    console.log(data.name + " - " + data.location);

    // axios
    //   .post("login", data)
    //   .then((res) => {
    //     const user = jwt(res.data);
    //     localStorage.setItem("token", res.data);
    //     if (user.role == "ADMIN") {
    //       window.location = "/admin/dashboard";
    //     } else if (user.role == "EMPLOYEE") {
    //       window.location = "/employee/home";
    //     }
    //   })
    //   .catch((err) => {
    //     this.setState({
    //       error: "invalid credentials",
    //     });
    //   });
  };

  render() {
    return (
      <div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={this.handleSubmit}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input office name!" }]}
          >
            <Input placeholder="Office name" />
          </Form.Item>
          <Form.Item
            name="location"
            rules={[
              { required: true, message: "Please input office location!" },
            ]}
          >
            <Input placeholder="Office location" />
          </Form.Item>
          <Form.Item>
            <Button type="submit" htmlType="submit" className="formButton">
              Save
            </Button>
            <Button
              className="formButton"
              onClick={() => (window.location = "/admin/offices")}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
