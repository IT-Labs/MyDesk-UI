import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import {
  Button,
  Typography,
  List,
  Card,
  Input,
  Popconfirm,
  Row,
  Col,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import styles from "./Offices.module.scss";
import Title from "./Title";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOffices } from "../../redux/Offices/offices";
import { deleteOfficeApi } from "../../services/office.service";
import { openNotification } from "../../components/notification/Notification";
import MainLayout from "../../layouts/MainLayout";

const Offices = () => {
  const [inputFilter, setInputFilter] = useState("");
  const [mediaMatches, setMediaMatches] = useState(false);
  const offices = useSelector((state) => state.offices.offices);
  const dispatch = useDispatch();
  const addOfficeText = "Add office";
  const media = window.matchMedia("(max-width: 820px)");

  const deleteFunc = (officeId) => {
    deleteOfficeApi(officeId).then(() => {
      dispatch(fetchOffices());
      openNotification("You have successfully deleted the selected office");
    });
  };

  const handleChange = (e) => {
    setInputFilter(e.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault(event);
  };

  useEffect(() => {
    dispatch(fetchOffices());
  }, [dispatch]);

  useEffect(() => {
    setMediaMatches(media.matches);
  }, [media]);

  return (
    <Layout>
      <Sidebar selected="2" />
      <MainLayout isHome={false}>
        <Content className={styles.contentAnt}>
          <Row className={styles.rowAnt}>
            <Col span={24}>
              <Card
                className={styles.cardContainer}
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
                <div
                  className={styles.contentWrapper}
                  style={{ overflowX: "scroll" }}
                >
                  <Input
                    className={styles.searchInput}
                    onChange={handleChange}
                    data-cy="SearchOffice-Input"
                    placeholder="Search Office"
                  />
                  <List
                    bordered
                    className={styles.listAnt}
                    pagination={{ pageSize: 5, position: "bottom" }}
                    dataSource={offices.filter(({ name }) =>
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
                          className={`${styles.editButton} editButton`}
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
