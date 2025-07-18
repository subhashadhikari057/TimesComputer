import axiosLib from "axios";
import { toast } from "sonner";

const axios = axiosLib.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axios;

const fetchData = async (url: string, method: string, data?: any) => {
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

export const apiRequest = async (method: string, url: string, data?: any) => {
  try {
    return await fetchData(url, method, data);
  } catch (error: any) {
    if (error.response.status === 401) {
     await axios.post("/auth/refresh/renewtoken");
    return await fetchData(url, method, data);
    } else {
      throw error;
    }
    
  
  }
};
