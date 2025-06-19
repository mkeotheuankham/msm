import axios from "axios";

const createApiClient = (baseURL) => {
  const instance = axios.create({
    baseURL: baseURL || process.env.REACT_APP_API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      "x-hasura-role": "user",
      "x-hasura-user-id": process.env.REACT_APP_DEFAULT_USER_ID,
    },
  });

  // Request interceptor
  instance.interceptors.request.use((config) => {
    // ສາມາດເພີ່ມ headers ເພີ່ມເຕີມຕາມຄວາມຕ້ອງການ
    return config;
  });

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      console.error("API Error:", error);
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createApiClient;
