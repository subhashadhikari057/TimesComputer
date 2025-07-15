import axios from "@/lib/axiosInstance";

export interface Category {
  id: number;
  name: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  images: File[];
}

export const categoryService = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await axios.get("/category/get");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Create a new category
  createCategory: async (data: CreateCategoryData): Promise<Category> => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      
      // Append all images
      data.images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await axios.post("/category/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },
};
