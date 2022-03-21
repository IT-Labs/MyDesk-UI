import React, { Component } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHead from "../../components/Head/UserHead";

export default class PersonalInformations extends Component {
  render() {
    return (
      <Layout>
        <UserHead />
        <Layout>
          <Sidebar selected="2" />
          <Content>Personal Informations</Content>
        </Layout>
      </Layout>
    );
  }
}
