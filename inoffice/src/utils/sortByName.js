export const sortByName = (data) => {
  return data.sort((a, b) => {
    return a.name < b.name ? -1 : 1;
  });
};
