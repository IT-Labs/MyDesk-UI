import React, { Component } from "react";
import api from "../../helper/api";
import { Form, Input, Button } from "antd";
import { withRouter } from "../../helper/withRouterHelper";
import {
  openError,
  openNotification,
} from "../../components/notification/Notification";

class AddOffice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: this.props.imageUrl,
      officeName: this.props.params.name.split(" ")[0],
      officeLocation: this.props.params.name.split(" ")[1],
      officeId: this.props.params.id,
    };
  }

  handleSubmit = (e) => {
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

    api.put("admin/office/" + this.state.officeId, data).then((res) => {
      window.location =
        "/admin/edit/" + data.officeName + "/" + this.props.params.id;
    });
  };

  render() {
    return (
      <div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={this.handleSubmit}
          initialValues={{
            officePlan: this.state.imageUrl,
            officeName: this.state.officeName,
            officeLocation: this.state.officeLocation,
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
            rules={[
              { required: false, message: "Please enter office location" },
            ]}
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
              onClick={() =>
                (window.location =
                  "/admin/edit/" +
                  this.props.params.name +
                  "/" +
                  this.props.params.id)
              }
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default withRouter(AddOffice);
