"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { PiWhatsappLogoThin } from "react-icons/pi";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { getProductBySlug } from "@/api/product";
import { Product } from "../../../../../types/product";
import Reccomendedproducts from "@/components/products/reccomendedproducts";
import { getImageUrl } from "@/lib/imageUtils";
import axios from "@/lib/axiosInstance";

export default function ProductDetails() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [productData, setProductData] = useState<Product>({});
  const [loading, setLoading] = useState(true);
  const { slug } = useParams<{ slug: string }>();

  const productId = productData.id;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await getProductBySlug(slug);
        setProductData(data);
        console.log(data);
        toast.success("Product loaded successfully.");
      } catch (error) {
        toast.error("Failed to fetch productData.");
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("specifications");

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-2 p-6 bg-white">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!productData || Object.keys(productData).length === 0) {
    return (
      <div className="max-w-7xl mx-auto mt-2 p-6 bg-white">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleBuyInBulk = async () => {
    try {
      const productId = productData.id;

      const response = await axios.post(`/inquiry/post/${productId}`);

      const whatsappURL = response.data.whatsappURL || response.data;

      const whatsappAppURL = whatsappURL.replace(/^https:\/\/wa\.me/, 'whatsapp://send');

      const newWindow = window.open(whatsappAppURL, '_blank');

      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.open(whatsappURL, '_blank');
      }
    } catch (error) {
      toast.error("Failed to place bulk order.");
      console.error("Failed to get WhatsApp URL", error);
    }
  };


  return (
    <div className="max-w-7xl mx-auto mt-2 p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Thumbnail Images */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
            {productData?.images?.map((thumb: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${selectedImage === index ? "border-blue-500" : "border-gray-200"
                  }`}
              >
                <Image
                  src={thumb ? getImageUrl(thumb) : "/products/Frame_68.png"}
                  alt={`Product view ${index + 1}`}
                  className="w-full h-full object-cover"
                  height={129.21}
                  width={149.31}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Product Image */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
            <Image
              src={productData?.images?.[selectedImage] ? getImageUrl(productData.images[selectedImage]) : "/products/Frame_68.png"}
              alt={productData?.name ?? "image not found"}
              className="max-w-full max-h-96 object-contain"
              height={551.72}
              width={688.28}
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="lg:col-span-5 order-3 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              {productData?.name}
            </h1>

            {/* rating section */}
            {/* 
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {renderStars(productData.rating)}
              </div>
              <span className="text-sm text-gray-600">
                {productData.rating} ({productData.reviewCount})
              </span>
            </div> */}

            <div className="mb-6">
              <span className="text-sm text-gray-600">Price: </span>
              <span className="text-2xl font-bold text-blue-600">
                Rs {productData?.price ? productData.price.toLocaleString('en-IN') : "Price not available"}
              </span>
            </div>
            {(productData?.colors)?.map((x, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedColor(x?.color?.hexCode)}
                className={`mb-4 mx-2 w-5 h-5 rounded-full border-2 cursor-pointer transition-transform duration-200 ease-in-out
      ${selectedColor === x.color.hexCode ? "border-black scale-110" : "border-gray-300"}
    `}
                style={{ backgroundColor: x.color.hexCode }}
                aria-label={`Select color ${x.color.hexCode}`}
                title={x.color.hexCode}
              />
            ))}


            <Button className="w-full bg-primary text-white py-3 mb-4" onClick={handleBuyInBulk}>
              Buy in bulk
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>You will be forwarded to a</span>
              <PiWhatsappLogoThin className="w-4 h-4" />
              <span>whatsapp chat with the selected product</span>
            </div>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Features</h3>
            <div>
              {Object.entries(productData?.specs ?? {})
                .slice(0, 5)
                .map(([key, value], index) => (
                  <div key={index} className="flex">
                    <span className="font-medium text-gray-700 min-w-24">
                      {key}:
                    </span>
                    <span className="text-gray-600 ml-2">{value}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Specifications */}
      <div className="mt-12">
        <div>
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("specifications")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "specifications"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab("description")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "description"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              Description
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === "specifications" && (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(productData?.specs ?? {}).map(
                        ([category, description], index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }
                          >
                            <td className="px-6 py-4 font-medium text-gray-900 w-1/4 align-top">
                              {category}
                            </td>
                            <td className="px-6 py-4 text-gray-700 whitespace-pre-line">
                              {description}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "description" && (
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700">{productData?.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recommended Products */}
      <Reccomendedproducts
        category={productData?.category}
        currentSlug={productData?.slug}
      />
    </div>
  );
}
