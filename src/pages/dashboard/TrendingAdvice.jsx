import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Copy,
  FileText,
  Loader2,
  RefreshCcw,
  Sparkles,
  Trash2,
  TrendingUp,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const PLATFORM_OPTIONS = [
  "Facebook Reels",
  "TikTok",
  "YouTube Shorts",
  "Instagram Reels",
];

const LANGUAGE_OPTIONS = ["Bangla", "English", "Bangla + English"];
const CREATOR_LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];
const GOAL_OPTIONS = [
  "Views",
  "Followers",
  "Engagement",
  "Monetization",
  "Product Sales",
  "Personal Branding",
];

const initialForm = {
  platform: "Facebook Reels",
  niche: "",
  audience: "Bangladeshi young audience",
  creatorLevel: "Beginner",
  goal: "Views",
  market: "Bangladesh",
  contentStyle: "Educational and practical",
  language: "Bangla",
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
        JSON.stringify({
          ...user,
          aiCredits: credits,
        })
      );
    }
  } catch {
    // ignore localStorage errors
  }
};

const getContent = (document) => document?.output?.content || "";

const formatDate = (date) => {
  if (!date) return "Unknown date";

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export default function TrendingAdvice() {
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

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);

      const { data } = await axios.get(
        `${API_BASE_URL}/trending/history`,
        getAuthConfig()
      );

      setHistory(data?.data || []);
      setRemainingCredits(getStoredUserCredits());
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Trending history load failed."
      );
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

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.niche.trim()) {
      toast.error("Please write a niche.");
      return false;
    }

    if (!form.audience.trim()) {
      toast.error("Please write the target audience.");
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
        `${API_BASE_URL}/trending/generate`,
        { form },
        getAuthConfig()
      );

      const document = data?.data?.document;
      const content = getContent(document);
      const credits = data?.data?.remainingCredits ?? null;

      setGeneratedContent(content);
      setGeneratedTitle(document?.title || "Trending Advice Report");
      setRemainingCredits(credits);
      updateStoredUserCredits(credits);

      toast.success("Trending advice generated!");
      await loadHistory();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to generate trending advice."
      );
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
    setGeneratedTitle(document?.title || "Trending Advice Report");
    setGeneratedContent(getContent(document));
    toast.success("Report loaded.");
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);

      await axios.delete(`${API_BASE_URL}/trending/history/${id}`, getAuthConfig());

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
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700">
                <TrendingUp size={17} />
                CareerPilot AI · Trending Advice
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Trending advice for creators
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                Generate niche-based hooks, scripts, captions, hashtags,
                posting advice, and monetization angles for Facebook Reels,
                TikTok, YouTube Shorts, and Instagram Reels.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-600">
                Best For
              </p>

              <div className="mt-4 space-y-3 text-sm font-semibold text-slate-700">
                <p>Content creator workflow</p>
                <p>Bangladesh-focused audience fit</p>
                <p>Hook + script generation</p>
                <p>Income-focused posting plan</p>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-500">
                  Remaining Credits
                </p>
                <p className="mt-1 text-3xl font-black text-rose-600">
                  {remainingCredits === null || remainingCredits === undefined
                    ? "-"
                    : remainingCredits}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-600">
                  Input
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-950">
                  Generate content guidance
                </h2>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-black text-rose-700 hover:bg-rose-50"
              >
                Reset
              </button>
            </div>

            <div className="space-y-4">
              <Select
                label="Platform"
                name="platform"
                value={form.platform}
                onChange={handleChange}
                options={PLATFORM_OPTIONS}
              />

              <Input
                label="Niche"
                name="niche"
                value={form.niche}
                onChange={handleChange}
                placeholder="e.g. AI tools, fitness, Islamic content, education"
              />

              <Input
                label="Target Audience"
                name="audience"
                value={form.audience}
                onChange={handleChange}
                placeholder="e.g. Bangladeshi students, job seekers, freelancers"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Creator Level"
                  name="creatorLevel"
                  value={form.creatorLevel}
                  onChange={handleChange}
                  options={CREATOR_LEVEL_OPTIONS}
                />

                <Select
                  label="Goal"
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  options={GOAL_OPTIONS}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Market"
                  name="market"
                  value={form.market}
                  onChange={handleChange}
                  placeholder="Bangladesh / Global"
                />

                <Select
                  label="Language"
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  options={LANGUAGE_OPTIONS}
                />
              </div>

              <Input
                label="Content Style"
                name="contentStyle"
                value={form.contentStyle}
                onChange={handleChange}
                placeholder="Educational, funny, motivational, storytelling"
              />

              <label className="block">
                <span className="mb-1.5 block text-sm font-black text-slate-700">
                  Extra Details
                </span>
                <textarea
                  name="extraDetails"
                  value={form.extraDetails}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Audience age, content length, product or service, posting frequency"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                />
              </label>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Content Advice
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-600">
                    Output
                  </p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    {generatedTitle || "Generated advice will appear here"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy()}
                  disabled={!generatedContent}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <Copy size={16} />
                  Copy
                </button>
              </div>

              <div className="min-h-[420px] rounded-3xl border border-slate-200 bg-slate-50 p-5">
                {generatedContent ? (
                  <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-800">
                    {generatedContent}
                  </pre>
                ) : (
                  <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-white p-5 shadow-sm">
                      <FileText className="text-slate-400" size={36} />
                    </div>
                    <p className="text-sm font-semibold text-slate-500">
                      AI-generated advice will be shown here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">
                    Saved
                  </p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    Recent Trending Advice
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={loadHistory}
                  className="rounded-2xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
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
                  No trending advice generated yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => {
                    const content = getContent(item);

                    return (
                      <div
                        key={item._id}
                        className="rounded-3xl border border-slate-200 p-4 hover:bg-slate-50"
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
                              {item?.input?.platform || "Platform"} ·{" "}
                              {item?.input?.language || item.language || "Bangla"}
                            </p>

                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                              {content}
                            </p>
                          </button>

                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(content)}
                              className="rounded-2xl border border-slate-200 p-2 text-slate-600 hover:bg-white"
                              aria-label="Copy advice"
                            >
                              <Copy size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item._id)}
                              disabled={deletingId === item._id}
                              className="rounded-2xl border border-red-100 bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-60"
                              aria-label="Delete advice"
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

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-black text-slate-700">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
      />
    </label>
  );
}

function Select({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-black text-slate-700">
        {label}
      </span>
      <select
        {...props}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
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
