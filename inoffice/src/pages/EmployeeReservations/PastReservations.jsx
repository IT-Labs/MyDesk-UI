import React from "react";
import "antd/dist/antd.css";
import {
  Row,
  Col,
  Form,
  Space,
  Checkbox,
  notification,
  Select,
  Spin,
  List,
  Layout,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import api from "../../helper/api";
import { useState, useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";

const PastReservations = () => {
  const { Option } = Select;
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const [loadingData, setLoading] = useState(true);
  const [pastreservations, setPastReservations] = useState([]);
  const [refreshstate, setRefreshState] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await api
        .get("employee/past-reservations")
        .then((response) => {
          setPastReservations(response.data);
        })
        .catch((error) => {
          console.error("Error message");
        });

      setLoading(false);
    };
    fetchData();
  }, [refreshstate]);

  return (
    <div>
      {" "}
      {loadingData && <Spin indicator={antIcon} />}
      {!loadingData && (
        <div>
          <Row>
            <Col span={2}></Col>

            <Col span={4}>Date</Col>
            <Col span={5}></Col>
            <Col span={4}>
              <label>Entity</label>
            </Col>
            <Col span={7}></Col>
            <Col span={2}>Options</Col>
          </Row>
          <Space>
            <Row>
              <Col span={24}>
                <div></div>
              </Col>
            </Row>
          </Space>
          <List
            dataSource={pastreservations}
            renderItem={(item, index) => (
              <List.Item>
                <Layout>
                  <Row align="middle">
                    <Col span={1}></Col>
                    <Col span={6}>
                      {item.startDate
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("/")}{" "}
                      -{" "}
                      {item.endDate
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("/")}
                    </Col>
                    <Col span={3}></Col>
                    <Col span={5}>
                      {item.deskId ? "Desk" : "Conference room"} [
                      {item.deskId ? item.deskIndex : item.confRoomIndex}]
                    </Col>
                    <Col span={6}></Col>
                    <Col span={2}>Write a review</Col>
                    <Col span={1}>
                      <EditOutlined style={{ cursor: "pointer" }} />
                    </Col>
                  </Row>
                </Layout>
              </List.Item>
            )}
          />
        </div>
      )}{" "}
    </div>
  );
};
export default PastReservations;
