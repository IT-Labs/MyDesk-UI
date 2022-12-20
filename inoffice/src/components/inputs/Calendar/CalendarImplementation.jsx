import React, { useEffect } from "react";
import "antd/dist/antd.css";
import { Space, DatePicker } from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setEnd, setStart } from "../../../redux/Date/Date";

const CalendarImplementation = (props) => {
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();
  const dateFormat = "DD/MM/YYYY";

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const changeDates = (range) => {
    if (range) {
      const startDate = range[0].format("DD-MM-YYYY");
      const endDate = range[1].format("DD-MM-YYYY");
      dispatch(setStart(moment(range[0]).toISOString()));
      dispatch(setEnd(moment(range[1]).toISOString()));
      props.dateFunction(startDate, endDate, range);
    }
  };

  useEffect(() => {
    dispatch(setStart(null));
    dispatch(setEnd(null));
  }, []);

  return props.isHome ? (
    <div style={{ width: "100%" }}>
      <Space style={{ width: "100%" }} direction="vertical" size={12}>
        <RangePicker
          disabledDate={disabledDate}
          format={dateFormat}
          onChange={changeDates}
          value={[props.dates[0], props.dates[1]]}
          onClick={props.clearDate}
          style={{ width: "100%" }}
        />
      </Space>
    </div>
  ) : (
    <div>
      <Space direction="vertical" size={12}>
        <RangePicker
          format={dateFormat}
          onChange={changeDates}
          value={[props.dates[0], props.dates[1]]}
          onClick={props.clearDate}
          style={{ width: "100%" }}
        />
      </Space>
    </div>
  );
};
export default CalendarImplementation;
