import React from "react";
import { Menu, Tooltip } from "antd";
import FeatherIcon from "feather-icons-react";
import jwt from "jwt-decode";
import { Link } from "react-router-dom";

const MobileMenu = (props) => {
  const config = { token: localStorage.getItem("msal.idtoken") };

  if (
    jwt(config.token).roles &&
    (jwt(config.token).roles[0] === "ADMIN" ||
      jwt(config.token).roles[1] === "ADMIN")
  ) {
    return (
      <Menu selectedKeys={[props.selected]} mode="inline" className="sideMenu">
        <Menu.Item key="1" icon={<FeatherIcon icon="home" />}>
          <Tooltip title="Home">
            <Link to={"/employee/home"}>{<>Home</>}</Link>
          </Tooltip>
        </Menu.Item>
        <Menu.Item key="2" icon={<FeatherIcon icon="pie-chart" />}>
          <Tooltip title="Dashboard">
            <Link to={"/admin/dashboard"}>{<>Dashboard</>}</Link>
          </Tooltip>
        </Menu.Item>
        <Menu.Item key="3" icon={<FeatherIcon icon="code" />}>
          <Tooltip title="Offices">
            <Link to={"/admin/offices"}>{<>Offices</>}</Link>
          </Tooltip>
        </Menu.Item>
        <Menu.Item key="4" icon={<FeatherIcon icon="coffee" />}>
          <Tooltip title="Reservation list">
            <Link to={"/admin/reservations"}>{<>Reservation list</>}</Link>
          </Tooltip>
        </Menu.Item>
        <Menu.Item key="5" icon={<FeatherIcon icon="coffee" />}>
          <Tooltip title="My reservations">
            <Link to={"/employee/reservations"}>{<>My reservations</>}</Link>
          </Tooltip>
        </Menu.Item>
        <Menu.Item key="6" icon={<FeatherIcon icon="users" />}>
          <Tooltip title="Users">
            <Link to={"/admin/users"}>{<>Users</>}</Link>
          </Tooltip>
        </Menu.Item>
      </Menu>
    );
  }

  return (
    <Menu selectedKeys={[props.selected]} mode="inline" className="sideMenu">
      <Menu.Item key="1" icon={<FeatherIcon icon="home" />}>
        <Tooltip title="Home">
          <Link to={"/employee/home"}>{<>Home</>}</Link>
        </Tooltip>
      </Menu.Item>
      <Menu.Item key="2" icon={<FeatherIcon icon="coffee" />}>
        <Tooltip title="My reservations">
          <Link to={"/employee/reservations"}>{<>My reservations</>}</Link>
        </Tooltip>
      </Menu.Item>
    </Menu>
  );
};
export default MobileMenu;
