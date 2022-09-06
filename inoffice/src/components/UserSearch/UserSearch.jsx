import { Modal, notification, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { fetchEmployees } from "../../utils/fetchEmployees";
import api from "../../helper/api";
import { useDispatch, useSelector } from "react-redux";
import styles from "./UserSearch.module.scss";

import moment from "moment";

import { SearchOutlined } from "@ant-design/icons";
import { getAllFutureReservations } from "../../utils/getAllFutureReservations";

const UserSearch = () => {
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState({});
  const [visible, setVisible] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const { decodedUser } = useSelector((state) => state.user);

  const getUsers = async () => {
    fetchEmployees(api, dispatch, notification, decodedUser);
  };

  const sortFuture = (res) => {
    const future = getAllFutureReservations(res);
    setReservations(future);
  };

  const sortResStruct = (res) => {
    const results = res
      .map((item) => {
        const start = new Date(item.startDate);
        const end = new Date(item.endDate);
        return {
          ...item,
          employee: `${item.employee.firstName} ${item.employee.lastName}`,
          office: item.officeName ? item.officeName : "Undefined office",
          entity: item.desk.indexForOffice
            ? `Desk [${item.desk.indexForOffice}]`
            : "Undefined Desk",
          key: item.id,
          startDate: Date.parse(item.startDate),
          endDate: Date.parse(item.endDate),
          date: `${moment(start).format("DD/MM/YYYY")}-${moment(end).format(
            "DD/MM/YYYY"
          )}`,
        };
      })
      .sort((a, b) => {
        const date1 = new Date(a.startDate).getTime();
        const date2 = new Date(b.startDate).getTime();

        return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
      });
    sortFuture(results);
  };

  const futureColumns = [
    {
      title: "Desk",
      dataIndex: "entity",
      key: 1,
    },
    { title: "Office", dataIndex: "office", key: 2 },
    {
      title: "Date",
      dataIndex: "date",
      key: 3,
      sorter: {
        compare: (a, b) => {
          const date1 = new Date(a.startDate).getTime();
          const date2 = new Date(b.startDate).getTime();

          return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
        },
        multiple: 1,
      },
      sortDirections: ["descend"],
    },
  ];

  const getAllRes = () => {
    api
      .get("employee/reservations/all")
      .then(({ data }) => {
        sortResStruct(data.values);
      })
      .catch((err) => {
        console.log(err);
      });
    api
      .get("admin/offices")
      .then(({ data }) => {
        let sorted = data.sort((a, b) => {
          return a.name < b.name ? -1 : b.name > a.name ? 1 : 0;
        });
        return sorted;
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUsers();
    getAllRes();
  }, []);

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
        value={employeeName}
        onSearch={(e) => setEmployeeName(e)}
        style={{ width: 220 }}
        className="userSearchSelect"
        onSelect={findEmployee}
        suffixIcon={<PlaceholderText name={employeeName} />}
      >
        {employees ? (
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
          ))
        ) : (
          <p>No employees atm</p>
        )}
      </Select>
      <Modal
        title="Employee details"
        visible={visible}
        onOk={() => {
          setVisible(false);
          setEmployeeName("");
        }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <h3>
          Name: {employee.firstName} {employee.lastName}
        </h3>
        <h3>Job title: {employee.jobTitle}</h3>
        <h3>E-Mail: {employee.email}</h3>

        <Table
          columns={futureColumns}
          pagination={false}
          className="newTable"
          dataSource={reservations.filter(
            (item) =>
              item.employee === `${employee.firstName} ${employee.lastName}`
          )}
          style={{ height: 300, maxHeight: 300 }}
          scroll={{ y: 250 }}
        />
      </Modal>
    </>
  );
};

const PlaceholderText = ({ name }) => {
  return name.length > 0
    ? null
    : 9 /
      (
        <div className={styles.flexDiv}>
          <SearchOutlined size="80px" />
          <p className={styles.textStyle}>Search by user</p>
        </div>
      );
};

export default UserSearch;
