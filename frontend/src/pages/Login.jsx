import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userAPI } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const res = await userAPI.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      {/* Dot grid background */}
      <div style={styles.dotGrid} />

      {/* Glow orb */}
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

        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.subheading}>Log in to continue your practice</p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email address</label>
          <input
            style={styles.input}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = "#6366F1"}
            onBlur={(e) => e.target.style.borderColor = "#1E293B"}
          />
        </div>

        <div style={styles.inputGroup}>
          <div style={styles.labelRow}>
            <label style={styles.label}>Password</label>
            <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
          </div>
          
          <div id="passwordWrapper" style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              style={styles.passwordInput}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => {
                const el = document.getElementById("passwordWrapper");
                if (el) el.style.borderColor = "#6366F1";
              }}
              onBlur={() => {
                const el = document.getElementById("passwordWrapper");
                if (el) el.style.borderColor = "#1E293B";
              }}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
            
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.togglePasswordBtn}
              tabIndex="-1"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                /* Eye Off Icon SVG */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                /* Eye On Icon SVG */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={login}
          disabled={loading}
          style={{...styles.primaryBtn, opacity: loading ? 0.7 : 1}}
        >
          {loading ? (
            <span style={styles.btnInner}>
              <span style={styles.spinner} />
              Logging in...
            </span>
          ) : "Log In"}
        </button>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <span style={styles.dividerLine} />
        </div>

        <p style={styles.registerText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.registerLink}>Create one</Link>
        </p>

        {/* Stats strip */}
        <div style={styles.statsStrip}>
          {[["Code and Evaluate"]].map(([num, label]) => (
            <div key={label} style={styles.statItem}>
              <span style={styles.statNum}>{num}</span>
              <span style={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
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
    top: "-20%",
    right: "-10%",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
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
    margin: "0 0 28px 0",
  },
  inputGroup: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#94A3B8",
    marginBottom: "8px",
    fontFamily: "'Inter', sans-serif",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  forgotLink: {
    fontSize: "12px",
    color: "#6366F1",
    textDecoration: "none",
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
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "#0A0E1A",
    border: "1px solid #1E293B",
    borderRadius: "8px",
    transition: "border-color 0.15s",
  },
  passwordInput: {
    width: "100%",
    padding: "11px 44px 11px 14px",
    background: "transparent",
    border: "none",
    color: "#F8FAFC",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
  },
  togglePasswordBtn: {
    position: "absolute",
    right: "12px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    transition: "opacity 0.15s, transform 0.1s",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "-0.1px",
  },
  btnInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "22px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#1E293B",
  },
  dividerText: {
    fontSize: "12px",
    color: "#475569",
  },
  registerText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#64748B",
    margin: 0,
  },
  registerLink: {
    color: "#6366F1",
    textDecoration: "none",
    fontWeight: "500",
  },
  statsStrip: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "28px",
    paddingTop: "24px",
    borderTop: "1px solid #1E293B",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
  },
  statNum: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#F8FAFC",
  },
  statLabel: {
    fontSize: "11px",
    color: "#475569",
  },
};

export default Login;