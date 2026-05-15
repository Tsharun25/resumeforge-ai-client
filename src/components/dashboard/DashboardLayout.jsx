import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Sidebar />

      <section className="lg:pl-72">
        <Topbar />

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
          <Outlet />
        </div>
      </section>
    </main>
  );
}