import { LogOut, Menu } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("resumeforge_user") || "null");
  const displayName = user?.fullName || user?.name || user?.email || "User";

  const handleLogout = () => {
    localStorage.removeItem("resumeforge_token");
    localStorage.removeItem("resumeforge_user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex h-[86px] items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <h1 className="hidden text-2xl font-black text-slate-950 md:block">
              Welcome back, {displayName}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 shadow-sm">
              {user?.plan || "Free"} Plan
            </span>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white shadow-md">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
