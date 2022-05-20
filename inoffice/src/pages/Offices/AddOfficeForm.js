import React, { Component } from "react";
import api from "../../helper/api";
import { Form, Input, Button } from "antd";

export default class AddOffice extends Component {
  state = {
    value: "",
  };

  handleSubmit = (e) => {
    const data = {
      officeName: e.name + " " + e.location,
    };

    api
      .post("admin/office", data)
      .then((res) => {
        window.location = "/admin/offices";
      })
      .catch((err) => {
        this.setState({
          error: "invalid credentials",
        });
      });
  };

  handleChange = (e) => {
    this.setState({ value: e.target.value });
    console.log(e.target.value);
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
            onValuesChange={this.handleChange}
            rules={[
              {
                required: true,
                message: "Please input office name!",
              },
              {
                required: true,
                pattern: new RegExp("^[A-Za-z][A-Za-z0-9_./&-]{0,25}$"),
                message: "You exceeded the maximum number of characters",
              },
            ]}
          >
            <Input placeholder="Office name" />
          </Form.Item>
          <Form.Item
            name="location"
            rules={[
              { required: true, message: "Please input office location!" },
              {
                required: true,
                pattern: new RegExp("^[A-Za-z][A-Za-z0-9_./&-]{0,25}$"),
                message: "You exceeded the maximum number of characters",
              },
            ]}
          >
            <Input placeholder="Office location" />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              className="formButton"
              type="primary"
              shape="round"
            >
              Save
            </Button>
            <Button
              type="primary"
              shape="round"
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
