import axios from "@/lib/axiosInstance";

// GET /init → fetch initial data
export async function getInitData() {
    const response = await axios.get("/init");
    return response.data;
} 