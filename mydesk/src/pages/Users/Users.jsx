import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import { Button, Card, Input, Popconfirm, Row, Col, Table } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import styles from "./Users.module.scss";
import Title from "./Title";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOffices } from "../../redux/Offices/offices";
import {
  fetchEmployeesApi,
  updateEmployeeApi,
} from "../../services/employee.service";
import { openNotification } from "../../components/notification/Notification";
import MainLayout from "../../layouts/MainLayout";
import { filterEmployees } from "../../utils/filterEmployees";

const Users = () => {
  const media = window.matchMedia("(max-width: 820px)");
  const [inputFilter, setInputFilter] = useState("");
  const employees = useSelector((state) => state.employees.employees);
  const loggedUser = useSelector((state) => state.user.loggedUser);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const dispatch = useDispatch();
  const usersColumns = [
    {
      title: "Employee",
      dataIndex: ["firstName"],
      key: 1,
      width: "40%",
      render: (text, record, index) => {
        return (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <span style={{ marginLeft: "15px" }}>
              {record.firstName} {record.surname}
            </span>
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: ["email"],
      key: 2,
      width: "40%",
    },
    {
      title: "Action",
      dataIndex: "assign",
      width: "5px",
      key: 3,
      render: (text, data, index) => {
        return (
          <Popconfirm
            title="Do you want to assign this user as admin?"
            onConfirm={() => assignAsAdmin(data)}
            okText="Yes"
            cancelText="No"
            className={styles.assignAsAdminButton}
            shape="round"
            placement="topRight"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button type="primary">Assign as admin</Button>
          </Popconfirm>
        );
      },
    },
  ];

  const getUsers = async () => {
    fetchEmployeesApi(dispatch);
  };

  const assignAsAdmin = (value) => {
    const body = {
      isAdmin: false,
    };

    updateEmployeeApi(value.id, body).then((res) => {
      openNotification(
        `${value.firstName} ${value.surname} has been made admin successfully.`
      );
    });
  };

  const handleChange = (e) => {
    setInputFilter(e.target.value);
  };

  const onSubmit = () => {
    getUsers();
  };

  useEffect(() => {
    dispatch(fetchOffices());
    getUsers();
  }, []);

  useEffect(() => {
    setFilteredEmployees(filterEmployees(employees, loggedUser));
  }, [employees, loggedUser]);

  return (
    <Layout>
      <div>{!media.matches && <Sidebar selected="6" />}</div>
      <MainLayout isHome={false}>
        <Content className={styles.contentAnt}>
          <Row className={styles.rowAnt}>
            <Col span={24}>
              <Card
                className={styles.cardContainer}
                title={
                  <Title
                    officeName="Users"
                    addUserTextBtn="Add user"
                    onSubmit={onSubmit}
                  />
                }
              >
                <div style={{ overflowX: "scroll" }}>
                  <Input
                    className={styles.searchInput}
                    onChange={handleChange}
                    placeholder="Search Users"
                  />
                  <Table
                    style={{ overflow: "auto", overflowY: "hidden" }}
                    columns={usersColumns}
                    dataSource={filteredEmployees.filter(
                      ({ firstName, surname }) =>
                        firstName
                          .toLowerCase()
                          .includes(inputFilter.toLowerCase()) ||
                        surname
                          .toLowerCase()
                          .includes(inputFilter.toLowerCase())
                    )}
                    pagination={{
                      pageSize: 5,
                      position: ["bottomRight"],
                      showSizeChanger: false,
                      size: "small",
                    }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </MainLayout>
    </Layout>
  );
};

export default Users;
