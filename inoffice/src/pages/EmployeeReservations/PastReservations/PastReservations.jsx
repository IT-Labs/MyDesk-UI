import React from "react";
import "antd/dist/antd.css";
import { Input, Modal, Button, Table } from "antd";

import api from "../../../helper/api";
import { useState, useEffect } from "react";

import Loading from "../../../components/Loading/Loading";
import styles from "../Reservation.module.scss";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  openError,
  openNotification,
} from "../../../components/notification/Notification";
import { setPastReservations } from "../../../redux/MyReservations/PastReservations";
import { sortByNewest } from "../../../utils/sortByNewest";

let controller = new AbortController();

const PastReservations = ({ officeName }) => {
  const { TextArea } = Input;
  const { officeSelect } = useSelector((state) => state.officeSelect);
  const { pastReservations } = useSelector((state) => state.pastReservations);
  const dispatch = useDispatch();

  const [loadingData, setLoading] = useState(true);

  const [refreshstate, setRefreshState] = useState();
  const [visible, setVisible] = useState(false);
  const [review, setReview] = useState("");
  const [resid, setResid] = useState();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [writtenReview, setWrittenReview] = useState();

  const [btnDisabled, setBtnDisabled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await api
        .get("employee/past-reservations")
        .then((response) => {
          const sorted = sortByNewest(response.data);
          setLoading(false);
          dispatch(setPastReservations(sorted));
        })
        .catch((error) => {
          console.error("Error message");
          setLoading(false);
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
      openError("Please write a review with more than 6 and less than 200");
      setLoading(false);
      setBtnDisabled(false);
      return;
    }

    await api
      .post("employee/review", data, { signal: controller.signal })
      .then((response) => {
        setVisible(false);
        setBtnDisabled(false);
        setRefreshState({});
        setLoading(false);
        openNotification("Review written successfully");
      })
      .catch((error) => {
        openError("Review could not be written");
        setLoading(false);
        setVisible(false);
        setBtnDisabled(false);
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
      {!loadingData ? (
        <Table
          columns={columns}
          dataSource={pastReservations.filter((item) =>
            item.officeName.includes(officeSelect)
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
        title="Write a review for the selected reservation"
        centered
        visible={visible}
        onOk={() => writeReview()}
        okButtonProps={{ disabled: btnDisabled }}
        onCancel={() => {
          setVisible(false);
          controller.abort();
          controller = new AbortController();
        }}
        width={800}
        // style={{ height: 120 }}
      >
        {loadingData ? (
          <div className={styles.writtingReview}>
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
        <div className={styles.review}>
          <p>{writtenReview}</p>
        </div>
      </Modal>
    </div>
  );
};
export default PastReservations;
