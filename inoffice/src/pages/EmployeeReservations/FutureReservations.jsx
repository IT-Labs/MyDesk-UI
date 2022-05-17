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
  Modal,
} from "antd";

import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { DeleteFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";
import api from "../../helper/api";
import { LoadingOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons/lib/components/AntdIcon";

const FutureReservations = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [filter, setFilter] = useState("Sort By oldest");

  const [loadingData, setLoading] = useState(true);
  const [futurereservations, setFutureReservations] = useState([]);
  const [refreshstate, setRefreshState] = useState();
  const [arrow, setArrow] = useState(true);
  const [visible, setVisible] = useState(false);
  const visibility = (item) => {
    setVisible(true);
  };

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
          setArrow(true);
          sortByOldest(response.data);
        })
        .catch((error) => {
          console.error(error);
          notification.open({
            message: "Error",
            description: "There appears to be problem at our end",
            placement: "top",
            duration: 4,
          });
        });

      setLoading(false);
    };
    fetchData();
  }, []);

  const sortByTime = (flag) => {
    setArrow(flag);
    if (flag) {
      sortByOldest(futurereservations);
    } else sortByNewest(futurereservations);
  };

  const deleteNotification = async (id) => {
    await api
      .delete("employee/reserve/" + id)
      .then((response) => {
        notification.open({
          message: "Notification",
          description: "You successfully canceled a reservation",
          placement: "top",
          duration: 4,
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
      <table style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th
              onClick={() => sortByTime(!arrow)}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              Date
              {arrow ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
            </th>
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
                  onClick={() => setVisible(true)}
                  style={{
                    color: "teal",
                    fontWeight: "bold",
                    borderRadius: "7px",
                  }}
                >
                  Cancel
                </Button>
              </td>
              <Modal
                maskClosable={false}
                title="Are you sure you want to cancel your reservation?"
                centered
                visible={visible}
                onOk={() => {
                  deleteNotification(item.id);
                  setVisible(false);
                }}
                onCancel={() => setVisible(false)}
              >
                <p>
                  You are able to reserve your seat again, but know someone can
                  reserve it before you.
                </p>
              </Modal>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FutureReservations;
