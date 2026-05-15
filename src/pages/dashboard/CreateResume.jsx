import { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Sparkles,
  Trash2,
  Download,
  Check,
  Loader2,
  Wand2,
  Save,
} from "lucide-react";

const templates = [
  {
    id: "classic",
    name: "Classic",
    description: "ATS-friendly traditional layout",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold header with clean sections",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple, elegant, recruiter-focused",
  },
];

const initialResume = {
  fullName: "Harun Ahmed",
  title: "MERN Stack Developer",
  email: "harun@example.com",
  phone: "+880 1XXXXXXXXX",
  location: "Dhaka, Bangladesh",
  portfolio: "https://harun.dev",
  summary:
    "Passionate MERN Stack Developer with experience building modern, scalable, and user-friendly web applications using React, Node.js, Express, and MongoDB.",
  skills: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JWT"],
  experience: [
    {
      company: "Freelance",
      role: "MERN Stack Developer",
      duration: "2024 - Present",
      description:
        "Built full-stack web applications including ecommerce platforms, CRM dashboards, and service-based business platforms.",
    },
  ],
  projects: [
    {
      name: "ShebaSathi",
      stack: "React, Node.js, MongoDB",
      description:
        "A professional service/business platform with modern UI, authentication, and dashboard experience.",
    },
  ],
};

