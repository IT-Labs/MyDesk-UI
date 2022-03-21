import React from "react";
import "./Sidebar.css";
import { Menu } from "antd";
import { Component } from "react/cjs/react.production.min";
import {
  DesktopOutlined,
  PieChartOutlined,
  FolderOutlined,
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
          style={{  overflow: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0,  }}
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
              icon={<FolderOutlined />}
            >
              Configuration
            </Menu.Item>
            <Menu.Item
              onClick={() => (window.location = "/admin/reservations")}
              key="4"
              icon={<TeamOutlined />}
            >
              Reservation list
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
            onClick={() => (window.location = "/employee/reservations")}
            key="2"
            icon={<TeamOutlined />}
          >
            My reservations
          </Menu.Item>
          <Menu.Item
            onClick={() => (window.location = "/employee/informations")}
            key="1"
            icon={<FolderOutlined />}
          >
            Personal information
          </Menu.Item>
          
        </Menu>
      </Sider>
    );
  }
}

export default SiderDemo;
