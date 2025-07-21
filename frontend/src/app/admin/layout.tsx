import { AuthProvider } from "@/context/authContext";
import { type ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
