import axios from "@/lib/axiosInstance";
import { toast } from "sonner";

export interface Category {
  id: number;
  name: string;
  images: string[];
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

      const data = await response.data.data;
      console.log("Fetched categories:", data);
      return data;
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
      formData.append("image", data.image);

      // Append all Icon
      formData.append("icon", data.icon);

      const response = await axios.post("/category/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Category created successfully!");

      return response.data.data;
    } catch (error) {
      toast.error("Error creating category");
      throw error; // Ensure the error is propagated
    }
  },
};
