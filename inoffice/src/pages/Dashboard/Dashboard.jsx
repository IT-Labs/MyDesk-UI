import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHead from "../../components/Head/UserHead";
import { Pie } from "@ant-design/charts";
import api from "../../helper/api";
import styles from "./Dashboard.module.css";
import { Table } from "antd";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";

const Dashboard = () => {
  const [desks, setDesks] = useState([]);
  const [conference, setConference] = useState([]);
  const [deskData, setDeskData] = useState([]);
  const [confData, setConfData] = useState([]);
  const [availableDesks, setAvailableDesks] = useState(0);
  const [reservedDesks, setReservedDesks] = useState(0);
  const [allDesks, setAllDesks] = useState(0);

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
              <SmileOutlined className={styles.icon} />
            ) : (
              <FrownOutlined className={styles.icon} />
            )
          ) : (
            <MehOutlined className={styles.icon} />
          ),
          review:
            item.review.length > 0
              ? item.review.length > 50
                ? `${item.review.slice(0, 50)}...`
                : item.review
              : "This review is blank",
          key: id,
        };
      });
      console.log(better);
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
      width: "50%",
    },
    {
      title: "Review output",
      dataIndex: "reviewOutput",
      key: 2,

      align: "center",
    },
    { title: "Desk number", dataIndex: "deskIndex", key: 3 },
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
              <h2>Available</h2>
              <h1>{availableDesks}</h1>
            </div>
            <div className={styles.dashboardCard}>
              <h2>Reserved</h2>
              <h1>{reservedDesks}</h1>
            </div>
            <div className={styles.dashboardCard}>
              <h2>Total</h2>
              <h1>{allDesks}</h1>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "90%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  width: 400,
                  height: 400,
                  borderRadius: 7,
                  display: "flex",

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
                  width: 750,
                  height: 400,
                  borderRadius: 7,
                  display: "flex",

                  boxShadow: "0px 3px 17px rgba(18, 18, 18, 0.2)",
                  flexDirection: "column",
                }}
              >
                <h3>User Reviews</h3>
                <Table
                  columns={colums}
                  dataSource={reviews}
                  style={{ maxHeight: 250 }}
                  pagination={{ pageSize: 4 }}
                />
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
