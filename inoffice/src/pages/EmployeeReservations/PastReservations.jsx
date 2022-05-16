import React from "react";
import "antd/dist/antd.css";
import {
  Row,
  Col,
  Space,
  Spin,
  List,
  Layout,
  Input,
  Modal,
  Button,
  Select,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EditOutlined,
} from "@ant-design/icons";
import api from "../../helper/api";
import { useState, useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { BookOutlined } from "@ant-design/icons";

const PastReservations = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const { TextArea } = Input;

  const [loadingData, setLoading] = useState(true);
  const [pastreservations, setPastReservations] = useState([]);
  const [refreshstate, setRefreshState] = useState();
  const [visible, setVisible] = useState(false);
  const [review, setReview] = useState("");
  const [resid, setResid] = useState();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [writtenReview, setWrittenReview] = useState();
  const [filter, setFilter] = useState("Sort by newest");
  const [arrow, setArrow] = useState(false);

  const sortByOldest = (reservations) => {
    const sorted = reservations.sort((a, b) => {
      const date1 = new Date(a.startDate).getTime();
      const date2 = new Date(b.startDate).getTime();

      return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
    });

    setPastReservations(sorted);
  };

  const sortByNewest = (reservations) => {
    const sorted = reservations.sort((a, b) => {
      const date1 = new Date(a.startDate).getTime();
      const date2 = new Date(b.startDate).getTime();

      return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
    });

    setPastReservations(sorted);
  };

  const sortByTime = (flag) => {
    setArrow(flag);
    if (flag) {
      sortByOldest(pastreservations);
    } else {
      sortByNewest(pastreservations);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await api
        .get("employee/past-reservations")
        .then((response) => {
          sortByNewest(response.data);
        })
        .catch((error) => {
          console.error("Error message");
        });

      setLoading(false);
    };
    fetchData();
  }, [refreshstate]);

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
    setVisible(false);

    const data = {
      reservationid: resid,
      review: review,
    };

    await api
      .post("employee/review", data)
      .then((response) => {
        setRefreshState({});
      })
      .catch((error) => {
        console.error("Error message");
      });
  };

  return (
    <div>
      <table style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th onClick={() => sortByTime(!arrow)}>
              Date
              {arrow ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
            </th>
            <th>Office</th>
            <th>Entity</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {pastreservations.map((item, id) => {
            return (
              <tr key={id}>
                <td>
                  {item.startDate.split("T")[0].split("-").reverse().join("/")}{" "}
                  - {item.endDate.split("T")[0].split("-").reverse().join("/")}
                </td>
                <td>{item.officeName}</td>
                <td>
                  {item.deskId ? "Desk" : "Conference room"} [
                  {item.deskId ? item.deskIndex : item.confRoomIndex}]
                </td>
                <td onClick={() => {}}>
                  {!item.reviewId ? (
                    <div
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onClick={() => visibility(item)}
                    >
                      <p style={{ margin: "10px" }}>Write Review</p>
                      <EditOutlined key={item.id} />
                    </div>
                  ) : (
                    <div
                      onClick={() => showReview(item)}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <p style={{ margin: "10px" }}>Read Review</p>
                      <BookOutlined
                        style={{ cursor: "pointer" }}
                        key={item.id}
                        type="primary"
                      />
                    </div>
                  )}
                  <Modal
                    title="Write a review for the selected reservation"
                    centered
                    visible={visible}
                    onOk={() => writeReview()}
                    onCancel={() => setVisible(false)}
                    width={800}
                  >
                    <TextArea
                      rows={4}
                      onChange={(e) => setReview(e.target.value)}
                      allowClear={true}
                    />
                  </Modal>

                  <Modal
                    title="Review for desk"
                    centered
                    visible={showReviewModal}
                    onOk={() => setShowReviewModal(false)}
                    onCancel={() => setShowReviewModal(false)}
                    width={800}
                  >
                    <p>{writtenReview}</p>
                  </Modal>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default PastReservations;
