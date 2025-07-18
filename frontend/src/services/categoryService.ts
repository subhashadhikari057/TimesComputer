import axios, { apiRequest } from "@/lib/axiosInstance";

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

export interface UpdateCategoryData {
  name: string;
  image?: File; 
  icon?: File;  
}

export const categoryService = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await axios.get("/category");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (id: number): Promise<Category> => {
    try {
      const response = await axios.get(`/category/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching category:", error);
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

      const response = await apiRequest("POST", "/category", formData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Update an existing category
  updateCategory: async (
    id: number,
    data: UpdateCategoryData
  ): Promise<Category> => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);

      // Only append image if user uploaded a new one
      if (data.image) {
        formData.append("image", data.image);
      }

      // Only append icon if user uploaded a new one
      if (data.icon) {
        formData.append("icon", data.icon);
      }

      const response = await apiRequest("PUT", `/category/update/${id}`, formData);
      return response.data.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  // Delete Category
  deleteCategory: async (id: number): Promise<void> => {
    try {
      await apiRequest("DELETE", `/category/delete/${id}`);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },

  // Bulk delete categories
  bulkDeleteCategories: async (ids: number[]): Promise<void> => {
    try {
      await apiRequest("DELETE", "/category/bulk-delete", { ids });
    } catch (error) {
      console.error("Error bulk deleting categories:", error);
      throw error;
    }
  },
};