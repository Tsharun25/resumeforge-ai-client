import { useEffect, useState } from "react";
import {
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
  Shield,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function AdminPayments() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/payments/admin/requests");

      setRequests(data.requests || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  };

  const approveRequest = async (id) => {
    try {
      setProcessingId(id);

      const { data } = await api.patch(
        `/payments/admin/requests/${id}/approve`,
      );

      toast.success(data.message || "Payment approved");
      await fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve request");
    } finally {
      setProcessingId(null);
    }
  };

  const rejectRequest = async (id) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this payment request?",
    );

    if (!confirmReject) return;

    try {
      setProcessingId(id);

      const { data } = await api.patch(
        `/payments/admin/requests/${id}/reject`,
        {
          note: "Rejected by admin",
        },
      );

      toast.success(data.message || "Payment rejected");
      await fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const pendingRequests = requests.filter(
    (request) => request.status === "pending",
  );

  const approvedRequests = requests.filter(
    (request) => request.status === "approved",
  );

  const rejectedRequests = requests.filter(
    (request) => request.status === "rejected",
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <Loader2 className="animate-spin text-indigo-600" size={22} />
          <span className="font-bold text-slate-700">
            Loading payment requests...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-slate-950 to-indigo-700 p-6 text-white shadow-xl shadow-indigo-100 sm:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15">
          <Shield size={28} />
        </div>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          Admin Payment Requests
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-indigo-100 sm:text-base">
          Review manual bKash/Nagad/Rocket payment requests and activate user
          plans after verification.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <AdminStat label="Total" value={requests.length} />
          <AdminStat label="Pending" value={pendingRequests.length} />
          <AdminStat label="Approved" value={approvedRequests.length} />
          <AdminStat label="Rejected" value={rejectedRequests.length} />
        </div>
      </div>

      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-950">Payment Queue</h2>
          <p className="mt-1 text-sm text-slate-500">
            Pending requests appear first for faster approval.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            No payment requests
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Payment requests will appear here after users submit them.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {[...pendingRequests, ...approvedRequests, ...rejectedRequests].map(
            (request) => (
              <PaymentRequestCard
                key={request._id}
                request={request}
                processingId={processingId}
                onApprove={approveRequest}
                onReject={rejectRequest}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}

function AdminStat({ label, value }) {
  return (
    <div className="rounded-3xl bg-white/15 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-indigo-100">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function PaymentRequestCard({ request, processingId, onApprove, onReject }) {
  const statusConfig = {
    pending: {
      label: "Pending",
      badge: "bg-amber-100 text-amber-700",
      icon: Clock,
      panel: "border-amber-200 bg-amber-50",
      message: "Waiting for admin verification.",
    },
    approved: {
      label: "Approved",
      badge: "bg-emerald-100 text-emerald-700",
      icon: CheckCircle,
      panel: "border-emerald-200 bg-emerald-50",
      message: "This payment has been approved and the user plan is activated.",
    },
    rejected: {
      label: "Rejected",
      badge: "bg-red-50 text-red-600",
      icon: XCircle,
      panel: "border-red-200 bg-red-50",
      message: "This payment request was rejected.",
    },
  };

  const config = statusConfig[request.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  const isProcessing = processingId === request._id;
  const isPending = request.status === "pending";

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-black capitalize text-slate-950">
              {request.plan} Plan
            </h2>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black capitalize ${config.badge}`}
            >
              <StatusIcon size={14} />
              {config.label}
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-500">
            Amount: ৳{request.amount} • Method: {request.paymentMethod}
          </p>

          <div className={`mt-5 rounded-3xl border p-4 ${config.panel}`}>
            <p className="text-sm font-bold leading-6 text-slate-700">
              {config.message}
            </p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Info label="User" value={request.user?.fullName || "Unknown"} />
            <Info label="Email" value={request.user?.email || "N/A"} />
            <Info
              label="Activated Plan"
              value={
                request.status === "approved"
                  ? request.plan
                  : request.user?.plan || "free"
              }
            />

            <Info
              label="Activated Credits"
              value={
                request.status === "approved"
                  ? getPlanCredits(request.plan)
                  : (request.user?.aiCredits ?? 0)
              }
            />
            <Info label="Sender Number" value={request.senderNumber} />
            <Info label="Transaction ID" value={request.transactionId} />
          </div>

          {request.note && (
            <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">
              <span className="font-black text-slate-800">Note:</span>{" "}
              {request.note}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          {isPending ? (
            <>
              <button
                onClick={() => onApprove(request._id)}
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <CheckCircle size={18} />
                )}
                Approve
              </button>

              <button
                onClick={() => onReject(request._id)}
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <XCircle size={18} />
                )}
                Reject
              </button>
            </>
          ) : (
            <div
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black ${config.badge}`}
            >
              <StatusIcon size={18} />
              {config.label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold capitalize text-slate-700">
        {value}
      </p>
    </div>
  );
}

function getPlanCredits(plan) {
  const creditsMap = {
    starter: 20,
    pro: 80,
    agency: 250,
  };

  return creditsMap[plan] || 10;
}
