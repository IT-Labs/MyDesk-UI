import React, { useState, useEffect } from "react";
import { List, Card, Tooltip } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import moment from "moment";
import styles from "./CardsSection.module.scss";
import { InfoCircleOutlined } from "@ant-design/icons";
import { checkAvailable, findAvailable } from "../../utils/checkAvailable.js";
import { fetchDeskApi, fetchAllDeskApi } from "../../services/desk.service";
import { filterByAvailable, getSpecificUser } from "./utils/filterByAvailable";
import { filterByCategories } from "./utils/filterByCategories";
let controller = new AbortController();

const CardsSection = (props) => {
  const [loading, setLoading] = useState(false);
  const [selectedCardInSection, setSelectedCardInSection] = useState();
  const [dataDesks, setDataDesks] = useState([]);
  const [allDesks, setAllDesks] = useState([]);
  const [desksByAvailable, setDesksByAvailable] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { Meta } = Card;
  const media = window.matchMedia("(max-width: 820px)");
  const start = useSelector((state) => state.date.start);
  const end = useSelector((state) => state.date.end);

  const selectCard = (e) => {
    let isAvailable = true;
    const res = e.reservations;
    if (res.length && end !== null) {
      res.forEach((item) => {
        const availability = findAvailable(item, start, end);
        if (!availability || !e.available) {
          isAvailable = false;
        }
      });
    }

    props.selectedCard(e, isAvailable);
    setSelectedCardInSection(e);
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
    if (!props.officeId) {
      return;
    }

    fetchAllDeskApi(props.officeId).then((response) => {
      addAvailableProp(response.data);
    });
  };

  const addAvailableProp = (allDataDesk) => {
    if (!allDataDesk.length) {
      return;
    }
    const addAvailable = allDataDesk.map((item) => {
      const available = checkAvailable(item, start, end);
      Object.assign(item, { available: available });
      return item;
    });
    setAllDesks(addAvailable);
  };

  const fetchData = async (skipProp) => {
    if (!props.officeId) {
      return;
    }
    fetchDeskApi(props.officeId, skipProp).then((response) => {
      if (skipProp === 0) {
        setDesks(response.data);
        setHasMore(true);
        setLoading(false);
      } else {
        setDesks([...dataDesks, ...response.data]);
        if (!response.data.length) {
          setHasMore(false);
        }
        setLoading(false);
      }
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

  const onFilterByAvailable = () => {
    let filteredDesks = filterByAvailable(
      allDesks,
      props.employeeSearch,
      props.available,
      start,
      end
    );

    filteredDesks.length === 0 && props.employeeSearch.length !== 0
      ? props.getEmployeeSearch(true)
      : props.getEmployeeSearch(false);

    setDesksByAvailable(filteredDesks);
    setDesks(filteredDesks);
  };

  const onFilterByCategories = () => {
    let desksNeedToFilter;
    if (props.available === null && !props.employeeSearch.length) {
      desksNeedToFilter = allDesks;
    } else {
      desksNeedToFilter = desksByAvailable;
    }
    let filteredDesks = filterByCategories(props, desksNeedToFilter);

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
  }, [props.officeId, props.refresh]);

  useEffect(() => {
    setHasMore(false);
    setDesks([]);
    onFilterByAvailable();
  }, [props.available, props.employeeSearch]);

  useEffect(() => {
    setHasMore(false);
    setDesks([]);
    onFilterByCategories();
  }, [props.categories]);

  useEffect(() => {
    addAvailableProp(allDesks);
  }, [end]);

  useEffect(() => {
    if (
      props?.categories?.singleMonitor ||
      props?.categories?.doubleMonitor ||
      props?.categories?.nearWindow
    ) {
      onFilterByCategories();
    }
  }, [desksByAvailable]);

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
              const newGuy = getSpecificUser(info, start, end);
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
