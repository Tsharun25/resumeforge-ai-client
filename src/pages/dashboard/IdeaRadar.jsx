import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  Clipboard,
  Copy,
  FileText,
  Loader2,
  RefreshCcw,
  Sparkles,
  Trash2,
  Wand2,
  CheckCircle2,
  ArrowRight,
  Compass,
  TrendingUp,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const TOOL_OPTIONS = [
  {
    id: "niche_ideas",
    title: "Niche Idea Generator",
    shortTitle: "Niche Ideas",
    description:
      "Find profitable career, freelance, and SaaS niche ideas based on your skills.",
    badge: "2 credits",
    gradient: "from-emerald-500 to-teal-600",
    iconLabel: "💡",
  },
  {
    id: "career_path",
    title: "Career Path Generator",
    shortTitle: "Career Path",
    description:
      "Get a personalized career direction with Bangladesh and global market focus.",
    badge: "2 credits",
    gradient: "from-blue-500 to-indigo-600",
    iconLabel: "🧭",
  },
  {
    id: "skill_roadmap",
    title: "Skill Roadmap Generator",
    shortTitle: "Skill Roadmap",
    description:
      "Create a practical 30/60/90-day learning roadmap for high-income skills.",
    badge: "2 credits",
    gradient: "from-violet-500 to-fuchsia-600",
    iconLabel: "📚",
  },
  {
    id: "income_roadmap",
    title: "Income Roadmap Generator",
    shortTitle: "Income Roadmap",
    description:
      "Build a realistic earning roadmap for freelancing, jobs, and digital products.",
    badge: "2 credits",
    gradient: "from-orange-500 to-amber-600",
    iconLabel: "💰",
  },
];

const STATUS_OPTIONS = [
  "Student / Beginner",
  "Fresh Graduate",
  "Job Seeker",
  "Freelancer",
  "Junior Developer",
  "Career Switcher",
  "Small Business Owner",
];

const LANGUAGE_OPTIONS = ["English", "Bangla", "Bangla + English"];

const TIMELINE_OPTIONS = [
  "30 days",
  "3 months",
  "6 months",
  "1 year",
  "2 years",
];

const initialForm = {
  name: "",
  currentStatus: "Student / Beginner",
  field: "",
  skills: "",
  interests: "",
  goal: "",
  targetIncome: "৳30,000 - ৳100,000/month",
  timeline: "6 months",
  marketFocus: "Bangladesh and global remote market",
  language: "English",
  extraDetails: "",
};

const getToken = () => {
  return localStorage.getItem("resumeforge_token") || "";
};

const getAuthConfig = () => {
  const token = getToken();

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("resumeforge_user") || "null");
  } catch {
    return null;
  }
};

const getStoredUserCredits = () => {
  const user = getStoredUser();
  return user?.aiCredits ?? null;
};

const updateStoredUserCredits = (credits) => {
  try {
    const user = getStoredUser();

    if (user && credits !== null && credits !== undefined) {
      localStorage.setItem(
        "resumeforge_user",
        JSON.stringify({
          ...user,
          aiCredits: credits,
        })
      );
    }
  } catch {
    // localStorage update failed silently
  }
};

const getDocumentContent = (document) => {
  return document?.output?.content || "";
};

