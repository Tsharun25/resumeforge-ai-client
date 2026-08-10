import { useEffect, useState } from "react";
import {
  Check,
  Crown,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Try CareerPilot AI with limited access.",
    features: [
      "10 free AI credits",
      "1 saved resume",
      "1 cover letter per month",
      "Classic ATS template + PDF",
      "Bangla and English output",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: 199,
    description: "Best for students and freshers.",
    features: [
      "Up to 5 saved resumes",
      "5 cover letters/month",
      "20 AI credits",
      "Job Match report + all templates",
      "Recruiter message + PDF export",
      "Bangla + English output",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 499,
    description: "Best for job seekers and freelancers.",
    features: [
      "80 AI credits",
      "Up to 30 saved resumes",
      "30 cover letters/month",
      "Full job-specific optimization",
      "Upwork/Fiverr profile tools",
      "Opportunity Planner + Live Trend Radar",
      "All templates + PDF export",
    ],
    popular: true,
  },
];

const merchantNumbers = [
  ["bKash", import.meta.env.VITE_BKASH_NUMBER],
  ["Nagad", import.meta.env.VITE_NAGAD_NUMBER],
  ["Rocket", import.meta.env.VITE_ROCKET_NUMBER],
  ["Tap", import.meta.env.VITE_TAP_NUMBER],
  ["Upay", import.meta.env.VITE_UPAY_NUMBER],
].filter(([, value]) => Boolean(value?.trim()));

const bankDetails = [
  ["Bank Name", import.meta.env.VITE_BANK_NAME],
  ["Account Name", import.meta.env.VITE_BANK_ACCOUNT_NAME],
  ["Account Number", import.meta.env.VITE_BANK_ACCOUNT_NUMBER],
  ["Branch", import.meta.env.VITE_BANK_BRANCH],
  ["Routing Number", import.meta.env.VITE_BANK_ROUTING_NUMBER],
].filter(([, value]) => Boolean(value?.trim()));

const hasBankTransfer = Boolean(import.meta.env.VITE_BANK_ACCOUNT_NUMBER?.trim());

const paymentMethods = [
  ...merchantNumbers.map(([label]) => label),
  ...(hasBankTransfer ? ["Bank Transfer"] : []),
];

export default function Billing() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [formData, setFormData] = useState({
    paymentMethod: paymentMethods[0] || "",
    senderNumber: "",
    transactionId: "",
    note: "",
  });

  const selectedPlanData = plans.find((plan) => plan.id === selectedPlan);

  const fetchCurrentUser = async () => {
    try {
      setIsLoadingUser(true);

      const { data } = await api.get("/auth/me");

      setCurrentUser(data.user);
      localStorage.setItem("resumeforge_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("careerpilot-user-updated"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load user plan");
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fetchPaymentRequests = async () => {
    try {
      setIsLoadingRequests(true);

      const { data } = await api.get("/payments/my-requests");

      setPaymentRequests(data.requests || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load payment requests"
      );
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchCurrentUser();
      fetchPaymentRequests();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitPaymentRequest = async (event) => {
    event.preventDefault();

    if (!selectedPlan || selectedPlan === "free") {
      toast.error("Please select a paid plan");
      return;
    }

    if (!formData.senderNumber.trim()) {
      toast.error("Sender number or account is required");
      return;
    }

    if (!formData.paymentMethod) {
      toast.error("Payment is not configured yet. Please contact support.");
      return;
    }

    if (!formData.transactionId.trim()) {
      toast.error("Transaction ID is required");
      return;
    }

    try {
      setIsSubmitting(true);

      const { data } = await api.post("/payments/request", {
        plan: selectedPlan,
        ...formData,
      });

      toast.success(data.message || "Payment request submitted");

      setFormData({
        paymentMethod: paymentMethods[0] || "",
        senderNumber: "",
        transactionId: "",
        note: "",
      });

      fetchPaymentRequests();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit payment request"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasPendingRequest = paymentRequests.some(
    (request) => request.status === "pending"
  );

  return (
    <div>
      <div className="mb-8 rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-100 sm:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15">
          <Crown size={28} />
        </div>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          Bangladesh Pricing & Manual Payment
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-indigo-100 sm:text-base">
          Pay manually through bKash, Nagad, Rocket, Tap, Upay, or bank
          transfer and submit transaction details for admin approval.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatusPill
            label="Current Plan"
            value={formatPlanName(currentUser?.plan || "free")}
            loading={isLoadingUser}
          />
          <StatusPill
            label="AI Credits"
            value={currentUser?.aiCredits ?? 0}
            loading={isLoadingUser}
          />
          <StatusPill
            label="Payment Status"
            value={hasPendingRequest ? "Pending Review" : "Ready"}
            loading={isLoadingRequests}
          />
          <StatusPill
            label="Plan Valid Until"
            value={formatExpiry(currentUser?.planExpiresAt)}
            loading={isLoadingUser}
          />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {plans.map((plan) => {
          const isCurrentPlan = currentUser?.plan === plan.id;
          const isSelected = selectedPlan === plan.id;

          return (
            <button
              key={plan.id}
              type="button"
              disabled={plan.id === "free"}
              onClick={() => plan.id !== "free" && setSelectedPlan(plan.id)}
              className={`relative rounded-[2rem] border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200 disabled:cursor-default ${
                isSelected
                  ? "border-indigo-600 ring-4 ring-indigo-100"
                  : "border-slate-200"
              }`}
            >
              <div className="absolute right-5 top-5 flex flex-wrap justify-end gap-2">
                {plan.popular && (
                  <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-black text-white">
                    Popular
                  </span>
                )}

                {isCurrentPlan && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                    Current
                  </span>
                )}
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  plan.id === "pro"
                    ? "bg-indigo-50 text-indigo-600"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {plan.id === "pro" ? <Zap size={24} /> : <Sparkles size={24} />}
              </div>

              <h2 className="mt-5 text-xl font-black text-slate-950">
                {plan.name}
              </h2>

              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-black text-slate-950">
                  BDT {plan.price}
                </span>
                {plan.price > 0 && (
                  <span className="mb-1 text-sm font-bold text-slate-500">
                    /month
                  </span>
                )}
              </div>

              <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                {plan.description}
              </p>

              <div className="mt-5 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-indigo-600"
                    />
                    <span className="text-sm font-semibold text-slate-600">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
            Credit guide
          </p>
          <h2 className="mt-2 text-xl font-black text-slate-950">
            Know the cost before you generate
          </h2>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <CreditCost label="Job application AI" value="1 credit" />
          <CreditCost label="Cover letter" value="1 credit" />
          <CreditCost label="Freelancer tool" value="1–2 credits" />
          <CreditCost label="Opportunity plan" value="2 credits" />
          <CreditCost label="Live Trend Radar" value="3 credits" />
        </div>

        <p className="mt-4 text-xs font-semibold leading-6 text-slate-500">
          A failed AI request is refunded automatically. Saved resumes and
          downloaded documents do not consume additional AI credits.
        </p>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-950">
                Manual Payment Request
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Selected plan:{" "}
                <span className="font-black text-indigo-600">
                  {selectedPlanData?.name} - BDT {selectedPlanData?.price}
                </span>
              </p>
              {currentUser?.plan === selectedPlan && (
                <p className="mt-1 text-xs font-bold text-emerald-700">
                  Renewal adds another month after your current expiry date.
                </p>
              )}
            </div>
          </div>

          {merchantNumbers.length > 0 && (
          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <h3 className="font-black text-slate-950">
              Send payment to merchant number
            </h3>

            <div className="mt-4 grid gap-3 text-sm">
              {merchantNumbers.map(([label, value]) => (
                <PaymentInfo key={label} label={label} value={value} />
              ))}
            </div>

            <p className="mt-4 text-xs font-semibold leading-6 text-slate-500">
              All mobile payment methods are linked to the same verified
              number for this account.
            </p>
          </div>
          )}

          {hasBankTransfer && (
          <div className="mt-4 rounded-3xl bg-slate-50 p-5">
            <h3 className="font-black text-slate-950">
              Bank transfer details
            </h3>

            <div className="mt-4 grid gap-3 text-sm">
              {bankDetails.map(([label, value]) => (
                <PaymentInfo key={label} label={label} value={value} />
              ))}
            </div>

            <p className="mt-4 text-xs font-semibold leading-6 text-slate-500">
              Use the account details above for bank transfer verification.
            </p>
          </div>
          )}

          {paymentMethods.length === 0 && (
            <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-bold leading-6 text-amber-800">
                Payment details are not configured yet. Please contact support
                before sending any money.
              </p>
            </div>
          )}

          {hasPendingRequest && (
            <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-bold leading-6 text-amber-800">
                You already have a pending payment request. Please wait for
                admin approval before submitting another request.
              </p>
            </div>
          )}

          <form onSubmit={submitPaymentRequest} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(event) =>
                  handleChange("paymentMethod", event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Sender Number / Account"
              placeholder="01XXXXXXXXX or bank account number"
              value={formData.senderNumber}
              onChange={(value) => handleChange("senderNumber", value)}
            />

            <Input
              label="Transaction ID"
              placeholder="Example: 9A7B6C123D"
              value={formData.transactionId}
              onChange={(value) => handleChange("transactionId", value)}
            />

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Note optional
              </label>
              <textarea
                value={formData.note}
                onChange={(event) => handleChange("note", event.target.value)}
                rows="4"
                placeholder="Write any additional note for admin..."
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <button
              disabled={
                isSubmitting ||
                selectedPlan === "free" ||
                hasPendingRequest
                || paymentMethods.length === 0
              }
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  {currentUser?.plan === selectedPlan
                    ? "Submit Renewal Request"
                    : "Submit Payment Request"}
                </>
              )}
            </button>
          </form>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black text-slate-950">
            My Payment Requests
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track submitted manual payment requests.
          </p>

          <div className="mt-6 space-y-4">
            {isLoadingRequests ? (
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <Loader2 className="animate-spin text-indigo-600" size={20} />
                <span className="text-sm font-bold text-slate-600">
                  Loading requests...
                </span>
              </div>
            ) : paymentRequests.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <h3 className="text-lg font-black text-slate-950">
                  No payment requests yet
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Select a paid plan, send payment, and submit transaction
                  details here.
                </p>
              </div>
            ) : (
              paymentRequests.map((request) => (
                <PaymentRequestCard key={request._id} request={request} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Input({ label, value, placeholder, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      />
    </div>
  );
}

function StatusPill({ label, value, loading }) {
  return (
    <div className="rounded-3xl bg-white/15 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-indigo-100">
        {label}
      </p>
      <p className="mt-1 text-lg font-black capitalize text-white">
        {loading ? "..." : value}
      </p>
    </div>
  );
}

function PaymentInfo({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
      <span className="font-bold text-slate-600">{label}</span>
      <span className="font-black text-slate-950">{value}</span>
    </div>
  );
}

function PaymentRequestCard({ request }) {
  const statusClassMap = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-black capitalize text-slate-950">
            {request.plan} Plan
          </h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            ৳{request.amount} • {request.paymentMethod}
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-black capitalize ${
            statusClassMap[request.status] || statusClassMap.pending
          }`}
        >
          {request.status}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <p>
          <span className="font-black text-slate-800">Sender:</span>{" "}
          {request.senderNumber}
        </p>
        <p>
          <span className="font-black text-slate-800">Transaction ID:</span>{" "}
          {request.transactionId}
        </p>
      </div>
    </div>
  );
}

function formatPlanName(plan) {
  const map = {
    free: "Free",
    starter: "Starter",
    pro: "Pro",
    agency: "Agency",
  };

  return map[plan] || "Free";
}

function CreditCost({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 font-black text-slate-950">{value}</p>
    </div>
  );
}

function formatExpiry(date) {
  if (!date) return "No expiry";

  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "Unavailable";

  return value.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
