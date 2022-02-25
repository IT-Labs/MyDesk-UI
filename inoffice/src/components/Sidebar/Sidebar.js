import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./Sidebar.css";
import { Layout, Menu, Breadcrumb } from "antd";
import { Component } from "react/cjs/react.production.min";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Header1 from "../Header/Header";

const { Header, Content, Footer, Sider } = Layout;

class SiderDemo extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item
              onClick={() => alert("clicked")}
              key="1"
              icon={<PieChartOutlined />}
            >
              Dashboard
            </Menu.Item>
            <Menu.Item
              onClick={() => alert("clicked")}
              key="2"
              icon={<DesktopOutlined />}
            >
              Offices
            </Menu.Item>
            <Menu.Item
              onClick={() => alert("clicked")}
              key="3"
              icon={<FileOutlined />}
            >
              Configuration
            </Menu.Item>
            <Menu.Item
              onClick={() => alert("clicked")}
              key="4"
              icon={<TeamOutlined />}
            >
              Reservation List
            </Menu.Item>
          </Menu>
        </Sider>
        <Header>
          <h1>ASD</h1>
          <Header1 />
        </Header>
        <Content>Component for a given choice - EX: Dashboard</Content>
      </Layout>
    );
  }
}

export default SiderDemo;

ReactDOM.render(<SiderDemo />, document.getElementById("root"));
