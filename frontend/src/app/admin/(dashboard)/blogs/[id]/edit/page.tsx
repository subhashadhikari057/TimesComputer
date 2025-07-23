"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import ComponentCard from "@/components/common/ComponentsCard";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import PhotoUpload from "@/components/admin/product/photoUpload";
import DefaultButton from "@/components/form/form-elements/DefaultButton";
import { getBlogById, updateBlog } from "@/api/blog";

// Dynamic import for RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import("@/components/form/form-elements/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] bg-gray-50 rounded border flex items-center justify-center">
        Loading editor...
      </div>
    ),
  }
);

// Define the RichTextEditorHandle type
type RichTextEditorHandle = {
  getContent: () => string;
  setContent: (content: string) => void;
};

interface BlogFormData {
  title: string;
  content: string;
  author: string;
  images: { file: File; preview: string }[];
  slug: string;
  metadata: {
    [key: string]: unknown;
  };
}

const INITIAL_FORM_DATA: BlogFormData = {
  title: "",
  content: "",
  author: "admin",
  images: [],
  slug: "",
  metadata: {},
};

// Function to fetch blog data
const fetchBlog = async (
  id: string
): Promise<BlogFormData & { id: string }> => {
  const response = await getBlogById(Number(id));
  const data = response.data; // Extract data from the response wrapper

  // Map API response to FormData shape
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    author: data.author,
    slug: data.slug,
    metadata: data.metadata,
    images: (data.images || []).map((imagePath: string) => {
      const fileName = imagePath.split("/").pop() || "image.jpg";
      const file = new File([""], fileName, { type: "image/jpeg" });

      // Convert relative path to absolute URL
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      const baseUrl = apiUrl.replace("/api", ""); // Remove /api for static files
      const imageUrl = imagePath.startsWith("http")
        ? imagePath // Already absolute URL
        : `${baseUrl}/${imagePath}`; // Convert relative to absolute

      return {
        file: file,
        preview: imageUrl,
      };
    }),
  };
};

