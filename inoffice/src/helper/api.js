import axios from "axios";

/* Creating an instance of axios and adding the token to the header. */
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "*",
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
export default instance;
