// utils/imageUtils.ts

/**
 * Converts a relative image path to an absolute URL
 * @param imagePath - The image path (relative or absolute)
 * @returns Absolute URL for the image
 */
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // If already absolute URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Get API URL and convert to base URL for static files
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const baseUrl = apiUrl.replace("/api", ""); // Remove /api for static files
  
  // Ensure path starts with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${baseUrl}${normalizedPath}`;
};

/**
 * Converts multiple image paths to absolute URLs
 * @param imagePaths - Array of image paths
 * @returns Array of absolute URLs
 */
export const getImageUrls = (imagePaths: string[]): string[] => {
  return imagePaths.map(getImageUrl);
};

/**
 * Creates a File object from an image URL for form handling
 * @param imageUrl - The image URL
 * @param fileName - Optional filename (will extract from URL if not provided)
 * @returns Object with file and preview URL
 */
export const createImageFileFromUrl = (imageUrl: string, fileName?: string): { file: File; preview: string } => {
  const extractedFileName = fileName || imageUrl.split("/").pop() || "image.jpg";
  const file = new File([""], extractedFileName, { type: "image/jpeg" });
  
  return {
    file: file,
    preview: getImageUrl(imageUrl),
  };
};

/**
 * Converts API image data to form-compatible format
 * @param images - Array of image paths from API
 * @returns Array of objects with file and preview
 */
export const convertApiImagesToFormImages = (images: string[]): { file: File; preview: string }[] => {
  return images.map(imagePath => createImageFileFromUrl(imagePath));
};

/**
 * Gets the first image URL from an array, with fallback
 * @param images - Array of image paths
 * @param fallback - Fallback image URL
 * @returns First image URL or fallback
 */
export const getFirstImageUrl = (images: string[], fallback: string = '/placeholder-image.jpg'): string => {
  if (!images || images.length === 0) {
    return fallback;
  }
  return getImageUrl(images[0]);
};

/**
 * Validates if an image URL is accessible
 * @param imageUrl - The image URL to validate
 * @returns Promise<boolean> - True if image is accessible
 */
export const validateImageUrl = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};