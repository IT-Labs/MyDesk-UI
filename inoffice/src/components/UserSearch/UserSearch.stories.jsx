import { Modal, Select, Space, Table } from "antd";
import { useState } from "react";

export default {
  title: "User Search",
  component: Space,
};

export const Search = () => {
  const [visible, setVisible] = useState(false);
  const data = [
    { entity: "Desk 1", office: "Placeholder Office", key: 1 },
    { entity: "Desk 2", office: "Placeholder Office", key: 2 },
    { entity: "Desk 3", office: "Placeholder Office", key: 3 },
  ];
  const futureColumns = [
    {
      title: "Desk",
      dataIndex: "entity",
      key: 1,
    },
    { title: "Office", dataIndex: "office", key: 2 },
    {
      title: "Date",
      dataIndex: "date",
      key: 3,
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
  ];
  const { Option } = Select;
  return (
    <>
      <p>Search for user</p>
      <Select style={{ width: 200 }} onSelect={() => setVisible(true)}>
        <Option key={1}>Employee 1</Option>
        <Option key={2}>Employee 2</Option>
        <Option key={3}>Employee 3</Option>
      </Select>
      <Modal onOk={() => setVisible(false)} visible={visible}>
        <h3>Name: Placeholder</h3>
        <h3>Job title: Placeholder</h3>
        <h3>Email: Placeholder@pl.com</h3>
        <Table
          columns={futureColumns}
          dataSource={data}
          scroll={{ y: 300 }}
          pagination={false}
        />
      </Modal>
    </>
  );
};
