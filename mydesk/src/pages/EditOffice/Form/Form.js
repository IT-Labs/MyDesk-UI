import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { editOfficeApi } from "../../../services/office.service";
import { withRouter } from "../../../helper/withRouterHelper";
import {
  openError,
  openNotification,
} from "../../../components/notification/Notification";

const AddOffice = (props) => {
  const imageUrl = props.imageUrl;
  const officeName = props.params.name.split(" ")[0];
  const officeLocation = props.params.name.split(" ")[1];
  const officeId = props.params.id;
  const navigate = useNavigate();
  const [errorName, setErrorName] = useState("");

  function resetErrorHighlighted() {
    setErrorName("");
  }

  /**
   * It takes the officeName and officeLocation from the form and replaces the spaces with dashes. Then
   * it adds the officeName and officeLocation together with a space in between. Then it adds the
   * officePlan to the data object. Then it makes a put request to the api with the data object. Then it
   * navigates to the page with the officeName and officeLocation.
   * @param e - the form data
   * @returns The data object is being returned.
   */
  const handleSubmit = (e) => {
    if (
      e.officeName.length >= 25 ||
      e.officeName.length === 0 ||
      e.officeLocation.length >= 25 ||
      e.officeLocation.length === 0
    ) {
      openError(
        "The office name and office location should be between 0 and 25 characters each."
      );
      return;
    }

    const data = {
      name:
        e.officeName.replace(/\s+/, "-") +
        " " +
        e.officeLocation.replace(/\s+/, "-"),
      officeImage: e.officePlan,
    };

    let officeImageChange = imageUrl !== data.officeImage;

    const officeChange =
      (officeName + " " + officeLocation).toLowerCase() ===
        data.name.toLowerCase() && !officeImageChange;

    if (officeChange) {
      setErrorName("error");
      openError("An office with that name and location already exists");
      return;
    }

    editOfficeApi(officeId, data).then(() => {
      navigate(`/admin/edit/${data.name}/${officeId}`);
      openNotification("You have successfully updated office plan/information");
      props.hideModal();
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
          validateStatus={errorName}
          rules={[{ required: false, message: "Please enter office name" }]}
        >
          <Input placeholder="Office name" onChange={resetErrorHighlighted} />
        </Form.Item>

        <Form.Item
          name="officeLocation"
          validateStatus={errorName}
          rules={[{ required: false, message: "Please enter office location" }]}
        >
          <Input
            placeholder="Office location"
            onChange={resetErrorHighlighted}
          />
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
