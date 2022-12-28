import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import { Button, List, Card, Input, Popconfirm, Row, Col } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import styles from "./Users.module.scss";
import Title from "./Title";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOffices } from "../../redux/Offices/offices";
import { fetchEmployeesApi, updateEmployeeApi} from "../../services/employee.service";
import { openNotification } from "../../components/notification/Notification";
import MainLayout from "../../layouts/MainLayout";
import { filterEmployees } from "../../utils/filterEmployees";

const Users = () => {
  const [inputFilter, setInputFilter] = useState("");
  const employees = useSelector((state) => state.employees.employees);
  const loggedUser = useSelector((state) => state.user.loggedUser);
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const dispatch = useDispatch();

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
      <Sidebar selected="6" />
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
                  <List
                    bordered
                    className={styles.listAnt}
                    pagination={{
                      pageSize: 5,
                      position: "bottom",
                      showSizeChanger: false,
                      size: "small",
                    }}
                    dataSource={filteredEmployees.filter(
                      ({ firstName, surname }) =>
                        firstName
                          .toLowerCase()
                          .includes(inputFilter.toLowerCase()) ||
                        surname
                          .toLowerCase()
                          .includes(inputFilter.toLowerCase())
                    )}
                    renderItem={(user) => (
                      <List.Item>
                        <span>{`${user.firstName} ${user.surname}`}</span>
                        <span>{`${user.email}`}</span>
                        <Popconfirm
                          title="Do you want to assign this user as admin?"
                          onConfirm={() => assignAsAdmin(user)}
                          okText="Yes"
                          cancelText="No"
                          className={styles.assignAsAdminButton}
                          shape="round"
                          placement="topRight"
                          icon={
                            <QuestionCircleOutlined style={{ color: "red" }} />
                          }
                        >
                          <Button type="primary">Assign as admin</Button>
                        </Popconfirm>
                      </List.Item>
                    )}
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
