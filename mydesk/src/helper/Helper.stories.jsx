export default {
  title: "Helper Functions",
};

export const Api = () => {
  const axios = "think of this as importing axios";
  const helper = () => {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("msal.idtoken");
        if (token) {
          config.headers["Authorization"] = "Bearer " + token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    //export default instance;
  };
  return (
    <>
      <p>
        The Api helper function reduces the amount of text we have to provide to
        get to our api. Its axios based so we create an instance based request
        with all the headers like authorization we would typically need
      </p>
    </>
  );
};

export const PrivateRoute = () => {
  return (
    <>
      <p>
        The private route is a custom component helper function that checks if
        the user has access to the specific route, you setup roles in azure
        enterprise and need to give your users either a employee or admin role.
        If you do not have the role requiered it will return you to the home
        page and you will get an error.
      </p>
    </>
  );
};
