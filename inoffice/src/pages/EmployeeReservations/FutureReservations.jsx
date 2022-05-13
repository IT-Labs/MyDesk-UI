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
  Table,
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

  console.log(futurereservations);

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
  }, []);

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
    <table style={{ width: "100%", textAlign: "center" }}>
      <tr>
        <th>Date</th>
        <th>Office</th>
        <th>Entity</th>
        <th>Options</th>
      </tr>
      {futurereservations?.map((item, index) => (
        <tr key={index}>
          <td>
            {item.startDate.split("T")[0].split("-").reverse().join("/")} -{" "}
            {item.endDate.split("T")[0].split("-").reverse().join("/")}
          </td>
          <td>{item.officeName}</td>
          <td>
            {item.deskId ? "Desk" : "Conference room"} [
            {item.deskId ? item.deskIndex : item.confRoomIndex}]
          </td>
          <td>
            <Button
              onClick={() => deleteNotification(item.id)}
              style={{
                color: "teal",
                fontWeight: "bold",
                borderRadius: "7px",
              }}
            >
              Cancel
            </Button>
          </td>
        </tr>
      ))}
    </table>
  );
};

export default FutureReservations;
