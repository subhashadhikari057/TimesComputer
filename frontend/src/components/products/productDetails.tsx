"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById } from "@/api/product";
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { PiWhatsappLogoThin } from "react-icons/pi";
import { getImageUrl } from "@/lib/imageUtils";


// Dummy data structure - easy to replace with API data
// const productData = {
//   id: 1,
//   title: 'Apple MacBook Pro 2024 - M3 Pro | 18GB RAM 512GB SSD | 16.2" XDR Display | 1 Year Warranty',
//   price: "1,49,000",
//   currency: "Rs",
//   rating: 4.5,
//   reviewCount: 200,
//   mainImage: "/placeholder.svg?height=400&width=500",
//   thumbnails: [
//     "/placeholder.svg?height=80&width=80",
//     "/placeholder.svg?height=80&width=80",
//     "/placeholder.svg?height=80&width=80",
//     "/placeholder.svg?height=80&width=80",
//   ],
//   keyFeatures: [
//     { label: "Model", value: "Apple MacBook Pro 2024 (16-inch)" },
//     { label: "Processor", value: "Apple M3 Pro Chip (11-core CPU, 14-core GPU)" },
//     { label: "RAM", value: "18GB Unified Memory" },
//     { label: "Storage", value: "512GB SSD" },
//     { label: "Display", value: "16.2-inch Liquid Retina XDR Display, 3456x2234, 120Hz ProMotion" },
//     { label: "Graphics", value: "Integrated 14-core GPU (Apple Silicon)" },
//     { label: "Warranty", value: "1 Year Limited Warranty (with 90 days tech support)" },
//   ],
//   specifications: [
//     {
//       category: "CPU",
//       description: "Apple M3 Pro Chip (11-core CPU: 5 performance + 6 efficiency cores, up to 4.06 GHz)",
//     },
//     {
//       category: "RAM",
//       description: "18GB Unified Memory (High-bandwidth, low-latency, LPDDR5)",
//     },
//     {
//       category: "Display",
//       description:
//         '16.2" Liquid Retina XDR, 3456 x 2234, 120Hz ProMotion, P3 Wide Color, True Tone, 1,000 nits sustained brightness (1,600 nits peak), Mini-LED, Anti-reflective coating',
//     },
//     {
//       category: "Connections",
//       description:
//         "3x Thunderbolt 4 (USB-C) ports with DisplayPort\n1x HDMI 2.1 port\n1x SDXC card slot\n1x 3.5 mm headphone jack\n1x MagSafe 3 charging port",
//     },
//     {
//       category: "Networking",
//       description: "Wi-Fi 6E (802.11ax), Bluetooth 5.3",
//     },
//     {
//       category: "Storage",
//       description: "512GB SSD (superfast NVMe-based storage)",
//     },
//     {
//       category: "Size: Height x Width x Depth",
//       description: "Height: 16.8 mm (0.66 in.)\nWidth: 355.7 mm (14.01 in.)\nDepth: 248.1 mm (9.77 in.)",
//     },
//     {
//       category: "Battery",
//       description: "100Wh lithium-polymer battery, up to 22 hours Apple TV app movie playback",
//     },
//     {
//       category: "Weight",
//       description: "2.14 kg (4.7 lbs.)",
//     },
//     {
//       category: "Audio",
//       description:
//         "6-speaker sound system with force-cancelling woofers\nSpatial Audio support with Dolby Atmos\nStudio-quality three-mic array",
//     },
//   ],
// }

export default function ProductDetail() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (err) {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div>No product found.</div>;

  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState("specifications")

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : index < rating
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-gray-300"
          }`}
      />
    ))
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Thumbnail Images */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
            {product.thumbnails.map((thumb: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${selectedImage === index ? "border-blue-500" : "border-gray-200"
                  }`}
              >
                <Image
                  src={thumb ? getImageUrl(thumb) : "/placeholder.svg"}
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
              src={product.mainImage ? getImageUrl(product.mainImage) : "/placeholder.svg"}
              alt={product.title}
              className="max-w-full max-h-96 object-contain"
              height={551.72}
              width={688.28}
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="lg:col-span-5 order-3 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">{product.name}</h1>

            <div className="mb-6">
              <span className="text-sm text-gray-600">Price: </span>
              <span className="text-2xl font-bold text-blue-600">
                Rs {product.price ? product.price.toLocaleString('en-IN') : "Price not available"}
              </span>
            </div>

            <Button className="w-full bg-primary text-white py-3 mb-4">Buy in bulk</Button>
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
              {product.keyFeatures.map((feature: any, index: number) => (
                <div key={index} className="flex">
                  <span className="font-medium text-gray-700 min-w-24">{feature.label}:</span>
                  <span className="text-gray-600 ml-2">{feature.value}</span>
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
                      {product.specifications.map((spec: any, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-6 py-4 font-medium text-gray-900 w-1/4 align-top">{spec.category}</td>
                          <td className="px-6 py-4 text-gray-700 whitespace-pre-line">{spec.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "description" && (
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700">
                  The Apple MacBook Pro 2024 with M3 Pro chip delivers exceptional performance for professional
                  workflows. With its advanced architecture and unified memory, this laptop handles demanding tasks with
                  ease while maintaining excellent battery life.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
