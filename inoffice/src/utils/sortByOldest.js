import moment from "moment";

export const sortByOldest = (reservations) => {
  return reservations
    .sort((a, b) => {
      const date1 = new Date(a.startDate).getTime();
      const date2 = new Date(b.startDate).getTime();

      return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
    })
    .map((item, id) => {
      return {
        ...item,
        key: id,
        date: `${moment(item.startDate).format("DD/MM/YYYY")} - ${moment(
          item.endDate
        ).format("DD/MM/YYYY")}`,
        entity: `Desk [${item.deskIndex}]`,
      };
    });
};
