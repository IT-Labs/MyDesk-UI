import React from "react";
import { useState, useEffect } from "react";
import { List, Card, Layout, Button } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "../../helper/api";
import { useSelector } from "react-redux";
import moment from "moment";
import Loading from "../Loading/Loading";

let controller = new AbortController();

const CardsSection = (props) => {
  const [loadingData, setLoading] = useState(true);
  const [dataConfRooms, setDataConfRooms] = useState([]);
  const [selectedCardInSection, setselectedCardInSection] = useState();
  const [dataDesks, setDataDesks] = useState([]);
  const [initialDesks, setInitnialDesks] = useState([]);
  const [initialConf, setInitialConf] = useState([]);
  const { Meta } = Card;
  const start = useSelector((state) => state.date.start);
  const end = useSelector((state) => state.date.end);
  const [initLoad, setInitLoad] = useState(true);

  function selectCard(e) {
    let isAvailable = true;
    const res = e.reservations;
    if (res.length > 0) {
      res.forEach((item) => {
        const availability = findAvailable(item);
        if (!availability) {
          isAvailable = false;
        }
      });
    } else isAvailable = true;
    const availability = isAvailable ? true : false;
    props.selectedCard(e, availability);
    setselectedCardInSection(e);
  }

  const setDesks = (desks) => {
    if (props.available === 2) {
      const filtered = desks.filter((item) => !item.reservationId);
      setDataDesks(filtered);
    } else if (props.available === 3) {
      const filtered = desks.filter((item) => item.reservationId);
      setDataDesks(filtered);
    } else setDataDesks(desks);
  };

  const setConference = (rooms) => {
    if (props.available === 2) {
      const filtered = rooms.filter((item) => !item.reservationId);
      setDataConfRooms(filtered);
    } else if (props.available === 3) {
      const filtered = rooms.filter((item) => item.reservationId);
      setDataConfRooms(filtered);
    } else setDataConfRooms(rooms);
  };

  const fetchData = async () => {
    setLoading(true);

    await api
      .get("employee/office-desks/" + props.officeid, {
        signal: controller.signal,
      })
      .then((response) => {
        setDesks(response.data);
        setInitnialDesks(response.data);
        setInitLoad(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
    // await api
    //   .get("employee/office-conferencerooms/" + props.officeid)
    //   .then((response) => {
    //     setConference(response.data);
    //     setInitialConf(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("error message");
    //   });
  };

  useEffect(() => {
    fetchData();
    return () => {
      controller.abort();
      controller = new AbortController();
    };
  }, [props.officeid, props.refresh]);

  useEffect(() => {
    setDesks(initialDesks);
  }, [props.available]);

  const findAvailable = (item) => {
    const startSelected = moment(item.startdate)._i;
    const endSelected = moment(item?.endDate)._i;
    const momentStart = moment(start);
    const momentEnd = moment(end);
    //   (momentStart.isAfter(startSelected) &&
    //   momentStart.isBefore(endSelected)) ||
    // (momentStart.isBefore(startSelected) &&
    //   momentEnd.isAfter(endSelected)) ||
    // (momentStart.isBefore(startSelected) &&
    //   momentEnd.isBefore(endSelected)) ||
    // (momentStart.isBefore(endSelected) && momentEnd.isAfter(endSelected))
    if (
      (momentStart.isBefore(startSelected) &&
        momentEnd.isBefore(startSelected)) ||
      (momentStart.isAfter(endSelected) && momentEnd.isAfter(endSelected)) ||
      (startSelected === null && endSelected === null)
    )
      return true;
    else return false;
  };

  const checkAvailable = (res) => {
    let isAvailable = true;
    if (res.length > 0 && start && end) {
      res.forEach((item) => {
        const availability = findAvailable(item);
        if (!availability) {
          isAvailable = false;
        }
      });

      return isAvailable;
    } else {
      return true;
    }
    // return "#f37076" : "#69e28d",
  };

  console.log(dataDesks);

  return (
    <>
      {loadingData && (
        <div
          style={{
            height: 400,
            maxHeight: 400,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading />
        </div>
      )}
      {!loadingData && (
        <InfiniteScroll
          dataLength={dataDesks.length}
          scrollableTarget="scrollableDiv"
          display="flex"
          style={{ height: 400, maxHeight: 400 }}
        >
          <Layout style={{ background: "transparent" }}>
            <List
              grid={{ gutter: 0, column: 5 }}
              dataSource={dataDesks.filter((item) => {
                if (props.available === null) {
                  return item;
                } else if (props.available === true) {
                  return checkAvailable(item.reservations);
                } else if (props.available === false) {
                  return !checkAvailable(item.reservations);
                }
              })}
              renderItem={(item) => {
                const available = checkAvailable(item.reservations);
                return (
                  <List.Item
                    style={{
                      border:
                        item === selectedCardInSection ? "solid 2px" : "none",
                    }}
                  >
                    <Card
                      onClick={() => selectCard(item)}
                      bodyStyle={{
                        // backgroundColor: checkAvailable(item.reservation),
                        background: available ? "#69e28d" : "#f37076",
                        height: 114,
                      }}
                      hoverable={true}
                      bordered={true}
                    >
                      <Meta
                        title={
                          <p style={{ fontSize: "0.8vw" }}>
                            Desk {item.indexForOffice}
                          </p>
                        }
                        description={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "start",
                            }}
                            className="cardContentInformation"
                          >
                            {item.capacity >= 0 ? (
                              <p
                                style={{ color: "#000000	", fontSize: "0.6vw" }}
                              >
                                Capacity: {item.capacity}
                              </p>
                            ) : (
                              <p
                                style={{
                                  color: "#000000	",
                                  fontSize: "10px",
                                }}
                              >
                                {item.reservations.length > 0 &&
                                  !available &&
                                  `${item.reservations[0].employee.firstName} ${item.reservations[0].employee.lastName}`}
                              </p>
                            )}
                          </div>
                        }
                      />
                    </Card>
                  </List.Item>
                );
              }}
            />
          </Layout>
        </InfiniteScroll>
      )}
    </>
  );
};
export default CardsSection;
