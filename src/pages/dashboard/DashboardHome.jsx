import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, FileText, Loader2, Plus, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function DashboardHome() {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/resumes");

      setResumes(data.resumes || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <Loader2 className="animate-spin text-indigo-600" size={22} />
          <span className="font-bold text-slate-700">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const recentResumes = resumes.slice(0, 3);

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard title="Total Resumes" value={resumes.length} icon={FileText} />
        <MetricCard title="AI Generations" value="Demo" icon={Sparkles} />
        <MetricCard title="PDF Exports" value="Ready" icon={Download} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Recent Resumes
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your latest saved resume projects.
              </p>
            </div>

            <Link
              to="/dashboard/create-resume"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white"
            >
              <Plus size={18} />
              New Resume
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {recentResumes.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <h3 className="text-xl font-black text-slate-950">
                  No resumes yet
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Create and save your first AI-powered resume.
                </p>
              </div>
            ) : (
              recentResumes.map((resume) => (
                <ResumeRow key={resume._id} resume={resume} />
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-100">
          <Sparkles size={34} />
          <h2 className="mt-5 text-2xl font-black">AI Resume Builder</h2>
          <p className="mt-3 text-sm leading-6 text-indigo-100">
            Generate resume summaries, skills, project descriptions and export
            polished PDFs from one dashboard.
          </p>

          <Link
            to="/dashboard/create-resume"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-black text-indigo-600"
          >
            Start Building
          </Link>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
            {value}
          </h3>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function ResumeRow({ resume }) {
  return (
    <Link
      to={`/dashboard/create-resume?id=${resume._id}`}
      className="block rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-indigo-200 hover:bg-indigo-50"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h3 className="truncate font-black text-slate-950">
            {resume.title || "Untitled Resume"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {resume.fullName || "No name"} • {resume.template || "classic"}
          </p>
        </div>

        <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
          Saved
        </span>
      </div>
    </Link>
  );
}