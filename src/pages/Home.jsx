import { Link } from "react-router-dom";
import {
  ArrowRight,
  Download,
  FileText,
  LayoutTemplate,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: "AI Resume Generator",
      desc: "Generate professional resume content from your job title, skills, and experience.",
    },
    {
      icon: LayoutTemplate,
      title: "Modern Templates",
      desc: "Use clean, ATS-friendly, recruiter-focused resume templates.",
    },
    {
      icon: Download,
      title: "PDF Export",
      desc: "Download your final resume as a polished PDF in one click.",
    },
    {
      icon: FileText,
      title: "Cover Letter Generator",
      desc: "Create AI-powered cover letters matched to each job description.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <Sparkles size={22} />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-950">
            CareerPilot AI
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-xl shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-indigo-600"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-14 lg:grid-cols-2 lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
            <ShieldCheck size={17} />
            Build career tools that actually help you earn
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
            Build your next career move with{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              AI power
            </span>
            .
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            CareerPilot AI helps students, job seekers, freelancers, and
            creators build resumes, cover letters, career roadmaps, and content
            income strategies from one modern dashboard.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-7 py-4 text-sm font-bold text-white shadow-2xl shadow-indigo-200 transition hover:-translate-y-1 hover:bg-indigo-700"
            >
              Start Building Free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200"
            >
              Open Dashboard
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-slate-400">Career Preview</p>
                  <h3 className="text-xl font-bold">AI-Powered Dashboard</h3>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  CareerPilot
                </span>
              </div>

              <div className="mt-5 rounded-2xl bg-white p-5 text-slate-900">
                <h4 className="text-2xl font-black">Harun Ar Rashid</h4>
                <p className="mt-1 text-sm font-medium text-indigo-600">
                  Resume, Content, and Income Strategy
                </p>

                <div className="mt-5 space-y-4">
                  <PreviewSection title="Summary" />
                  <PreviewSection title="Experience" />
                  <PreviewSection title="Skills" />
                  <PreviewSection title="Projects" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">
            Product
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            Everything needed for a career and income platform.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>CareerPilot AI - AI career and income platform.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/legal/privacy" className="hover:text-indigo-600">
              Privacy
            </Link>
            <Link to="/legal/terms" className="hover:text-indigo-600">
              Terms
            </Link>
            <Link to="/legal/refund" className="hover:text-indigo-600">
              Refund
            </Link>
            <Link to="/legal/support" className="hover:text-indigo-600">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function PreviewSection({ title }) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <div className="space-y-2">
        <div className="h-2 rounded-full bg-slate-200" />
        <div className="h-2 w-4/5 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}
