import { DeleteFilled, QuestionCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Form as FormComp,
  Table,
  Checkbox,
  Popconfirm,
  Image,
} from "antd";
import { Fragment } from "react";
import {
  openError,
  openNotification,
} from "../../components/notification/Notification";
// import styles from "../EditOffice.module.scss";

export default {
  title: "Edit Office",
  component: Fragment,
};

export const Form = () => {
  const handleSubmit = (e) => {
    if (
      e.officeName.length >= 25 ||
      e.officeName.length === 0 ||
      e.officeLocation.length >= 25 ||
      e.officeLocation.length === 0
    ) {
      openError(
        "The office name and office location should be more between 0 and 25 characters each."
      );
      return;
    }
    openNotification("Successfully changed office information");
  };
  return (
    <>
      This is the form we use to change the office plan image, office name and
      location. If there are spaces in the office name, it will replace them
      with dashes: <strong>-</strong>.
      <FormComp
        name="normal_login"
        className="login-form"
        onFinish={handleSubmit}
        initialValues={{
          officePlan: "Placeholder url",
          officeName: "Placeholder office name",
          officeLocation: "Placeholder office location",
        }}
      >
        <FormComp.Item
          name="officePlan"
          rules={[{ required: false, message: "Please enter image url" }]}
        >
          <Input placeholder="Image url" />
        </FormComp.Item>

        <FormComp.Item
          name="officeName"
          rules={[{ required: false, message: "Please enter office name" }]}
        >
          <Input placeholder="Office name" />
        </FormComp.Item>

        <FormComp.Item
          name="officeLocation"
          rules={[{ required: false, message: "Please enter office location" }]}
        >
          <Input placeholder="Office location" />
        </FormComp.Item>

        <FormComp.Item>
          <Button
            htmlType="submit"
            className="greenBtn"
            type="primary"
            shape="round"
          >
            Save
          </Button>
          <Button
            className="redButton"
            style={{ marginLeft: 5 }}
            onClick={() => {}}
          >
            Cancel
          </Button>
        </FormComp.Item>
      </FormComp>
    </>
  );
};

