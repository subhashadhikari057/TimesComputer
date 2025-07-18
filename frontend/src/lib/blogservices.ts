// app/services/blogService.ts
export const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs", {
        next: { revalidate: 60 }, // Optional for ISR
      });
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    } catch (error) {
      console.error("API Error:", error);
      return { data: [] }; // Fallback if API fails
    }
  };
  