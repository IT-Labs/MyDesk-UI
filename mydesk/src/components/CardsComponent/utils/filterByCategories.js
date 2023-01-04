export const filterByCategories = (props, desksNeedToFilter) => {
  return desksNeedToFilter.filter(({ category }) => {
    if (
      !props.categories.nearWindow &&
      !props.categories.doubleMonitor &&
      !props.categories.singleMonitor
    )
      return true;
    if (
      category &&
      props.categories.nearWindow &&
      !props.categories.doubleMonitor &&
      !props.categories.singleMonitor &&
      category.nearWindow
    ) {
      return true;
    }
    if (
      category &&
      props.categories.nearWindow &&
      props.categories.doubleMonitor &&
      !props.categories.singleMonitor &&
      category.nearWindow &&
      category.doubleMonitor
    ) {
      return true;
    }
    if (
      category &&
      props.categories.nearWindow &&
      !props.categories.doubleMonitor &&
      props.categories.singleMonitor &&
      category.nearWindow &&
      category.singleMonitor
    ) {
      return true;
    }
    if (
      category &&
      !props.categories.nearWindow &&
      !props.categories.doubleMonitor &&
      props.categories.singleMonitor &&
      category.singleMonitor
    ) {
      return true;
    }
    if (
      category &&
      !props.categories.nearWindow &&
      props.categories.doubleMonitor &&
      !props.categories.singleMonitor &&
      category.doubleMonitor
    )
      return true;
  });
};