export const SelectCategories = () => {
  const columns = [
    {
      title: "All desks",
      dataIndex: "indexForOffice",
      key: 1,
      align: "center",
      width: "16.6666666667%",
    },
    {
      title: "Unavailable desks",
      dataIndex: "unavailable",
      key: 2,

      render: (text, item, index) => {
        return <Checkbox checked={item.categories?.unavailable}></Checkbox>;
      },
      align: "center",
      width: "10%",
    },
    {
      title: "Single monitor",
      dataIndex: "singleMonitor",
      key: 3,

      render: (text, item, index) => {
        return (
          <Checkbox
            checked={item.categories?.singleMonitor}
            disabled={item.categories?.doubleMonitor}
          ></Checkbox>
        );
      },
      align: "center",
      width: "16.6666666667%",
    },
    {
      title: "Dual monitor",
      dataIndex: "dualMonitor",
      key: 4,

      render: (text, item, index) => {
        return (
          <Checkbox
            checked={item.categories?.doubleMonitor}
            disabled={item.categories?.singleMonitor}
          ></Checkbox>
        );
      },
      align: "center",
      width: "16.6666666667%",
    },
    {
      title: "Near window",
      dataIndex: "nearWindow",
      key: 5,

      render: (text, item, index) => {
        return <Checkbox></Checkbox>;
      },
      align: "center",
      width: "16.6666666667%",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      align: "center",
      key: 6,
      borderRight: "none",
      render: (text, item, id) => {
        return (
          <Popconfirm
            title="Are you sure to delete this desk?"
            onConfirm={() => {}}
            okText="Yes"
            cancelText="No"
            shape="round"
            style={{ padding: 0 }}
            placement="topRight"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <DeleteFilled
              key={item.id}
              value={item.id}
              style={{ padding: 0 }}
            />
          </Popconfirm>
        );
      },
      width: "10%",
    },
  ];

  const data = [
    {
      id: 6419,
      indexForOffice: 1,
      reservations: [],
      categories: {
        deskId: 6419,
        singleMonitor: false,
        doubleMonitor: false,
        nearWindow: false,
        unavailable: true,
        deskCategories: null,
        id: 415,
        isDeleted: false,
      },
    },
    {
      id: 6420,
      indexForOffice: 2,
      reservations: [],
      categories: {
        deskId: 6420,
        singleMonitor: true,
        doubleMonitor: false,
        nearWindow: false,
        unavailable: false,
        deskCategories: null,
        id: 416,
        isDeleted: false,
      },
    },
    {
      id: 6421,
      indexForOffice: 3,
      reservations: [],
      categories: {
        deskId: 6421,
        singleMonitor: false,
        doubleMonitor: true,
        nearWindow: false,
        unavailable: false,
        deskCategories: null,
        id: 417,
        isDeleted: false,
      },
    },
    {
      id: 6422,
      indexForOffice: 4,
      reservations: [],
      categories: {
        deskId: 6422,
        singleMonitor: false,
        doubleMonitor: false,
        nearWindow: true,
        unavailable: false,
        deskCategories: null,
        id: 418,
        isDeleted: false,
      },
    },
    {
      id: 6423,
      indexForOffice: 5,
      reservations: [],
      categories: {
        deskId: 6423,
        singleMonitor: false,
        doubleMonitor: true,
        nearWindow: false,
        unavailable: true,
        deskCategories: null,
        id: 419,
        isDeleted: false,
      },
    },
    {
      id: 6424,
      indexForOffice: 6,
      reservations: [],
      categories: {
        deskId: 6424,
        singleMonitor: false,
        doubleMonitor: false,
        nearWindow: true,
        unavailable: false,
        deskCategories: null,
        id: 420,
        isDeleted: false,
      },
    },
    {
      id: 6425,
      indexForOffice: 7,
      reservations: [],
      categories: {
        deskId: 6425,
        singleMonitor: false,
        doubleMonitor: false,
        nearWindow: false,
        unavailable: false,
        deskCategories: null,
        id: 421,
        isDeleted: false,
      },
    },
    {
      id: 6426,
      indexForOffice: 8,
      reservations: [],
      categories: {
        deskId: 6426,
        singleMonitor: false,
        doubleMonitor: false,
        nearWindow: false,
        unavailable: false,
        deskCategories: null,
        id: 422,
        isDeleted: false,
      },
    },
    {
      id: 6427,
      indexForOffice: 9,
      reservations: [],
      categories: {
        deskId: 6427,
        singleMonitor: false,
        doubleMonitor: false,
        nearWindow: false,
        unavailable: false,
        deskCategories: null,
        id: 423,
        isDeleted: false,
      },
    },
    {
      id: 6428,
      indexForOffice: 10,
      reservations: [],
      categories: {
        deskId: 6428,
        singleMonitor: false,
        doubleMonitor: false,
        nearWindow: false,
        unavailable: false,
        deskCategories: null,
        id: 424,
        isDeleted: false,
      },
    },
    {
      id: 6429,
      indexForOffice: 11,
      reservations: [],
      categories: {
        deskId: 6429,
        singleMonitor: false,
        doubleMonitor: false,
        nearWindow: false,
        unavailable: false,
        deskCategories: null,
        id: 425,
        isDeleted: false,
      },
    },
    {
      id: 6430,
      indexForOffice: 12,
      reservations: [],
      categories: {
        deskId: 6430,
        singleMonitor: false,
        doubleMonitor: false,
        nearWindow: false,
        unavailable: false,
        deskCategories: null,
        id: 426,
        isDeleted: false,
      },
    },
  ];

  return (
    <>
      <span>
        This component lets use select all the categories that we would want for
        each of our desks. The default options are: Near window, single monitor,
        dual monitor, and unavailable. If you select single monitor, the dual
        monitor option becomes disabled and vice versa.
      </span>
      <br />
      <Table columns={columns} dataSource={data} />
    </>
  );
};

export const OfficePlanImage = () => {
  return (
    <>
      <span>This is the office plan image</span>
      <br />
      <Image src="https://conceptdraw.com/a491c4/p1/preview/640/pict--floor-plan-small-office-floor-plan.png--diagram-flowchart-example.png"></Image>
    </>
  );
};
