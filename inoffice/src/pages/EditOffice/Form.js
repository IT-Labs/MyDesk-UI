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
      "/admin/edit/"+data.officeName+"/"+this.props.params.id
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
            rules={[{ required: false, message: "Please enter image url" },
            ]}
          >
            <Input placeholder="Image url" />
          </Form.Item>

          <Form.Item
            name="officeName"
            rules={[{ required: false, message: "Please enter office name" },
            {
              required: true,
              pattern: new RegExp(
                "^[A-Za-z][A-Za-z0-9_./&-]{0,25}$"
              ),
              message: "You exceeded the maximum number of characters",
            }]}
          >
            <Input placeholder="Office name" />
          </Form.Item>

          <Form.Item
            name="officeLocation"
            rules={[
              { required: false, message: "Please enter office location" },
              {
                required: true,
                pattern: new RegExp(
                  "^[A-Za-z][A-Za-z0-9_./&-]{0,25}$"
                ),
                message: "You exceeded the maximum number of characters",
              }
            ]}
          >
            <Input placeholder="Office location" />
          </Form.Item>

          <Form.Item>
            <Button 
            htmlType="submit" 
            className="formButton" 
            type="primary"
            shape="round"

            >
              Save
            </Button>
            <Button
              type="primary"
              className="formButton"
              shape="round"
              onClick={() => (window.location = "/admin/edit/"+this.props.params.name+"/"+this.props.params.id)}
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
