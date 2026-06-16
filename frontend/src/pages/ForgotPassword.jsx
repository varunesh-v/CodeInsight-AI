import { useState } from "react";
import { Link } from "react-router-dom";
import { userAPI } from "../services/api"; // Reusing your api instance

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetRequest = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage("");
    try {
      // Adjust the endpoint matching your backend structure (e.g., /forgot-password or /reset-password)
      await userAPI.post("/forgot-password", { email });
      setMessage("If that email exists, a password reset link has been sent.");
    } catch (err) {
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.dotGrid} />
      <div style={styles.glowOrb} />

      <div style={styles.card}>
        <h1 style={styles.heading}>Reset Password</h1>
        <p style={styles.subheading}>Enter your email to receive a recovery link.</p>

        {message && <p style={styles.message}>{message}</p>}

        <form onSubmit={handleResetRequest}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              style={styles.input}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{...styles.primaryBtn, opacity: loading ? 0.7 : 1}}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p style={{ ...styles.registerText, marginTop: "20px" }}>
          <Link to="/login" style={styles.registerLink}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

// Reuses your current design syntax
const styles = {
  root: { minHeight: "100vh", background: "#0A0E1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden" },
  dotGrid: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #1E293B 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: 0.6, pointerEvents: "none" },
  glowOrb: { position: "absolute", top: "-20%", right: "-10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" },
  card: { position: "relative", zIndex: 1, background: "#111827", border: "1px solid #1E293B", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "420px", boxShadow: "0 32px 64px rgba(0,0,0,0.5)" },
  heading: { fontSize: "26px", fontWeight: "700", color: "#F8FAFC", margin: "0 0 6px 0" },
  subheading: { fontSize: "14px", color: "#64748B", margin: "0 0 24px 0" },
  message: { padding: "10px", background: "rgba(99,102,241,0.1)", border: "1px solid #6366F1", borderRadius: "6px", color: "#F8FAFC", fontSize: "13px", marginBottom: "16px" },
  inputGroup: { marginBottom: "18px" },
  label: { display: "block", fontSize: "13px", fontWeight: "500", color: "#94A3B8", marginBottom: "8px" },
  input: { width: "100%", padding: "11px 14px", background: "#0A0E1A", border: "1px solid #1E293B", borderRadius: "8px", color: "#F8FAFC", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  primaryBtn: { width: "100%", padding: "12px", background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "15px", fontWeight: "600", cursor: "pointer" },
  registerText: { textAlign: "center", fontSize: "14px", color: "#64748B" },
  registerLink: { color: "#6366F1", textDecoration: "none", fontWeight: "500" }
};

export default ForgotPassword;