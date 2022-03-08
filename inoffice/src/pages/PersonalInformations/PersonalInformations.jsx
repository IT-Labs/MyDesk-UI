import React, { Component } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";

export default class PersonalInformations extends Component {
  render() {
    return (
      <Layout>
        <UserHeade />
        <Layout>
          <Sidebar selected="1" />
          <Content>Personal Informations</Content>
          <Footer>
            <p>Footer</p>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
