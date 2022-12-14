import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../helper/api";
import Layout, { Content } from "antd/lib/layout/layout";
import { Button, Typography, List, Card, Input } from "antd";
import { Popconfirm, Row, Col } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "../Offices/Offices.css";
import Title from "./Title";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOffices } from "../../redux/Offices/offices";
import {
  openError,
  openNotification,
} from "../../components/notification/Notification";
import MainLayout from "../../layouts/MainLayout";

const Offices = () => {
  const [inputFilter, setInputFilter] = useState("");
  const [mediaMatches, setMediaMatches] = useState(false);
  const data = useSelector((state) => state.offices.offices);
  const dispatch = useDispatch();
  const media = window.matchMedia("(max-width: 820px)");

  useEffect(() => {
    dispatch(fetchOffices());
  }, [dispatch]);

  useEffect(() => {
    setMediaMatches(media.matches);
  }, [media]);

  const deleteFunc = (value) => {
    api
      .delete("admin/office/" + value)
      .then(() => {
        dispatch(fetchOffices());
        openNotification("You have successfully deleted the selected office");
      })
      .catch((error) => {
        error.response.status === 401
          ? openError("Your session has expired, please login again.")
          : openError(
              "An error occurred while deleting the office, please try again"
            );

        console.log(error);
      });
  };

  const handleChange = (e) => {
    setInputFilter(e.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault(event);
  };

  const addOfficeText = "Add office";

  return (
    <Layout>
      <Sidebar selected="2" />
      <MainLayout isHome={false}>
        <Content
          style={{
            display: "flex",
            justifyContent: "top",
            flexDirection: "column",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <Row
            style={{
              background: "transparent",
              width: "80%",
              borderRadius: "14px",
              border: 0,
            }}
          >
            <Col span={24}>
              <Card
                title={
                  <Title
                    onSubmit={onSubmit}
                    addOfficeText={addOfficeText}
                    mediaMatches={mediaMatches}
                  />
                }
                style={{
                  boxShadow: "0 2px 2px 1px #2c28283c",
                  padding: "10px",
                  borderRadius: 7,
                }}
              >
                <div style={{ overflowX: "scroll" }}>
                  <Input
                    style={{ width: 200 }}
                    onChange={handleChange}
                    data-cy="SearchOffice-Input"
                    placeholder="Search Office"
                  />
                  <List
                    bordered
                    style={{ minWidth: 400 }}
                    pagination={{ pageSize: 5, position: "bottom" }}
                    dataSource={data.filter(({ name }) =>
                      name.toLowerCase().includes(inputFilter.toLowerCase())
                    )}
                    renderItem={(office) => (
                      <List.Item style={{ marginBottom: 10 }}>
                        <Typography.Text mark></Typography.Text> {office.name}{" "}
                        <Popconfirm
                          title="Do you want to delete this office?"
                          onConfirm={() => deleteFunc(office.id)}
                          okText="Yes"
                          cancelText="No"
                          className="deleteButton"
                          shape="round"
                          placement="topRight"
                          icon={
                            <QuestionCircleOutlined style={{ color: "red" }} />
                          }
                        >
                          <Button
                            data-cy="deleteoffice-button"
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
                          data-cy="editoffice-button"
                          type="primary"
                          className="editButton"
                          onClick={() => {
                            window.location =
                              "edit/" + office.name + "/" + office.id;
                          }}
                        >
                          Edit
                        </Button>
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

export default Offices;