export default function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<BlogFormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metadataInput, setMetadataInput] = useState("");
  const editorRef = useRef<RichTextEditorHandle>(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBlog(id);
        setForm(data);

        // Set metadata input with formatted JSON
        if (data.metadata && Object.keys(data.metadata).length > 0) {
          setMetadataInput(JSON.stringify(data.metadata, null, 2));
        }

        // Set content in editor after it loads
        setTimeout(() => {
          if (editorRef.current && data.content) {
            editorRef.current.setContent(data.content);
          }
        }, 100);
      } catch {
        setError("Failed to load blog data");
        toast.error("Failed to load blog data");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadBlog();
    }
  }, [id]);

  // Function to generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const newForm = {
        ...prev,
        [name]: value,
      };

      // Auto-generate slug when title changes
      if (name === "title" && value) {
        newForm.slug = generateSlug(value);
      }

      return newForm;
    });
  };

  // Get content from Quill editor
  const getEditorContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      setForm((prev) => ({ ...prev, content }));
      return content;
    }
    return form.content;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, { file, preview }],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleMetadataAdd = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      try {
        const parsedMetadata = JSON.parse(metadataInput);
        setForm((prev) => ({ ...prev, metadata: parsedMetadata }));
        toast.success("Metadata updated successfully");
      } catch {
        toast.error("Invalid JSON format");
      }
    }
  };

  const handleCancel = () => {
    router.push("/admin/blogs");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    // Get content from editor before validation
    const content = getEditorContent();

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", content);
      formData.append("author", form.author);
      formData.append("slug", form.slug);
      formData.append("metadata", JSON.stringify(form.metadata));

      // Add all images
      form.images.forEach((img) => formData.append("images", img.file));

      await updateBlog(Number(id), formData);
      toast.success("Blog post updated successfully!");
      router.push("/admin/blogs");
    } catch {
      toast.error("Failed to update blog post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <DefaultButton
            variant="secondary"
            onClick={() => router.push("/admin/blogs")}
            icon={ArrowLeft}
            iconPosition="left"
          >
            Back to Blogs
          </DefaultButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="pb-24">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Edit Blog Post
              </h1>
              <p className="text-gray-600">Update your blog content</p>
            </div>
            <DefaultButton
              variant="secondary"
              onClick={handleCancel}
              icon={ArrowLeft}
              iconPosition="left"
              size="sm"
            >
              Back to Blogs
            </DefaultButton>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
          >
            {/* Main Content Section */}
            <div className="xl:col-span-2 space-y-6">
              {/* Basic Information */}
              <ComponentCard
                title="Post Details"
                desc="Update the basic information of your blog post"
              >
                <div className="grid grid-cols-1 gap-6">
                  <DefaultInput
                    label="Post Title"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="Enter your blog post title"
                    required
                  />

                  <DefaultInput
                    label="Post Slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleFormChange}
                    placeholder="post-slug (auto-generated from title)"
                    required
                    helpText="This will be used in the URL"
                  />

                  <DefaultInput
                    label="Author"
                    name="author"
                    value={form.author}
                    onChange={handleFormChange}
                    placeholder="Enter author name"
                    required
                  />
                </div>
              </ComponentCard>

              {/* Content Editor */}
              <ComponentCard
                title="Post Content"
                desc="Update your blog post content using the rich text editor"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Content *
                  </label>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <RichTextEditor ref={editorRef} key={`blog-editor-${id}`} />
                  </div>
                  <p className="text-sm text-gray-500">
                    Use the toolbar above to format your content with headings,
                    lists, links, and more.
                  </p>
                </div>
              </ComponentCard>

              {/* Metadata */}
              <ComponentCard
                title="Metadata"
                desc="Update additional data in JSON format"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Metadata (JSON Format)
                  </label>
                  <textarea
                    value={metadataInput}
                    onChange={(e) => setMetadataInput(e.target.value)}
                    onKeyDown={handleMetadataAdd}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder={`{
  "tags": ["technology", "web"],
  "category": "tutorial",
  "seoTitle": "Custom SEO Title",
  "description": "Meta description"
}`}
                  />
                  <p className="text-sm text-gray-500">
                    Press Ctrl+Enter to save metadata. Use valid JSON format.
                  </p>

                  {Object.keys(form.metadata).length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Current Metadata:
                      </p>
                      <pre className="text-xs text-gray-600 overflow-x-auto">
                        {JSON.stringify(form.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </ComponentCard>
            </div>

            {/* Sidebar Section */}
            <div className="xl:col-span-1 space-y-6">
              {/* Images */}
              <ComponentCard
                title="Blog Images"
                desc="Update images for your blog post (up to 10 images)"
              >
                <PhotoUpload
                  label="Blog Images"
                  images={form.images.map((img) => img.file)}
                  required={false}
                  imagePreviews={form.images.map((img) => img.preview)}
                  onImageUpload={handleImageUpload}
                  onRemoveImage={removeImage}
                  maxImages={10}
                  maxSizeText="up to 5MB each"
                  acceptedFormats="PNG, JPG, WebP"
                  uploadText="Click to upload blog images"
                />
              </ComponentCard>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Action Card */}
      <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50 sm:w-full sm:max-w-sm">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <DefaultButton
                variant="secondary"
                onClick={handleCancel}
                size="sm"
                className="flex-1 sm:flex-none py-2"
                disabled={isSubmitting}
              >
                <span className="sm:hidden">Cancel</span>
                <span className="hidden sm:inline">Cancel</span>
              </DefaultButton>

              <DefaultButton
                variant="primary"
                onClick={handleSubmit}
                icon={Save}
                iconPosition="left"
                size="sm"
                className="flex-1 sm:flex-none py-2"
                disabled={isSubmitting}
              >
                <span className="sm:hidden">Update</span>
                <span className="hidden sm:inline">Update Post</span>
              </DefaultButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
