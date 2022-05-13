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
  const [filter, setFilter] = useState("Sort By oldest");

  const [loadingData, setLoading] = useState(true);
  const [futurereservations, setFutureReservations] = useState([]);
  const [refreshstate, setRefreshState] = useState();

  const sortByOldest = (reservations) => {
    const sorted = reservations.sort((a, b) => {
      const date1 = new Date(a.startDate).getTime();
      const date2 = new Date(b.startDate).getTime();

      return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
    });

    setFutureReservations(sorted);
  };

  const sortByNewest = (reservations) => {
    const sorted = reservations.sort((a, b) => {
      const date1 = new Date(a.startDate).getTime();
      const date2 = new Date(b.startDate).getTime();

      return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
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
  }, []);

  const sortByTime = (value) => {
    if (value === "Sort By oldest") {
      sortByOldest(futurereservations);
    } else if (value === "Sort By newest") {
      sortByNewest(futurereservations);
    }
  };

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
        const filteredReservations = futurereservations.filter(
          (item) => item.id !== id
        );
        setFutureReservations(filteredReservations);
      })
      .catch((error) => {
        console.error("Error message");
      });
  };

  return (
    <div className="">
      <Select
        style={{ width: "50%", marginBottom: "20px" }}
        onSelect={(value) => {
          setFilter(value);
          sortByTime(value);
        }}
        value={filter}
      >
        <Select.Option key={1} value={"Sort By oldest"}>
          Sort By oldest
        </Select.Option>
        <Select.Option key={2} value={"Sort By newest"}>
          Sort By newest
        </Select.Option>
      </Select>
      <table style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Office</th>
            <th>Entity</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {futurereservations.map((item, index) => (
            <tr key={index} style={{ transition: "all 0.2s ease-in-out" }}>
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
        </tbody>
      </table>
    </div>
  );
};

export default FutureReservations;
