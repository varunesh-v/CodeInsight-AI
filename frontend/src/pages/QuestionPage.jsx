import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";
import { aiAPI } from "../services/api";
import Navbar from "../components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function QuestionPage() {
  const navigate = useNavigate();
  const question = JSON.parse(localStorage.getItem("question"));
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Folding states for both panels
  const [isLeftPaneCollapsed, setIsLeftPaneCollapsed] = useState(false);
  const [isRightPaneCollapsed, setIsRightPaneCollapsed] = useState(false);

  // Timer State persisted across refreshes
  const timerStorageKey = `timer_start_${question?.question_id || "default"}`;
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    let savedStart = localStorage.getItem(timerStorageKey);
    if (!savedStart) {
      savedStart = Date.now().toString();
      localStorage.setItem(timerStorageKey, savedStart);
    }

    const calculateElapsed = () => {
      const startTime = parseInt(savedStart, 10);
      const delta = Math.floor((Date.now() - startTime) / 1000);
      return delta > 0 ? delta : 0;
    };

    setSecondsElapsed(calculateElapsed());

    const interval = setInterval(() => {
      setSecondsElapsed(calculateElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [timerStorageKey]);

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    const pad = (num) => String(num).padStart(2, "0");
    
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  const submitCode = async () => {
    setLoading(true);
    try {
      const res = await aiAPI.post("/evaluate", {
        user_id: 1,
        question_id: question.question_id,
        question: question.question,
        language: question.language,
        submitted_code: code,
      });
      localStorage.removeItem(timerStorageKey); // Clear timer on successful submission
      localStorage.setItem("result", JSON.stringify(res.data));
      navigate("/result");
    } catch (error) {
      console.error(error);
      alert("Evaluation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const difficultyColor = {
    Easy: "#10B981",
    Medium: "#F59E0B",
    Hard: "#EF4444",
  }[question?.difficulty] || "#6366F1";

  const langDisplay = {
    python: "Python 3",
    java: "Java 17",
    javascript: "JavaScript",
    cpp: "C++17",
  }[question?.language] || question?.language;

  // Compute layout ratios based on active panes
  const getGridLayout = () => {
    if (isLeftPaneCollapsed && isRightPaneCollapsed) return { gridTemplateColumns: "40px 1fr 40px" };
    if (isLeftPaneCollapsed) return { gridTemplateColumns: "40px 1fr" };
    if (isRightPaneCollapsed) return { gridTemplateColumns: "1fr 40px" };
    return { gridTemplateColumns: "1fr 1fr" };
  };

  return (
    <div style={styles.root}>
      <Navbar />

      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <span style={styles.topBarTitle}>{question?.title || "Coding Challenge"}</span>
          <span style={{ ...styles.diffBadge, color: difficultyColor, borderColor: difficultyColor + "44", background: difficultyColor + "11" }}>
            {question?.difficulty || "Medium"}
          </span>
          <span style={styles.topicChip}>{question?.topic || "Arrays"}</span>
        </div>
        <div style={styles.topBarRight}>
          <div style={styles.timerBox}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#64748B" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={styles.timerText}>{formatTime(secondsElapsed)}</span>
          </div>
          <button
            onClick={submitCode}
            disabled={loading}
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={styles.spinner} /> Evaluating...
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                </svg>
                Submit
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Workspace Area Layout */}
      <div style={{ ...styles.workspaceWrapper, ...getGridLayout() }}>
        
        {/* --- LEFT SIDE SYSTEMS --- */}
        {!isLeftPaneCollapsed ? (
          <div style={styles.leftPane}>
            <div style={styles.tabRow}>
              <div style={styles.tabRowLeftGroup}>
                <span style={{ ...styles.metaTag, ...styles.panelTabTag }}>
                  <span style={{ ...styles.editorLangDot, background: "#6366F1" }} />
                  Problem
                </span>
                
                <div style={styles.headerMetaGroup}>
                  <span style={styles.metaTag}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginRight: "4px" }}>
                      <path d="M9 12l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2"/>
                    </svg>
                    AI-Generated
                  </span>
                  <span style={styles.metaTag}>Language: {langDisplay}</span>
                </div>
              </div>

              <button 
                onClick={() => setIsLeftPaneCollapsed(true)}
                style={styles.collapseIconBtn}
                title="Collapse Problem"
              >
                ❮
              </button>
            </div>

            <div style={styles.problemContent}>
              <div style={styles.problemText}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {question?.question}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.collapsedLeftStripe}>
            <button 
              onClick={() => setIsLeftPaneCollapsed(false)}
              style={styles.expandIconBtn}
              title="Expand Problem"
            >
              ❯
            </button>
            <div style={styles.verticalTextLabel}>PROBLEM</div>
          </div>
        )}

        {/* --- RIGHT SIDE SYSTEMS --- */}
        {!isRightPaneCollapsed ? (
          <div style={styles.rightPane}>
            <div style={styles.editorHeader}>
              <div style={styles.editorLangBadge}>
                <button 
                  onClick={() => setIsRightPaneCollapsed(true)}
                  style={styles.collapseIconBtn}
                  title="Collapse Editor"
                >
                  ❯
                </button>
                <span style={{ ...styles.metaTag, ...styles.panelTabTag }}>
                  <span style={{ ...styles.editorLangDot, background: "#F59E0B" }} />
                  {langDisplay}
                </span>
              </div>
              <div style={styles.editorActions}>
              </div>
            </div>

            <div style={{ flex: 1, overflow: "hidden" }}>
              <Editor
                height="calc(100vh - 180px)"
                defaultLanguage={question?.language || "python"}
                theme="vs-dark"
                onChange={(value) => setCode(value || "")}
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  renderLineHighlight: "all",
                  lineNumbers: "on",
                  padding: { top: 16 },
                  suggestOnTriggerCharacters: true,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>
        ) : (
          <div style={styles.collapsedRightStripe}>
            <button 
              onClick={() => setIsRightPaneCollapsed(false)}
              style={styles.expandIconBtn}
              title="Expand Editor"
            >
              ❮
            </button>
            <div style={styles.verticalTextLabel}>WORKSPACE</div>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0A0E1A",
    fontFamily: "'Inter', system-ui, sans-serif",
    overflow: "hidden",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    height: "52px",
    borderBottom: "1px solid #1E293B",
    background: "#111827",
    flexShrink: 0,
  },
  topBarLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  topBarTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#F8FAFC",
  },
  diffBadge: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "3px 8px",
    borderRadius: "4px",
    border: "1px solid",
    fontFamily: "'JetBrains Mono', monospace",
  },
  topicChip: {
    fontSize: "11px",
    color: "#64748B",
    background: "#1E293B",
    padding: "3px 8px",
    borderRadius: "4px",
  },
  topBarRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  timerBox: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    background: "#1E293B",
    borderRadius: "6px",
  },
  timerText: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#94A3B8",
    fontFamily: "'JetBrains Mono', monospace",
  },
  submitBtn: {
    padding: "8px 18px",
    background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 0 20px rgba(16,185,129,0.25)",
    transition: "opacity 0.15s",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
  workspaceWrapper: {
    display: "grid",
    flex: 1,
    overflow: "hidden",
  },
  leftPane: {
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #1E293B",
    background: "#0A0E1A",
    overflow: "hidden",
  },
  rightPane: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: "#1E1E1E",
  },
  collapsedLeftStripe: {
    width: "40px",
    background: "#0D1420",
    borderRight: "1px solid #1E293B",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "12px",
    userSelect: "none",
  },
  collapsedRightStripe: {
    width: "40px",
    background: "#252526",
    borderLeft: "1px solid #2D2D2D",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "12px",
    userSelect: "none",
  },
  tabRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #1E293B",
    background: "#0D1420",
    flexShrink: 0,
    paddingLeft: "14px",
    paddingRight: "12px",
    height: "41px",
  },
  tabRowLeftGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  headerMetaGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  collapseIconBtn: {
    background: "#2D2D2D",
    border: "1px solid #3E3E3F",
    color: "#A0A0A1",
    cursor: "pointer",
    borderRadius: "4px",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
  },
  expandIconBtn: {
    background: "#2D2D2D",
    border: "1px solid #3E3E3F",
    color: "#A0A0A1",
    cursor: "pointer",
    borderRadius: "4px",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    marginBottom: "20px",
  },
  verticalTextLabel: {
    writingMode: "vertical-rl",
    textTransform: "uppercase",
    color: "#5F6E7F",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "2px",
    marginTop: "10px",
  },
  problemContent: {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
  },
  metaTag: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    color: "#64748B",
    background: "#1E293B",
    padding: "4px 10px",
    borderRadius: "4px",
    fontFamily: "'JetBrains Mono', monospace",
  },
  panelTabTag: {
    background: "#1E293B",
    color: "#F8FAFC",
    fontWeight: "600",
    fontSize: "12.5px",
    padding: "5px 12px",
    border: "1px solid rgba(99, 102, 241, 0.2)"
  },
  problemText: {
    color: "#CBD5E1",
    fontSize: "14px",
    lineHeight: "1.7",
  },
  editorHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    borderBottom: "1px solid #2D2D2D",
    background: "#252526",
    flexShrink: 0,
    height: "41px",
  },
  editorLangBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  editorLangDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
};

export default QuestionPage;