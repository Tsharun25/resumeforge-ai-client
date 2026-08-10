/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BriefcaseBusiness,
  Crown,
  FileText,
  LayoutDashboard,
  Plus,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const baseNavItems = [
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
    label: "Job Application Studio",
    path: "/dashboard/create-resume",
    icon: Plus,
  },
  {
    label: "Cover Letter AI",
    path: "/dashboard/cover-letter",
    icon: Sparkles,
  },
  {
    label: "Freelancer Toolkit",
    path: "/dashboard/freelancer-toolkit",
    icon: BriefcaseBusiness,
  },
  {
    label: "Opportunity Planner",
    path: "/dashboard/idea-radar",
    icon: Sparkles,
  },
  {
    label: "Trend Radar",
    path: "/dashboard/trending-advice",
    icon: TrendingUp,
  },
  {
    label: "Billing",
    path: "/dashboard/billing",
    icon: Crown,
  },
];

const adminNavItems = [
  {
    label: "Admin Payments",
    path: "/dashboard/admin/payments",
    icon: Shield,
  },
];

export const getNavItems = (currentUser) => {
  const user =
    currentUser ??
    JSON.parse(localStorage.getItem("resumeforge_user") || "null");

  if (user?.role === "admin") {
    return [...baseNavItems, ...adminNavItems];
  }

  return baseNavItems;
};

export default function Sidebar() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("resumeforge_user") || "null"),
  );
  const navItems = getNavItems(user);

  useEffect(() => {
    const syncUser = () => {
      setUser(
        JSON.parse(localStorage.getItem("resumeforge_user") || "null"),
      );
    };

    window.addEventListener("careerpilot-user-updated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("careerpilot-user-updated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:flex-col">
      <Brand />

      <nav className="mt-8 flex-1 space-y-2">
        {navItems.map((item) => (
          <SidebarLink key={item.path} item={item} />
        ))}
      </nav>

      <div className="rounded-3xl bg-indigo-50 p-5">
        <p className="text-sm font-bold text-slate-500">AI Credits</p>
        <p className="mt-1 text-2xl font-black text-slate-950">
          {user?.aiCredits ?? 0}
        </p>
        <p className="text-sm font-semibold text-slate-500">credits left</p>

        <NavLink
          to="/dashboard/billing"
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-black text-white hover:bg-indigo-700"
        >
          <Crown size={17} />
          Upgrade Plan
        </NavLink>
      </div>
    </aside>
  );
}

export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Sparkles size={28} />
      </div>

      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-950">
          CareerPilot AI
        </h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          AI Career Platform
        </p>
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
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
          isActive
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
        }`
      }
    >
      <Icon size={19} />
      {item.label}
    </NavLink>
  );
}
