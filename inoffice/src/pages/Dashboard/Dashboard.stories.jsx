import {
  CheckCircleFilled,
  CloseCircleFilled,
  FrownOutlined,
  InfoCircleFilled,
  MehOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Pie } from "@ant-design/charts";
import { Fragment } from "react";
import styles from "./Dashboard.module.scss";
import { Button, Modal, Table } from "antd";
import { useState } from "react";
import "../../antd.less";

export default {
  title: "Dashboard",
  component: Fragment,
};

export const InfoCards = () => {
  return (
    <>
      <p>
        These info cards specify all the information fetched from the backend,
        by default they represent all desks throughout all offices, but once an
        office is selected, they change.
      </p>
      <div className={styles.infoCards}>
        <div className={styles.dashboardCard}>
          <p>AVAILABLE</p>
          <div className={styles.tile}>
            <h2>43</h2>
            <CheckCircleFilled
              className={`${styles.tabIcon} ${styles.checkmark}`}
            />
          </div>
        </div>
        <div className={styles.dashboardCard}>
          <p>RESERVED</p>
          <div className={styles.tile}>
            <h2>15</h2>
            <CloseCircleFilled
              className={`${styles.tabIcon} ${styles.xmark}`}
            />
          </div>
        </div>
        <div className={styles.dashboardCard}>
          <p>TOTAL</p>
          <div className={styles.tile}>
            <h2>57</h2>
            <InfoCircleFilled className={`${styles.tabIcon} ${styles.imark}`} />
          </div>
        </div>
      </div>
    </>
  );
};

export const PieChart = () => {
  const config = {
    appendPadding: 10,
    data: [
      {
        type: "Available",
        value: 43,
      },
      {
        type: "Reserved",
        value: 15,
      },
    ],
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
      },
    },
    theme: {
      colors10: ["#2DCE98", "#F53C56"],
    },
  };
  return (
    <>
      <span>
        The pie chart represents the the data we fetched from the API, its just
        to help visualise the data in terms of scope.
      </span>
      <Pie {...config} />
    </>
  );
};

export const Reviews = () => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const handleClick = () => {
    setVisible(!visible);
  };
  const reviews = [
    {
      review: "Jasmine please let me see the kids again....",
      reviewOutput: <SmileOutlined className={styles.emoji} />,
      deskIndex: 1,
      officeName: "Atlantic Skopje",
      key: 1,
    },
    {
      review: "Good desk",
      reviewOutput: <FrownOutlined className={styles.emoji} />,
      deskIndex: 5,
      officeName: "Atlantic Skopje",
      key: 2,
    },
    {
      review: "New review",
      reviewOutput: <MehOutlined className={styles.emoji} />,
      deskIndex: 2,
      officeName: "Atlantic Skopje",
      key: 3,
    },
  ];
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
        console.log(id);
        return (
          <Button
            onClick={() => {
              handleClick();
              setText(reviews[id].review);
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
    <>
      <span>
        This is a table component where we fetch all the reviews from each desk.
        All desks can have multiple reviews, but one person can only write once
        for each desk.
      </span>
      <Button type="primary">Yep</Button>
      <Table
        columns={colums}
        dataSource={reviews}
        pagination={{ pageSize: 4, position: ["bottomRight"] }}
      />
      <Modal visible={visible} onOk={handleClick}>
        <p>{text}</p>
      </Modal>
    </>
  );
};
