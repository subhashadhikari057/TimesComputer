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
      const response = await axios.get("/brand/get");
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


      const response = await axios.post("/brand/add", formData, {
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
};
