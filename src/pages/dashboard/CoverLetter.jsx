import { useState } from "react";
import { Copy, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function CoverLetter() {
  const [formData, setFormData] = useState({
    applicantName: "",
    jobTitle: "",
    companyName: "",
    skills: "",
    achievements: "",
    experienceSummary: "",
    jobDescription: "",
    language: "English",
    tone: "Professional",
  });

  const [coverLetter, setCoverLetter] = useState("");
  const [generationMeta, setGenerationMeta] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.applicantName.trim()) {
      toast.error("Applicant name is required");
      return false;
    }

    if (!formData.jobTitle.trim()) {
      toast.error("Job title is required");
      return false;
    }

    if (!formData.companyName.trim()) {
      toast.error("Company name is required");
      return false;
    }

    if (!formData.skills.trim()) {
      toast.error("Skills are required");
      return false;
    }

    return true;
  };

  const generateCoverLetter = async () => {
    if (!validateForm()) return;

    try {
      setIsGenerating(true);

      const { data } = await api.post("/ai/generate-cover-letter", formData);

      setCoverLetter(data.data.coverLetter);
      setGenerationMeta({
        matchedKeywords: data.data.matchedKeywords || [],
        missingInformation: data.data.missingInformation || [],
        source: data.source,
        remainingCredits: data.remainingCredits,
      });

      const storedUser = JSON.parse(
        localStorage.getItem("resumeforge_user") || "null",
      );

      if (storedUser && Number.isFinite(data.remainingCredits)) {
        localStorage.setItem(
          "resumeforge_user",
          JSON.stringify({ ...storedUser, aiCredits: data.remainingCredits }),
        );
        window.dispatchEvent(new Event("careerpilot-user-updated"));
      }

      toast.success("Job-specific cover letter generated!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate cover letter"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCoverLetter = async () => {
    if (!coverLetter) return;

    await navigator.clipboard.writeText(coverLetter);
    toast.success("Copied to clipboard!");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
          Cover Letter AI
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Generate job-focused cover letters in English, Bangla, or mixed style.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black text-slate-950">
            Job Information
          </h2>

          <div className="mt-6 space-y-4">
            <Input
              label="Applicant Name"
              value={formData.applicantName}
              onChange={(value) => handleChange("applicantName", value)}
            />

            <Input
              label="Job Title"
              value={formData.jobTitle}
              onChange={(value) => handleChange("jobTitle", value)}
            />

            <Input
              label="Company Name"
              value={formData.companyName}
              onChange={(value) => handleChange("companyName", value)}
            />

            <Input
              label="Skills"
              value={formData.skills}
              onChange={(value) => handleChange("skills", value)}
            />

            <TextAreaInput
              label="Verified achievements"
              value={formData.achievements}
              placeholder="Example: Reduced processing time by 25%; completed 8 client projects"
              onChange={(value) => handleChange("achievements", value)}
            />

            <TextAreaInput
              label="Relevant experience summary"
              value={formData.experienceSummary}
              placeholder="Describe only experience you can verify."
              onChange={(value) => handleChange("experienceSummary", value)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Output Language"
                value={formData.language}
                options={["English", "Bangla", "Bangla + English"]}
                onChange={(value) => handleChange("language", value)}
              />

              <Select
                label="Output Tone"
                value={formData.tone}
                options={[
                  "Professional",
                  "Friendly",
                  "Corporate",
                  "Freelance Marketplace",
                  "Student/Fresher",
                ]}
                onChange={(value) => handleChange("tone", value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Job Description
              </label>
              <textarea
                value={formData.jobDescription}
                onChange={(event) =>
                  handleChange("jobDescription", event.target.value)
                }
                rows="6"
                placeholder="Paste job description here..."
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <button
              onClick={generateCoverLetter}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Cover Letter
                </>
              )}
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Generated Cover Letter
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review, edit, and copy your cover letter.
              </p>
            </div>

            <button
              onClick={copyCoverLetter}
              disabled={!coverLetter}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-50"
            >
              <Copy size={17} />
              Copy
            </button>
          </div>

          <textarea
            value={coverLetter}
            onChange={(event) => setCoverLetter(event.target.value)}
            placeholder="Your generated cover letter will appear here..."
            rows="22"
            className="mt-6 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />

          {generationMeta && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <MetaList
                title="Matched job requirements"
                items={generationMeta.matchedKeywords}
                emptyText="No confirmed match was found."
              />
              <MetaList
                title="Information to add"
                items={generationMeta.missingInformation}
                emptyText="No important information gap was returned."
              />
              <p className="text-xs font-bold text-slate-500 sm:col-span-2">
                Source: {generationMeta.source} • Remaining credits:{" "}
                {generationMeta.remainingCredits}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      />
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaInput({ label, value, placeholder, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      />
    </div>
  );
}

function MetaList({ title, items, emptyText }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="font-black text-slate-950">{title}</h3>
      {items.length > 0 ? (
        <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
          {items.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-500">{emptyText}</p>
      )}
    </div>
  );
}
