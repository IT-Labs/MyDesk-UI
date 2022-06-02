import React from "react";
import "antd/dist/antd.css";
import { Input, Modal, Button, notification, Table } from "antd";

import api from "../../helper/api";
import { useState, useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";

import Loading from "../../components/Loading/Loading";
import styles from "./Reservation.module.css";
import moment from "moment";
import { useSelector } from "react-redux";

const PastReservations = ({ officeName }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const { TextArea } = Input;
  const { officeSelect } = useSelector((state) => state.officeSelect);

  const [loadingData, setLoading] = useState(false);
  const [pastreservations, setPastReservations] = useState([]);
  const [refreshstate, setRefreshState] = useState();
  const [visible, setVisible] = useState(false);
  const [review, setReview] = useState("");
  const [resid, setResid] = useState();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [writtenReview, setWrittenReview] = useState();

  const [btnDisabled, setBtnDisabled] = useState(false);

  const sortByNewest = (reservations) => {
    const sorted = reservations
      .sort((a, b) => {
        const date1 = new Date(a.startDate).getTime();
        const date2 = new Date(b.startDate).getTime();

        return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
      })
      .map((item) => {
        return {
          ...item,
          key: item.deskId,
          date: `${moment(item.startDate).format("DD/MM/YYYY")} - ${moment(
            item.endDate
          ).format("DD/MM/YYYY")}`,
          entity: `Desk [${item.deskIndex}]`,
        };
      });

    setPastReservations(sorted);
  };

  useEffect(() => {
    const fetchData = async () => {
      await api
        .get("employee/past-reservations")
        .then((response) => {
          sortByNewest(response.data);
        })
        .catch((error) => {
          console.error("Error message");
        });
    };
    fetchData();
  }, [refreshstate]);

  useState(() => {
    setWrittenReview("");
  }, []);

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
    const data = {
      reservationid: resid,
      review: review,
    };
    setLoading(true);
    setBtnDisabled(true);

    if (data.review.length < 6 || data.review.length > 200) {
      notification.open({
        message: "Notification",
        description: "Please write a review with more than 6 and less than 200",
        placement: "top",
        duration: 4,
      });
      setLoading(false);
      setBtnDisabled(false);
      return;
    }

    await api
      .post("employee/review", data)
      .then((response) => {
        setVisible(false);
        setBtnDisabled(false);
        setRefreshState({});
        setLoading(false);
        notification.open({
          message: "Notification",
          description: "Review written",
          placement: "top",
          duration: 4,
        });
      })
      .catch((error) => {
        notification.open({
          message: "Notification",
          description: "Review could not be written",
          placement: "top",
          duration: 4,
        });
        setLoading(false);
        setVisible(false);
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
      sortDirections: ["ascend"],
    },
    { title: "Office", dataIndex: "officeName", key: 2 },
    { title: "Entity", dataIndex: "entity", key: 3 },
    {
      title: "Options",
      dataIndex: "options",
      key: 4,
      align: "center",
      render: (useless1, data, useless2) => {
        return !data.reviewId ? (
          <div onClick={() => visibility(data)}>
            <Button className={styles.btn}>Write review</Button>
          </div>
        ) : (
          <div onClick={() => showReview(data)}>
            <Button className={styles.btn}>Read review</Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {pastreservations.length > 0 ? (
        <Table
          columns={columns}
          dataSource={pastreservations.filter((item) =>
            item.officeName.includes(officeSelect)
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
        title="Write a review for the selected reservation"
        centered
        visible={visible}
        onOk={() => writeReview()}
        okButtonProps={{ disabled: btnDisabled }}
        onCancel={() => setVisible(false)}
        width={800}
        // style={{ height: 120 }}
      >
        {loadingData ? (
          <div
            style={{
              width: "100%",
              height: 160,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflowY: "hidden",
              flexDirection: "column",
            }}
          >
            <Loading />
            <p>
              Please wait for a moment. Your review is currently being
              processed.
            </p>
          </div>
        ) : (
          <TextArea
            rows={4}
            onChange={(e) => setReview(e.target.value)}
            allowClear={true}
            maxLength={200}
          />
        )}
      </Modal>

      <Modal
        title="Review for desk"
        centered
        maskClosable={false}
        visible={showReviewModal}
        onOk={() => setShowReviewModal(false)}
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
  );
};
export default PastReservations;
