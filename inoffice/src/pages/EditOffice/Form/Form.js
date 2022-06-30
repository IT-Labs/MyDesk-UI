import React from "react";
import api from "../../../helper/api";
import { Form, Input, Button } from "antd";
import { withRouter } from "../../../helper/withRouterHelper";
import { openError } from "../../../components/notification/Notification";
import { useNavigate } from "react-router-dom";

const AddOffice = (props) => {
  const imageUrl = props.imageUrl;
  const officeName = props.params.name.split(" ")[0];
  const officeLocation = props.params.name.split(" ")[1];

  const officeId = props.params.id;

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    if (
      e.officeName.length >= 25 ||
      e.officeName.length === 0 ||
      e.officeLocation.length >= 25 ||
      e.officeLocation.length === 0
    ) {
      openError(
        "The office name and office location should be more between 0 and 25 characters each."
      );
      return;
    }
    const data = {
      officeName:
        e.officeName.replace(/\s+/, "-") +
        " " +
        e.officeLocation.replace(/\s+/, "-"),
      officePlan: e.officePlan,
    };

    api.put("admin/office/" + officeId, data).then((res) => {
      navigate(`/admin/edit/${data.officeName}/${props.params.id}`);
    });
  };
  return (
    <div>
      <Form
        name="normal_login"
        className="login-form"
        onFinish={handleSubmit}
        initialValues={{
          officePlan: imageUrl,
          officeName: officeName,
          officeLocation: officeLocation,
        }}
      >
        <Form.Item
          name="officePlan"
          rules={[{ required: false, message: "Please enter image url" }]}
        >
          <Input placeholder="Image url" />
        </Form.Item>

        <Form.Item
          name="officeName"
          rules={[{ required: false, message: "Please enter office name" }]}
        >
          <Input placeholder="Office name" />
        </Form.Item>

        <Form.Item
          name="officeLocation"
          rules={[{ required: false, message: "Please enter office location" }]}
        >
          <Input placeholder="Office location" />
        </Form.Item>

        <Form.Item>
          <Button
            htmlType="submit"
            className="greenBtn"
            type="primary"
            shape="round"
          >
            Save
          </Button>
          <Button
            className="redButton"
            style={{ marginLeft: 5 }}
            onClick={props.hideModal}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default withRouter(AddOffice);
