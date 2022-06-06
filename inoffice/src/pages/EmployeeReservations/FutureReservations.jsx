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

import Loading from "../../components/Loading/Loading";
import { useState, useEffect } from "react";
import api from "../../helper/api";
import { LoadingOutlined } from "@ant-design/icons";

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
        .get("employee/future-reservation")
        .then((response) => {
          sortByOldest(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          notification.open({
            message: "Error",
            description: "There appears to be problem at our end",
            placement: "top",
            duration: 4,
          });
          setLoading(false);
        });
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
      {!loadingData ? (
        <Table
          columns={columns}
          dataSource={futurereservations.filter(({ officeName }) =>
            officeName.includes(officeSelect)
          )}
          pagination={{ pageSize: 4, position: ["topCenter"] }}
        />
      ) : (
        <div
          style={{
            height: 380,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading />
        </div>
      )}
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
