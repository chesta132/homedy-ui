import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

/**
 * Wraps all /dashboard/* routes with the fixed sidebar and topbar.
 * The <Outlet /> renders the active child route.
 */
export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-base">
      <Sidebar />
      <Topbar />
      <main className="pt-14 lg:ml-56">
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
