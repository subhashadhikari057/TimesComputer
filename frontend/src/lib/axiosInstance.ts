import axiosLib from "axios";

const axios = axiosLib.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export default axios;

const fetchData = async (url: string, method: string, data?: unknown) => {
  try {
    const response = await axios({
      url,
      method,
      data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const apiRequest = async (method: string, url: string, data?: unknown) => {
  try {
    return await fetchData(url, method, data);
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number } };
      if (axiosError.response.status === 401) {
        await axios.post("/auth/refresh/renewtoken");
        return await fetchData(url, method, data);
      }
    }
    throw error;
  }
};
