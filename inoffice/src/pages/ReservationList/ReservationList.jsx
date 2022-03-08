import React, { Component } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";

export default class ReservationList extends Component {
  render() {
    return (
      <Layout>
        <UserHeade />
        <Layout>
          <Sidebar selected="4" />
          <Content>Reservation List</Content>
          <Footer>
            <p>Footer</p>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
