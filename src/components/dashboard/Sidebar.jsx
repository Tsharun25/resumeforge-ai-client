import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Sparkles,
  Crown,
} from "lucide-react";

export const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Resumes",
    path: "/dashboard/resumes",
    icon: FileText,
  },
  {
    label: "Create Resume",
    path: "/dashboard/create-resume",
    icon: Plus,
  },
  {
    label: "Cover Letter AI",
    path: "/dashboard/cover-letter",
    icon: Sparkles,
  },
  {
    label: "Billing",
    path: "/dashboard/billing",
    icon: Crown,
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-full w-72 border-r border-slate-200 bg-white p-6 lg:block">
      <Brand />

      <nav className="mt-10 space-y-2">
        {navItems.map((item) => (
          <SidebarLink key={item.label} item={item} />
        ))}
      </nav>
    </aside>
  );
}

export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
        <Sparkles size={22} />
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-950">ResumeForge AI</h2>
        <p className="text-xs font-medium text-slate-500">AI Resume SaaS</p>
      </div>
    </div>
  );
}

export function SidebarLink({ item, onClick }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/dashboard"}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
          isActive
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
        }`
      }
    >
      <Icon size={20} />
      {item.label}
    </NavLink>
  );
}