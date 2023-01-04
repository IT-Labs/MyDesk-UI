export const filterEmployees = (employees, user) => {
  return employees.filter(
    ({ email }) => email !== user.preferred_username ?? user.email
  );
};
