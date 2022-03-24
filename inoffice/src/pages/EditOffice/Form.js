import React, { Component } from "react";
import api from "../../helper/api";
import { Form, Input, Button } from "antd";

export default class AddOffice extends Component {


  handleSubmit = (e) => {

    const data = {
      officeName: e.officeName + " " + e.officeLocation,
      officePlan: e.officePlan,
    }
    
    api.put(
      "admin/office/" +
        window.location.href.split("/")[
          window.location.href.split("/").length - 1
        ],
      data
    )
    .then((res) =>{
    window.location =
      "/admin/offices" 
    }
    )
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
            name="officePlan"
            rules={[{ required: true, message: "Please enter image url" }]}
          >
            <Input placeholder="Image url" />
          </Form.Item>

          <Form.Item
          name="officeName"
          rules={[{ required: true, message: "Please enter office name" }]}
          >
            <Input placeholder="Office Name" />

          </Form.Item>

          <Form.Item
          name="officeLocation"
          rules={[{ required: true, message: "Please enter office location" }]}
          >
            <Input placeholder="Office Location" />

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
