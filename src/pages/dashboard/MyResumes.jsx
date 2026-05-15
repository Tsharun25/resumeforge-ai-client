import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Loader2, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function MyResumes() {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/resumes");

      setResumes(data.resumes || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch resumes");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteResume = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const { data } = await api.delete(`/resumes/${id}`);

      toast.success(data.message || "Resume deleted successfully");

      setResumes((prev) => prev.filter((resume) => resume._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete resume");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <Loader2 className="animate-spin text-indigo-600" size={22} />
          <span className="font-bold text-slate-700">Loading resumes...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
            My Resumes
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            View, manage, and delete your saved resumes.
          </p>
        </div>

        <Link
          to="/dashboard/create-resume"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Create New Resume
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
            <FileText size={30} />
          </div>

          <h2 className="mt-5 text-2xl font-black text-slate-950">
            No resumes yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Create your first AI-powered resume and save it to your dashboard.
          </p>

          <Link
            to="/dashboard/create-resume"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white"
          >
            <Plus size={18} />
            Create Resume
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <FileText size={24} />
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black capitalize text-slate-600">
                  {resume.template}
                </span>
              </div>

              <h2 className="mt-5 line-clamp-1 text-xl font-black text-slate-950">
                {resume.title || "Untitled Resume"}
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {resume.fullName || "No name"}
              </p>

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                {resume.summary || "No summary added yet."}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {(resume.skills || []).slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  to={`/dashboard/create-resume?id=${resume._id}`}
                  className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-indigo-600"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteResume(resume._id)}
                  disabled={deletingId === resume._id}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-70"
                >
                  {deletingId === resume._id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}