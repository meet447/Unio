import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navigation from "./Navigation";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

