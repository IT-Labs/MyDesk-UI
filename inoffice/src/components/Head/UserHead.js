import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import { Header } from "antd/lib/layout/layout";
import jwt from "jwt-decode";

import HeaderImg from "./HeaderImg";
import avatar from "../../assets/avatar.png";
import { notification, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../utils/fetchEmployees";
import api from "../../helper/api";

const UserHead = (props) => {
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState({});
  const [visible, setVisible] = useState(false);

  const getUsers = async () => {
    fetchEmployees(api, dispatch, notification);
  };

  useEffect(() => {
    if (employees.length === 0) {
      getUsers();
    }
  }, []);

  const config = {
    token: sessionStorage.getItem("msal.idtoken"),
    decoded: jwt(sessionStorage.getItem("msal.idtoken")),
  };
  const { employees } = useSelector((state) => state.employees);

  const findEmployee = (e) => {
    const foundEmployee = employees.find(
      ({ firstName, lastName }) => `${firstName} ${lastName}` === e
    );
    setVisible(true);
    setEmployee(foundEmployee);
  };
  return (
    <Header id="header">
      {/* Hello x user here without the my account tab, same as the admin page*/}

      <div>{props?.isHome && <HeaderImg />}</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "80%",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {!props?.isHome ? (
          <Select
            defaultValue={"Search for user"}
            showSearch
            style={{ width: 220 }}
            onSelect={findEmployee}
          >
            {employees &&
              employees.map((item) => (
                <Select.Option
                  key={item.id}
                  value={`${item.firstName} ${item.lastName}`}
                >
                  <h4
                    style={{ fontSize: 14 }}
                  >{`${item.firstName} ${item.lastName}`}</h4>
                  <p style={{ fontSize: 9 }}>{item.jobTitle}</p>
                </Select.Option>
              ))}
          </Select>
        ) : (
          <div></div>
        )}
        <div>
          <img src={avatar} alt="avatar" style={{ width: 90, height: 50 }} />
          <NavLink className={"link"} to="/employee/reservations">
            {config.decoded.name}
          </NavLink>
          <NavLink
            className={"link"}
            to="/"
            onClick={() => {
              sessionStorage.clear();
              localStorage.clear();
              window.location = "/";
            }}
          >
            Log out
          </NavLink>
          <Modal
            title="Employee details"
            visible={visible}
            onOk={() => setVisible(false)}
          >
            <h3>
              Name: {employee.firstName} {employee.lastName}
            </h3>
            <h3>Job title: {employee.jobTitle}</h3>
            <h3>E-Mail: {employee.email}</h3>
          </Modal>
        </div>
      </div>
    </Header>
  );
};

export default UserHead;
