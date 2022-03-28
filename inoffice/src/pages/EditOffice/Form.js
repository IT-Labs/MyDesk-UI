import React, { Component } from "react";
import api from "../../helper/api";
import { Form, Input, Button } from "antd";
import { withRouter } from "../../helper/withRouterHelper";

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
    const data = {
      officeName: e.officeName + " " + e.officeLocation,
      officePlan: e.officePlan,
    }

    api.put(
      "admin/office/" + this.state.officeId,
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
            <Input placeholder="Office Name" />
          </Form.Item>

          <Form.Item
            name="officeLocation"
            rules={[
              { required: false, message: "Please enter office location" },
            ]}
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
export default withRouter(AddOffice);
