import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  BookOpen,
  CheckCircle2,
  Compass,
  Copy,
  FileText,
  Lightbulb,
  Loader2,
  RefreshCcw,
  Sparkles,
  Trash2,
  Route,
  Wallet,
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
    icon: Lightbulb,
  },
  {
    id: "career_path",
    title: "Career Path Generator",
    shortTitle: "Career Path",
    description:
      "Get a personalized career direction with Bangladesh and global market focus.",
    badge: "2 credits",
    icon: Route,
  },
  {
    id: "skill_roadmap",
    title: "Skill Roadmap Generator",
    shortTitle: "Skill Roadmap",
    description:
      "Create a practical 30/60/90-day learning roadmap for high-income skills.",
    badge: "2 credits",
    icon: BookOpen,
  },
  {
    id: "income_roadmap",
    title: "Income Roadmap Generator",
    shortTitle: "Income Roadmap",
    description:
      "Build a realistic earning roadmap for freelancing, jobs, and digital products.",
    badge: "2 credits",
    icon: Wallet,
  },
];

const STATUS_OPTIONS = [
  "Student / Beginner",
  "Fresh Graduate",
  "Job Seeker",
  "Freelancer",
  "Content Creator",
  "Career Switcher",
  "Small Business Owner",
];

const LANGUAGE_OPTIONS = ["Bangla", "English", "Bangla + English"];
const MARKET_OPTIONS = ["Bangladesh", "Global", "Bangladesh + Global"];
const BUDGET_OPTIONS = ["Low Budget", "Medium Budget", "High Budget"];
const SKILL_LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];
const TIMELINE_OPTIONS = ["30 days", "3 months", "6 months", "1 year", "2 years"];

const initialForm = {
  name: "",
  currentStatus: "Student / Beginner",
  field: "",
  skills: "",
  interests: "",
  goal: "",
  targetIncome: "৳30,000 - ৳100,000/month",
  timeline: "6 months",
  marketFocus: "Bangladesh",
  language: "Bangla",
  budget: "Low Budget",
  skillLevel: "Beginner",
  extraDetails: "",
};

const getToken = () => localStorage.getItem("resumeforge_token") || "";

const getAuthConfig = () => ({
  headers: {
    Authorization: getToken() ? `Bearer ${getToken()}` : "",
  },
});

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("resumeforge_user") || "null");
  } catch {
    return null;
  }
};

const getStoredUserCredits = () => getStoredUser()?.aiCredits ?? null;

const updateStoredUserCredits = (credits) => {
  try {
    const user = getStoredUser();
    if (user && credits !== null && credits !== undefined) {
      localStorage.setItem(
        "resumeforge_user",
        JSON.stringify({ ...user, aiCredits: credits })
      );
    }
  } catch {
    // ignore
  }
};

