import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL;
console.log(baseURL);
const apiClient = axios.create({
  baseURL: baseURL,
});

export default apiClient;
