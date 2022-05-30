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
import { useSelector } from "react-redux";
import moment from "moment";
import styles from "./Reservation.module.css";

const FutureReservations = ({ officeName }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [filter, setFilter] = useState("Sort By oldest");
  const { officeSelect } = useSelector((state) => state.officeSelect);

  const [loadingData, setLoading] = useState(true);
  const [futurereservations, setFutureReservations] = useState([]);
  const [refreshstate, setRefreshState] = useState();

  const [visible, setVisible] = useState(false);
  const [toBeCancelled, setToBeCancelled] = useState(null);
  const visibility = (item) => {
    setVisible(true);
  };

  const sortByOldest = (reservations) => {
    const sorted = reservations
      .sort((a, b) => {
        const date1 = new Date(a.startDate).getTime();
        const date2 = new Date(b.startDate).getTime();

        return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
      })
      .map((item, id) => {
        return {
          ...item,
          key: id,
          date: `${moment(item.startDate).format("DD/MM/YYYY")} - ${moment(
            item.endDate
          ).format("DD/MM/YYYY")}`,
          entity: `Desk [${item.deskIndex}]`,
        };
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

  const deleteNotification = async (id) => {
    await api
      .delete("employee/reserve/" + id)
      .then((response) => {
        notification.open({
          message: "Notification",
          description: "You have successfully cancelled a reservation",
          placement: "top",
          duration: 4,
        });
        setToBeCancelled();
        setVisible(false);
        const filteredReservations = futurereservations.filter(
          (item) => item.id !== id
        );
        setFutureReservations(filteredReservations);
      })
      .catch((error) => {
        notification.open({
          message: "Error",
          description: "Something went wrong",
          placement: "top",
          duration: 4,
        });
      });
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: 1,
      sorter: {
        compare: (a, b) => {
          const date1 = new Date(a.startDate).getTime();
          const date2 = new Date(b.startDate).getTime();

          return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
        },
        multiple: 1,
      },
      sortDirections: ["descend"],
    },
    { title: "Office", dataIndex: "officeName", key: 2 },
    { title: "Entity", dataIndex: "entity", key: 3 },
    {
      title: "Options",
      dataIndex: "options",
      key: 4,
      align: "center",
      render: (useless1, data, useless2) => {
        return (
          <Button
            onClick={() => {
              setVisible(true);
              setToBeCancelled(data.id);
            }}
            className={styles.btn}
          >
            Cancel
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={futurereservations.filter(({ officeName }) =>
          officeName.includes(officeSelect)
        )}
        pagination={{ pageSize: 4, position: ["topCenter"] }}
      />
      <Modal
        maskClosable={false}
        title="Are you sure you want to cancel your reservation?"
        centered
        visible={visible}
        onOk={() => {
          deleteNotification(toBeCancelled);
        }}
        onCancel={() => setVisible(false)}
      >
        <p>
          You are able to reserve your seat again but someone can reserve it
          before you.
        </p>
      </Modal>
    </div>
  );
};

export default FutureReservations;

/*<table style={{ width: "100%", textAlign: "center" }}>
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
          {futurereservations
            .filter(({ officeName }) => officeName.includes(officeSelect))
            .map((item, index) => (
              <tr key={index} style={{ transition: "all 0.2s ease-in-out" }}>
                <td>
                  {item.startDate.split("T")[0].split("-").reverse().join("/")}{" "}
                  - {item.endDate.split("T")[0].split("-").reverse().join("/")}
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
                      color: "#5cb1b8",
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
      </table>\*/