const getDocumentContent = (document) => document?.output?.content || "";

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

  const activeTool = useMemo(
    () => TOOL_OPTIONS.find((tool) => tool.id === selectedTool) || TOOL_OPTIONS[0],
    [selectedTool]
  );

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);

      const { data } = await axios.get(
        `${API_BASE_URL}/ideas/history`,
        getAuthConfig()
      );

      setHistory(data?.data || []);
      setRemainingCredits(getStoredUserCredits());
    } catch (error) {
      toast.error(error?.response?.data?.message || "Idea history load failed.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(loadHistory, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.field.trim()) {
      toast.error("Please write a field or career area.");
      return false;
    }

    if (!form.skills.trim()) {
      toast.error("Please write your current skills.");
      return false;
    }

    if (!form.goal.trim()) {
      toast.error("Please write your main goal.");
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

      toast.success("Idea report generated!");
      await loadHistory();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (content = generatedContent) => {
    if (!content) {
      toast.error("No content to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied!");
    } catch {
      toast.error("Copy failed.");
    }
  };

  const handleLoadDocument = (document) => {
    setGeneratedTitle(document?.title || "Idea Radar Report");
    setGeneratedContent(getDocumentContent(document));
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
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                <Compass size={17} />
                CareerPilot AI · Idea Radar
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Bangladesh-focused income idea engine
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                Generate niche ideas, career paths, skill roadmaps, and income
                plans based on your skills, interests, goal, budget, and market
                focus.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "Bangla output support",
                  "Bangladesh market focus",
                  "Freelance + content income plan",
                  "30/60/90-day practical roadmap",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <CheckCircle2 size={17} className="text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                Current Tool
              </p>
              <h2 className="mt-2 text-2xl font-black">{activeTool.shortTitle}</h2>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <InfoBox label="Credit Cost" value={activeTool.badge} />
                <InfoBox
                  label="Remaining"
                  value={
                    remainingCredits === null || remainingCredits === undefined
                      ? "-"
                      : remainingCredits
                  }
                />
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                For better results, write your field, skills, interests, goal,
                budget, and target market clearly.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_1.3fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {TOOL_OPTIONS.map((tool) => {
                const isActive = selectedTool === tool.id;
                const Icon = tool.icon;

                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => setSelectedTool(tool.id)}
                    className={`rounded-3xl border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
                      isActive
                        ? "border-slate-900 ring-2 ring-slate-900/10"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="mb-4 inline-flex rounded-2xl bg-slate-100 p-3 text-slate-800">
                      <Icon size={22} />
                    </div>

                    <h3 className="font-black text-slate-950">{tool.title}</h3>

                    <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      {tool.badge}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {tool.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                    Input
                  </p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    {activeTool.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />

                  <SelectField
                    label="Current Status"
                    name="currentStatus"
                    value={form.currentStatus}
                    onChange={handleChange}
                    options={STATUS_OPTIONS}
                  />
                </div>

                <TextField
                  label="Field / Career Area"
                  name="field"
                  value={form.field}
                  onChange={handleChange}
                  placeholder="e.g. Web Development, Digital Marketing, Content Creation"
                />

                <TextAreaField
                  label="Current Skills"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. React, basic design, communication, video editing, writing"
                />

                <TextAreaField
                  label="Interests"
                  name="interests"
                  value={form.interests}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Reels, TikTok, AI tools, freelancing, YouTube Shorts, ecommerce"
                />

                <TextAreaField
                  label="Main Goal"
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Start freelancing/content income within 6 months"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField
                    label="Language"
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    options={LANGUAGE_OPTIONS}
                  />

                  <SelectField
                    label="Market Focus"
                    name="marketFocus"
                    value={form.marketFocus}
                    onChange={handleChange}
                    options={MARKET_OPTIONS}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField
                    label="Budget"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    options={BUDGET_OPTIONS}
                  />

                  <SelectField
                    label="Skill Level"
                    name="skillLevel"
                    value={form.skillLevel}
                    onChange={handleChange}
                    options={SKILL_LEVEL_OPTIONS}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Target Income"
                    name="targetIncome"
                    value={form.targetIncome}
                    onChange={handleChange}
                    placeholder="৳50,000/month"
                  />

                  <SelectField
                    label="Timeline"
                    name="timeline"
                    value={form.timeline}
                    onChange={handleChange}
                    options={TIMELINE_OPTIONS}
                  />
                </div>

                <TextAreaField
                  label="Extra Details"
                  name="extraDetails"
                  value={form.extraDetails}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any extra context: time available, laptop, English level, preferred platform, etc."
                />

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
                      Fill the form and generate your report. It will appear here
                      and also be saved in history.
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
                    Recent Idea Radar Reports
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
                <div className="rounded-3xl bg-slate-50 p-6 text-center text-sm font-semibold text-slate-600">
                  No Idea Radar reports yet.
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
                              {item?.input?.language || item.language || "Bangla"} ·{" "}
                              {item?.input?.marketFocus || "Bangladesh"} ·{" "}
                              {item?.input?.creditsUsed || 2} credits
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

function InfoBox({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function TextField({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-black text-slate-700">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      />
    </label>
  );
}

function TextAreaField({ label, rows = 3, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-black text-slate-700">
        {label}
      </span>
      <textarea
        {...props}
        rows={rows}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      />
    </label>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-black text-slate-700">
        {label}
      </span>
      <select
        {...props}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}
