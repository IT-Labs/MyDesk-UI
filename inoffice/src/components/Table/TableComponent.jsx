import React from "react";
import { Table } from "antd";

const TableComponent = ({ pagination, columns, data }) => {
  return (
    <Table
      pagination={pagination}
      columns={columns}
      dataSource={data}
      scroll={{ x: 400 }}
    />
  );
};

export default TableComponent;
