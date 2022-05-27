import { Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setOfficeSelect } from "../../redux/MyReservationsSelect/MyReservationsSelect";

export const CardTitle = ({ data }) => {
  const dispatch = useDispatch();
  const handleChange = (value) => {
    dispatch(setOfficeSelect(value));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p>My reservations</p>
      <Select
        showSearch
        placeholder="Select office"
        defaultValue={""}
        style={{ width: 200 }}
        onChange={handleChange}
      >
        <Select.Option key={0} value="">
          All offices
        </Select.Option>
        {data?.map((item, id) => {
          return (
            <Select.Option key={id + 1} value={item.name}>
              {item.name}
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};
