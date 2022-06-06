import { Modal, notification, Select } from "antd";
import React, { useEffect, useState } from "react";
import { fetchEmployees } from "../../utils/fetchEmployees";
import api from "../../helper/api";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";

const UserSearch = () => {
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState({});
  const [visible, setVisible] = useState(false);

  const getUsers = async () => {
    fetchEmployees(api, dispatch, notification);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const config = {
    token: sessionStorage.getItem("msal.idtoken"),
    decoded: jwtDecode(sessionStorage.getItem("msal.idtoken")),
  };
  const { employees } = useSelector((state) => state.employees);

  const findEmployee = (e) => {
    const foundEmployee = employees.find(
      ({ firstName, lastName, jobTitle }) =>
        `${firstName} ${lastName} ${jobTitle}` === e
    );
    setVisible(true);
    setEmployee(foundEmployee);
  };
  return (
    <>
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
              value={`${item.firstName} ${item.lastName} ${item.jobTitle}`}
            >
              <h4
                style={{ fontSize: 14 }}
              >{`${item.firstName} ${item.lastName}`}</h4>
              <p style={{ fontSize: 9 }}>{item.jobTitle}</p>
            </Select.Option>
          ))}
      </Select>
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
    </>
  );
};

export default UserSearch;
