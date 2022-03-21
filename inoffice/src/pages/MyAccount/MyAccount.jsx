import { Component } from "react/cjs/react.production.min";
import React from "react";
import FirstName from "../../components/inputs/FirstName";
import LastName from "../../components/inputs/LastName";
import EmailComponent from "../../components/inputs/EmailComponent";
import JobTitle from "../../components/inputs/JobTitle";
import Sidebar from "../../components/Sidebar/Sidebar";
import {Button, Form} from "antd";
import UserHead from "../../components/Head/UserHead";
import Layout, {Content} from "antd/lib/layout/layout";

class MyAccount extends Component {
    state = {};

    handleSubmit = (e, value) => {
        const data = {
            Firstname: e.firstname,
            Lastname: e.lastname,
            Email: e.email,
            JobTitle: `selected ${value}`
        };
    };
    render() {
        return (
            <Layout>
                <UserHead/>
                <Layout>
                    <Sidebar/>
                    <Content>
                        <h1>My account</h1>
                        <div className="MyAccountForm">
                            <Form onFinish={
                                this.handleSubmit
                            }>
                                <FirstName/>
                                <LastName/>
                                <EmailComponent/>
                                <JobTitle/>
                                <Button onClick={
                                        (event) => (window.location.href = "/changepassword")
                                    }
                                    type="primary"
                                    className="login-form-button"
                                    style={
                                        {
                                            backgroundColor: "grey",
                                            color: "blue"
                                        }
                                }>
                                    Change password
                                </Button>
                                <Button type="primary" htmlType="submit" className="save-changes"
                                    style={
                                        {
                                            backgroundColor: "grey",
                                            color: "blue"
                                        }
                                }>
                                    Save changes
                                </Button>
                            </Form>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default MyAccount;
