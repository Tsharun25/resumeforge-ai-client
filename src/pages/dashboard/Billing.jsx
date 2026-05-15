import { Check, Crown, Sparkles, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying ResumeForge AI.",
    features: [
      "3 saved resumes",
      "Demo AI resume generation",
      "Basic templates",
      "PDF export",
      "Cover letter generator",
    ],
    button: "Current Plan",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    description: "For job seekers who want unlimited resume power.",
    features: [
      "Unlimited resumes",
      "Unlimited AI generations",
      "Premium templates",
      "Priority PDF export",
      "Advanced cover letters",
      "Future analytics dashboard",
    ],
    button: "Upgrade to Pro",
    highlighted: true,
  },
];

export default function Billing() {
  return (
    <div>
      <div className="mb-8 rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-100 sm:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15">
          <Crown size={28} />
        </div>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          Subscription & Billing
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-indigo-100 sm:text-base">
          ResumeForge AI uses a simple SaaS pricing model. This page is built as
          a portfolio-ready subscription UI and can later be connected with
          Stripe.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8 ${
              plan.highlighted
                ? "border-indigo-600 ring-4 ring-indigo-100"
                : "border-slate-200"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute right-6 top-6 rounded-full bg-indigo-600 px-4 py-2 text-xs font-black text-white">
                Recommended
              </div>
            )}

            <div
              className={`flex h-14 w-14 items-center justify-center rounded-3xl ${
                plan.highlighted
                  ? "bg-indigo-50 text-indigo-600"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {plan.highlighted ? <Zap size={27} /> : <Sparkles size={27} />}
            </div>

            <h2 className="mt-6 text-2xl font-black text-slate-950">
              {plan.name}
            </h2>

            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-black tracking-tight text-slate-950">
                {plan.price}
              </span>
              <span className="mb-2 text-sm font-bold text-slate-500">
                /month
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              {plan.description}
            </p>

            <button
              className={`mt-7 w-full rounded-2xl px-5 py-3 text-sm font-black transition ${
                plan.highlighted
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
                  : "bg-slate-950 text-white hover:bg-slate-800"
              }`}
            >
              {plan.button}
            </button>

            <div className="mt-8 space-y-4">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      plan.highlighted
                        ? "bg-indigo-50 text-indigo-600"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Check size={14} />
                  </span>

                  <p className="text-sm font-semibold text-slate-600">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-black text-slate-950">
          Stripe Integration Ready
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
          For portfolio purposes, this subscription page shows a clean SaaS
          pricing system. Later, you can connect Stripe Checkout, save
          subscription status in MongoDB, and unlock Pro features based on user
          plan.
        </p>
      </div>
    </div>
  );
}