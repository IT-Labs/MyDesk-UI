import React, { useEffect, useState } from "react";
import { addOfficeApi } from "../../../services/office.service";
import { Form, Input, Button } from "antd";
import {
  openError,
  openNotification,
} from "../../../components/notification/Notification";
import { useSelector } from "react-redux";

const AddOfficeForm = () => {
  const offices = useSelector((state) => state.offices.offices);
  const [errorName, setErrorName] = useState("");
  const [ifHaveChanges, setIfHaveChanges] = useState(false);

  useEffect(() => {
    if (ifHaveChanges) {
      window.onbeforeunload = function () {
        return "Changes that you made may not be saved.";
      };
    } else {
      window.onbeforeunload = function () {
        return null;
      };
    }
  }, [ifHaveChanges]);

  function resetErrorHighlighted() {
    setIfHaveChanges(true);
    setErrorName("");
  }

  function onCancel() {
    setIfHaveChanges(false);
    window.onbeforeunload = function () {
      return null;
    };
    window.location = "/admin/offices";
  }

  const handleSubmit = (e) => {
    setIfHaveChanges(false);
    const name = e.name.replace(/\s+/, "-");
    const location = e.location.replace(/\s+/, "-");

    const newOffice = {
      name: name + " " + location,
    };
    const office = offices.find(
      (item) => item.name.toLowerCase() === newOffice.name.toLowerCase()
    );

    if (office) {
      setErrorName("error");
      openError("An office with that name and location already exists");
      return;
    }
    if (e.name.length > 25 || e.location.length > 25) {
      openError(
        "You have exceeded the allowed 25 characters at one of the fields"
      );
      return;
    }

    addOfficeApi(newOffice).then((res) => {
      openNotification("You have successfully added a new office");
      window.location = "/admin/offices";
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
          validateStatus={errorName}
          rules={[
            {
              required: true,
              message: "Please input office name without any whitespace!",
            },
          ]}
        >
          <Input
            placeholder="Office name"
            data-cy="officename-input"
            onChange={resetErrorHighlighted}
          />
        </Form.Item>
        <Form.Item
          name="location"
          validateStatus={errorName}
          on
          rules={[{ required: true, message: "Please input office location!" }]}
        >
          <Input
            placeholder="Office location"
            data-cy="officelocation-input"
            onChange={resetErrorHighlighted}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            data-cy="saveoffice-button"
            className="formButton greenBtn"
            type="primary"
          >
            Save
          </Button>
          <Button className="formButton redButton" onClick={() => onCancel()}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddOfficeForm;
