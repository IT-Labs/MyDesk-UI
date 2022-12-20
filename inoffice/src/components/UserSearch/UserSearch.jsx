import { Modal, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./UserSearch.module.scss";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import { getAllFutureReservationsApi } from "../../services/reservation.service";
import { fetchAllOfficesAdminApi } from "../../services/office.service";
import { sortByName } from "../../utils/sortByName";

const UserSearch = () => {
  const [employee, setEmployee] = useState({});
  const [visible, setVisible] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const { employees } = useSelector((state) => state.employees);
  const futureColumns = [
    {
      title: "Desk",
      dataIndex: "entity",
      key: 1,
    },
    { title: "Office", dataIndex: ["desk", "office", "name"], key: 2 },
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

  const sortResStruct = (res) => {
    const results = res
      .map((item) => {
        const start = new Date(item.startDate);
        const end = new Date(item.endDate);
        return {
          ...item,
          employee: `${item.employee.firstName} ${item.employee.surname}`,
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
    setReservations(results);
  };

  const getAllRes = () => {
    getAllFutureReservationsApi().then(({ data }) => {
      sortResStruct(data.values);
    });

    fetchAllOfficesAdminApi().then(({ data }) => {
      let sorted = sortByName(data);
      return sorted;
    });
  };

  const findEmployee = (e) => {
    const foundEmployee = employees.find(
      ({ firstName, surname, jobTitle }) =>
        `${firstName} ${surname} ${jobTitle}` === e
    );
    setVisible(true);
    setEmployee(foundEmployee);
  };

  useEffect(() => {
    getAllRes();
  }, []);

  return (
    <>
      <Select
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
              value={`${item.firstName} ${item.surname} ${item.jobTitle}`}
            >
              <h4
                style={{ fontSize: 14 }}
              >{`${item.firstName} ${item.surname}`}</h4>
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
          Name: {employee.firstName} {employee.surname}
        </h3>
        <h3>Job title: {employee.jobTitle}</h3>
        <h3>E-Mail: {employee.email}</h3>

        <Table
          columns={futureColumns}
          pagination={false}
          className="newTable"
          dataSource={reservations.filter(
            (item) =>
              item.employee === `${employee.firstName} ${employee.surname}`
          )}
          style={{ height: 300, maxHeight: 300 }}
          scroll={{ y: 250 }}
        />
      </Modal>
    </>
  );
};

const PlaceholderText = ({ name }) => {
  return !name.length > 0 ? (
    <div className={styles.flexDiv}>
      <SearchOutlined style={{ fontSize: "16px" }} />
      <p className={styles.textStyle}>Search by user</p>
    </div>
  ) : null;
};

export default UserSearch;
