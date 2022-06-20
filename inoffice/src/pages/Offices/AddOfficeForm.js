import React, { Component, useEffect, useState } from "react";
import api from "../../helper/api";
import { Form, Input, Button, notification } from "antd";

const AddOfficeForm = () => {
  const handleSubmit = (e) => {
    const name = e.name.replace(/\s+/, "-");
    const location = e.location.replace(/\s+/, "-");
    console.log(name, location);
    const data = {
      officeName: name + " " + location,
    };

    try {
      if (e.name.length > 25 || e.location.length > 25)
        // eslint-disable-next-line no-throw-literal
        throw "You have exceeded the allowed 25 characters at one of the fields ";
      api.post("admin/office", data).then((res) => {
        window.location = "/admin/offices";
      });
    } catch (err) {
      notification.open({
        message: "Error",
        description: err,
        placement: "top",
        duration: 3,
      });
    }
  };

  return (
    <div>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Please input office name without any whitespace!",
            },
          ]}
        >
          <Input placeholder="Office name" />
        </Form.Item>
        <Form.Item
          name="location"
          on
          rules={[{ required: true, message: "Please input office location!" }]}
        >
          <Input placeholder="Office location" />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            className="formButton greenBtn"
            type="primary"
          >
            Save
          </Button>
          <Button
            className="formButton redButton"
            onClick={() => (window.location = "/admin/offices")}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddOfficeForm;
