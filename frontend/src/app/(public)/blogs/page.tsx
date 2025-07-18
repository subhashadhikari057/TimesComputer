import HeroSection from "@/components/blog/blogHeroSection";

import BlogCard from "@/components/blog/blogCard";
// import { fetchBlogs } from "../services/blogService"; // 🔁 Uncomment this when backend is ready

const dummyBlogs = [
  {
    id: '1',
    title: "Best Laptops for Students in 2024?",
    content: "Top student-friendly laptops that balance performance, portability, and price.",
    images: ["/blog1.jpg"],
  },
  {
    id: '2',
    title: "Gaming Laptops Under NPR 1,00,000",
    content: "Top student-friendly laptops that balance performance, portability, and price.",
    images: ["/blog2.jpg"],
  },
  {
    id: '4',
    title: "How to Keep Your Laptop Fast?",
    content: "Top student-friendly laptops that balance performance, portability, and price.",
    images: ["/blog3.jpg"],
  },
  {
    id: '5',
    title: "Why Buy from Times Computer Automation?",
    content: "Top student-friendly laptops that balance performance, portability, and price.",
    images: ["/blog4.jpg"],
  },
  // Add more for 5 rows = 20 cards if you want
];

export default async function BlogsPage() {
  // const blogData = await fetchBlogs(); // 🔁 Use this when real API is connected

  const blogData = { data: dummyBlogs }; // 💾 For now use dummy data

  return (
    <div>
      <HeroSection />

    
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6"> Latest Blogs</h2>
<div className="flex space-x-4 space-y-4 ">
              {blogData.data.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              image={blog.images[0] || "/default.jpg"}
              title={blog.title}
              description={blog.content.slice(0, 100) + "..."}
            />
          ))}
        </div>
      </div>
          <div className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-2xl font-bold mb-6"> Popular Blogs</h2>
<div className="flex space-x-3 space-y-4 ">
              {blogData.data.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              image={blog.images[0] || "/default.jpg"}
              title={blog.title}
              description={blog.content.slice(0, 100) + "..."}
            />
          ))}
        </div>
      </div>
      </div>
  );
}