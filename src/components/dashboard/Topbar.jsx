import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Brand, navItems, SidebarLink } from "./Sidebar";
import useAuth from "../../hooks/useAuth";

export default function Topbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();
  const handleLogout = () => {
    localStorage.removeItem("resumeforge_token");
    localStorage.removeItem("resumeforge_user");

    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="hidden lg:block">
            <h1 className="text-2xl font-black text-slate-950">
              Welcome back, {user.fullName} 👋
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Build AI-powered resumes and grow your career.
            </p>
          </div>

          <div className="lg:hidden">
            <Brand />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 sm:block">
              Free Plan
            </div>

            <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white sm:flex">
              {user.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:flex"
            >
              <LogOut size={18} />
              Logout
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 lg:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <div className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <Brand />

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-950">
                {user.fullName}
              </p>
              <p className="text-xs font-medium text-slate-500">Free Plan</p>
            </div>

            <nav className="mt-8 space-y-2">
              {navItems.map((item) => (
                <SidebarLink
                  key={item.label}
                  item={item}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 text-sm font-black text-red-600"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
