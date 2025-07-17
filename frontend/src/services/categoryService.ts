import axios from "@/lib/axiosInstance";

export interface Category {
  id: number;
  name: string;
  description?: string;
  image: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: File;
  icon?: File;
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

  // Get category by ID
  getCategoryById: async (id: number): Promise<Category> => {
    try {
      const response = await axios.get(`/category/get/${id}`);
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

      if (data.description) {
        formData.append("description", data.description);
      }

      if (data.image) {
        formData.append("image", data.image);
      }

      if (data.icon) {
        formData.append("icon", data.icon);
      }

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
  updateCategory: async (
    id: number,
    data: CreateCategoryData
  ): Promise<Category> => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);

      if (data.description) {
        formData.append("description", data.description);
      }

      // Only append image if it exists (user uploaded new image)
      if (data.image) {
        formData.append("image", data.image);
      }

      // Only append icon if it exists (user uploaded new icon)
      if (data.icon) {
        formData.append("icon", data.icon);
      }

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

  // Delete Category
  deleteCategory: async (id: number): Promise<void> => {
    try {
      await axios.delete(`/category/delete/${id}`);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};
