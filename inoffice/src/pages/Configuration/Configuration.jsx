import React, { Component } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import styles from "./Configuration.module.css";
export default class Configuration extends Component {
  render() {
    return (
      <Layout>
        <UserHeade />
        <Layout className="panelBg">
          <Sidebar selected="3" />
          <Content>
            <h1>Configuration</h1>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
