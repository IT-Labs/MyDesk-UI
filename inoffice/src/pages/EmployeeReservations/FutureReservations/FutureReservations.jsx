import React from "react";
import "antd/dist/antd.css";
import { Button, Table, Modal } from "antd";

import Loading from "../../../components/Loading/Loading";
import { useState, useEffect } from "react";
import api from "../../../helper/api";
import styles from "../Reservation.module.scss";

import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import {
  openError,
  openNotification,
} from "../../../components/notification/Notification";
import { setFutureReservation } from "../../../redux/MyReservations/FutureReservations";
import { sortByOldest } from "../../../utils/sortByOldest";

const FutureReservations = () => {
  const { officeSelect } = useSelector((state) => state.officeSelect);

  const [loadingData, setLoading] = useState(true);
  const { futureReservations } = useSelector(
    (state) => state.futureReservations
  );

  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [toBeCancelled, setToBeCancelled] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await api
        .get("employee/future-reservation")
        .then((response) => {
          const sorted = sortByOldest(response.data);
          setLoading(false);
          dispatch(setFutureReservation(sorted));
        })
        .catch((error) => {
          console.error(error);
          openError("There appears to be problem at our end");
          setLoading(false);
        });
    };
    fetchData();
  }, []);

  const deleteNotification = async (id) => {
    await api
      .delete("employee/reserve/" + id)
      .then((response) => {
        openNotification("You have successfully cancelled a reservation");
        setToBeCancelled();
        setVisible(false);
        const filteredReservations = futureReservations.filter(
          (item) => item.id !== id
        );
        dispatch(setFutureReservation(filteredReservations));
      })
      .catch((error) => {
        openError(
          "An error occurred while canceling the reservation, please try again"
        );
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
    { title: "Office", dataIndex: ["desk", "office", "name"], key: 2 },
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
            className="btn"
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
          dataSource={futureReservations.filter((reservation) =>
            reservation.desk.office.name?.includes(officeSelect)
          )}
          pagination={{ pageSize: 4, position: ["bottomRight"] }}
          scroll={{ x: 400 }}
        />
      ) : (
        <div className={styles.loading}>
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
