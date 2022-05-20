import React, { Component } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import { Card } from "antd";

export default class ReservationList extends Component {
  render() {
    return (
      <Layout>
        <UserHeade />
        <Layout>
          <Sidebar selected="4" />
          <Content>
            <Card title="Reservation List"></Card>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
