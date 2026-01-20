import Navbar from "@/components/Navbar/Navbar";

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <main className="min-h-screen ">{children}</main>
    </>
  );
}
