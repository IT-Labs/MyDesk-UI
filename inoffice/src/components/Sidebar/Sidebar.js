import React from "react";
import "./Sidebar.css";
import { Menu } from "antd";
import { Component } from "react/cjs/react.production.min";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Sider from "antd/lib/layout/Sider";
import jwt from "jwt-decode";

class SiderDemo extends Component {
  state = {
    collapsed: false,
  };

  config = {
    token: localStorage.getItem("token"),
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    if (jwt(this.config.token).role == "ADMIN") {
      return (
        <Sider
          style={{ minHeight: "93vh" }}
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}
        >
          <Menu
            theme="dark"
            defaultSelectedKeys={[this.props.selected]}
            mode="inline"
          >
            <Menu.Item
              onClick={() => (window.location = "/admin/dashboard")}
              key="1"
              icon={<PieChartOutlined />}
            >
              Dashboard
            </Menu.Item>
            <Menu.Item
              onClick={() => (window.location = "/admin/offices")}
              key="2"
              icon={<DesktopOutlined />}
            >
              Offices
            </Menu.Item>
            <Menu.Item
              onClick={() => (window.location = "/admin/configuration")}
              key="3"
              icon={<FileOutlined />}
            >
              Configuration
            </Menu.Item>
            <Menu.Item
              onClick={() => (window.location = "/admin/reservations")}
              key="4"
              icon={<TeamOutlined />}
            >
              Reservation List
            </Menu.Item>
          </Menu>
        </Sider>
      );
    }

    return (
      <Sider
        style={{ minHeight: "93vh" }}
        collapsible
        collapsed={collapsed}
        onCollapse={this.onCollapse}
      >
        <Menu
          theme="dark"
          defaultSelectedKeys={[this.props.selected]}
          mode="inline"
        >
          <Menu.Item
            onClick={() => (window.location = "/admin/configuration")}
            key="3"
            icon={<FileOutlined />}
          >
            Personal Information
          </Menu.Item>
          <Menu.Item
            onClick={() => (window.location = "/admin/reservations")}
            key="4"
            icon={<TeamOutlined />}
          >
            My Reservations
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default SiderDemo;
