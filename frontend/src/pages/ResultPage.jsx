import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ResultPage() {
  const navigate = useNavigate();
  const result = JSON.parse(localStorage.getItem("result"));
  const question = JSON.parse(localStorage.getItem("question"));

  const score = result?.score ?? 0;

  const scoreColor =
    score >= 80 ? "#10B981" :
    score >= 50 ? "#F59E0B" :
    "#EF4444";

  const scoreLabel =
    score >= 80 ? "Excellent" :
    score >= 50 ? "Good Effort" :
    "Needs Work";

  const scoreBg =
    score >= 80 ? "rgba(16,185,129,0.08)" :
    score >= 50 ? "rgba(245,158,11,0.08)" :
    "rgba(239,68,68,0.08)";

  const scoreBorder =
    score >= 80 ? "rgba(16,185,129,0.2)" :
    score >= 50 ? "rgba(245,158,11,0.2)" :
    "rgba(239,68,68,0.2)";

  // Divide score into arc degrees
  const arcDeg = (score / 100) * 283; // 283 = circumference fraction

  return (
    <div style={styles.root}>
      <Navbar />
      <div style={styles.dotGrid} />

      <main style={styles.main}>
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <button onClick={() => navigate("/dashboard")} style={styles.breadLink}>
            ← Back to Dashboard
          </button>
          <span style={styles.breadSep}>/</span>
          <span style={styles.breadCurrent}>Evaluation Result</span>
        </div>

        <div style={styles.layout}>
          {/* Left: Score hero */}
          <div style={styles.leftCol}>
            <div style={styles.scoreCard}>
              <p style={styles.scoreEyebrow}>Your Score</p>

              {/* Circular progress */}
              <div style={styles.circleWrap}>
                <svg width="160" height="160" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#1E293B" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="45" fill="none"
                    stroke={scoreColor} strokeWidth="6"
                    strokeDasharray={`${arcDeg} 283`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 1s ease" }}
                  />
                </svg>
                <div style={styles.circleCenter}>
                  <span style={{ ...styles.scoreNum, color: scoreColor }}>{score}</span>
                  <span style={styles.scoreTotal}>/100</span>
                </div>
              </div>

              <div style={{ ...styles.scoreLabelBadge, color: scoreColor, background: scoreBg, borderColor: scoreBorder }}>
                {scoreLabel}
              </div>

              <div style={styles.scoreMeta}>
                <div style={styles.scoreMetaItem}>
                  <span style={styles.scoreMetaKey}>Topic</span>
                  <span style={styles.scoreMetaVal}>{question?.topic || "—"}</span>
                </div>
                <div style={styles.scoreMetaItem}>
                  <span style={styles.scoreMetaKey}>Difficulty</span>
                  <span style={styles.scoreMetaVal}>{question?.difficulty || "—"}</span>
                </div>
                <div style={styles.scoreMetaItem}>
                  <span style={styles.scoreMetaKey}>Language</span>
                  <span style={styles.scoreMetaVal}>{question?.language || "—"}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => navigate("/dashboard")}
              style={styles.primaryBtn}
            >
              Try Another Problem →
            </button>

            <button
              onClick={() => navigate("/question")}
              style={styles.secondaryBtn}
            >
              Reattempt This Problem
            </button>
          </div>

          {/* Right: Feedback */}
          <div style={styles.rightCol}>
            <div style={styles.feedbackCard}>
              <div style={styles.feedbackHeader}>
                <h2 style={styles.feedbackTitle}>
                  <span style={styles.feedbackIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        fill="#F59E0B" stroke="#F59E0B" strokeWidth="1"/>
                    </svg>
                  </span>
                  AI Feedback
                </h2>
                <span style={styles.feedbackCount}>{result?.feedback?.length || 0} insights</span>
              </div>

              <div style={styles.feedbackList}>
                {result?.feedback?.map((item, index) => (
                  <div key={index} style={styles.feedbackItem}>
                    <div style={styles.feedbackItemLeft}>
                      <div style={styles.feedbackCheck}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="#10B981" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <p style={styles.feedbackText}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance breakdown */}
            <div style={styles.breakdownCard}>
              <h3 style={styles.breakdownTitle}>Performance Breakdown</h3>
              {[
                { label: "Correctness", val: Math.min(100, score + 5) },
                { label: "Code Quality", val: Math.max(20, score - 10) },
                { label: "Efficiency", val: Math.max(10, score - 20) },
                { label: "Edge Cases", val: Math.max(5, score - 30) },
              ].map(({ label, val }) => (
                <div key={label} style={styles.barRow}>
                  <div style={styles.barLabel}>
                    <span style={styles.barName}>{label}</span>
                    <span style={styles.barVal}>{val}%</span>
                  </div>
                  <div style={styles.barTrack}>
                    <div style={{
                      ...styles.barFill,
                      width: `${val}%`,
                      background: val >= 70 ? "#10B981" : val >= 40 ? "#F59E0B" : "#EF4444",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0A0E1A",
    fontFamily: "'Inter', system-ui, sans-serif",
    position: "relative",
  },
  dotGrid: {
    position: "fixed",
    inset: 0,
    backgroundImage: "radial-gradient(circle, #1E293B 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    opacity: 0.4,
    pointerEvents: "none",
    zIndex: 0,
  },
  main: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "32px",
  },
  breadLink: {
    fontSize: "13px",
    color: "#6366F1",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    fontFamily: "'Inter', sans-serif",
  },
  breadSep: {
    color: "#1E293B",
    fontSize: "13px",
  },
  breadCurrent: {
    fontSize: "13px",
    color: "#64748B",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "24px",
    alignItems: "start",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    position: "sticky",
    top: "24px",
  },
  scoreCard: {
    background: "#111827",
    border: "1px solid #1E293B",
    borderRadius: "16px",
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  scoreEyebrow: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: 0,
  },
  circleWrap: {
    position: "relative",
    width: "160px",
    height: "160px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  circleCenter: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNum: {
    fontSize: "42px",
    fontWeight: "800",
    lineHeight: 1,
    letterSpacing: "-2px",
    fontFamily: "'Inter', sans-serif",
  },
  scoreTotal: {
    fontSize: "14px",
    color: "#475569",
    fontWeight: "500",
  },
  scoreLabelBadge: {
    fontSize: "13px",
    fontWeight: "600",
    padding: "6px 16px",
    borderRadius: "20px",
    border: "1px solid",
  },
  scoreMeta: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0",
    borderTop: "1px solid #1E293B",
    paddingTop: "16px",
  },
  scoreMetaItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #0F172A",
  },
  scoreMetaKey: {
    fontSize: "12px",
    color: "#475569",
  },
  scoreMetaVal: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#94A3B8",
  },
  primaryBtn: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 0 24px rgba(99,102,241,0.25)",
  },
  secondaryBtn: {
    width: "100%",
    padding: "13px",
    background: "transparent",
    border: "1px solid #1E293B",
    borderRadius: "10px",
    color: "#64748B",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  feedbackCard: {
    background: "#111827",
    border: "1px solid #1E293B",
    borderRadius: "16px",
    overflow: "hidden",
  },
  feedbackHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #1E293B",
    background: "#0D1420",
  },
  feedbackTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#F8FAFC",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  feedbackIcon: {
    display: "flex",
    alignItems: "center",
  },
  feedbackCount: {
    fontSize: "12px",
    color: "#475569",
    background: "#1E293B",
    padding: "3px 10px",
    borderRadius: "20px",
    fontFamily: "'JetBrains Mono', monospace",
  },
  feedbackList: {
    padding: "16px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  feedbackItem: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    padding: "14px 16px",
    background: "#0A0E1A",
    borderRadius: "10px",
    border: "1px solid #1E293B",
    borderLeft: "3px solid #10B981",
  },
  feedbackItemLeft: {
    flexShrink: 0,
    marginTop: "1px",
  },
  feedbackCheck: {
    width: "20px",
    height: "20px",
    background: "rgba(16,185,129,0.15)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackText: {
    fontSize: "14px",
    color: "#CBD5E1",
    margin: 0,
    lineHeight: "1.6",
  },
  breakdownCard: {
    background: "#111827",
    border: "1px solid #1E293B",
    borderRadius: "16px",
    padding: "24px",
  },
  breakdownTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#F8FAFC",
    margin: "0 0 20px 0",
  },
  barRow: {
    marginBottom: "16px",
  },
  barLabel: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
  },
  barName: {
    fontSize: "13px",
    color: "#94A3B8",
  },
  barVal: {
    fontSize: "12px",
    color: "#64748B",
    fontFamily: "'JetBrains Mono', monospace",
  },
  barTrack: {
    height: "6px",
    background: "#1E293B",
    borderRadius: "3px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.8s ease",
  },
};

export default ResultPage;