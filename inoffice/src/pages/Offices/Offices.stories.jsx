import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  List,
  notification,
  Popconfirm,
  Typography,
} from "antd";
import { useState } from "react";
import { Fragment } from "react";
import { openNotification } from "../../components/notification/Notification";

export default {
  title: "Offices",
  component: Fragment,
};

export const OfficesCard = () => {
  const data = [
    {
      name: "Dave-Inc Placeholder-Location",
      officeImage: "https://i.postimg.cc/GhfkwTGk/in-Office-PLAN.jpg",
      desks: null,
      modes: null,
      conferenceRooms: null,
      id: 77,
      isDeleted: false,
    },
    {
      name: "Steve-Inc Placeholder-Location",
      officeImage: "https://i.postimg.cc/GhfkwTGk/in-Office-PLAN.jpg",
      desks: null,
      modes: null,
      conferenceRooms: null,
      id: 77,
      isDeleted: false,
    },
  ];
  const [inputFilter, setInputFilter] = useState("");

  const handleChange = (e) => {
    setInputFilter(e.target.value);
  };

  const deleteFunc = (id) => {
    openNotification("Deleted");
  };

  return (
    <Fragment>
      <p>
        The offices page is where admins can create,edit and delete offices.
      </p>
      <Card title="Offices">
        <div style={{ overflowX: "scroll" }}>
          <Input style={{ width: 200 }} onChange={handleChange} />
          <List
            bordered
            style={{ minWidth: 400, border: "none" }}
            pagination={{ pageSize: 5, position: "bottom" }}
            dataSource={data.filter(({ name }) =>
              name.toLowerCase().includes(inputFilter.toLowerCase())
            )}
            renderItem={(office) => (
              <List.Item style={{ marginBottom: 10 }}>
                <Typography.Text mark></Typography.Text>
                {office.name}
                <Popconfirm
                  title="Do you want to delete this office?"
                  onConfirm={() => deleteFunc(office.id)}
                  okText="Yes"
                  cancelText="No"
                  className="deleteButton"
                  shape="round"
                  placement="topRight"
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                >
                  <Button
                    type="primary"
                    danger
                    style={{
                      border: "0",
                      borderRadius: "5px",
                      boxShadow: " 0px 3px 6px #2C28281C",
                    }}
                  >
                    Delete
                  </Button>
                </Popconfirm>
                <Button
                  type="primary"
                  className="editButton"
                  onClick={() => {
                    openNotification(
                      "This should take you to the edit office page"
                    );
                  }}
                >
                  Edit
                </Button>
              </List.Item>
            )}
          />
        </div>
      </Card>
    </Fragment>
  );
};
