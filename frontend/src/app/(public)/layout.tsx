import Navbar from "@/components/home/navbar";
export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <>
      <Navbar />
      {children}
      </>
    );
  }
  