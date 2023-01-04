import { Button, Card, Modal, Table } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Content } from "antd/lib/layout/layout";
import { Fragment, useState } from "react";
import { CardTitle } from "./CardTitle";
import styles from "./Reservation.module.scss";

export default {
  title: "My Reservations",
  component: Fragment,
};

export const MyReservations = () => {
  const data = ["skopje", "ohrid"];
  const tabList = [
    {
      key: "tab1",
      tab: "Future",
    },
    {
      key: "tab2",
      tab: "Past",
    },
  ];
  const [activeTabKey1, setActiveTabKey1] = useState("tab1");

  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };

  const contentList = {
    tab1: <FutureReservations />,
    tab2: <PastReservations />,
  };
  return (
    <>
      <span>
        This is a tab that contains the reservations. This is the same logic for
        both the My reservations and future reservations, but the only
        difference is that reservation list uses the graph api to get the
        profile picture of the users in your organization and reservation list
        checks every reservation not just the current user's.
      </span>
      <br />
      {activeTabKey1 === "tab1" ? (
        <span>
          The future reservations tab is where the user can check all the
          reservations that have been reserved, whether they or someone else has
          reserved the desk for them. If the user has changed their mind, they
          can cancel the desk at any time.
        </span>
      ) : (
        <span>
          The past reservation tab is where the user can see any reservations
          that have expired, here you can also read a review or write a review
          based on your preferences. The reviews written will be analyzed by our
          AI and spit out a positive, negative or neutral reaction.
        </span>
      )}
      <Content className={styles.contentStyle}>
        <Card
          className={styles.cardStyle}
          title={"My Reservations"}
          tabList={tabList}
          activeTabKey={activeTabKey1}
          onTabChange={(key) => {
            onTab1Change(key);
          }}
        >
          {contentList[activeTabKey1]}
        </Card>
      </Content>
    </>
  );
};

const FutureReservations = () => {
  const [data, setData] = useState([
    {
      date: "22/06/2022-26/07/2022",
      officeName: "Skopje",
      entity: `Desk 1`,
      id: 1,
    },
    {
      date: "22/06/2022-26/07/2022",
      officeName: "Skopje",
      entity: `Desk 2`,
      id: 2,
    },
    {
      date: "22/06/2022-26/07/2022",
      officeName: "Skopje",
      entity: `Desk 3`,
      id: 3,
    },
  ]);
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
      sortDirections: ["descend"],
    },
    { title: "Office", dataIndex: "officeName", key: 2 },
    { title: "Entity", dataIndex: "entity", key: 3 },
    {
      title: "Options",
      dataIndex: "options",
      key: 4,
      align: "center",
      render: (useless1, data, useless2) => {
        return (
          <Button
            onClick={() => {
              setVisible(true);
            }}
            className="btn"
          >
            Cancel
          </Button>
        );
      },
    },
  ];

  const [visible, setVisible] = useState(false);

  return <Table columns={columns} dataSource={data} />;
};

const PastReservations = () => {
  const [data, setData] = useState([
    {
      date: "22/06/2022-26/07/2022",
      officeName: "Skopje",
      entity: `Desk 1`,
      id: 1,
    },
    {
      date: "22/06/2022-26/07/2022",
      officeName: "Skopje",
      entity: `Desk 2`,
      id: 2,
    },
    {
      date: "22/06/2022-26/07/2022",
      officeName: "Skopje",
      entity: `Desk 3`,
      id: 3,
      reviewId: 8,
    },
  ]);
  const [visible, setVisible] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const handleSubmit = () => {
    setLoadingData(true);
    setTimeout(() => {
      setLoadingData(false);
      setVisible(false);
    }, 5000);
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
          <div onClick={() => setVisible(true)}>
            <Button className={styles.btn}>Write review</Button>
          </div>
        ) : (
          <div onClick={() => setShowReviewModal(true)}>
            <Button className={styles.btn}>Read review</Button>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Table columns={columns} dataSource={data} />
      <Modal
        visible={showReviewModal}
        onOk={() => setShowReviewModal(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        title="Review"
      >
        <p>This is a placeholder review</p>
      </Modal>
      <Modal
        visible={visible}
        onOk={handleSubmit}
        confirmLoading={loadingData}
        cancelButtonProps={{ style: { display: "none" } }}
        title="Review"
      >
        <TextArea rows={4} allowClear={true} maxLength={200} />
      </Modal>
    </>
  );
};
