import { areIntervalsOverlapping } from "date-fns";

export const filterByAvailable = (
  allDesks,
  employeeSearch,
  available,
  start,
  end
) => {
  return allDesks.filter((item) => {
    if (employeeSearch.length === 0) {
      if (available === null) {
        return true;
      } else if (item.available && available && !item.category?.unavailable) {
        return true;
      } else if (!item.available && !available) {
        return true;
      }
      return false;
    }

    const specificUser = item.reservations.find((info) => {
      const newGuy = getSpecificUser(info, start, end);
      if (
        info.startDate === newGuy.startDate &&
        info.endDate === newGuy.endDate
      ) {
        return true;
      }
      return false;
    });

    if (
      `${specificUser?.employee?.firstName} ${specificUser?.employee?.surname}`
        .toLowerCase()
        .includes(employeeSearch.toLowerCase())
    ) {
      return true;
    }
  });
};

export const getSpecificUser = (info, start, end) => {
  if (start && end) {
    const start1 = start?.split("T");
    const end1 = end?.split("T");
    const start2 = `${start1[0]}T00:00:00`;
    const end2 = `${end1[0]}T00:00:00`;

    const flag = areIntervalsOverlapping(
      { start: new Date(info.startDate), end: new Date(info.endDate) },
      { start: new Date(start2), end: new Date(end2) },
      { inclusive: true }
    );
    if (flag) {
      return { startDate: info.startDate, endDate: info.endDate };
    }
    return {};
  }
  return {};
};
