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
import FeatherIcon from "feather-icons-react";
import Sider from "antd/lib/layout/Sider";
import jwt from "jwt-decode";
import { Link } from "react-router-dom";

class SiderDemo extends Component {
  state = {
    collapsed: false,
  };

  config = {
    token: localStorage.getItem("msal.idtoken"),
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    if (jwt(this.config.token).roles[0] == "ADMIN") {
      return (
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "sticky",
            top: 0,
            left: 0,
          }}
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}
        >
          <Menu selectedKeys={[this.props.selected]} mode="inline">
            <Menu.Item key="1" icon={<FeatherIcon icon="home" />}>
              <Link to={"/admin/dashboard"}>
                {!this.state.collapsed && <>Dashboard</>}
              </Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<FeatherIcon icon="code" />}>
              <Link to={"/admin/offices"}>
                {!this.state.collapsed && <>Offices</>}
              </Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<FeatherIcon icon="settings" />}>
              <Link to={"/admin/configuration"}>
                {!this.state.collapsed && <>Configuration</>}
              </Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<FeatherIcon icon="coffee" />}>
              <Link to={"/admin/reservations"}>
                {!this.state.collapsed && <>Reservation List</>}
              </Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<FeatherIcon icon="coffee" />}>
              <Link to={"/employee/reservations"}>
                {!this.state.collapsed && <>My Reservations</>}
              </Link>
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
        <Menu theme="light" selectedKeys={[this.props.selected]} mode="inline">
          <Menu.Item key="1" icon={<TeamOutlined />}>
            <Link to={"/employee/reservations"}>My reservations</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default SiderDemo;
