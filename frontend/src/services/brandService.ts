import axios from "@/lib/axiosInstance";

export interface Brand {
  id: number;
  name: string;
  image: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandData {
  name: string;
  image: File;
  icon: File;
}

export const brandService = {
  // Get all brands
  getAllBrands: async (): Promise<Brand[]> => {
    try {
      const response = await axios.get("/brand");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching brands:", error);
      throw error;
    }
  },

  // Create a new brand
  createBrand: async (data: CreateBrandData): Promise<Brand> => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      
      
        formData.append("image", data.image);

         formData.append("icon", data.icon);


      const response = await axios.post("/brand", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error creating brand:", error);
      throw error;
    }
  },

  // Update an existing brand
  updateBrand: async (id: number, data: CreateBrandData): Promise<Brand> => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("image", data.image);
      formData.append("icon", data.icon);

      const response = await axios.put(`/brand/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error updating brand:", error);
      throw error;
    }
  },

  // Delete a brand
  deleteBrand: async (id: number): Promise<void> => {   
    try {
      await axios.delete(`/brand/delete/${id}`);
    } catch (error) {
      console.error("Error deleting brand:", error);
      throw error;
    }
  }
};
