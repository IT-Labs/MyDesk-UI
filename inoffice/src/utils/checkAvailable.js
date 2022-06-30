import { areIntervalsOverlapping } from "date-fns";

export const findAvailable = ({ startDate, endDate }, start, end) => {
  const start1 = start.split("T");
  const end1 = end.split("T");
  const start2 = `${start1[0]}T00:00:00`;
  const end2 = `${end1[0]}T00:00:00`;

  const flag = areIntervalsOverlapping(
    { start: new Date(startDate), end: new Date(endDate) },
    { start: new Date(start2), end: new Date(end2) },
    { inclusive: true }
  );

  return !flag;
};

export const checkAvailable = (res, start, end) => {
  let isAvailable = true;

  if (res.length > 0 && start && end) {
    try {
      res.forEach((item) => {
        const availability = findAvailable(item, start, end);
        if (!availability) {
          isAvailable = false;
          throw "";
        }
      });
    } catch (msg) {}
    return isAvailable;
  } else {
    return true;
  }
  // return "#f37076" : "#69e28d",
};
