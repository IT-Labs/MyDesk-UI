import React from "react";
import { useState, useEffect } from "react";
import { List, Card, Layout, Button, Tooltip } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "../../helper/api";
import { useSelector } from "react-redux";
import moment from "moment";
import Loading from "../Loading/Loading";
import { extendMoment } from "moment-range";
import { InfoCircleOutlined } from "@ant-design/icons";
import jwtDecode from "jwt-decode";
import { areIntervalsOverlapping } from "date-fns";
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

  const findAvailable = ({ startDate, endDate }) => {
    const momentStart = moment.utc(start);
    const momentEnd = moment.utc(end);

    const flag = areIntervalsOverlapping(
      { start: new Date(momentStart), end: new Date(momentEnd) },
      { start: new Date(startDate), end: new Date(endDate) }
    );

    return !flag;
  };

  const getSpecificUser = ({ startDate, endDate }) => {
    const momentStart = moment(start).toISOString();
    const momentEnd = moment(end).toISOString();

    const flag = areIntervalsOverlapping(
      { start: new Date(momentStart), end: new Date(momentEnd) },
      { start: new Date(startDate), end: new Date(endDate) }
    );
    if (flag) {
      return { startDate: startDate, endDate: endDate };
    }
    return {};
  };

  const checkAvailable = (res) => {
    let isAvailable = true;

    if (res.length > 0 && start && end) {
      const sortedRes = res.sort((a, b) => {
        const date1 = new Date(a.startDate).getTime();
        const date2 = new Date(b.startDate).getTime();

        return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
      });
      sortedRes.forEach((item) => {
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
                if (
                  `${item?.reservations[0]?.employee?.firstName} ${item?.reservations[0]?.employee?.lastName}`
                    .toLowerCase()
                    .includes(props.employeeSearch.toLowerCase()) &&
                  !checkAvailable(item.reservations)
                ) {
                  return true;
                } else if (props.employeeSearch.length === 0) {
                  if (props.available === null) {
                    return item;
                  } else if (props.available === true) {
                    return checkAvailable(item.reservations);
                  } else if (props.available === false) {
                    return !checkAvailable(item.reservations);
                  }
                }
              })}
              renderItem={(item) => {
                const available = checkAvailable(item.reservations);
                const specificUser = item.reservations.find((info) => {
                  const newGuy = getSpecificUser(info);
                  if (
                    info.startDate === newGuy.startDate &&
                    info.endDate === newGuy.endDate
                  ) {
                    return true;
                  }
                  return false;
                });
                console.log(specificUser);
                return (
                  <List.Item
                    style={{
                      border:
                        item === selectedCardInSection ? "solid 2px" : "none",
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    <Card
                      onClick={() => selectCard(item)}
                      bodyStyle={{
                        // backgroundColor: checkAvailable(item.reservation),
                        background: item.categories?.unavailable
                          ? "#c1c1c1"
                          : available
                          ? "#69e28d"
                          : "#f37076",
                        height: "10rem",
                      }}
                      hoverable={true}
                      bordered={true}
                    >
                      <Meta
                        title={
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "space-between",
                              // alignItems: "center",
                            }}
                          >
                            <p style={{ fontSize: "0.8vw" }}>
                              Desk {item.indexForOffice}
                            </p>
                            <Tooltip
                              autoAdjustOverflow={true}
                              overlayStyle={{ width: 120 }}
                              title={`${
                                item.categories?.doubleMonitor
                                  ? "Dual monitors\n"
                                  : ""
                              }
                              ${
                                item.categories?.singleMonitor
                                  ? "Single monitor\n"
                                  : ""
                              } ${
                                !item.categories?.singleMonitor &&
                                !item.categories?.doubleMonitor
                                  ? "No monitors\n"
                                  : ""
                              }${
                                item.categories?.nearWindow
                                  ? "Near window\n"
                                  : ""
                              }`}
                            >
                              <InfoCircleOutlined
                                style={{ position: "relative", top: 4 }}
                              />
                            </Tooltip>
                          </div>
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
                              <div>
                                <p
                                  style={{
                                    color: "#000000	",
                                    fontSize: "12px",
                                  }}
                                >
                                  {item.categories?.unavailable
                                    ? "Unavailable"
                                    : item.reservations.length > 0 &&
                                      !available &&
                                      `${specificUser?.employee.firstName} ${specificUser?.employee.lastName}`}
                                  {}
                                </p>
                                <p
                                  style={{
                                    color: "#000000	",
                                    fontSize: "12px",
                                  }}
                                >
                                  {!item.categories?.unavailable &&
                                    item.reservations.length > 0 &&
                                    !available &&
                                    `${moment(specificUser?.startDate).format(
                                      "DD-MM"
                                    )}
                                  / ${moment(specificUser?.endDate).format(
                                    "DD-MM"
                                  )}`}
                                </p>
                              </div>
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
