import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Download,
  FileText,
  Loader2,
  Plus,
  Sparkles,
  Wand2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function DashboardHome() {
  const [dashboardData, setDashboardData] = useState({
    user: null,
    stats: {
      totalResumes: 0,
      totalGenerations: 0,
      resumeGenerations: 0,
      coverLetterGenerations: 0,
    },
    recentResumes: [],
    recentDocuments: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/stats/dashboard");

      if (data.user) {
        localStorage.setItem("resumeforge_user", JSON.stringify(data.user));
      }

      setDashboardData({
        user: data.user,
        stats: data.stats,
        recentResumes: data.recentResumes || [],
        recentDocuments: data.recentDocuments || [],
      });
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

  const { user, stats, recentResumes, recentDocuments } = dashboardData;
  const planExpiryText = getPlanExpiryText(user?.planExpiresAt);
  const remainingDays = getRemainingDays(user?.planExpiresAt);

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard
          title="Total Resumes"
          value={stats.totalResumes}
          icon={FileText}
        />

        <MetricCard
          title="AI Generations"
          value={stats.totalGenerations}
          icon={Sparkles}
        />

        <MetricCard title="PDF Export" value="Ready" icon={Download} />
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
              <EmptyState
                title="No resumes yet"
                text="Create and save your first AI-powered resume."
              />
            ) : (
              recentResumes.map((resume) => (
                <ResumeRow key={resume._id} resume={resume} />
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-100">
            <Sparkles size={34} />

            <h2 className="mt-5 text-2xl font-black">CareerPilot AI</h2>

            <p className="mt-3 text-sm leading-6 text-indigo-100">
              Bangladesh-focused AI career platform for resumes, cover letters,
              freelancer profiles, and growth plans.
            </p>

            <Link
              to="/dashboard/create-resume"
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-black text-indigo-600"
            >
              Start Building
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black text-slate-950">AI Usage</h2>

            <div className="mt-5 grid gap-3">
              <UsageRow
                label="Remaining AI Credits"
                value={user?.aiCredits ?? 0}
              />

              <UsageRow
                label="Current Plan"
                value={formatPlanName(user?.plan || "free")}
              />

              <UsageRow
                label="Resume Limit"
                value={`${stats.totalResumes}/${user?.monthlyResumeLimit ?? 1}`}
              />

              <UsageRow
                label="Resume Generations"
                value={stats.resumeGenerations}
              />

              <UsageRow
                label="Cover Letters"
                value={stats.coverLetterGenerations}
              />

              <UsageRow label="Plan Expiry" value={planExpiryText} />
            </div>

            {user?.plan !== "free" && user?.planExpiresAt && (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 ${
                  remainingDays <= 3
                    ? "border-amber-200 bg-amber-50"
                    : "border-indigo-100 bg-indigo-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={20}
                    className={
                      remainingDays <= 3 ? "text-amber-700" : "text-indigo-700"
                    }
                  />

                  <div>
                    <p
                      className={`text-sm font-black ${
                        remainingDays <= 3
                          ? "text-amber-800"
                          : "text-indigo-700"
                      }`}
                    >
                      {remainingDays > 0
                        ? `${remainingDays} day${
                            remainingDays === 1 ? "" : "s"
                          } remaining`
                        : "Plan expires today"}
                    </p>

                    <p
                      className={`mt-1 text-xs font-semibold ${
                        remainingDays <= 3
                          ? "text-amber-700"
                          : "text-indigo-600"
                      }`}
                    >
                      Your {formatPlanName(user?.plan)} plan expires on{" "}
                      {formatDate(user.planExpiresAt)}.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {user?.plan === "free" && (
              <Link
                to="/dashboard/billing"
                className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-600"
              >
                Upgrade Plan
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Wand2 size={22} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-950">
              Recent AI Documents
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest AI-generated resume and cover letter activities.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {recentDocuments.length === 0 ? (
            <EmptyState
              title="No AI documents yet"
              text="Generate resume content or cover letters to see activity here."
            />
          ) : (
            recentDocuments.map((document) => (
              <DocumentRow key={document._id} document={document} />
            ))
          )}
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

function DocumentRow({ document }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-black capitalize text-slate-950">
            {document.type.replaceAll("_", " ")}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {document.title || "Untitled"} • {document.language} •{" "}
            {document.source}
          </p>
        </div>

        <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
          {document.tone}
        </span>
      </div>
    </div>
  );
}

function UsageRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <span className="text-right text-sm font-black capitalize text-slate-950">
        {value}
      </span>
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

function formatPlanName(plan) {
  const planMap = {
    free: "Free",
    starter: "Starter",
    pro: "Pro",
    agency: "Agency",
  };

  return planMap[plan] || "Free";
}

function formatDate(dateValue) {
  if (!dateValue) return "No expiry";

  return new Date(dateValue).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getPlanExpiryText(dateValue) {
  if (!dateValue) return "No expiry";

  const days = getRemainingDays(dateValue);

  if (days <= 0) return "Today";

  return `${days} day${days === 1 ? "" : "s"} left`;
}

function getRemainingDays(dateValue) {
  if (!dateValue) return 0;

  const now = new Date();
  const expiry = new Date(dateValue);

  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(diffDays, 0);
}