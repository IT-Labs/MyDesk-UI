import { List, Modal, notification, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { fetchEmployees } from "../../utils/fetchEmployees";
import api from "../../helper/api";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import { SearchOutlined } from "@ant-design/icons";
import { getAllFutureReservations } from "../../utils/getAllFutureReservations";

const UserSearch = () => {
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState({});
  const [visible, setVisible] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [employeeName, setEmployeeName] = useState("");

  const getUsers = async () => {
    fetchEmployees(api, dispatch, notification);
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
          entity: item.indexForOffice
            ? `Desk [${item.indexForOffice}]`
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
        sortResStruct(data.reservations);
        console.log(data);
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
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUsers();
    getAllRes();
  }, []);

  const config = {
    token: localStorage.getItem("msal.idtoken"),
    decoded: jwtDecode(localStorage.getItem("msal.idtoken")),
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
        value={employeeName}
        onChange={(e) => setEmployeeName(e)}
        style={{ width: 220 }}
        className="userSearchSelect"
        onSelect={findEmployee}
        suffixIcon={employeeName.length > 0 ? <></> : <SearchOutlined />}
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
          scroll={{ y: 300 }}
        />
      </Modal>
    </>
  );
};

export default UserSearch;
