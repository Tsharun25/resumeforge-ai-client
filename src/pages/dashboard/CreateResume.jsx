import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  BriefcaseBusiness,
  Check,
  Download,
  FolderKanban,
  GraduationCap,
  Loader2,
  Lock,
  Plus,
  Save,
  ShieldCheck,
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
    achievements: "",
    jobDescription: "",
    language: "English",
    tone: "Professional",
  });

  const [aiResult, setAiResult] = useState(null);

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
        resumeData,
      });
      const content = data.data || data.content || {};

      setResumeData((prev) => ({
        ...prev,
        title: prev.title || aiForm.targetRole,
        summary: content.summary || prev.summary,
        skills:
          content.optimizedSkills?.length > 0
            ? content.optimizedSkills
            : prev.skills,
        experience:
          content.experienceDescription && prev.experience.length > 0
            ? prev.experience.map((item, index) =>
                index === 0
                  ? { ...item, description: content.experienceDescription }
                  : item,
              )
            : prev.experience,
        projects:
          content.projectDescription && prev.projects.length > 0
            ? prev.projects.map((item, index) =>
                index === 0
                  ? { ...item, description: content.projectDescription }
                  : item,
              )
            : prev.projects,
      }));

      setAiResult({
        ...content,
        source: data.source,
        remainingCredits: data.remainingCredits,
      });

      const storedUser = JSON.parse(
        localStorage.getItem("resumeforge_user") || "null",
      );

      if (storedUser && Number.isFinite(data.remainingCredits)) {
        localStorage.setItem(
          "resumeforge_user",
          JSON.stringify({
            ...storedUser,
            aiCredits: data.remainingCredits,
          }),
        );
        window.dispatchEvent(new Event("careerpilot-user-updated"));
      }

      toast.success("Job-specific resume analysis completed.");
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

  const addObjectItem = (field, item) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: [...prev[field], item],
    }));
  };

  const updateObjectItem = (field, index, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const removeObjectItem = (field, index) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const addStringItem = (field) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const updateStringItem = (field, index, value) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  };

  const removeStringItem = (field, index) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, itemIndex) => itemIndex !== index),
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
              Job Application Studio
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Tailor a truthful, ATS-friendly resume to a real job description.
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
              Analyze & Optimize
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

          <ObjectSection
            title="Work Experience"
            icon={BriefcaseBusiness}
            items={resumeData.experience}
            emptyItem={{
              company: "",
              role: "",
              duration: "",
              description: "",
            }}
            fields={[
              { key: "company", label: "Company" },
              { key: "role", label: "Role" },
              { key: "duration", label: "Duration" },
              {
                key: "description",
                label: "Achievements and responsibilities",
                multiline: true,
              },
            ]}
            onAdd={(item) => addObjectItem("experience", item)}
            onUpdate={(index, key, value) =>
              updateObjectItem("experience", index, key, value)
            }
            onRemove={(index) => removeObjectItem("experience", index)}
          />

          <ObjectSection
            title="Projects"
            icon={FolderKanban}
            items={resumeData.projects}
            emptyItem={{ name: "", stack: "", description: "" }}
            fields={[
              { key: "name", label: "Project name" },
              { key: "stack", label: "Tools / technologies" },
              {
                key: "description",
                label: "What you built and the result",
                multiline: true,
              },
            ]}
            onAdd={(item) => addObjectItem("projects", item)}
            onUpdate={(index, key, value) =>
              updateObjectItem("projects", index, key, value)
            }
            onRemove={(index) => removeObjectItem("projects", index)}
          />

          <ObjectSection
            title="Education"
            icon={GraduationCap}
            items={resumeData.education}
            emptyItem={{ degree: "", institute: "", year: "" }}
            fields={[
              { key: "degree", label: "Degree" },
              { key: "institute", label: "Institute" },
              { key: "year", label: "Year" },
            ]}
            onAdd={(item) => addObjectItem("education", item)}
            onUpdate={(index, key, value) =>
              updateObjectItem("education", index, key, value)
            }
            onRemove={(index) => removeObjectItem("education", index)}
          />

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

          <StringListSection
            title="Certifications"
            items={resumeData.certifications}
            placeholder="Certification name"
            onAdd={() => addStringItem("certifications")}
            onUpdate={(index, value) =>
              updateStringItem("certifications", index, value)
            }
            onRemove={(index) => removeStringItem("certifications", index)}
          />

          <StringListSection
            title="Languages"
            items={resumeData.languages}
            placeholder="English — Professional"
            onAdd={() => addStringItem("languages")}
            onUpdate={(index, value) =>
              updateStringItem("languages", index, value)
            }
            onRemove={(index) => removeStringItem("languages", index)}
          />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Job Match Assistant
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Paste the real job description. AI only uses facts you provide and
              lists unsupported requirements as gaps instead of inventing them.
            </p>

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
                label="Your verified skills"
                value={aiForm.skills}
                onChange={(e) => updateAiForm("skills", e.target.value)}
              />

              <TextArea
                label="Verified achievements (numbers and results help)"
                value={aiForm.achievements}
                onChange={(e) => updateAiForm("achievements", e.target.value)}
              />

              <TextArea
                label="Target job description"
                value={aiForm.jobDescription}
                onChange={(e) =>
                  updateAiForm("jobDescription", e.target.value)
                }
                rows={9}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Output language"
                  value={aiForm.language}
                  options={["English", "Bangla", "Bangla + English"]}
                  onChange={(e) => updateAiForm("language", e.target.value)}
                />
                <SelectField
                  label="Tone"
                  value={aiForm.tone}
                  options={["Professional", "Confident", "Concise", "Fresher"]}
                  onChange={(e) => updateAiForm("tone", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {aiResult && <JobMatchReport result={aiResult} />}

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

                {resumeData.experience.length > 0 && (
                  <PreviewSection title="Experience">
                    <div className="space-y-5">
                      {resumeData.experience.map((item, index) => (
                        <div key={`${item.company}-${index}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-black">{item.role}</h3>
                              <p className="font-semibold text-indigo-700">
                                {item.company}
                              </p>
                            </div>
                            <span className="text-sm text-slate-500">
                              {item.duration}
                            </span>
                          </div>
                          <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </PreviewSection>
                )}

                {resumeData.projects.length > 0 && (
                  <PreviewSection title="Projects">
                    <div className="space-y-5">
                      {resumeData.projects.map((item, index) => (
                        <div key={`${item.name}-${index}`}>
                          <h3 className="font-black">{item.name}</h3>
                          <p className="text-sm font-semibold text-indigo-700">
                            {item.stack}
                          </p>
                          <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </PreviewSection>
                )}

                {resumeData.education.length > 0 && (
                  <PreviewSection title="Education">
                    <div className="space-y-3">
                      {resumeData.education.map((item, index) => (
                        <div
                          key={`${item.institute}-${index}`}
                          className="flex items-start justify-between gap-4"
                        >
                          <div>
                            <h3 className="font-black">{item.degree}</h3>
                            <p className="text-slate-700">{item.institute}</p>
                          </div>
                          <span className="text-sm text-slate-500">
                            {item.year}
                          </span>
                        </div>
                      ))}
                    </div>
                  </PreviewSection>
                )}

                {(resumeData.certifications.length > 0 ||
                  resumeData.languages.length > 0) && (
                  <PreviewSection title="Additional Information">
                    {resumeData.certifications.length > 0 && (
                      <p className="leading-7 text-slate-700">
                        <strong>Certifications:</strong>{" "}
                        {resumeData.certifications.filter(Boolean).join(", ")}
                      </p>
                    )}
                    {resumeData.languages.length > 0 && (
                      <p className="mt-2 leading-7 text-slate-700">
                        <strong>Languages:</strong>{" "}
                        {resumeData.languages.filter(Boolean).join(", ")}
                      </p>
                    )}
                  </PreviewSection>
                )}
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

function SelectField({ label, options, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </label>
      <select
        {...props}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500"
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

function ObjectSection({
  title,
  icon: Icon,
  items,
  emptyItem,
  fields,
  onAdd,
  onUpdate,
  onRemove,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Icon size={19} />
          </span>
          <h2 className="text-2xl font-black text-slate-950">{title}</h2>
        </div>
        <button
          type="button"
          onClick={() => onAdd({ ...emptyItem })}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-black text-white"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {items.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
          Add verified information so AI can create specific, truthful content.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="grid gap-4">
                {fields.map((field) =>
                  field.multiline ? (
                    <TextArea
                      key={field.key}
                      label={field.label}
                      value={item[field.key] || ""}
                      onChange={(event) =>
                        onUpdate(index, field.key, event.target.value)
                      }
                    />
                  ) : (
                    <Input
                      key={field.key}
                      label={field.label}
                      value={item[field.key] || ""}
                      onChange={(event) =>
                        onUpdate(index, field.key, event.target.value)
                      }
                    />
                  ),
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="mt-4 inline-flex items-center gap-2 text-sm font-black text-red-600"
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function StringListSection({
  title,
  items,
  placeholder,
  onAdd,
  onUpdate,
  onRemove,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-slate-950">{title}</h2>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-black text-white"
        >
          <Plus size={16} /> Add
        </button>
      </div>
      <div className="mt-5 space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3">
            <input
              value={item}
              onChange={(event) => onUpdate(index, event.target.value)}
              placeholder={placeholder}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function JobMatchReport({ result }) {
  const score = Number(result.matchScore || 0);
  const scoreColor =
    score >= 75
      ? "bg-emerald-100 text-emerald-700"
      : score >= 50
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700";

  return (
    <section className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
            Evidence-based analysis
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Job Match Report
          </h2>
        </div>
        <span className={`rounded-2xl px-4 py-3 text-2xl font-black ${scoreColor}`}>
          {score}%
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <ReportList
          title="Matched keywords"
          icon={ShieldCheck}
          items={result.matchedKeywords}
          emptyText="Add a job description for keyword matching."
        />
        <ReportList
          title="Missing evidence"
          icon={AlertTriangle}
          items={result.missingKeywords}
          emptyText="No major unsupported requirement detected."
        />
        <ReportList
          title="Strengths"
          icon={Check}
          items={result.strengths}
          emptyText="Add more verified achievements."
        />
        <ReportList
          title="Improve next"
          icon={Sparkles}
          items={result.improvements}
          emptyText="No immediate improvement returned."
        />
      </div>

      {result.truthCheckQuestions?.length > 0 && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <h3 className="font-black text-amber-900">Facts to confirm</h3>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-amber-900">
            {result.truthCheckQuestions.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      )}

      {result.recruiterMessage && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="font-black text-slate-950">Recruiter message</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
            {result.recruiterMessage}
          </p>
        </div>
      )}

      <p className="mt-4 text-xs font-bold text-slate-500">
        Source: {result.source} • Remaining credits: {result.remainingCredits}
      </p>
    </section>
  );
}

function ReportList({ title, icon: Icon, items = [], emptyText }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="flex items-center gap-2 font-black text-slate-950">
        <Icon size={17} className="text-indigo-600" /> {title}
      </h3>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          {items.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-6 text-slate-500">{emptyText}</p>
      )}
    </div>
  );
}

function PreviewSection({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="border-b border-slate-300 pb-2 text-lg font-black uppercase tracking-wide">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
