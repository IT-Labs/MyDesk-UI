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
import { EditOutlined } from "@ant-design/icons";
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

  const sortByTime = (value) => {
    if (value === "Sort By oldest") {
      sortByOldest(pastreservations);
    } else if (value === "Sort By newest") {
      sortByNewest(pastreservations);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await api
        .get("employee/past-reservations")
        .then((response) => {
          setPastReservations(response.data);
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
                <td>
                  {item.reviewId ? "Show review" : "Write a review"}
                  {!item.reviewId ? (
                    <EditOutlined
                      style={{ cursor: "pointer" }}
                      key={item.id}
                      onClick={() => visibility(item)}
                    />
                  ) : (
                    <BookOutlined
                      style={{ cursor: "pointer" }}
                      key={item.id}
                      onClick={() => showReview(item)}
                      type="primary"
                    />
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
