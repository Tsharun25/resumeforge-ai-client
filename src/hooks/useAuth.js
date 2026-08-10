import { useEffect, useState } from "react";

const readAuth = () => {
  const token = localStorage.getItem("resumeforge_token");

  try {
    return {
      token,
      user: JSON.parse(localStorage.getItem("resumeforge_user") || "null"),
    };
  } catch {
    return { token, user: null };
  }
};

export default function useAuth() {
  const [auth, setAuth] = useState(readAuth);

  useEffect(() => {
    const syncAuth = () => setAuth(readAuth());

    window.addEventListener("careerpilot-user-updated", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("careerpilot-user-updated", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  return {
    ...auth,
    isAuthenticated: Boolean(auth.token),
  };
}
