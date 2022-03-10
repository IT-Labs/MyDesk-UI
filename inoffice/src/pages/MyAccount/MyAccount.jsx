import { Component } from "react/cjs/react.production.min";
import React from "react";
import FirstName from "../../components/inputs/FirstName";
import LastName from "../../components/inputs/LastName";
import EmailComponent from "../../components/inputs/EmailComponent";
import JobTitle from "../../components/inputs/JobTitle";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Button, Form } from "antd";
import UserHeade from "../../components/Head/UserHead";
import Layout, { Content } from "antd/lib/layout/layout";

class MyAccount extends Component {
  state = {};

  handleSubmit = (e, value) => {
    const data = {
      email: e.email,
      firstname: e.firstname,
      lastname: e.lastname,
      jobTitle: `selected ${value}`,
    };
  };
  render() {
    return (
      <Layout>
        <UserHeade />
        <Layout>
          <Sidebar />
          <Content>
            <h1>My Account</h1>
            <Form className="MyAccountForm" onFinish={this.handleSubmit}>
              <FirstName />
              <LastName />
              <EmailComponent />
              <JobTitle />
              <Button
                onClick={(event) => (window.location.href = "/changepassword")}
                type="primary"
                className="login-form-button"
                style={{ backgroundColor: "grey", color: "blue" }}
              >
                Change password
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="save-changes"
                style={{ backgroundColor: "grey", color: "blue" }}
              >
                Save changes
              </Button>
            </Form>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default MyAccount;
