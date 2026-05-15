import { Link } from "react-router-dom";
import {
  Sparkles,
  FileText,
  Download,
  LayoutTemplate,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: "AI Resume Generator",
      desc: "Job title, skills, and experience দিয়ে instantly professional resume content generate করো.",
    },
    {
      icon: LayoutTemplate,
      title: "Modern Templates",
      desc: "Clean, ATS-friendly, recruiter-focused resume templates ব্যবহার করো.",
    },
    {
      icon: Download,
      title: "PDF Export",
      desc: "Final resume এক click-এ polished PDF হিসেবে download করো.",
    },
    {
      icon: FileText,
      title: "Cover Letter Generator",
      desc: "Job description অনুযায়ী AI-powered cover letter তৈরি করো.",
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
            ResumeForge AI
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
            Build ATS-friendly resumes in minutes
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
            Create job-winning resumes with{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              AI power
            </span>
            .
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            ResumeForge AI helps developers, designers, marketers, and students
            create polished resumes, cover letters, and PDF exports from one
            modern SaaS dashboard.
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
              View Demo Dashboard
            </Link>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            <Stat number="10k+" label="Resumes" />
            <Stat number="4.9/5" label="User Rating" />
            <Stat number="ATS" label="Friendly" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-indigo-200 blur-3xl" />
          <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-violet-200 blur-3xl" />

          <div className="relative rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-slate-400">Resume Preview</p>
                  <h3 className="text-xl font-bold">Frontend Developer</h3>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  AI Enhanced
                </span>
              </div>

              <div className="mt-5 rounded-2xl bg-white p-5 text-slate-900">
                <h4 className="text-2xl font-black">Harun Ahmed</h4>
                <p className="mt-1 text-sm font-medium text-indigo-600">
                  MERN Stack Developer
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
            Features
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            Everything needed for a modern resume SaaS.
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
    </main>
  );
}

function Stat({ number, label }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-2xl font-black text-slate-950">{number}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
    </div>
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