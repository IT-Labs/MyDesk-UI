import React from "react";
import "antd/dist/antd.css";
import {
  Row,
  Col,
  Space,
  notification,
  Select,
  Spin,
  List,
  Layout,
  Button,
} from "antd";
import { DeleteFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";
import api from "../../helper/api";
import { LoadingOutlined } from "@ant-design/icons";

const FutureReservations = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const [loadingData, setLoading] = useState(true);
  const [futurereservations, setFutureReservations] = useState([]);
  const [refreshstate, setRefreshState] = useState();

  const sortByOldest = (reservations) => {
    const sorted = reservations.sort((a, b) => {
      return a.StartDate < b.startDate ? -1 : a.StartDate > b.StartDate ? 1 : 0;
    });

    setFutureReservations(sorted);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await api
        .get("employee/reserve")
        .then((response) => {
          sortByOldest(response.data);
        })
        .catch((error) => {
          console.error("Error message");
        });

      setLoading(false);
    };
    fetchData();
  }, [refreshstate]);

  const deleteNotification = async (id) => {
    await api
      .delete("employee/reserve/" + id)
      .then((response) => {
        notification.open({
          message: "Notification",
          description: "You successfully canceled a reservation",
          placement: "top",
          duration: 1,
        });
        setRefreshState({});
      })
      .catch((error) => {
        console.error("Error message");
      });
  };
  return (
    <div>
      {" "}
      {loadingData && <Spin indicator={antIcon} />}
      {!loadingData && (
        <div>
          <Row style={{ display: "flex", justifyContent: "space-between" }}>
            <Col span={2}></Col>
            <Col span={4}>Date</Col>
            <Col span={5}></Col>
            <Col span={4}>
              <label>Entity</label>
            </Col>
            <Col span={7}></Col>
            <Col span={2} style={{ right: "5%" }}>
              Options
            </Col>
          </Row>
          <Space>
            <Row>
              <Col span={24}>
                <div></div>
              </Col>
            </Row>
          </Space>
          <List
            dataSource={futurereservations}
            renderItem={(item, index) => (
              <List.Item>
                <Layout>
                  <Row
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Col span={6}>
                      <p>
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
                      </p>
                    </Col>

                    <Col span={5}>
                      {item.deskId ? "Desk" : "Conference room"} [
                      {item.deskId ? item.deskIndex : item.confRoomIndex}]
                    </Col>
                    <Col span={3}>
                      <Button
                        onClick={() => deleteNotification(item.id)}
                        style={{
                          left: "-15px",
                          color: "teal",
                          fontWeight: "bold",
                          borderRadius: "7px",
                        }}
                      >
                        Cancel
                      </Button>
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
export default FutureReservations;