const formatDate = (date) => {
  if (!date) return "Unknown date";

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export default function IdeaRadar() {
  const [selectedTool, setSelectedTool] = useState("niche_ideas");
  const [form, setForm] = useState(initialForm);
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [history, setHistory] = useState([]);
  const [remainingCredits, setRemainingCredits] = useState(
    getStoredUserCredits()
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  const activeTool = useMemo(() => {
    return (
      TOOL_OPTIONS.find((tool) => tool.id === selectedTool) || TOOL_OPTIONS[0]
    );
  }, [selectedTool]);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);

      const { data } = await axios.get(
        `${API_BASE_URL}/ideas/history`,
        getAuthConfig()
      );

      setHistory(data?.data || []);

      const storedCredits = getStoredUserCredits();
      if (storedCredits !== null && storedCredits !== undefined) {
        setRemainingCredits(storedCredits);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Idea history load failed.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.field.trim()) {
      toast.error("Field / career area লিখুন।");
      return false;
    }

    if (!form.skills.trim()) {
      toast.error("Current skills লিখুন।");
      return false;
    }

    if (!form.goal.trim()) {
      toast.error("Career goal লিখুন।");
      return false;
    }

    return true;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;

    try {
      setIsGenerating(true);
      setGeneratedContent("");
      setGeneratedTitle("");

      const { data } = await axios.post(
        `${API_BASE_URL}/ideas/generate`,
        {
          toolType: selectedTool,
          form,
        },
        getAuthConfig()
      );

      const document = data?.data?.document;
      const content = getDocumentContent(document);
      const credits = data?.data?.remainingCredits ?? null;

      setGeneratedContent(content);
      setGeneratedTitle(document?.title || activeTool.title);
      setRemainingCredits(credits);
      updateStoredUserCredits(credits);

      toast.success("Idea Radar report generated!");
      await loadHistory();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to generate Idea Radar report."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (content = generatedContent) => {
    if (!content) {
      toast.error("Copy করার মতো content নেই।");
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Copy failed.");
    }
  };

  const handleLoadDocument = (document) => {
    const content = getDocumentContent(document);

    setGeneratedTitle(document?.title || "Idea Radar Report");
    setGeneratedContent(content);
    toast.success("Report loaded.");
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);

      await axios.delete(`${API_BASE_URL}/ideas/history/${id}`, getAuthConfig());

      setHistory((prev) => prev.filter((item) => item._id !== id));
      toast.success("Report deleted.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed.");
    } finally {
      setDeletingId("");
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setGeneratedContent("");
    setGeneratedTitle("");
    toast.success("Form reset.");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-100 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-emerald-100 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.10),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_35%)]" />

          <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
            <div className="flex flex-col justify-center">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700">
                  <Compass size={14} />
                  Career Strategy Engine
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-600">
                  <TrendingUp size={14} className="text-emerald-500" />
                  Roadmap for Bangladesh
                </span>
              </div>

              <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Find your next career move.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                আপনার skills, interests, goal আর timeline অনুযায়ী AI-powered
                career path, skill roadmap, income plan এবং niche ideas তৈরি
                করুন — Bangladesh reality মাথায় রেখে।
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
                {[
                  "Personalized career direction",
                  "Practical 30/60/90-day roadmap",
                  "Freelance and job opportunity plan",
                  "Realistic income growth strategy",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm"
                  >
                    <CheckCircle2 size={15} className="text-violet-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-900/20">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <Wand2 size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Current Tool</p>
                    <h2 className="font-black">{activeTool.shortTitle}</h2>
                  </div>
                </div>

                <ArrowRight size={20} className="text-slate-500" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Credit Cost</p>
                  <p className="mt-1 text-xl font-black">{activeTool.badge}</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Remaining</p>
                  <p className="mt-1 text-xl font-black">
                    {remainingCredits === null ||
                    remainingCredits === undefined
                      ? "—"
                      : remainingCredits}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs leading-6 text-slate-300">
                  Better report পেতে field, current skills, interests, target
                  income আর career goal clearly লিখুন।
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {TOOL_OPTIONS.map((tool) => {
            const isActive = selectedTool === tool.id;

            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setSelectedTool(tool.id)}
                className={`group rounded-3xl border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
                  isActive
                    ? "border-slate-900 ring-2 ring-slate-900/10"
                    : "border-slate-200"
                }`}
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-xl text-white shadow-sm`}
                >
                  {tool.iconLabel}
                </div>

                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-black text-slate-950">{tool.title}</h3>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
                    {tool.badge}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {tool.description}
                </p>
              </button>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                  Input
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-950">
                  {activeTool.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <RefreshCcw size={14} />
                Reset
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    Name
                  </span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Harun"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    Current Status
                  </span>
                  <select
                    name="currentStatus"
                    value={form.currentStatus}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                  >
                    {STATUS_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  Field / Career Area
                </span>
                <input
                  name="field"
                  value={form.field}
                  onChange={handleChange}
                  placeholder="e.g. MERN Stack Development, Digital Marketing, UI/UX Design"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  Current Skills
                </span>
                <textarea
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. React, Node.js, MongoDB, Tailwind CSS, JWT, REST API"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  Interests
                </span>
                <textarea
                  name="interests"
                  value={form.interests}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. freelancing, remote job, SaaS, AI tools, ecommerce, dashboards"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  Main Goal
                </span>
                <textarea
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. I want to get freelance clients and earn from remote work within 6 months."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    Target Income
                  </span>
                  <input
                    name="targetIncome"
                    value={form.targetIncome}
                    onChange={handleChange}
                    placeholder="৳50,000/month"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    Timeline
                  </span>
                  <select
                    name="timeline"
                    value={form.timeline}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                  >
                    {TIMELINE_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    Language
                  </span>
                  <select
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                  >
                    {LANGUAGE_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  Market Focus
                </span>
                <input
                  name="marketFocus"
                  value={form.marketFocus}
                  onChange={handleChange}
                  placeholder="e.g. Bangladesh and global remote market"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  Extra Details
                </span>
                <textarea
                  name="extraDetails"
                  value={form.extraDetails}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any personal background, limitation, preferred career direction, available time, laptop/internet situation, etc."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                />
              </label>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate {activeTool.shortTitle}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                    Output
                  </p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    {generatedTitle || "Generated report will appear here"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy()}
                  disabled={!generatedContent}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Copy size={16} />
                  Copy
                </button>
              </div>

              <div className="min-h-[420px] rounded-3xl border border-slate-200 bg-slate-50 p-4">
                {generatedContent ? (
                  <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-800">
                    {generatedContent}
                  </pre>
                ) : (
                  <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-3xl bg-white p-4 shadow-sm">
                      <FileText className="text-slate-400" size={34} />
                    </div>
                    <h3 className="font-black text-slate-900">
                      Ready to discover your next move
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      বাম পাশের form পূরণ করে generate করুন। Report এখানে দেখা
                      যাবে এবং history-তেও save হবে।
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                    Saved
                  </p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    Recent Career Strategy Reports
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={loadHistory}
                  className="rounded-2xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50"
                  aria-label="Refresh history"
                >
                  <RefreshCcw size={17} />
                </button>
              </div>

              {isLoadingHistory ? (
                <div className="flex items-center justify-center rounded-3xl bg-slate-50 py-12 text-slate-500">
                  <Loader2 className="mr-2 animate-spin" size={18} />
                  Loading history...
                </div>
              ) : history.length === 0 ? (
                <div className="rounded-3xl bg-slate-50 p-6 text-center">
                  <Clipboard className="mx-auto text-slate-400" size={30} />
                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    No career strategy reports yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => {
                    const content = getDocumentContent(item);

                    return (
                      <div
                        key={item._id}
                        className="rounded-3xl border border-slate-200 p-4 transition hover:bg-slate-50"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <button
                            type="button"
                            onClick={() => handleLoadDocument(item)}
                            className="min-w-0 flex-1 text-left"
                          >
                            <h3 className="truncate font-black text-slate-900">
                              {item.title}
                            </h3>

                            <p className="mt-1 text-xs font-semibold text-slate-500">
                              {formatDate(item.createdAt)} ·{" "}
                              {item?.input?.creditsUsed || 2} credits used ·{" "}
                              {item.source || "mock"}
                            </p>

                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                              {content}
                            </p>
                          </button>

                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(content)}
                              className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-white"
                              aria-label="Copy report"
                            >
                              <Copy size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item._id)}
                              disabled={deletingId === item._id}
                              className="rounded-2xl border border-red-100 bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                              aria-label="Delete report"
                            >
                              {deletingId === item._id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}