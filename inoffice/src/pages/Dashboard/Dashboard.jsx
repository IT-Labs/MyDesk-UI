import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import { Pie } from "@ant-design/charts";
import styles from "./Dashboard.module.scss";
import { Button, Modal, Select, Table } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled,
} from "@ant-design/icons";
import CalendarImplementation from "../../components/inputs/Calendar/CalendarImplementation";
import { useDispatch, useSelector } from "react-redux";
import { setEnd, setStart } from "../../redux/Date/Date";
import Moment from "moment";
import { extendMoment } from "moment-range";
import UserSearch from "../../components/UserSearch/UserSearch";
import { setInitialDesks } from "../../redux/Dashboard/Dashboard";
import { fetchAllDeskApi } from "../../services/desk.service";
import { fetchAllOfficesAdminApi } from "../../services/office.service";
import { getAllReviewsApi } from "../../services/review.service";
import { addEmojiToReview } from "../../utils/addEmojiToReview";
import MainLayout from "../../layouts/MainLayout";
import { sortByName } from "../../utils/sortByName";

const Dashboard = () => {
  const [desksForSelectedOffice, setDesksForSelectedOffice] = useState([]);
  const [deskData, setDeskData] = useState([
    {
      type: "Available",
      value: 0,
    },
    {
      type: "Reserved",
      value: 0,
    },
  ]);
  const [availableDesksNumber, setAvailableDesksNumber] = useState(0);
  const [reservedDesksNumber, setReservedDesksNumber] = useState(0);
  const [allDesksNumber, setAllDesksNumber] = useState(0);
  const [writtenReview, setWrittenReview] = useState("");
  const [activeModal, setActiveModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsForSelectedOffice, setReviewsForSelectedOffice] = useState([]);
  const [offices, setOffices] = useState([]);
  const [initialReviews, setInitialReviews] = useState([]);
  const count = useRef(0);
  const initialDesk = useSelector((state) => state.dashboard.initialDesk);
  const moment = extendMoment(Moment);
  const dispatch = useDispatch();
  const [startDateRes, setStartDate] = useState([]);
  const [endDateRes, setEndDate] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState({});
  const currentRange = [moment(), moment()];

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
        content: `${allDesksNumber ? allDesksNumber : "0"}`,
      },
    },
    theme: {
      colors10: ["#2DCE98", "#F53C56"],
    },
  };

  /* Creating a table with 4 columns. */
  const columns = [
    {
      title: "Review",
      dataIndex: "review",
      key: 1,
      ellipsis: true,
      width: "90px",
    },
    {
      title: "Review output",
      dataIndex: "reviewOutput",
      key: 2,
      width: "90px",
      align: "center",
    },
    {
      title: "Desk number",
      dataIndex: ["reservation", "desk", "indexForOffice"],
      key: 3,
      align: "center",
      width: "90px",
      render: (text, data, id) => {
        return (
          <p style={{ fontSize: "0.9rem" }}>
            Desk [{data.reservation.desk.indexForOffice}]
          </p>
        );
      },
    },
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
            Show Review
          </Button>
        );
      },
    },
  ];

  /**
   * If the start and end dates of the item are within the start and end dates of the range, return
   * true.
   * @returns A boolean value.
   */
  const findAvailable = (item, range) => {
    const startSelected = item.startDate;
    const endSelected = item.endDate;
    const itemStartDate = moment(startSelected).format("YYYY-MM-DD");
    const selectedStartDate = range[0].format("YYYY-MM-DD");
    const isSameDate = itemStartDate === selectedStartDate;
    const momentRange = extendMoment(moment);
    const range1 = momentRange.range(startSelected, endSelected);
    const range2 = momentRange.range(range[0], range[1]);
    const flag = range2.overlaps(range1, { adjacent: true }) || isSameDate;
    return flag;
  };

  /**
   * If the length of the array is greater than 0, then for each item in the array, if the item is
   * available, then increment the count by 1.
   */
  const checkAvailable = (reservations, range) => {
    if (reservations.length > 0) {
      let flag = reservations.some((reservation) =>
        findAvailable(reservation, range)
      );
      if (flag) {
        count.current = count.current + 1;
      }
    }
  };

  /**
   * It takes an array of objects, and returns an array of objects.
   */
  const filterData = (deskInfo, range) => {
    if (!deskInfo.length) {
      return;
    }
    count.current = 0;
    deskInfo.forEach((item) => {
      if (item.category.unavailable) {
        count.current = count.current + 1;
      } else {
        checkAvailable(item.reservations, range);
      }
    });

    const unavailableDeskNo = count.current;
    const availableDeskNo = parseInt(deskInfo.length) - unavailableDeskNo;
    setAllDesksNumber(deskInfo.length);
    setDeskData([
      {
        type: "Available",
        value: availableDeskNo,
      },
      {
        type: "Reserved",
        value: unavailableDeskNo,
      },
    ]);

    setAvailableDesksNumber(availableDeskNo);
    setReservedDesksNumber(unavailableDeskNo);
  };

  /**
   * It fetches data from an API, sorts it, and then sets it to a state.
   */
  const fetchOfficeData = async () => {
    await fetchAllOfficesAdminApi()
      .then(async ({ data }) => {
        const sortedOffices = sortByName(data);
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
        } else if (dates.length) {
          filterData(initialDesk, currentRange);
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
    return fetchAllDeskApi(officeId).then((response) => {
      const desks = response.data.map((item) => {
        return { ...item, officeId };
      });
      return desks;
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
  const selectOffice = (officeId) => {
    if (!officeId) {
      filterData(initialDesk, currentRange);
      setReviews(initialReviews);
      setDesksForSelectedOffice(initialDesk);
      return;
    }

    const deskInfo = initialDesk.filter((item) => item.officeId === officeId);
    setDesksForSelectedOffice(deskInfo);
    const foundOffice = offices.find((item) => item.id === officeId);
    setSelectedOffice(foundOffice);

    const reviewFilter = initialReviews.filter((item) =>
      item.reservation.desk.office.name.includes(foundOffice.name)
    );
    clearDate();
    setReviewsForSelectedOffice(reviewFilter);
    setReviews(reviewFilter);
  };

  const setDate = (startDate, endDate, range) => {
    filterData(desksForSelectedOffice, range);
    filterReviewByDate(range);
    setStartDate(startDate);
    setEndDate(endDate);
    setDates(range);
  };

  const clearDate = () => {
    setAvailableDesksNumber(0);
    setReservedDesksNumber(0);
    setDeskData([
      {
        type: "Available",
        value: 0,
      },
      {
        type: "Reserved",
        value: 0,
      },
    ]);
    setAllDesksNumber(0);
    dispatch(setStart(null));
    dispatch(setEnd(null));
    setDates([]);
    selectedOffice
      ? setReviews(reviewsForSelectedOffice)
      : setReviews(initialReviews);
  };

  /* Fetching reviews from an API and then mapping over the data to create a new array of objects. */
  const fetchReviews = () => {
    getAllReviewsApi().then(({ data }) => {
      const addEmoji = addEmojiToReview(data);

      setInitialReviews(addEmoji);
      setReviews(addEmoji);
    });
  };

  const filterReviewByDate = (range) => {
    let filteredReviews = [];
    let arrayOfReviews = selectedOffice
      ? reviewsForSelectedOffice
      : initialReviews;

    arrayOfReviews.forEach((review) => {
      if (review.reservation) {
        const reservationDate = moment(review.reservation.startDate).format(
          "YYYY-MM-DD"
        );
        const selectedStartDate = range[0].format("YYYY-MM-DD");
        const isSameDate = reservationDate === selectedStartDate;

        const isAfterStartDate = moment(review.reservation.startDate).isAfter(
          range[0]
        );
        const isBeforeEndDate = moment(review.reservation.endDate).isBefore(
          range[1]
        );

        if ((isAfterStartDate && isBeforeEndDate) || isSameDate) {
          filteredReviews.push(review);
        }
      }
    });

    setReviews(filteredReviews);
  };

  useEffect(() => {
    fetchOfficeData();
    fetchReviews();
  }, []);

  return (
    <Layout>
      <Sidebar selected="1" />
      <MainLayout isDashboard={true}>
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
                showSearch
                placeholder="Select office"
                onChange={selectOffice}
                className={styles.select}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
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
              <div className={`${styles.select} ant-select`}>
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
                <p className={styles.dashboardCardTitle}>AVAILABLE</p>
                <div className={styles.tile}>
                  <h2>
                    {isNaN(availableDesksNumber) ? 0 : availableDesksNumber}
                  </h2>
                  <CheckCircleFilled
                    className={`${styles.tabIcon} ${styles.checkmark}`}
                  />
                </div>
              </div>
              <div className={styles.dashboardCard}>
                <p>RESERVED</p>
                <div className={styles.tile}>
                  <h2>{reservedDesksNumber ? reservedDesksNumber : 0}</h2>
                  <CloseCircleFilled
                    className={`${styles.tabIcon} ${styles.xmark}`}
                  />
                </div>
              </div>
              <div className={styles.dashboardCard}>
                <p>TOTAL</p>
                <div className={styles.tile}>
                  <h2>{allDesksNumber}</h2>
                  <InfoCircleFilled
                    className={`${styles.tabIcon} ${styles.imark}`}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                paddingBottom: "20px",
              }}
            >
              <div className={styles.dataRow}>
                <div className={styles.pieCard}>
                  <h3>Desks available/reserved</h3>
                  <Pie {...config} />
                </div>
                <div className={styles.tableCard}>
                  <h3>User reviews</h3>
                  {reviews.length > 0 ? (
                    <Table
                      style={{ overflow: "auto", overflowY: "hidden" }}
                      columns={columns}
                      dataSource={reviews}
                      pagination={{
                        pageSize: 4,
                        position: ["bottomRight"],
                        size: "small",
                      }}
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
      </MainLayout>
    </Layout>
  );
};
export default Dashboard;
