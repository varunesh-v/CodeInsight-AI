import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userAPI } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await userAPI.post("/register", { email, password });
      alert("Account created! Please sign in.");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.dotGrid} />
      <div style={styles.glowOrb} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={styles.logoText}>CodeInsight</span>
          <span style={styles.logoBadge}>AI</span>
        </div>

        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.subheading}>Start solving problems smarter with AI feedback</p>

        {/* Perks */}
        <div style={styles.perksRow}>
          {["AI-powered feedback", "Infinte problems", "Progress tracking"].map((perk) => (
            <div key={perk} style={styles.perk}>
              <span style={styles.perkDot} />
              <span style={styles.perkText}>{perk}</span>
            </div>
          ))}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email address</label>
          <input
            type="email"
            style={styles.input}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = "#6366F1"}
            onBlur={(e) => e.target.style.borderColor = "#1E293B"}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            style={styles.input}
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = "#6366F1"}
            onBlur={(e) => e.target.style.borderColor = "#1E293B"}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Confirm password</label>
          <input
            type="password"
            style={styles.input}
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = "#6366F1"}
            onBlur={(e) => e.target.style.borderColor = "#1E293B"}
            onKeyDown={(e) => e.key === "Enter" && register()}
          />
        </div>

        <button
          onClick={register}
          disabled={loading}
          style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p style={styles.terms}>
          By registering, you agree to our{" "}
          <a href="#" style={styles.link}>Terms of Service</a> and{" "}
          <a href="#" style={styles.link}>Privacy Policy</a>.
        </p>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>already have an account?</span>
          <span style={styles.dividerLine} />
        </div>

        <Link to="/" style={styles.secondaryBtn}>
          Log In Instead
        </Link>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0A0E1A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "24px",
  },
  dotGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage: "radial-gradient(circle, #1E293B 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    opacity: 0.6,
    pointerEvents: "none",
  },
  glowOrb: {
    position: "absolute",
    bottom: "-20%",
    left: "-10%",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
    borderRadius: "50%",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 1,
    background: "#111827",
    border: "1px solid #1E293B",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 0 0 1px rgba(99,102,241,0.08), 0 32px 64px rgba(0,0,0,0.5)",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "28px",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#F8FAFC",
    letterSpacing: "-0.3px",
  },
  logoBadge: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#6366F1",
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: "4px",
    padding: "2px 6px",
    letterSpacing: "0.5px",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#F8FAFC",
    margin: "0 0 6px 0",
    letterSpacing: "-0.5px",
  },
  subheading: {
    fontSize: "14px",
    color: "#64748B",
    margin: "0 0 20px 0",
  },
  perksRow: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "24px",
    padding: "14px",
    background: "rgba(99,102,241,0.06)",
    border: "1px solid rgba(99,102,241,0.15)",
    borderRadius: "8px",
  },
  perk: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  perkDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#10B981",
    flexShrink: 0,
  },
  perkText: {
    fontSize: "13px",
    color: "#94A3B8",
  },
  inputGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#94A3B8",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    background: "#0A0E1A",
    border: "1px solid #1E293B",
    borderRadius: "8px",
    color: "#F8FAFC",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
  },
  primaryBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "-0.1px",
  },
  terms: {
    fontSize: "12px",
    color: "#475569",
    textAlign: "center",
    margin: "12px 0 0 0",
    lineHeight: "1.6",
  },
  link: {
    color: "#6366F1",
    textDecoration: "none",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "20px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#1E293B",
  },
  dividerText: {
    fontSize: "11px",
    color: "#475569",
    whiteSpace: "nowrap",
  },
  secondaryBtn: {
    display: "block",
    width: "100%",
    padding: "12px",
    background: "transparent",
    border: "1px solid #1E293B",
    borderRadius: "8px",
    color: "#94A3B8",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    textAlign: "center",
    textDecoration: "none",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
    transition: "border-color 0.15s, color 0.15s",
  },
};

export default Register;