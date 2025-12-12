import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navigation from "./Navigation";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#030303] relative overflow-hidden">
      {/* Pastel Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#93c5fd]/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#fed7aa]/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-[#a7f3d0]/5 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      <Navigation isDashboard={true} />
      <div className="relative z-10 flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 pt-16 rounded-tl-[1.5rem] bg-[#030303]/80 backdrop-blur-md">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

