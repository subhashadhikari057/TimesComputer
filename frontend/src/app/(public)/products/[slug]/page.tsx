"use client";
import { useEffect, useState } from "react";
// import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { PiWhatsappLogoThin } from "react-icons/pi";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "@/lib/axiosInstance";

export default function ProductDetails() {
  const [productData, setProductData] = useState<Product>({});
  const { slug } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/product/slug/${slug}`);
        const data = await res.data;
        setProductData(data);
        toast.success("Fetched.");
      } catch (error) {
        toast.error("failed to fetch");
        console.log(error);
      }
    })();
  }, [slug]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("specifications");

  //   const renderStars = (rating: number) => {
  //     return Array.from({ length: 5 }, (_, index) => (
  //       <Star
  //         key={index}
  //         className={`w-4 h-4 ${
  //           index < Math.floor(rating)
  //             ? "fill-yellow-400 text-yellow-400"
  //             : index < rating
  //             ? "fill-yellow-400/50 text-yellow-400"
  //             : "text-gray-300"
  //         }`}
  //       />
  //     ));
  //   };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Thumbnail Images */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
            {productData?.images?.map((thumb, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                  selectedImage === index
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
              >
                <Image
                  src={/*thumb ||*/ "/products/Frame_68.png"}
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
              src={/*productData?.images?.[0] ||*/ "/products/Frame_68.png"}
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
                Rs. {productData?.price}
              </span>
              <span className="text-sm text-gray-500 ml-2">/pcs</span>
            </div>

            <Button className="w-full bg-primary text-white py-3 mb-4">
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
            <div className="space-y-2">
              {Object.entries(productData?.specs ?? {}).slice(0,5).map(([key,value], index) => (
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
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("specifications")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "specifications"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("description")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "description"
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
            </div>

            {activeTab === "description" && (
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-700">
                    {productData?.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
    //   </div>
    // </div>
  );
}
