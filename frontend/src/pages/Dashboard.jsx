import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { codingAPI } from "../services/api";
import Navbar from "../components/Navbar";

const TOPICS = [
  { id: "Arrays", icon: "⬡", desc: "Index, slice, search" },
  { id: "Strings", icon: "∿", desc: "Parsing, matching, regex" },
  { id: "Trees", icon: "⎇", desc: "DFS, BFS, traversal" },
  { id: "Graphs", icon: "◎", desc: "Paths, cycles, components" },
  { id: "Linked Lists", icon: "⇢", desc: "Pointers, reversal, merging" },
  { id: "Dynamic Programming", icon: "◈", desc: "Memoization, tabulation" },
];

const DIFFICULTIES = [
  { id: "Easy", color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", label: "Beginner-friendly" },
  { id: "Medium", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", label: "Intermediate challenge" },
  { id: "Hard", color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", label: "Expert level" },
];

const LANGUAGES = [
  { id: "python", label: "Python", logo: "🐍" },
  { id: "java", label: "Java", logo: "☕" },
  { id: "javascript", label: "JavaScript", logo: "𝐉𝐒" },
  { id: "cpp", label: "C++", logo: "⚡" },
];

function Dashboard() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("Arrays");
  const [difficulty, setDifficulty] = useState("Easy");
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
  
  const [customTopic, setCustomTopic] = useState("");
  const [isCustomActive, setIsCustomActive] = useState(false);

  // Read data points cleanly from standard unified storage key tokens
  const [solvedToday] = useState(() => parseInt(localStorage.getItem("solved_today")) || 0);
  const [solvedTotal] = useState(() => parseInt(localStorage.getItem("solved_total")) || 0);
  const [streakDays] = useState(() => parseInt(localStorage.getItem("streak_days")) || 0);
  const [bestTopic] = useState(() => localStorage.getItem("best_topic") || "-");

  const handleTopicSelect = (topicId) => {
    setTopic(topicId);
    setIsCustomActive(false);
  };

  const handleCustomTopicSubmit = (e) => {
    e.preventDefault();
    if (customTopic.trim()) {
      setTopic(customTopic.trim());
      setIsCustomActive(true);
    }
  };

  const generateQuestion = async () => {
    setLoading(true);
    try {
      const res = await codingAPI.post("/generate-question", { topic, difficulty });
      localStorage.setItem("question", JSON.stringify({ ...res.data, language }));
      navigate("/question");
    } catch {
      alert("Failed to generate question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedDiff = DIFFICULTIES.find((d) => d.id === difficulty);

  return (
    <div style={styles.root}>
      <Navbar />

      <div style={styles.dotGrid} />

      <main style={styles.main}>
        <div style={styles.pageHeader}>
          <div>
            <p style={styles.eyebrow}>Practice Arena</p>
            <h1 style={styles.pageTitle}>Generate a Problem</h1>
            <p style={styles.pageSubtitle}>
              Configure your challenge — AI will create a unique question and evaluate your solution.
            </p>
          </div>
          <div style={styles.headerStat}>
            <span style={styles.headerStatNum}>{solvedToday}</span>
            <span style={styles.headerStatLabel}>Problems solved today</span>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.configPanel}>

            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionNum}>01</span>
                <span style={styles.sectionTitle}>Choose a Topic</span>
              </div>
              <div style={styles.topicsGrid}>
                {TOPICS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTopicSelect(t.id)}
                    style={{
                      ...styles.topicCard,
                      ...(!isCustomActive && topic === t.id ? styles.topicCardActive : {}),
                    }}
                  >
                    <span style={styles.topicIcon}>{t.icon}</span>
                    <span style={styles.topicName}>{t.id}</span>
                    <span style={styles.topicDesc}>{t.desc}</span>
                  </button>
                ))}
              </div>

              <div style={styles.customTopicWrapper}>
                <div style={styles.customTopicDivider}>
                  <span style={styles.customTopicDividerText}>OR ENTER YOUR OWN</span>
                </div>
                <form onSubmit={handleCustomTopicSubmit} style={styles.customTopicForm}>
                  <input
                    type="text"
                    placeholder="e.g., Heaps, Sorting..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    style={{
                      ...styles.customTopicInput,
                      ...(isCustomActive ? styles.customTopicInputActive : {}),
                    }}
                  />
                  <button type="submit" style={styles.customTopicBtn}>
                    Apply
                  </button>
                </form>
              </div>
            </section>

            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionNum}>02</span>
                <span style={styles.sectionTitle}>Set Difficulty</span>
              </div>
              <div style={styles.diffRow}>
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    style={{
                      ...styles.diffCard,
                      background: difficulty === d.id ? d.bg : "transparent",
                      borderColor: difficulty === d.id ? d.border : "#1E293B",
                    }}
                  >
                    <span style={{ ...styles.diffDot, background: d.color }} />
                    <div>
                      <div style={{ ...styles.diffLabel, color: difficulty === d.id ? d.color : "#94A3B8" }}>
                        {d.id}
                      </div>
                      <div style={styles.diffSub}>{d.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionNum}>03</span>
                <span style={styles.sectionTitle}>Pick Language</span>
              </div>
              <div style={styles.langRow}>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id)}
                    style={{
                      ...styles.langCard,
                      ...(language === l.id ? styles.langCardActive : {}),
                    }}
                  >
                    <span style={styles.langLogo}>{l.logo}</span>
                    <span style={styles.langLabel}>{l.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div style={styles.summaryPanel}>
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>Your Configuration</h3>

              <div style={styles.summaryItem}>
                <span style={styles.summaryKey}>Topic</span>
                <span style={styles.summaryVal}>{topic}</span>
              </div>
              <div style={styles.summaryDivider} />
              <div style={styles.summaryItem}>
                <span style={styles.summaryKey}>Difficulty</span>
                <span style={{
                  ...styles.summaryVal,
                  color: selectedDiff?.color,
                }}>{difficulty}</span>
              </div>
              <div style={styles.summaryDivider} />
              <div style={styles.summaryItem}>
                <span style={styles.summaryKey}>Language</span>
                <span style={styles.summaryVal}>
                  {LANGUAGES.find((l) => l.id === language)?.label}
                </span>
              </div>

              <div style={styles.estimateBox}>
                <span style={styles.estimateIcon}>⏱</span>
                <div>
                  <div style={styles.estimateLabel}>Estimated time</div>
                  <div style={styles.estimateVal}>
                    {difficulty === "Easy" ? "15–25 min" : difficulty === "Medium" ? "30–45 min" : "60–90 min"}
                  </div>
                </div>
              </div>

              <button
                onClick={generateQuestion}
                disabled={loading}
                style={{ ...styles.generateBtn, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <span style={styles.spinner} />
                    Generating...
                  </span>
                ) : (
                  <span>Generate Problem →</span>
                )}
              </button>

              <p style={styles.generateNote}>
                A unique question will be created by AI based on your settings.
              </p>
            </div>

            <div style={styles.miniStats}>
              {[
                { label: "Your streak", val: `🔥 ${streakDays} Days` },
                { label: "Solved", val: `${solvedTotal} Problems` },
                { label: "Most solved topic", val: bestTopic },
              ].map(({ label, val }) => (
                <div key={label} style={styles.miniStat}>
                  <span style={styles.miniStatVal}>{val}</span>
                  <span style={styles.miniStatLabel}>{label}</span>
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
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "40px",
  },
  eyebrow: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#6366F1",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    margin: "0 0 8px 0",
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#F8FAFC",
    margin: "0 0 8px 0",
    letterSpacing: "-0.7px",
  },
  pageSubtitle: {
    fontSize: "15px",
    color: "#64748B",
    margin: 0,
    maxWidth: "480px",
  },
  headerStat: {
    textAlign: "right",
    background: "rgba(99,102,241,0.08)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "12px",
    padding: "16px 20px",
  },
  headerStatNum: {
    display: "block",
    fontSize: "28px",
    fontWeight: "700",
    color: "#6366F1",
    letterSpacing: "-0.5px",
  },
  headerStatLabel: {
    fontSize: "12px",
    color: "#64748B",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: "24px",
    alignItems: "start",
  },
  configPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  section: {
    background: "#111827",
    border: "1px solid #1E293B",
    borderRadius: "12px",
    padding: "24px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
  },
  sectionNum: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#6366F1",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.5px",
  },
  sectionTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#F8FAFC",
  },
  topicsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  },
  topicCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "14px",
    background: "#0A0E1A",
    border: "1px solid #1E293B",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.15s",
    textAlign: "left",
    fontFamily: "'Inter', sans-serif",
  },
  topicCardActive: {
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.4)",
  },
  topicIcon: {
    fontSize: "18px",
    marginBottom: "8px",
    color: "#6366F1",
  },
  topicName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#F8FAFC",
    marginBottom: "3px",
  },
  topicDesc: {
    fontSize: "11px",
    color: "#475569",
  },
  customTopicWrapper: {
    marginTop: "20px",
  },
  customTopicDivider: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 0 16px 0",
    position: "relative",
  },
  customTopicDividerText: {
    background: "#111827",
    padding: "0 12px",
    color: "#475569",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1px",
  },
  customTopicForm: {
    display: "flex",
    gap: "10px",
  },
  customTopicInput: {
    flex: 1,
    background: "#0A0E1A",
    border: "1px solid #1E293B",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#F8FAFC",
    fontSize: "13px",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.15s",
  },
  customTopicInputActive: {
    background: "rgba(99,102,241,0.05)",
    borderColor: "rgba(99,102,241,0.4)",
    boxShadow: "0 0 10px rgba(99,102,241,0.1)",
  },
  customTopicBtn: {
    background: "#1E293B",
    border: "1px solid #334155",
    color: "#F8FAFC",
    borderRadius: "10px",
    padding: "0 20px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  diffRow: {
    display: "flex",
    gap: "10px",
  },
  diffCard: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    border: "1px solid",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "'Inter', sans-serif",
  },
  diffDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  diffLabel: {
    fontSize: "14px",
    fontWeight: "600",
  },
  diffSub: {
    fontSize: "11px",
    color: "#475569",
    marginTop: "2px",
  },
  langRow: {
    display: "flex",
    gap: "10px",
  },
  langCard: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "14px 10px",
    background: "#0A0E1A",
    border: "1px solid #1E293B",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "'Inter', sans-serif",
  },
  langCardActive: {
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.4)",
  },
  langLogo: {
    fontSize: "18px",
  },
  langLabel: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#94A3B8",
  },
  summaryPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    position: "sticky",
    top: "24px",
  },
  summaryCard: {
    background: "#111827",
    border: "1px solid #1E293B",
    borderRadius: "12px",
    padding: "24px",
  },
  summaryTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#94A3B8",
    margin: "0 0 20px 0",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
  },
  summaryKey: {
    fontSize: "13px",
    color: "#64748B",
  },
  summaryVal: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#F8FAFC",
  },
  summaryDivider: {
    height: "1px",
    background: "#1E293B",
  },
  estimateBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(245,158,11,0.08)",
    border: "1px solid rgba(245,158,11,0.2)",
    borderRadius: "8px",
    padding: "12px 14px",
    margin: "20px 0",
  },
  estimateIcon: {
    fontSize: "18px",
  },
  estimateLabel: {
    fontSize: "11px",
    color: "#64748B",
  },
  estimateVal: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#F59E0B",
  },
  generateBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "-0.2px",
    boxShadow: "0 0 32px rgba(99,102,241,0.3)",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  generateNote: {
    fontSize: "12px",
    color: "#475569",
    textAlign: "center",
    margin: "10px 0 0 0",
    lineHeight: "1.5",
  },
  miniStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
  },
  miniStat: {
    background: "#111827",
    border: "1px solid #1E293B",
    borderRadius: "10px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  miniStatVal: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#F8FAFC",
  },
  miniStatLabel: {
    fontSize: "10px",
    color: "#475569",
  },
};

export default Dashboard;