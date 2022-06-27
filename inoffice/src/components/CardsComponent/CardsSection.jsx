import React from "react";
import { useState, useEffect } from "react";
import { List, Card, Layout, Button, Tooltip } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "../../helper/api";
import { useSelector } from "react-redux";
import moment from "moment";
import Loading from "../Loading/Loading";
import styles from "./CardsSection.module.css";
import { InfoCircleOutlined } from "@ant-design/icons";
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
  const [media, setMedia] = useState(window.matchMedia("(max-width: 820px)"));

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
    const start1 = start.split("T");
    const end1 = end.split("T");
    const start2 = `${start1[0]}T00:00:00`;
    const end2 = `${end1[0]}T00:00:00`;

    const flag = areIntervalsOverlapping(
      { start: new Date(startDate), end: new Date(endDate) },
      { start: new Date(start2), end: new Date(end2) },
      { inclusive: true }
    );

    return !flag;
  };

  const getSpecificUser = ({ startDate, endDate }) => {
    if (start && end) {
      const start1 = start?.split("T");
      const end1 = end?.split("T");
      const start2 = `${start1[0]}T00:00:00`;
      const end2 = `${end1[0]}T00:00:00`;

      const flag = areIntervalsOverlapping(
        { start: new Date(startDate), end: new Date(endDate) },
        { start: new Date(start2), end: new Date(end2) },
        { inclusive: true }
      );
      if (flag) {
        return { startDate: startDate, endDate: endDate };
      }
      return {};
    }
    return {};
  };

  const checkAvailable = (res) => {
    let isAvailable = true;

    if (res.length > 0 && start && end) {
      try {
        res.forEach((item) => {
          const availability = findAvailable(item);
          if (!availability) {
            isAvailable = false;
            throw "";
          }
        });
      } catch (msg) {}
      return isAvailable;
    } else {
      return true;
    }
    // return "#f37076" : "#69e28d",
  };

  return (
    <>
      {loadingData && (
        <div className={styles.loading}>
          <Loading />
        </div>
      )}
      {!loadingData && (
        <InfiniteScroll
          dataLength={dataDesks.length}
          scrollableTarget="scrollableDiv"
          display="flex"
          className={styles.scrollableDiv}
        >
          <Layout style={{ background: "transparent" }}>
            <List
              grid={{ gutter: 0, column: media.matches ? 1 : 4 }}
              dataSource={dataDesks
                .filter((item) => {
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
                  if (
                    `${specificUser?.employee?.firstName} ${specificUser?.employee?.lastName}`
                      .toLowerCase()
                      .includes(props.employeeSearch.toLowerCase()) &&
                    !checkAvailable(item.reservations)
                  ) {
                    return true;
                  } else if (props.employeeSearch.length === 0) {
                    if (props.available === null) {
                      return true;
                    }
                    if (props.available && checkAvailable(item.reservations)) {
                      return item;
                    }
                    if (props.available === false) {
                      return !checkAvailable(item.reservations);
                    }
                  }
                })
                .filter(({ categories }) => {
                  if (
                    !props.categories.nearWindow &&
                    !props.categories.doubleMonitor &&
                    !props.categories.singleMonitor
                  )
                    return true;
                  if (categories.nearWindow && props.categories.nearWindow) {
                    return true;
                  }
                  if (
                    categories.doubleMonitor &&
                    props.categories.doubleMonitor
                  )
                    return true;
                  if (
                    categories.singleMonitor &&
                    props.categories.singleMonitor
                  )
                    return true;
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
                          <div className={styles.meta}>
                            <p style={{ fontSize: "1rem" }}>
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
                                className={styles.infoCircle}
                              />
                            </Tooltip>
                          </div>
                        }
                        description={
                          <div className={styles.cardContentInformation}>
                            <div>
                              <p className={styles.basicText}>
                                {item.categories?.unavailable
                                  ? "Unavailable"
                                  : item.reservations.length > 0 &&
                                    !available &&
                                    `${specificUser?.employee.firstName} ${specificUser?.employee.lastName}`}
                                {}
                              </p>
                              <p className={styles.basicText}>
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
