import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHead from "../../components/Head/UserHead";
import { Pie } from "@ant-design/charts";
import api from "../../helper/api";
import styles from "./Dashboard.module.scss";
import { Button, Modal, Select, Table } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  FrownOutlined,
  InfoCircleFilled,
  MehOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import Loading from "../../components/Loading/Loading";

import CalendarImplementation from "../../components/inputs/Calendar/CalendarImplementation";
import { useDispatch, useSelector } from "react-redux";
import { setEnd, setStart } from "../../redux/Date/Date";
import Moment from "moment";
import { extendMoment } from "moment-range";

import UserSearch from "../../components/UserSearch/UserSearch";
import { setInitialDesks } from "../../redux/Dashboard/Dashboard";

const Dashboard = () => {
  const [desks, setDesks] = useState([]);
  const [deskData, setDeskData] = useState([]);
  const [availableDesks, setAvailableDesks] = useState(0);
  const [reservedDesks, setReservedDesks] = useState(0);
  const [allDesks, setAllDesks] = useState(0);
  const [writtenReview, setWrittenReview] = useState("");
  const [activeModal, setActiveModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [offices, setOffices] = useState([]);
  const [initialReviews, setInitialReviews] = useState([]);
  const start = useSelector((state) => state.date.start);
  const end = useSelector((state) => state.date.end);
  const count = useRef(0);

  const initialDesk = useSelector((state) => state.dashboard.initialDesk);

  const moment = extendMoment(Moment);
  const dispatch = useDispatch();

  const [startDateRes, setStartDate] = useState(Moment());
  const [endDateRes, setEndDate] = useState(Moment());
  const [dates, setDates] = useState([]);

  /**
   * If the start and end dates of the item are within the start and end dates of the range, return
   * true.
   * @returns A boolean value.
   */
  const findAvailable = (item) => {
    const startSelected = item.startDate;
    const endSelected = item.endDate;
    const momentStart = start;
    const momentEnd = end;
    const momentRange = extendMoment(moment);
    const range1 = momentRange.range(startSelected, endSelected);
    const range2 = momentRange.range(momentStart, momentEnd);
    const flag = range2.overlaps(range1, { adjacent: true });
    return flag;
  };

  /**
   * If the length of the array is greater than 0, then for each item in the array, if the item is
   * available, then increment the count by 1.
   */
  const checkAvailable = (res) => {
    if (res.length > 0) {
      res.forEach((item) => {
        const flag = findAvailable(item);
        if (flag) count.current = count.current + 1;
      });
    }
    // return "#f37076" : "#69e28d",
  };

  /**
   * It takes an array of objects, and returns an array of objects.
   */
  const filterData = (deskInfo) => {
    count.current = 0;
    setDesks(deskInfo);
    let unavailableDesk;

    deskInfo.forEach((item) => {
      checkAvailable(item.reservations);
    });

    const unavailableData = count.current;

    console.log(unavailableData);
    const availableDesk = parseInt(deskInfo.length) - unavailableData;

    setAllDesks(deskInfo.length);
    setDeskData([
      {
        type: "Available",
        value: availableDesk,
      },
      {
        type: "Reserved",
        value: unavailableData,
      },
    ]);
    setAvailableDesks(availableDesk);
    setReservedDesks(unavailableData);
  };

  /**
   * It fetches data from an API, sorts it, and then sets it to a state.
   */
  const fetchOfficeData = async () => {
    await api
      .get("admin/offices")
      .then(async ({ data }) => {
        const sortedOffices = data.sort((a, b) => a.name.localeCompare(b.name));
        setOffices(sortedOffices);
        if (initialDesk.length === 0 || !initialDesk) {
          const deskRes = await Promise.all(
            data.map((item) => {
              const val = fetchDeskData(item.id).then((res) => res);
              return val;
            })
          );
          const desk = deskRes.flat(deskRes.length);
          const deskInfo = desk.map((item, id) => {
            return { ...item, key: id };
          });

          dispatch(setInitialDesks(deskInfo));
          filterData(deskInfo);
        } else {
          filterData(initialDesk);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /**
   * FetchDeskData is an async function that takes an officeId as an argument, and returns a promise
   * that resolves to an array of objects, each of which has an officeId property.
   * @returns An array of objects.
   */
  const fetchDeskData = async (officeId) => {
    console.log(officeId);
    return api
      .get("employee/office-desks/" + officeId)
      .then((response) => {
        const data = response.data.map((item) => {
          return { ...item, officeId };
        });
        return data;
      })
      .catch((error) => {
        console.error("error message");
      });
  };

  /**
   * If the office is not selected, then filter the data to the initial desk and set the reviews to the
   * initial reviews.
   *
   * If the office is selected, then filter the data to the desk info and set the reviews to the review
   * filter.
   * @returns the filtered data.
   */
  const selectFilter = (office) => {
    if (!office) {
      filterData(initialDesk);
      setReviews(initialReviews);
      return;
    }

    const deskInfo = initialDesk.filter((item) => item.officeId === office);
    filterData(deskInfo);
    const foundOffice = offices.find((item) => item.id === office);

    const reviewFilter = initialReviews.filter((item) =>
      item.officeName.includes(foundOffice.name)
    );
    setReviews(reviewFilter);
  };

  const clearDate = () => {
    dispatch(setStart(null));
    dispatch(setEnd(null));
    setDates([]);
  };

  useEffect(() => {
    filterData(desks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  /* Creating a pie chart. */
  const config = {
    appendPadding: 10,
    data: deskData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 20,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: `${allDesks ? allDesks : "Loading..."}`,
      },
    },
    theme: {
      colors10: ["#2DCE98", "#F53C56"],
    },
  };

  console.log(reviews);

  /* Fetching reviews from an API and then mapping over the data to create a new array of objects. */
  const fetchReviews = () => {
    api
      .get("employee/reviews/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("msal.idtoken")}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
      })
      .then(({ data }, id) => {
        const better = data.listOfReviews.map((item, id) => {
          return {
            ...item,
            reviewOutput: item.reviewOutput ? (
              item.reviewOutput === "Positive" ? (
                <SmileOutlined className={styles.emoji} />
              ) : (
                <FrownOutlined className={styles.emoji} />
              )
            ) : (
              <MehOutlined className={styles.emoji} />
            ),
            review:
              item.review.length > 0 ? item.review : "This review is blank",
            key: id,
          };
        });
        setInitialReviews(better);
        setReviews(better);
      });
  };

  useEffect(() => {
    fetchOfficeData();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDate = (startDate, endDate, range) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setDates(range);
  };

  /* Creating a table with 4 columns. */
  const colums = [
    {
      title: "Review",
      dataIndex: "review",
      key: 1,
      ellipsis: true,
      width: "45%",
    },
    {
      title: "Review output",
      dataIndex: "reviewOutput",
      key: 2,

      align: "center",
    },
    { title: "Desk number", dataIndex: "deskIndex", key: 3, align: "center" },
    {
      title: "Options",
      dataIndex: "options",
      key: 4,
      align: "center",
      width: "150px",
      render: (text, data, id) => {
        return (
          <Button
            onClick={() => {
              setWrittenReview(data.review);
              setActiveModal(true);
            }}
            className={styles.reviewBtn}
          >
            Check Review
          </Button>
        );
      },
    },
  ];

  return (
    <Layout>
      <UserHead />
      <Layout className="panelBg">
        <Sidebar selected="1" />
        <Content className={styles.content}>
          <div className={styles.container}>
            <div>
              <UserSearch />
            </div>
            <div className={styles.title}>
              <h2>Dashboard</h2>
            </div>
            <div className={styles.inputs}>
              <Select
                defaultValue="All offices"
                onChange={selectFilter}
                className={styles.select}
                showSearch
              >
                <Select.Option key={0} value={null}>
                  All offices
                </Select.Option>
                {offices &&
                  offices.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
              </Select>
              <div className={styles.select}>
                <CalendarImplementation
                  dateFunction={setDate}
                  startDate={startDateRes}
                  endDate={endDateRes}
                  dates={dates}
                  clearDate={clearDate}
                  dashboard={true}
                />
              </div>
            </div>
            <div className={styles.infoCards}>
              <div className={styles.dashboardCard}>
                <p>AVAILABLE</p>
                <div className={styles.tile}>
                  <h2>{isNaN(availableDesks) ? 0 : availableDesks}</h2>
                  <CheckCircleFilled
                    className={`${styles.tabIcon} ${styles.checkmark}`}
                  />
                </div>
              </div>
              <div className={styles.dashboardCard}>
                <p>RESERVED</p>
                <div className={styles.tile}>
                  <h2>{reservedDesks ? reservedDesks : 0}</h2>
                  <CloseCircleFilled
                    className={`${styles.tabIcon} ${styles.xmark}`}
                  />
                </div>
              </div>
              <div className={styles.dashboardCard}>
                <p>TOTAL</p>
                <div className={styles.tile}>
                  <h2>{allDesks}</h2>
                  <InfoCircleFilled
                    className={`${styles.tabIcon} ${styles.imark}`}
                  />
                </div>
              </div>
            </div>
            <div
            // style={{
            //   width: "100%",
            //   marginTop: "1%",
            // }}
            >
              <div className={styles.dataRow}>
                <div className={styles.pieCard}>
                  <h3>Desks available/reserved</h3>
                  {deskData.length > 0 ? (
                    <Pie {...config} />
                  ) : (
                    <div className={styles.loading}>
                      <Loading />
                    </div>
                  )}
                </div>
                <div className={styles.tableCard}>
                  <h3>User reviews</h3>
                  {reviews.length > 0 ? (
                    <Table
                      columns={colums}
                      dataSource={reviews}
                      pagination={{ pageSize: 4, position: ["bottomRight"] }}
                    />
                  ) : (
                    <div className={styles.noReviews}>
                      <h1>¯\_(ツ)_/¯</h1>
                      <h3>No reviews for this office</h3>
                    </div>
                  )}
                </div>
                <Modal
                  title="Review for desk"
                  centered
                  maskClosable={false}
                  visible={activeModal}
                  onOk={() => {
                    setWrittenReview("");
                    setActiveModal(false);
                  }}
                  width={800}
                  cancelButtonProps={{ style: { display: "none" } }}
                >
                  <div className={styles.modal}>
                    <p>{writtenReview}</p>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
