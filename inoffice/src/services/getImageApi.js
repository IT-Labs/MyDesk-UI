export const getImageApi = async (mail) => {
  return await fetch(
    `https://graph.microsoft.com/v1.0/users/${mail}/photo/$value`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      responseType: "blob",
    }
  );
};
