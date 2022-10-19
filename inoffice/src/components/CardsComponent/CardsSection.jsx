import React, { useState, useEffect } from "react";
import { List, Card, Tooltip } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "../../helper/api";
import { useSelector } from "react-redux";
import moment from "moment";
import styles from "./CardsSection.module.scss";
import { InfoCircleOutlined } from "@ant-design/icons";
import { areIntervalsOverlapping } from "date-fns";
import { checkAvailable, findAvailable } from "../../utils/checkAvailable.js";
let controller = new AbortController();

const CardsSection = (props) => {
  const [loading, setLoading] = useState(false);
  const [selectedCardInSection, setselectedCardInSection] = useState();
  const [dataDesks, setDataDesks] = useState([]);
  const [allDesks, setAllDesks] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { Meta } = Card;
  const media = window.matchMedia("(max-width: 820px)");

  const start = useSelector((state) => state.date.start);
  const end = useSelector((state) => state.date.end);

  const selectCard = (e) => {
    let isAvailable = true;
    const res = e.reservations;
    if (res.length > 0) {
      res.forEach((item) => {
        const availability = findAvailable(item, start, end);
        if (!availability || !e.available) {
          isAvailable = false;
        }
      });
    } else isAvailable = true;

    const availability = isAvailable ? true : false;
    props.selectedCard(e, availability);
    setselectedCardInSection(e);
  };

  const setDesks = (desks) => {
    if (!desks.length) {
      setDataDesks(desks);
    }

    if (props.available !== null) {
      const filtered = desks.filter((item) => !item.category.unavailable);
      setDataDesks(filtered);
    } else setDataDesks(desks);
  };

  const getAllDesks = async () => {
    await api
      .get(`employee/office-desks/${props.officeid}`, {
        signal: controller.signal,
      })
      .then((response) => {
        addAvailableProp(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function addAvailableProp(allDataDesk) {
    if (!allDataDesk.length) {
      return;
    }
    const addAvailable = allDataDesk.map((item) => {
      const available = checkAvailable(item, start, end);
      Object.assign(item, { available: available });
      return item;
    });
    setAllDesks(addAvailable);
  }

  const fetchData = async (skipProp) => {
    await api
      .get(`employee/office-desks/${props.officeid}/?top=20&skip=${skipProp}`, {
        signal: controller.signal,
      })
      .then((response) => {
        if (skipProp === 0) {
          setDesks(response.data);
          setLoading(false);
        } else {
          setDesks([...dataDesks, ...response.data]);
          if (!response.data.length) {
            setHasMore(false);
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loadInitialDesks = () => {
    setSkip(0);
    setLoading(true);
    fetchData(0);
    getAllDesks();
  };

  const loadMoreData = () => {
    if (loading) {
      return;
    }

    let newSkip = skip + 20;
    setSkip(newSkip);
    setLoading(true);
    fetchData(newSkip);
  };

  const filterByAvailable = () => {
    let filteredDesks = allDesks.filter((item) => {
      if (props.employeeSearch.length === 0) {
        if (props.available === null) {
          return true;
        } else if (
          item.available &&
          props.available &&
          !item.category?.unavailable
        ) {
          return true;
        } else if (!item.available && !props.available) {
          return true;
        }
        return false;
      }

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
        `${specificUser?.employee?.firstName} ${specificUser?.employee?.surname}`
          .toLowerCase()
          .includes(props.employeeSearch.toLowerCase())
      ) {
        return true;
      }
    });

    filteredDesks.length === 0 && props.employeeSearch.length !== 0
      ? props.getEmployeeSearch(true)
      : props.getEmployeeSearch(false);

    setDesks(filteredDesks);
  };

  const filterByCategories = () => {
    let filteredDesks = allDesks.filter(({ category }) => {
      if (
        !props.categories.nearWindow &&
        !props.categories.doubleMonitor &&
        !props.categories.singleMonitor
      )
        return true;
      if (
        category &&
        props.categories.nearWindow &&
        !props.categories.doubleMonitor &&
        !props.categories.singleMonitor &&
        category.nearWindow
      ) {
        return true;
      }
      if (
        category &&
        props.categories.nearWindow &&
        props.categories.doubleMonitor &&
        !props.categories.singleMonitor &&
        category.nearWindow &&
        category.doubleMonitor
      ) {
        return true;
      }
      if (
        category &&
        props.categories.nearWindow &&
        !props.categories.doubleMonitor &&
        props.categories.singleMonitor &&
        category.nearWindow &&
        category.singleMonitor
      ) {
        return true;
      }
      if (
        category &&
        !props.categories.nearWindow &&
        !props.categories.doubleMonitor &&
        props.categories.singleMonitor &&
        category.singleMonitor
      ) {
        return true;
      }
      if (
        category &&
        !props.categories.nearWindow &&
        props.categories.doubleMonitor &&
        !props.categories.singleMonitor &&
        category.doubleMonitor
      )
        return true;
    });

    setDesks(filteredDesks);
  };

  useEffect(() => {
    loadInitialDesks();
    setHasMore(true);
    setSkip(0);
    return () => {
      controller.abort();
      controller = new AbortController();
    };
  }, [props.officeid, props.refresh]);

  useEffect(() => {
    setHasMore(false);
    setDesks([]);
    filterByAvailable();
  }, [props.available, props.employeeSearch]);

  useEffect(() => {
    setHasMore(false);
    setDesks([]);
    filterByCategories();
  }, [props.categories]);

  useEffect(() => {
    addAvailableProp(allDesks);
  }, [end]);

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

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 400,
        overflow: dataDesks.length ? "auto" : "hidden",
        border: "1px solid rgba(140, 140, 140, 0.35)",
      }}
    >
      <InfiniteScroll
        dataLength={dataDesks.length}
        next={loadMoreData}
        hasMore={hasMore}
        scrollableTarget="scrollableDiv"
        style={{
          overflow: dataDesks.length ? "auto" : "hidden",
        }}
      >
        <List
          grid={{ gutter: 0, column: media.matches ? 1 : 4 }}
          dataSource={dataDesks}
          renderItem={(item) => {
            const available = checkAvailable(item, start, end);
            Object.assign(item, { available: available });
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
                  border: item === selectedCardInSection ? "solid 2px" : "none",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <Card
                  onClick={() => selectCard(item)}
                  bodyStyle={{
                    // backgroundColor: checkAvailable(item.reservation),
                    background: item.category?.unavailable
                      ? "#c1c1c1"
                      : item.available
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
                            item.category?.doubleMonitor
                              ? "Dual monitors\n"
                              : ""
                          }
                              ${
                                item.category?.singleMonitor
                                  ? "Single monitor\n"
                                  : ""
                              } ${
                            !item.category?.singleMonitor &&
                            !item.category?.doubleMonitor
                              ? "No monitors\n"
                              : ""
                          }${item.category?.nearWindow ? "Near window\n" : ""}`}
                        >
                          <InfoCircleOutlined className={styles.infoCircle} />
                        </Tooltip>
                      </div>
                    }
                    description={
                      <div className={styles.cardContentInformation}>
                        <div>
                          <p className={styles.basicText}>
                            {item.category?.unavailable
                              ? "Unavailable"
                              : item.reservations.length > 0 &&
                                !item.available &&
                                `${specificUser?.employee.firstName} ${specificUser?.employee.surname}`}
                            {}
                          </p>
                          <p className={styles.basicText}>
                            {!item.category?.unavailable &&
                              item.reservations.length > 0 &&
                              !item.available &&
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
      </InfiniteScroll>
    </div>
  );
};
export default CardsSection;
