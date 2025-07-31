import { Outlet } from "react-router-dom";
import BottomNavigation from "@/components/molecules/BottomNavigation";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;