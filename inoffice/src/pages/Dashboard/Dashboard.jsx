import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHead from "../../components/Head/UserHead";
import { Pie } from "@ant-design/charts";
import api from "../../helper/api";
import styles from "./Dashboard.module.css";
import { Button, Modal, Table } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  FrownOutlined,
  InfoCircleFilled,
  MehOutlined,
  SmileOutlined,
} from "@ant-design/icons";

const Dashboard = () => {
  const [desks, setDesks] = useState([]);
  const [conference, setConference] = useState([]);
  const [deskData, setDeskData] = useState([]);
  const [confData, setConfData] = useState([]);
  const [availableDesks, setAvailableDesks] = useState(0);
  const [reservedDesks, setReservedDesks] = useState(0);
  const [allDesks, setAllDesks] = useState(0);
  const [writtenReview, setWrittenReview] = useState("");
  const [activeModal, setActiveModal] = useState(false);

  const fetchOfficeData = async () => {
    await api
      .get("admin/offices")
      .then(async ({ data }) => {
        const deskRes = await Promise.all(
          data.map((item) => {
            const val = fetchDeskData(item.id).then((res) => res);
            return val;
          })
        );
        const deskInfo = [].concat.apply([], deskRes);
        setDesks(deskInfo);
        const availableDesk = deskInfo.filter((item) => !item.reservationId);
        const unavailableDesk = deskInfo.filter((item) => item.reservationId);
        setAvailableDesks(availableDesk.length);
        setReservedDesks(unavailableDesk.length);
        setAllDesks(unavailableDesk.length + availableDesk.length);
        setDeskData([
          {
            type: "Available",
            value: availableDesk.length,
          },
          {
            type: "Unavailable",
            value: unavailableDesk.length,
          },
        ]);
      })
      .catch((error) => {
        console.error("error message");
      });
  };

  const fetchDeskData = async (officeId) => {
    return api
      .get("employee/office-desks/" + officeId)
      .then((response) => response.data)
      .catch((error) => {
        console.error("error message");
      });
  };

  const config = {
    appendPadding: 10,
    data: deskData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: "Available Desks",
      },
    },
    theme: {
      colors10: ["#2DCE98", "#F53C56"],
    },
  };

  const [reviews, setReviews] = useState([]);

  const fetchReviews = () => {
    api.get("employee/reviews/all").then(({ data }, id) => {
      const better = data.listOfReviews.map((item) => {
        return {
          ...item,
          reviewOutput: item.reviewOutput ? (
            item.reviewOutput === "Positive" ? (
              <SmileOutlined className={styles.emoji} />
            ) : (
              <FrownOutlined className={styles.emoji} />
            )
          ) : (
            <MehOutlined className={styles.emoji} />
          ),
          review: item.review.length > 0 ? item.review : "This review is blank",
          key: id,
        };
      });

      setReviews(better);
    });
  };

  useEffect(() => {
    fetchOfficeData();
    fetchReviews();
  }, []);

  const colums = [
    {
      title: "Review",
      dataIndex: "review",
      key: 1,
      ellipsis: true,
      width: "45%",
    },
    {
      title: "Review output",
      dataIndex: "reviewOutput",
      key: 2,

      align: "center",
    },
    { title: "Desk number", dataIndex: "deskIndex", key: 3, align: "center" },
    {
      title: "Options",
      dataIndex: "options",
      key: 4,
      align: "center",
      width: "150px",
      render: (text, data, id) => {
        return (
          <Button
            onClick={() => {
              setWrittenReview(data.review);
              setActiveModal(true);
            }}
            className={styles.reviewBtn}
          >
            Check Review
          </Button>
        );
      },
    },
  ];

  return (
    <Layout>
      <UserHead />
      <Layout className="panelBg" style={{ width: "100%" }}>
        <Sidebar selected="1" />
        <Content>
          <h2
            style={{
              position: "relative",
              left: 20,
              color: "white",
            }}
          >
            Dashboard
          </h2>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <div className={styles.dashboardCard}>
              <p>AVAILABLE</p>
              <div className={styles.tile}>
                <h2>{availableDesks}</h2>
                <CheckCircleFilled
                  className={`${styles.tabIcon} ${styles.checkmark}`}
                />
              </div>
            </div>
            <div className={styles.dashboardCard}>
              <p>RESERVED</p>
              <div className={styles.tile}>
                <h2>{reservedDesks}</h2>
                <CloseCircleFilled
                  className={`${styles.tabIcon} ${styles.xmark}`}
                />
              </div>
            </div>
            <div className={styles.dashboardCard}>
              <p>TOTAL</p>
              <div className={styles.tile}>
                <h2>{allDesks}</h2>
                <InfoCircleFilled
                  className={`${styles.tabIcon} ${styles.imark}`}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              width: "100%",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  width: 400,
                  height: 400,
                  borderRadius: 7,
                  display: "flex",
                  padding: 20,
                  boxShadow: "0px 3px 17px rgba(18, 18, 18, 0.2)",
                  flexDirection: "column",
                }}
              >
                <h3>Desks available/reserved</h3>
                <Pie {...config} />
              </div>
              <div
                style={{
                  background: "#fff",
                  width: 800,
                  height: 430,
                  borderRadius: 7,
                  display: "flex",

                  boxShadow: "0px 3px 17px rgba(18, 18, 18, 0.2)",
                  flexDirection: "column",
                }}
              >
                <h3 style={{ position: "relative", left: 20, top: 5 }}>
                  User reviews
                </h3>
                <Table
                  columns={colums}
                  dataSource={reviews}
                  style={{ maxHeight: 250, padding: 5 }}
                  pagination={{ pageSize: 4, position: ["topCenter"] }}
                />
              </div>
              <Modal
                title="Review for desk"
                centered
                maskClosable={false}
                visible={activeModal}
                onOk={() => {
                  setWrittenReview("");
                  setActiveModal(false);
                }}
                width={800}
                cancelButtonProps={{ style: { display: "none" } }}
              >
                <div
                  style={{
                    maxHeight: 100,
                    overflow: "scroll",
                    overflowX: "hidden",
                  }}
                >
                  <p>{writtenReview}</p>
                </div>
              </Modal>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
