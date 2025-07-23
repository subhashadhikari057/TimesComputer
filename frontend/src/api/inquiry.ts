import axios from "@/lib/axiosInstance";
import type { InquiryInput } from "@/types/api";

// GET /inquiry → fetch all inquiries
// export async function getAllInquiries() {
//   const response = await axios.get("/inquiry");
//   return response.data;
// }

// // GET /inquiry/:id → fetch a single inquiry
// export async function getInquiryById(id: number) {
//   const response = await axios.get(`/inquiry/${id}`);
//   return response.data;
// }

// POST /inquiry → create a new inquiry
export async function createInquiry(data: InquiryInput) {
  const response = await axios.post("/inquiry", data);
  return response.data;
}

// PATCH /inquiry/:id → update an inquiry
// export async function updateInquiry(id: number, data: Partial<InquiryInput>) {
//   const response = await axios.patch(`/inquiry/${id}`, data);
//   return response.data;
// }

// // DELETE /inquiry/:id → delete an inquiry
// export async function deleteInquiry(id: number) {
//   const response = await axios.delete(`/inquiry/${id}`);
//   return response.data;
// }

// // POST /inquiry/bulk/:id → create a bulk order inquiry
// export async function createBulkInquiry(productId: number, quantity: number, selectedColor: string | null) {
//   const response = await axios.post(`/inquiry/bulk/${productId}`, {
//     quantity,
//     selectedColor
//   });
//   return response.data;
// }
