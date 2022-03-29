import React from "react";
import "antd/dist/antd.css";
import {  Space } from 'antd';
import { DatePicker } from 'antd';
import moment from 'moment';


const CalendarImplementation = () => {
    const { RangePicker } = DatePicker;
    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

    const dateFormat = 'YYYY/MM/DD';

    function range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    }

    function disabledDate(current) {
      return current && current < moment().endOf('day');
    }

   function changedates(range){
     if(range){
      const startdate = range[0].format("DD-MM-YYYY");
      const enddate = range[1].format("DD-MM-YYYY");
    }
  }

  return (
      <Space  direction="vertical" size={12}>
        <RangePicker
            disabledDate={disabledDate}
            defaultValue={[moment(new Date(), dateFormat), moment(new Date(), dateFormat)]}
            format={dateFormat}
            onChange={changedates}
        />
      </Space>
  )   
}
export default CalendarImplementation;
