import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck, Sparkles } from "lucide-react";

const pages = {
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated: June 2026",
    intro:
      "CareerPilot AI collects only the data needed to run accounts, AI tools, payment support, and product improvements.",
    sections: [
      {
        title: "Information We Collect",
        body: "We may collect your name, email address, password hash, plan data, payment requests, saved resumes, generated documents, and support messages.",
      },
      {
        title: "How We Use Information",
        body: "We use information to operate the dashboard, process manual payments, provide AI output, and respond to support requests.",
      },
      {
        title: "AI Content",
        body: "Inputs submitted to AI tools are processed by the configured third-party AI provider under that provider's terms. Free-tier providers may use submitted content to improve their products. Do not submit passwords, national ID numbers, financial credentials, medical records, or other unnecessary sensitive data.",
      },
      {
        title: "Data Security",
        body: "We use authentication, protected routes, database controls, and environment secrets to keep the platform secure.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "Last updated: June 2026",
    intro:
      "By using CareerPilot AI, you agree to use the platform responsibly for career, freelancing, and content growth work.",
    sections: [
      {
        title: "Account Responsibility",
        body: "You are responsible for keeping your login details safe and for reviewing generated content before using it publicly.",
      },
      {
        title: "AI Output",
        body: "AI-generated content is draft material. Review, edit, and personalize it before sending to employers or clients.",
      },
      {
        title: "Payments and Plans",
        body: "Paid plans activate after manual payment verification. Credits and limits are shown in the dashboard.",
      },
      {
        title: "Misuse",
        body: "Do not use the platform for fraud, spam, impersonation, or harmful activity.",
      },
    ],
  },
  refund: {
    title: "Refund Policy",
    updated: "Last updated: June 2026",
    intro:
      "Refunds are reviewed carefully because plan activation and credits are delivered digitally after payment approval.",
    sections: [
      {
        title: "Before Approval",
        body: "If a payment request is not approved yet, contact support to cancel or correct the request.",
      },
      {
        title: "After Approval",
        body: "Approved payments are reviewed case by case, since AI credits and access may already be delivered.",
      },
      {
        title: "Wrong or Duplicate Payment",
        body: "Duplicate or incorrect payments can be adjusted, credited, or refunded after verification.",
      },
      {
        title: "Support Information",
        body: "Please include your plan, payment method, transaction ID, sender number or account number, and email.",
      },
    ],
  },
  support: {
    title: "Contact & Support",
    updated: "We usually respond as soon as possible.",
    intro:
      "Need help with payment approval, account access, AI credits, or product usage? Contact support with the right details.",
    sections: [
      {
        title: "Support Email",
        body: "support@careerpilot.ai",
      },
      {
        title: "Payment Help",
        body: "Include your selected plan, payment method, transaction ID, sender number or account number, and account email.",
      },
      {
        title: "Product Help",
        body: "Mention which tool you used, what you expected, and any error message you saw.",
      },
    ],
  },
};

export default function LegalPage() {
  const { page = "privacy" } = useParams();
  const content = pages[page] || pages.privacy;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white">
              <Sparkles size={21} />
            </div>
            <span className="text-xl font-black text-slate-950">
              CareerPilot AI
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:text-indigo-700"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            {page === "support" ? <Mail size={24} /> : <ShieldCheck size={24} />}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
              {content.title}
            </h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {content.updated}
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-base leading-8 text-slate-600">{content.intro}</p>

          <div className="mt-8 space-y-6">
            {content.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-black text-slate-950">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
