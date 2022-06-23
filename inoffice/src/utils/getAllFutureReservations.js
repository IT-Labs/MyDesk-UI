import moment from "moment";

export const getAllFutureReservations = (res) => {
  return res
    .filter(
      (item) =>
        moment(item.startDate).isAfter(moment()) &&
        moment(item.endDate).isAfter(moment())
    )
    .sort((a, b) => {
      const date1 = new Date(a.startDate).getTime();
      const date2 = new Date(b.startDate).getTime();

      return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
    });
};
