import moment from "moment";

export const getAllPastReservations = (res) => {
  return res
    .filter(
      (item) =>
        moment(item.startDate).isBefore(moment()) &&
        moment(item.endDate).isBefore(moment())
    )
    .sort((a, b) => {
      const date1 = new Date(a.startDate).getTime();
      const date2 = new Date(b.startDate).getTime();

      return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
    });
};
