export const checkDeskProperty = (desks, id, category) => {
  const newItem = desks.map((item) => {
    if (item.id === id) {
      if (category === "unavailable") {
        return {
          ...item,
          category: {
            ...item.category,
            unavailable: !item.category?.unavailable ? true : false,
          },
        };
      } else if (category === "singleMonitor") {
        return {
          ...item,
          category: {
            ...item.category,
            singleMonitor: !item.category?.singleMonitor ? true : false,
          },
        };
      } else if (category === "dualMonitor") {
        return {
          ...item,
          category: {
            ...item.category,
            doubleMonitor: !item.category?.doubleMonitor ? true : false,
          },
        };
      } else if (category === "nearWindow") {
        return {
          ...item,
          category: {
            ...item.category,
            nearWindow: !item.category?.nearWindow ? true : false,
          },
        };
      }
    }
    return item;
  });
  return newItem;
};
