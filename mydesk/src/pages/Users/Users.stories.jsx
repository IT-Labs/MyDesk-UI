import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Card, Input, Table, Popconfirm, Typography } from "antd";
import { useState } from "react";
import { Fragment } from "react";
import { openNotification } from "../../components/notification/Notification";
import styles from "./Users.module.scss";

export default {
  title: "Users",
  component: Fragment,
};

export const UsersPage = () => {
  const [inputFilter, setInputFilter] = useState("");
  const data = [
    {
      email: "john.doe@it-labs.com",
      firstName: "John",
      id: 1,
      isAdmin: true,
      isSSOAccount: null,
      jobTitle: "Front-end Engineer",
      password: null,
      surname: "Doe",
    },
    {
      email: "jane.doe@it-labs.com",
      firstName: "Jane",
      id: 2,
      isAdmin: false,
      isSSOAccount: null,
      jobTitle: "Front-end Engineer",
      password: null,
      surname: "Doe",
    },
  ];

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
            onConfirm={() => assignAs(data)}
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

  const onUserSearch = (e) => {
    setInputFilter(e.target.value);
  };

  const assignAs = (value) => {
    openNotification(
      `${value.firstName} ${value.surname} has been made ${
        value.isAdmin ? "user" : "admin"
      } successfully.`
    );
  };

  return (
    <Fragment>
      <p>
        The Users page is where admins can add new users and assign roles to
        user.
      </p>
      <Card title="Users">
        <div style={{ overflowX: "scroll" }}>
          <Input style={{ width: 200 }} onChange={onUserSearch} />
          <Table
            style={{ overflow: "auto", overflowY: "hidden" }}
            columns={usersColumns}
            dataSource={data.filter(
              ({ firstName, surname }) =>
                firstName.toLowerCase().includes(inputFilter.toLowerCase()) ||
                surname.toLowerCase().includes(inputFilter.toLowerCase())
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
    </Fragment>
  );
};
