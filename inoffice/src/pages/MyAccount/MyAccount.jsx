import { Component } from "react/cjs/react.production.min";
import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import UserHead from "../../components/Head/UserHead";
import Layout, {Content} from "antd/lib/layout/layout";

class MyAccount extends Component {
    state = {};

    render() {
        return (
            <Layout>
                <UserHead/>
                <Layout>
                    <Sidebar/>
                    <Content>
                       My account
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default MyAccount;
