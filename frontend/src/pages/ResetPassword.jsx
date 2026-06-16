import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { userAPI } from "../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await userAPI.post("/reset-password-confirm", { token, password });
      alert("Password updated successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      setError("Link expired or invalid. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.dotGrid} />
      <div style={styles.glowOrb} />

      <div style={styles.card}>
        <h1 style={styles.heading}>Choose a new password</h1>
        <p style={styles.subheading}>Make sure it's secure and at least 8 characters.</p>

        {error && <p style={styles.errorBox}>{error}</p>}

        <form onSubmit={handlePasswordUpdate}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm New Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{...styles.primaryBtn, opacity: loading ? 0.7 : 1}}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "#0A0E1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden" },
  dotGrid: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #1E293B 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: 0.6, pointerEvents: "none" },
  glowOrb: { position: "absolute", top: "-20%", right: "-10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" },
  card: { position: "relative", zIndex: 1, background: "#111827", border: "1px solid #1E293B", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "420px", boxShadow: "0 32px 64px rgba(0,0,0,0.5)" },
  heading: { fontSize: "24px", fontWeight: "700", color: "#F8FAFC", margin: "0 0 6px 0" },
  subheading: { fontSize: "14px", color: "#64748B", margin: "0 0 24px 0" },
  errorBox: { padding: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid #EF4444", borderRadius: "6px", color: "#FCA5A5", fontSize: "13px", marginBottom: "16px" },
  inputGroup: { marginBottom: "18px" },
  label: { display: "block", fontSize: "13px", fontWeight: "500", color: "#94A3B8", marginBottom: "8px" },
  input: { width: "100%", padding: "11px 14px", background: "#0A0E1A", border: "1px solid #1E293B", borderRadius: "8px", color: "#F8FAFC", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  primaryBtn: { width: "100%", padding: "12px", background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "15px", fontWeight: "600", cursor: "pointer" }
};

export default ResetPassword;