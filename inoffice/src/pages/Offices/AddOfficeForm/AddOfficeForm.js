import React from "react";
import api from "../../../helper/api";
import { Form, Input, Button } from "antd";
import {
  openError,
  openNotification,
} from "../../../components/notification/Notification";
import { useSelector } from "react-redux";

const AddOfficeForm = () => {
  const offices = useSelector((state) => state.offices.offices);
  const handleSubmit = (e) => {
    const name = e.name.replace(/\s+/, "-");
    const location = e.location.replace(/\s+/, "-");
    console.log(name, location);
    const data = {
      name: name + " " + location,
    };
    const office = offices.find(
      (item) => item.name.toLowerCase() === data.name.toLowerCase()
    );

    if (office) {
      openError("That office already exists");
      return;
    }
    if (e.name.length > 25 || e.location.length > 25) {
      openError(
        "You have exceeded the allowed 25 characters at one of the fields"
      );
      return;
    }

    api
      .post("admin/office", data)
      .then((res) => {
        openNotification("You have successfully added a new office");
        window.location = "/admin/offices";
      })
      .catch((err) => {
        openError(err.response.data);
      });
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
