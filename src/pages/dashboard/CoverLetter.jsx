import { useState } from "react";
import { Copy, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function CoverLetter() {
  const [formData, setFormData] = useState({
    applicantName: "Harun Ahmed",
    jobTitle: "MERN Stack Developer",
    companyName: "Tech Company",
    skills: "React, Node.js, Express, MongoDB, Tailwind CSS",
    jobDescription: "",
  });

  const [coverLetter, setCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateCoverLetter = async () => {
    try {
      setIsGenerating(true);

      const { data } = await api.post("/ai/generate-cover-letter", formData);

      setCoverLetter(data.data.coverLetter);
      toast.success("Cover letter generated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate cover letter");
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
          Generate polished, job-focused cover letters in seconds.
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