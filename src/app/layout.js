import "./globals.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "Stock Market Simulator",
  description: "Virtual trading platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0f111a] text-white font-sans">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
