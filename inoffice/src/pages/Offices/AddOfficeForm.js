import React, { Component } from "react";
import api from "../../helper/api";
import { Form, Input, Button } from "antd";

export default class AddOffice extends Component {
  state = {};

  handleSubmit = (e) => {
    const data = {
      officeName: e.name + " " + e.location
    };

    console.log(data)

    api.post("admin/addoffice", data)
    .then((res) => {
      window.location = "/admin/offices";
    })
    .catch((err) => {
      this.setState({
        error: "invalid credentials",
      });
    });
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
