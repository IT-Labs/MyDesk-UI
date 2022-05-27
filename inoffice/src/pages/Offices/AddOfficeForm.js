import React, { Component, useEffect, useState } from "react";
import api from "../../helper/api";
import { Form, Input, Button, notification } from "antd";

const AddOfficeForm = () => {
  const handleSubmit = (e) => {
    const data = {
      officeName: e.name + " " + e.location,
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
              message: "Please input office name!",
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
            className="formButton"
            type="primary"
            style={{ background: "#5cb1b8", borderRadius: 7, border: "none" }}
          >
            Save
          </Button>
          <Button
            type="primary"
            style={{
              background: "rgb(255,70,70)",
              borderRadius: 7,
              border: "none",
            }}
            className="formButton"
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
