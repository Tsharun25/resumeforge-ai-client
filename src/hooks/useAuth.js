export default function useAuth() {
  const token = localStorage.getItem("resumeforge_token");

  const user = JSON.parse(
    localStorage.getItem("resumeforge_user") || "null"
  );

  return {
    token,
    user,
    isAuthenticated: !!token,
  };
}