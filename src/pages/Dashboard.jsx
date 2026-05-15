import {
  FileText,
  LayoutDashboard,
  Plus,
  Sparkles,
  Download,
  Crown,
} from "lucide-react";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 hidden h-full w-72 border-r border-slate-200 bg-white p-6 lg:block">
        <div className="flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <Sparkles size={22} />
          </div>
          <span className="text-xl font-black text-slate-950">
            ResumeForge AI
          </span>
        </div>

        <nav className="mt-10 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={FileText} label="My Resumes" />
          <SidebarItem icon={Plus} label="Create Resume" />
          <SidebarItem icon={Sparkles} label="Cover Letter AI" />
          <SidebarItem icon={Crown} label="Subscription" />
        </nav>
      </aside>

      <section className="lg:pl-72">
        <header className="border-b border-slate-200 bg-white px-6 py-5">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-950">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage resumes, generate AI content, and export PDFs.
              </p>
            </div>

            <button className="hidden rounded-full bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 sm:inline-flex">
              Create Resume
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid gap-5 md:grid-cols-3">
            <MetricCard title="Total Resumes" value="3" icon={FileText} />
            <MetricCard title="AI Generations" value="18" icon={Sparkles} />
            <MetricCard title="PDF Exports" value="7" icon={Download} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Recent Resumes
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your latest resume projects.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <ResumeRow
                  title="MERN Stack Developer Resume"
                  status="Ready"
                  date="Today"
                />
                <ResumeRow
                  title="Frontend Developer Resume"
                  status="Draft"
                  date="Yesterday"
                />
                <ResumeRow
                  title="Freelance Web Developer Resume"
                  status="Ready"
                  date="May 2026"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-100">
              <Crown size={34} />
              <h2 className="mt-5 text-2xl font-black">Upgrade to Pro</h2>
              <p className="mt-3 text-sm leading-6 text-indigo-100">
                Unlimited AI resumes, premium templates, cover letters, and PDF
                exports.
              </p>
              <button className="mt-6 w-full rounded-2xl bg-white px-5 py-3 text-sm font-black text-indigo-600">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SidebarItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
      }`}
    >
      <Icon size={19} />
      {label}
    </button>
  );
}

function MetricCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <h3 className="mt-2 text-4xl font-black text-slate-950">{value}</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function ResumeRow({ title, status, date }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div>
        <h3 className="font-black text-slate-950">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{date}</p>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-xs font-black ${
          status === "Ready"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        {status}
      </span>
    </div>
  );
}