import axios from "@/lib/axiosInstance";

export interface Category {
  id: number;
  name: string;
  image: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  image: File;
  icon: File; 
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
      
      
        formData.append("image", data.image);

        formData.append("icon", data.icon);

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

  // Update an existing category
  updateCategory: async (id: number, data: CreateCategoryData): Promise<Category> => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      
      
        formData.append("image", data.image);

        formData.append("icon", data.icon);

      const response = await axios.put(`/category/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  //delete Category
  deleteCategory: async (id: number): Promise<void> => {
    try {
      await axios.delete(`/category/delete/${id}`);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};
