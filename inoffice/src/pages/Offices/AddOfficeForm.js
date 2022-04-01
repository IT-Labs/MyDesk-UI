import React, { Component } from "react";
import api from "../../helper/api";
import { Form, Input, Button } from "antd";

export default class AddOffice extends Component {
  state = {};

  handleSubmit = (e) => {
    const data = {
      officeName: e.name + " " + e.location
    };


    api.post("admin/office", data)
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
            rules={[{ required: true, message: "Please input office name!" },
            {
              required: true,
              pattern: new RegExp(
                "^[A-Za-z][A-Za-z0-9_./&-]{0,25}$"
              ),
              message: "Whitespace is not allowed or you exceeded the maximum number of characters for Office name",
            },
          ]}
          >
            <Input placeholder="Office name"/>
          </Form.Item>
          <Form.Item
            name="location"
            rules={[
              { required: true, message: "Please input office location!" },
              {
                required: true,
                pattern: new RegExp(
                  "^[A-Za-z][A-Za-z0-9_./&-]{0,25}$"
                ),
                message: "Whitespace is not allowed or you exceeded the maximum number of characters for Office location",
              }
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
