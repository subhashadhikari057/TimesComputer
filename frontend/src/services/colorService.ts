import axios from "@/lib/axiosInstance";

export interface Color {
  id: number;
  name: string;
  hexCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateColorData {
  name: string;
  hexCode: string;
}

export const colorService = {
  // Get all colors
  getAllColors: async (): Promise<Color[]> => {
    try {
      const response = await axios.get("/color/get");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching colors:", error);
      throw error;
    }
  },

  // Create a new color
  createColor: async (data: CreateColorData): Promise<Color> => {
    try {
      const response = await axios.post("/color/add", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error creating color:", error);
      throw error;
    }
  },
};
