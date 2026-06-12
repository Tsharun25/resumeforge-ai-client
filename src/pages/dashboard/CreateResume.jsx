import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Check,
  Download,
  Loader2,
  Lock,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";

import api from "../../api/axios";

const templates = [
  {
    id: "classic",
    name: "Classic",
    description: "ATS-friendly traditional layout",
    premium: false,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold header with clean sections",
    premium: true,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple, elegant, recruiter-focused",
    premium: true,
  },
];

const defaultResumeData = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  portfolio: "",
  summary: "",
  skills: [],
  education: [],
  certifications: [],
  languages: [],
  experience: [],
  projects: [],
};

export default function CreateResume() {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get("id");

  const resumeRef = useRef(null);

  const currentUser = JSON.parse(
    localStorage.getItem("resumeforge_user") || "null",
  );

  const userPlan = currentUser?.plan || "free";

  const canUsePremiumTemplates = userPlan !== "free";

  const [selectedTemplate, setSelectedTemplate] = useState("classic");

  const [resumeData, setResumeData] = useState(defaultResumeData);

  const [loadingResume, setLoadingResume] = useState(false);

  const [savingResume, setSavingResume] = useState(false);

  const [exportingPDF, setExportingPDF] = useState(false);

  const [generatingAI, setGeneratingAI] = useState(false);

  const [aiForm, setAiForm] = useState({
    targetRole: "",
    experienceLevel: "",
    skills: "",
  });

  const fetchResume = useCallback(async () => {
    try {
      setLoadingResume(true);

      const { data } = await api.get(`/resumes/${resumeId}`);

      const resume = data.resume;

      setSelectedTemplate(resume.template || "classic");

      setResumeData({
        fullName: resume.fullName || "",
        title: resume.title || "",
        email: resume.email || "",
        phone: resume.phone || "",
        location: resume.location || "",
        portfolio: resume.portfolio || "",
        summary: resume.summary || "",
        skills: resume.skills || [],
        education: resume.education || [],
        certifications: resume.certifications || [],
        languages: resume.languages || [],
        experience: resume.experience || [],
        projects: resume.projects || [],
      });
    } catch {
      toast.error("Failed to load resume");
    } finally {
      setLoadingResume(false);
    }
  }, [resumeId]);

  useEffect(() => {
    if (!resumeId) return undefined;

    const timer = window.setTimeout(fetchResume, 0);

    return () => window.clearTimeout(timer);
  }, [fetchResume, resumeId]);

  const updateField = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateAiForm = (field, value) => {
    setAiForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTemplateSelect = (template) => {
    if (template.premium && !canUsePremiumTemplates) {
      toast.error(
        "Premium templates are available for Starter, Pro, and Agency plans.",
      );
      return;
    }

    setSelectedTemplate(template.id);
  };

  const generateAIContent = async () => {
    try {
      if (!aiForm.targetRole || !aiForm.experienceLevel || !aiForm.skills) {
        toast.error("Please complete AI generation form.");
        return;
      }

      setGeneratingAI(true);

      const { data } = await api.post("/ai/generate-resume", {
        ...aiForm,
        jobTitle: aiForm.targetRole,
      });
      const content = data.data || data.content || {};

      setResumeData((prev) => ({
        ...prev,
        summary: content.summary || prev.summary,
        skills: content.skills || prev.skills,
      }));

      toast.success("AI content generated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate AI content.",
      );
    } finally {
      setGeneratingAI(false);
    }
  };

  const saveResume = async () => {
    try {
      if (
        templates.find((template) => template.id === selectedTemplate)
          ?.premium &&
        !canUsePremiumTemplates
      ) {
        toast.error("Upgrade your plan to save premium templates.");
        return;
      }

      setSavingResume(true);

      const payload = {
        template: selectedTemplate,
        ...resumeData,
      };

      if (resumeId) {
        await api.put(`/resumes/${resumeId}`, payload);

        toast.success("Resume updated successfully.");
      } else {
        await api.post("/resumes", payload);

        toast.success("Resume saved successfully.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save resume.");
    } finally {
      setSavingResume(false);
    }
  };

  const exportPDF = async () => {
    try {
      if (
        templates.find((template) => template.id === selectedTemplate)
          ?.premium &&
        !canUsePremiumTemplates
      ) {
        toast.error("Upgrade your plan to export premium templates.");
        return;
      }

      if (!resumeRef.current) return;

      setExportingPDF(true);

      const opt = {
        margin: 0.3,
        filename: `${resumeData.fullName || "resume"}.pdf`,
        image: {
          type: "jpeg",
          quality: 1,
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
      };

      const { default: html2pdf } = await import("html2pdf.js");
      await html2pdf().set(opt).from(resumeRef.current).save();

      toast.success("PDF exported successfully.");
    } catch {
      toast.error("PDF export failed.");
    } finally {
      setExportingPDF(false);
    }
  };

  const addSkill = () => {
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }));
  };

  const updateSkill = (index, value) => {
    const updated = [...resumeData.skills];

    updated[index] = value;

    setResumeData((prev) => ({
      ...prev,
      skills: updated,
    }));
  };

  const removeSkill = (index) => {
    const updated = [...resumeData.skills];

    updated.splice(index, 1);

    setResumeData((prev) => ({
      ...prev,
      skills: updated,
    }));
  };

  if (loadingResume) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-950">
              Create Resume
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Build polished ATS-friendly resumes with AI power.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={generateAIContent}
              disabled={generatingAI}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
            >
              {generatingAI ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
              Generate with AI
            </button>

            <button
              onClick={saveResume}
              disabled={savingResume}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white"
            >
              {savingResume ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Save Resume
            </button>

            <button
              onClick={exportPDF}
              disabled={exportingPDF}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
            >
              {exportingPDF ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Download size={18} />
              )}
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Choose Template</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {templates.map((template) => {
            const isLocked = template.premium && !canUsePremiumTemplates;

            const isSelected = selectedTemplate === template.id;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateSelect(template)}
                className={`relative rounded-3xl border p-5 text-left transition ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50 ring-4 ring-indigo-100"
                    : "border-slate-200 bg-white hover:border-indigo-200"
                } ${isLocked ? "opacity-75" : ""}`}
              >
                {isLocked && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                    <Lock size={13} />
                    Premium
                  </span>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-black text-slate-950">
                      {template.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {template.description}
                    </p>

                    {template.premium && (
                      <p className="mt-3 text-xs font-black text-indigo-600">
                        Starter plan or higher
                      </p>
                    )}
                  </div>

                  {isSelected && !isLocked && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <Check size={16} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Personal Information
            </h2>

            <div className="mt-5 grid gap-4">
              <Input
                label="Full Name"
                value={resumeData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
              />

              <Input
                label="Professional Title"
                value={resumeData.title}
                onChange={(e) => updateField("title", e.target.value)}
              />

              <Input
                label="Email"
                value={resumeData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />

              <Input
                label="Phone"
                value={resumeData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />

              <Input
                label="Location"
                value={resumeData.location}
                onChange={(e) => updateField("location", e.target.value)}
              />

              <Input
                label="Portfolio"
                value={resumeData.portfolio}
                onChange={(e) => updateField("portfolio", e.target.value)}
              />

              <TextArea
                label="Professional Summary"
                value={resumeData.summary}
                onChange={(e) => updateField("summary", e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-950">Skills</h2>

              <button
                type="button"
                onClick={addSkill}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-black text-white"
              >
                <Plus size={16} />
                Add Skill
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => updateSkill(index, e.target.value)}
                    placeholder="React, Node.js, MongoDB..."
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">AI Assistant</h2>

            <div className="mt-5 grid gap-4">
              <Input
                label="Target Role"
                value={aiForm.targetRole}
                onChange={(e) => updateAiForm("targetRole", e.target.value)}
              />

              <Input
                label="Experience Level"
                value={aiForm.experienceLevel}
                onChange={(e) =>
                  updateAiForm("experienceLevel", e.target.value)
                }
              />

              <TextArea
                label="Skills"
                value={aiForm.skills}
                onChange={(e) => updateAiForm("skills", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Live Preview</h2>

            <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div ref={resumeRef} className="bg-white p-8 text-slate-900">
                <h1 className="text-4xl font-black">
                  {resumeData.fullName || "Your Name"}
                </h1>

                <p className="mt-2 text-lg font-bold text-indigo-600">
                  {resumeData.title || "Professional Title"}
                </p>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                  <span>{resumeData.email}</span>
                  <span>{resumeData.phone}</span>
                  <span>{resumeData.location}</span>
                  <span>{resumeData.portfolio}</span>
                </div>

                <section className="mt-8">
                  <h2 className="border-b border-slate-300 pb-2 text-lg font-black uppercase tracking-wide">
                    Summary
                  </h2>

                  <p className="mt-3 leading-7 text-slate-700">
                    {resumeData.summary ||
                      "Professional summary will appear here."}
                  </p>
                </section>

                <section className="mt-8">
                  <h2 className="border-b border-slate-300 pb-2 text-lg font-black uppercase tracking-wide">
                    Skills
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {resumeData.skills.length > 0 ? (
                      resumeData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-500">Skills will appear here.</p>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500"
      />
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </label>

      <textarea
        rows={5}
        {...props}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500"
      />
    </div>
  );
}
