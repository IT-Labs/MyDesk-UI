import moment from "moment";
import { v4 as uuid } from "uuid";

export const sortByOldest = (reservations) => {
  const res = [...reservations];
  return res
    .sort((a, b) => {
      const date1 = new Date(a.startDate).getTime();
      const date2 = new Date(b.startDate).getTime();

      return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
    })
    .map((item, id) => {
      return {
        ...item,
        key: uuid(),
        date: `${moment(item.startDate).format("DD/MM/YYYY")} - ${moment(
          item.endDate
        ).format("DD/MM/YYYY")}`,
        entity: `Desk [${item.deskIndex}]`,
      };
    });
};
