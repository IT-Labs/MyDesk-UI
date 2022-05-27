import React from "react";
import "antd/dist/antd.css";
import { Space } from "antd";
import { DatePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setEnd, setStart } from "../../redux/Date/Date";

const CalendarImplementation = (props) => {
  const { RangePicker } = DatePicker;
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
  const start = useSelector((state) => state.date.start);
  const dispatch = useDispatch();

  const dateFormat = "DD/MM/YYYY";

  function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  function disabledDate(current) {
    return current && current < moment().endOf("day");
  }

  function changedates(range) {
    if (range) {
      const startdate = range[0].format("DD-MM-YYYY");
      const enddate = range[1].format("DD-MM-YYYY");
      dispatch(setStart(startdate));
      dispatch(setEnd(enddate));
      props.dateFunction(startdate, enddate);
    }
  }

  return (
    <div>
      <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>Select date</p>
      <Space direction="vertical" size={12}>
        <RangePicker
          disabledDate={disabledDate}
          format={dateFormat}
          onChange={changedates}
        />
      </Space>
    </div>
  );
};
export default CalendarImplementation;