export default function CreateResume() {
  const resumeRef = useRef(null);
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get("id");
  const [isLoadingResume, setIsLoadingResume] = useState(false);

  const [resume, setResume] = useState(initialResume);
  const [skillInput, setSkillInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [aiForm, setAiForm] = useState({
    jobTitle: "MERN Stack Developer",
    experienceLevel: "Junior",
    skills: "React, Node.js, Express, MongoDB, Tailwind CSS, JWT",
    targetRole: "Full Stack Developer",
  });

  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) return;

      try {
        setIsLoadingResume(true);

        const { data } = await api.get(`/resumes/${resumeId}`);

        const savedResume = data.resume;

        setResume({
          fullName: savedResume.fullName || "",
          title: savedResume.title || "",
          email: savedResume.email || "",
          phone: savedResume.phone || "",
          location: savedResume.location || "",
          portfolio: savedResume.portfolio || "",
          summary: savedResume.summary || "",
          skills: savedResume.skills || [],
          experience: savedResume.experience?.length
            ? savedResume.experience
            : initialResume.experience,
          projects: savedResume.projects?.length
            ? savedResume.projects
            : initialResume.projects,
        });

        setSelectedTemplate(savedResume.template || "classic");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load resume");
      } finally {
        setIsLoadingResume(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  const updateField = (field, value) => {
    setResume((prev) => ({ ...prev, [field]: value }));
  };

  const updateAiForm = (field, value) => {
    setAiForm((prev) => ({ ...prev, [field]: value }));
  };

  const generateWithAI = async () => {
    try {
      setIsGenerating(true);

      const { data } = await api.post("/ai/generate-resume", aiForm);

      const aiData = data.data;

      setResume((prev) => ({
        ...prev,
        title: aiForm.jobTitle,
        summary: aiData.summary || prev.summary,
        skills: aiForm.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        experience: [
          {
            ...prev.experience[0],
            role: aiForm.jobTitle,
            description:
              aiData.experienceDescription || prev.experience[0].description,
          },
          ...prev.experience.slice(1),
        ],
        projects: [
          {
            ...prev.projects[0],
            description:
              aiData.projectDescription || prev.projects[0].description,
          },
          ...prev.projects.slice(1),
        ],
      }));

      toast.success("AI resume content generated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "AI generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;

    setResume((prev) => ({
      ...prev,
      skills: [...prev.skills, value],
    }));

    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const updateExperience = (index, field, value) => {
    const updatedExperience = [...resume.experience];
    updatedExperience[index][field] = value;
    setResume((prev) => ({ ...prev, experience: updatedExperience }));
  };

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", role: "", duration: "", description: "" },
      ],
    }));
  };

  const removeExperience = (index) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateProject = (index, field, value) => {
    const updatedProjects = [...resume.projects];
    updatedProjects[index][field] = value;
    setResume((prev) => ({ ...prev, projects: updatedProjects }));
  };

  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [...prev.projects, { name: "", stack: "", description: "" }],
    }));
  };

  const removeProject = (index) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const saveResume = async () => {
    try {
      setIsSaving(true);

      const payload = {
        ...resume,
        template: selectedTemplate,
      };

      if (resumeId) {
        const { data } = await api.put(`/resumes/${resumeId}`, payload);
        toast.success(data.message || "Resume updated successfully!");
      } else {
        const { data } = await api.post("/resumes", payload);
        toast.success(data.message || "Resume saved successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save resume");
    } finally {
      setIsSaving(false);
    }
  };

  const exportPDF = async () => {
    if (!resumeRef.current) return;

    try {
      setIsExporting(true);

      const fileName = `${resume.fullName || "resume"}-resume.pdf`
        .toLowerCase()
        .replaceAll(" ", "-");

      await html2pdf()
        .set({
          margin: 0,
          filename: fileName,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          },
          jsPDF: {
            unit: "px",
            format: [794, 1123],
            orientation: "portrait",
          },
        })
        .from(resumeRef.current)
        .save();

      toast.success("PDF exported successfully!");
    } catch (error) {
      toast.error(error.message || "PDF export failed");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoadingResume) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <Loader2 className="animate-spin text-indigo-600" size={22} />
          <span className="font-bold text-slate-700">Loading resume...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
            {resumeId ? "Edit Resume" : "Create Resume"}
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Generate AI-powered resume content and export polished PDFs.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={saveResume}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                {resumeId ? "Update Resume" : "Save Resume"}
              </>
            )}
          </button>

          <button
            onClick={exportPDF}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-70"
          >
            {isExporting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={18} />
                Export PDF
              </>
            )}
          </button>
        </div>
      </div>

      <FormCard
        title="Generate with AI"
        action={<Wand2 className="text-indigo-600" size={22} />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Job Title"
            value={aiForm.jobTitle}
            onChange={(value) => updateAiForm("jobTitle", value)}
          />

          <Input
            label="Experience Level"
            value={aiForm.experienceLevel}
            onChange={(value) => updateAiForm("experienceLevel", value)}
          />

          <Input
            label="Target Role"
            value={aiForm.targetRole}
            onChange={(value) => updateAiForm("targetRole", value)}
          />

          <Input
            label="Skills"
            value={aiForm.skills}
            onChange={(value) => updateAiForm("skills", value)}
          />
        </div>

        <button
          onClick={generateWithAI}
          disabled={isGenerating}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-600 disabled:opacity-70 sm:w-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Resume Content
            </>
          )}
        </button>
      </FormCard>

      <FormCard title="Choose Template">
        <div className="grid gap-4 md:grid-cols-3">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setSelectedTemplate(template.id)}
              className={`rounded-3xl border p-5 text-left transition ${
                selectedTemplate === template.id
                  ? "border-indigo-600 bg-indigo-50 ring-4 ring-indigo-100"
                  : "border-slate-200 bg-white hover:border-indigo-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-black text-slate-950">{template.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {template.description}
                  </p>
                </div>

                {selectedTemplate === template.id && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check size={16} />
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </FormCard>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="space-y-6">
          <FormCard title="Personal Information">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Full Name"
                value={resume.fullName}
                onChange={(value) => updateField("fullName", value)}
              />
              <Input
                label="Professional Title"
                value={resume.title}
                onChange={(value) => updateField("title", value)}
              />
              <Input
                label="Email"
                value={resume.email}
                onChange={(value) => updateField("email", value)}
              />
              <Input
                label="Phone"
                value={resume.phone}
                onChange={(value) => updateField("phone", value)}
              />
              <Input
                label="Location"
                value={resume.location}
                onChange={(value) => updateField("location", value)}
              />
              <Input
                label="Portfolio"
                value={resume.portfolio}
                onChange={(value) => updateField("portfolio", value)}
              />
            </div>
          </FormCard>

          <FormCard title="Professional Summary">
            <textarea
              value={resume.summary}
              onChange={(event) => updateField("summary", event.target.value)}
              rows="5"
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </FormCard>

          <FormCard title="Skills">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Add skill e.g. React"
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={addSkill}
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
              >
                Add Skill
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-black text-indigo-700 transition hover:bg-red-50 hover:text-red-600"
                >
                  {skill} ×
                </button>
              ))}
            </div>
          </FormCard>

          <FormCard
            title="Experience"
            action={
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-black text-indigo-700"
              >
                <Plus size={15} />
                Add
              </button>
            }
          >
            <div className="space-y-5">
              {resume.experience.map((item, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-black text-slate-800">
                      Experience #{index + 1}
                    </h3>

                    {resume.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="rounded-xl bg-red-50 p-2 text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Company"
                      value={item.company}
                      onChange={(value) =>
                        updateExperience(index, "company", value)
                      }
                    />
                    <Input
                      label="Role"
                      value={item.role}
                      onChange={(value) =>
                        updateExperience(index, "role", value)
                      }
                    />
                    <Input
                      label="Duration"
                      value={item.duration}
                      onChange={(value) =>
                        updateExperience(index, "duration", value)
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Description
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(event) =>
                        updateExperience(
                          index,
                          "description",
                          event.target.value,
                        )
                      }
                      rows="4"
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </FormCard>

          <FormCard
            title="Projects"
            action={
              <button
                type="button"
                onClick={addProject}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-black text-indigo-700"
              >
                <Plus size={15} />
                Add
              </button>
            }
          >
            <div className="space-y-5">
              {resume.projects.map((item, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-black text-slate-800">
                      Project #{index + 1}
                    </h3>

                    {resume.projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="rounded-xl bg-red-50 p-2 text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Project Name"
                      value={item.name}
                      onChange={(value) => updateProject(index, "name", value)}
                    />
                    <Input
                      label="Tech Stack"
                      value={item.stack}
                      onChange={(value) => updateProject(index, "stack", value)}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Description
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(event) =>
                        updateProject(index, "description", event.target.value)
                      }
                      rows="4"
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </FormCard>
        </section>

        <section className="xl:sticky xl:top-24 xl:self-start">
          <ResumePreview
            resume={resume}
            template={selectedTemplate}
            resumeRef={resumeRef}
          />
        </section>
      </div>
    </div>
  );
}

function FormCard({ title, action, children }) {
  return (
    <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-black text-slate-950 sm:text-xl">
          {title}
        </h2>
        {action}
      </div>
      {children}
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

function ResumePreview({ resume, template, resumeRef }) {
  const templateClassMap = {
    classic: "border-t-8 border-slate-950",
    modern: "border-t-8 border-indigo-600",
    minimal: "border-t border-slate-200",
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200 sm:p-5">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-black text-slate-950">Live Preview</h2>
          <p className="text-sm text-slate-500">
            {template.charAt(0).toUpperCase() + template.slice(1)} Template
          </p>
        </div>

        <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
          PDF Ready
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-2 sm:p-4">
        <div
          ref={resumeRef}
          className={`mx-auto min-h-[1123px] w-full max-w-[794px] bg-white p-5 sm:p-10 text-slate-900 shadow-sm ${templateClassMap[template]}`}
        >
          <ResumeHeader resume={resume} template={template} />

          <ResumeSection title="Summary" template={template}>
            <p className="text-sm leading-6 text-slate-700">{resume.summary}</p>
          </ResumeSection>

          <ResumeSection title="Skills" template={template}>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span
                  key={skill}
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    template === "modern"
                      ? "bg-indigo-50 text-indigo-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Experience" template={template}>
            <div className="space-y-5">
              {resume.experience.map((item, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-black text-slate-950">
                        {item.role || "Role"}
                      </h3>
                      <p className="text-sm font-bold text-slate-600">
                        {item.company || "Company"}
                      </p>
                    </div>

                    <p className="text-xs font-bold text-slate-500">
                      {item.duration}
                    </p>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Projects" template={template}>
            <div className="space-y-5">
              {resume.projects.map((item, index) => (
                <div key={index}>
                  <h3 className="text-sm font-black text-slate-950">
                    {item.name || "Project Name"}
                  </h3>

                  <p
                    className={`mt-1 text-xs font-bold ${
                      template === "modern"
                        ? "text-indigo-600"
                        : "text-slate-500"
                    }`}
                  >
                    {item.stack}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </ResumeSection>
        </div>
      </div>
    </div>
  );
}

function ResumeHeader({ resume, template }) {
  if (template === "modern") {
    return (
      <div className="-m-10 mb-6 bg-slate-950 p-10 text-white">
        <h1 className="text-4xl font-black tracking-tight">
          {resume.fullName || "Your Name"}
        </h1>

        <p className="mt-1 text-lg font-bold text-indigo-300">
          {resume.title || "Professional Title"}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-300">
          <span>{resume.email}</span>
          <span>{resume.phone}</span>
          <span>{resume.location}</span>
          <span>{resume.portfolio}</span>
        </div>
      </div>
    );
  }

  if (template === "minimal") {
    return (
      <div className="pb-5 text-center">
        <h1 className="text-4xl font-black tracking-tight">
          {resume.fullName || "Your Name"}
        </h1>

        <p className="mt-2 text-lg font-bold text-slate-600">
          {resume.title || "Professional Title"}
        </p>

        <div className="mx-auto mt-4 flex max-w-xl flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
          <span>{resume.email}</span>
          <span>{resume.phone}</span>
          <span>{resume.location}</span>
          <span>{resume.portfolio}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b-2 border-slate-900 pb-5">
      <h1 className="text-4xl font-black tracking-tight">
        {resume.fullName || "Your Name"}
      </h1>

      <p className="mt-1 text-lg font-bold text-indigo-600">
        {resume.title || "Professional Title"}
      </p>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-600">
        <span>{resume.email}</span>
        <span>{resume.phone}</span>
        <span>{resume.location}</span>
        <span>{resume.portfolio}</span>
      </div>
    </div>
  );
}

function ResumeSection({ title, template, children }) {
  const titleClass =
    template === "minimal"
      ? "mb-3 border-b border-slate-200 pb-2 text-sm font-black uppercase tracking-[0.2em] text-slate-700"
      : template === "modern"
        ? "mb-3 border-b border-indigo-100 pb-2 text-sm font-black uppercase tracking-[0.2em] text-indigo-700"
        : "mb-3 border-b border-slate-200 pb-2 text-sm font-black uppercase tracking-[0.2em] text-slate-900";

  return (
    <section className="mt-6">
      <h2 className={titleClass}>{title}</h2>
      {children}
    </section>
  );
}
