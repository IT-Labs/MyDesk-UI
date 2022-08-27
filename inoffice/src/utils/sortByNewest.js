import moment from "moment";
import { v4 as uuid } from "uuid";
export const sortByNewest = (reservations) => {
  return reservations
    .sort((a, b) => {
      const date1 = new Date(a.startDate).getTime();
      const date2 = new Date(b.startDate).getTime();

      return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
    })
    .map((item) => {
      return {
        ...item,
        key: uuid(),
        date: `${moment(item.startDate).format("DD/MM/YYYY")} - ${moment(
          item.endDate
        ).format("DD/MM/YYYY")}`,
        entity: `Desk [${item.desk.indexForOffice}]`,
      };
    });
};
