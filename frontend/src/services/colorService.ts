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
      const response = await axios.get("/colors");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching colors:", error);
      throw error;
    }
  },

  // Create a new color
  createColor: async (data: CreateColorData): Promise<Color> => {
    try {
      const response = await axios.post("/colors", data, {
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

  // Update an existing color
  updateColor: async (id: number, data: CreateColorData): Promise<Color> => {
    try {
      const response = await axios.put(`/colors/update/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error updating color:", error);
      throw error;
    }
  },

  // Delete a color
  deleteColor: async (id: number): Promise<void> => {   
    try {
      await axios.delete(`/colors/delete/${id}`);
    } catch (error) {
      console.error("Error deleting color:", error);
      throw error;
    }
  }
};
