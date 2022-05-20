import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHead from "../../components/Head/UserHead";
import { Pie } from "@ant-design/charts";
import api from "../../helper/api";
import styles from "./Dashboard.module.css";

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
    radius: 0.7,
    theme: {
      colors10: ["#2DCE98", "#F53C56"],
    },
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
        background: "#fff",
        width: 200,
        height: 200,
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  useEffect(() => {
    fetchOfficeData();
  }, []);

  return (
    <Layout>
      <UserHead />
      <Layout className="panelBg" style={{ width: "100%" }}>
        <Sidebar selected="1" />
        <Content>
          <h1>Dashboard</h1>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
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
                background: "#fff",
                width: 400,
                height: 300,
                borderRadius: 7,
                display: "flex",

                boxShadow: "0px 3px 17px rgba(18, 18, 18, 0.2)",
                flexDirection: "column",
              }}
            >
              <h3>Desks available/reserved</h3>
              <Pie {...config} />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
