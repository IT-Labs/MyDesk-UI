import React from "react";
import "antd/dist/antd.css";
import { Row, Col, Space, Spin, List, Layout, Input, Modal,Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import api from "../../helper/api";
import { useState, useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { BookOutlined } from "@ant-design/icons"

const PastReservations = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const { TextArea } = Input;

  const [loadingData, setLoading] = useState(true);
  const [pastreservations, setPastReservations] = useState([]);
  const [refreshstate, setRefreshState] = useState();
  const [visible, setVisible] = useState(false);
  const [review, setReview] = useState("");
  const [resid, setResid] = useState();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [writtenReview, setWrittenReview] = useState();

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

  const visibility = (item) => {
    setVisible(true);
    setResid(item.id);
  };

  const showReview = async (item) => {
    await api
      .get("employee/review/" + item.reviewId)
      .then((response) => {
        setWrittenReview(response.data);
      })
      .catch((error) => {
        console.error("Error message");
      });
    setShowReviewModal(true);
  };

  const writeReview = async () => {
    setVisible(false);
    
    const data = {
      reservationid: resid,
      review: review,
    };

    await api
      .post("employee/review", data)
      .then((response) => {
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
                    <Col span={2}>
                      {item.reviewId ? "Show review" : "Write a review"}
                    </Col>
                    <Col span={1}>
                      {!item.reviewId ? (
                        <EditOutlined
                          style={{ cursor: "pointer" }}
                          key={item.id}
                          onClick={() => visibility(item)}
                        />
                      ) : (
                        <BookOutlined
                          style={{ cursor: "pointer" }}
                          key={item.id}
                          onClick={() => showReview(item)}
                          type="primary"
                        />
                      )}

                          
                      <Modal
                        title="Write a review for the selected reservation"
                        centered
                        visible={visible}
                        onOk={() => writeReview()}
                        onCancel={() => setVisible(false)}
                        width={800}
                      >
                        <TextArea
                          rows={4}
                          onChange={(e) => setReview(e.target.value)}
                          allowClear={true}
                        />
                      </Modal>
                  
                      <Modal
                        title="Review for desk"
                        centered
                        visible={showReviewModal}
                        onOk={() => setShowReviewModal(false)}
                        onCancel={() => setShowReviewModal(false)}
                        width={800}
                      >
                         <p>{writtenReview}</p>
                      </Modal>
                   
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
