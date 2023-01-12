import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import { Button, Card, Input, Popconfirm, Row, Col, Table, Alert } from "antd";
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
  const [inputSearchUser, setInputSearchUser] = useState("");
  const employees = useSelector((state) => state.employees.employees);
  const loggedUser = useSelector((state) => state.user.loggedUser);
  const [usersResult, setUsersResult] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [invalidSearchInput, setInvalidSearchInput] = useState(false);
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
      render: (text, user, index) => {
        return (
          <Popconfirm
            title={user.isAdmin ? "Do you want to assign this admin as user" : "Do you want to assign this user as admin"}
            onConfirm={() => assignUserAsAdmin(user)}
            okText="Yes"
            cancelText="No"
            className={styles.assignAsAdminButton}
            shape="round"
            placement="topRight"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button type="primary">
              {user.isAdmin ? "Assign as user" : "Assign as admin"}
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  const getUsers = async () => {
    fetchEmployeesApi(dispatch);
  };

  const assignUserAsAdmin = (user) => {
    const body = {
      isAdmin: !user.isAdmin,
    };

    updateEmployeeApi(user.id, body).then((response) => {
      
      if (!response) {
        return;
      }

      getUsers();

      openNotification(
        `${user.firstName} ${user.surname} has been set as ${
          user.isAdmin ? "user" : "admin"
        } successfully.`
      );
    });
  };

  const onUserSearch = (e) => {
    const inputValue = e.target.value;

    setFilteredUsers(
      usersResult.filter(
        ({ firstName, surname }) =>
          firstName.toLowerCase().includes(inputValue.toLowerCase()) ||
          surname.toLowerCase().includes(inputValue.toLowerCase())
      )
    );

    if (!inputValue) {
      setInvalidSearchInput(false);
    }

    setInputSearchUser(inputValue);
  };

  const onSubmit = () => {
    getUsers();
  };

  useEffect(() => {
    dispatch(fetchOffices());
    getUsers();
  }, []);

  useEffect(() => {
    if (!filteredUsers.length && inputSearchUser) {
      setInvalidSearchInput(true);
      return;
    }
    setInvalidSearchInput(false);
  }, [filteredUsers]);

  useEffect(() => {
    setUsersResult(filterEmployees(employees, loggedUser));
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
                  <div className={styles.searchInput}>
                    <Input onChange={onUserSearch} placeholder="Search Users" />
                    {invalidSearchInput ? (
                      <Alert
                        message="There is no data or input is invalid."
                        type="error"
                        className={`${styles.alert} ${styles.input}`}
                      />
                    ) : null}
                  </div>

                  <Table
                    style={{ overflow: "auto", overflowY: "hidden" }}
                    columns={usersColumns}
                    dataSource={usersResult.filter(
                      ({ firstName, surname }) =>
                        firstName
                          .toLowerCase()
                          .includes(inputSearchUser.toLowerCase()) ||
                        surname
                          .toLowerCase()
                          .includes(inputSearchUser.toLowerCase())
                    )}
                    pagination={{
                      pageSize: 5,
                      position: ["bottomRight"],
                      showSizeChanger: false,
                      size: "small",
                    }}
                    rowKey="id"
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
