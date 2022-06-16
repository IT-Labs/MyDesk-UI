import { Select, Tooltip } from "antd";
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
      <p style={{ fontSize: "1.125rem" }}>My reservations</p>
      <Tooltip title="Select which office you want to filter by">
        <Select
          showSearch
          placeholder="Select office"
          defaultValue={"Select office"}
          style={{ width: 200 }}
          onChange={handleChange}
        >
          <Select.Option key={1} value="">
            All offices
          </Select.Option>
          {data?.map((item) => {
            return (
              <Select.Option key={item.id} value={item.name}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      </Tooltip>
    </div>
  );
};
