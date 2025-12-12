import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navigation from "./Navigation";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#030303] relative overflow-hidden">
      <Navigation isDashboard={true} />
      <div className="relative z-10 flex">
        <Sidebar />
          <main className="flex-1 ml-64 p-8 pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

