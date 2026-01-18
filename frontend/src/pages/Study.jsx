import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Send,
  Minimize2,
  Maximize2,
  LogOut,
  Loader,
  Play,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { API_BASE_URL } from "../config/api";

export default function Study() {
  const { pdf_id } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pdfName, setPdfName] = useState("Loading...");
  const [explanation, setExplanation] = useState("");
  const [rawText, setRawText] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pdfCollapsed, setPdfCollapsed] = useState(false);
  const [language, setLanguage] = useState("hinglish");
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [hasExplanation, setHasExplanation] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedPages, setSelectedPages] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [pdfPageImage, setPdfPageImage] = useState("");

  // Load language from session
  useEffect(() => {
    const savedLanguage = sessionStorage.getItem("explanationLanguage");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Fetch PDF info on mount
  useEffect(() => {
    if (!pdf_id) return;
    const fetchPdfInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/pdf/${pdf_id}`);
        const data = await response.json();
        if (response.ok) {
          setPdfName(data.fileName || "Unknown PDF");
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error("Error fetching PDF info:", err);
      }
    };
    fetchPdfInfo();
  }, [pdf_id]);

  // Reset explanation state when page changes
  useEffect(() => {
    setHasExplanation(false);
    setExplanation("");
    setMessages([]);
    setRawText("");
    setPdfPageImage("");
  }, [currentPage]);

  // Fetch PDF page image when page changes
  useEffect(() => {
    if (!pdf_id || !currentPage) return;
    const fetchPdfPageImage = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/pdf/${pdf_id}/page/${currentPage}/image`
        );
        const data = await response.json();
        if (response.ok && data.image) {
          setPdfPageImage(data.image);
        }
      } catch (err) {
        console.error("Error fetching PDF page image:", err);
      }
    };
    fetchPdfPageImage();
  }, [pdf_id, currentPage]);

  // Handle Explain button click
  const handleExplain = async () => {
    if (!pdf_id) return;
    setExplanationLoading(true);
    setHasExplanation(false);
    try {
      const response = await fetch(`${API_BASE_URL}/parse-page`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdf_id,
          page_no: currentPage,
          language,
        }),
      });

      let data;
      const text = await response.text();

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
        throw new Error("Server error (non-JSON response)");
      }

      if (response.ok) {
        setExplanation(data.explanation || "No explanation available");
        setRawText(data.text || "");
        setHasExplanation(true);
        // Reset chat for new explanation
        setMessages([]);
      } else {
        setExplanation("Failed to load explanation. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching explanation:", err);
      setExplanation("Failed to load explanation. Please try again.");
    } finally {
      setExplanationLoading(false);
    }
  };

  // Handle doubt submission
  const handleSendDoubt = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: inputValue,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const queryText = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ask-doubt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdf_id,
          page_no: currentPage,
          query: queryText,
          language,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = {
          id: Date.now() + 1,
          role: "assistant",
          text: data.answer || "Unable to generate answer.",
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          role: "assistant",
          text: `Error: ${data.error || "Failed to get response"}`,
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } catch (err) {
      console.error("Error asking doubt:", err);
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: "Connection error. Please try again.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quiz generation
  const handleGenerateQuiz = async () => {
    if (selectedPages.length === 0) {
      alert("Please select at least one page");
      return;
    }
    setQuizLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/generate-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdf_id,
          page_numbers: selectedPages,
          language,
          num_questions: 5,
        }),
      });

      const data = await response.json();
      if (response.ok && data.quiz) {
        setQuiz(data.quiz);
      } else {
        alert(data.error || "Failed to generate quiz");
      }
    } catch (err) {
      console.error("Error generating quiz:", err);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setQuizLoading(false);
    }
  };

  const togglePageSelection = (pageNum) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum)
        ? prev.filter((p) => p !== pageNum)
        : [...prev, pageNum]
    );
  };

  return (
    <div className="study-theme h-screen overflow-hidden flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="study-navbar shrink-0 w-full z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrainCircuit className="study-accent" size={24} />
            <div>
              <p className="text-xs study-text-muted font-medium">STUDYING</p>
              <p className="text-sm font-bold">{pdfName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowQuizModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white"
              style={{ background: "#1E293B", border: "1px solid #334155" }}
            >
              <BookOpen size={18} /> Quiz
            </button>
            <div className="text-center px-4 py-2 rounded-lg study-card">
              <p className="text-xs study-text-muted">Page</p>
              <p className="text-lg font-bold study-accent">
                {currentPage} / {totalPages}
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors study-text-secondary hover:text-white"
              style={{ border: "1px solid transparent" }}
            >
              <LogOut size={18} /> Exit
            </button>
          </div>
        </div>
      </nav>

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="study-panel rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold study-accent">Generate Quiz</h2>
              <button
                onClick={() => {
                  setShowQuizModal(false);
                  setQuiz(null);
                  setSelectedPages([]);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {!quiz ? (
              <div>
                <p className="text-slate-400 mb-4">
                  Select pages you've studied to generate a quiz:
                </p>
                <div className="grid grid-cols-10 gap-2 mb-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => togglePageSelection(pageNum)}
                        className={`p-2 rounded-lg border-2 transition-colors ${
                          selectedPages.includes(pageNum)
                            ? "bg-sky-500 border-sky-400 text-white"
                            : "bg-slate-800 border-slate-700 text-slate-300 hover:border-sky-500"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={handleGenerateQuiz}
                  disabled={selectedPages.length === 0 || quizLoading}
                  className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {quizLoading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <BookOpen size={20} />
                      Generate Quiz ({selectedPages.length} pages)
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">
                    Quiz ({quiz.questions?.length || 0} questions)
                  </h3>
                  <button
                    onClick={() => setQuiz(null)}
                    className="text-sky-400 hover:text-sky-300"
                  >
                    Generate New Quiz
                  </button>
                </div>
                {quiz.questions?.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
                  >
                    <p className="font-bold mb-3 text-white">
                      {idx + 1}. {q.question}
                    </p>
                    <div className="space-y-2 mb-3">
                      {Object.entries(q.options || {}).map(([key, value]) => (
                        <div
                          key={key}
                          className={`p-2 rounded-lg ${
                            key === q.correct_answer
                              ? "bg-green-500/20 border-2 border-green-500"
                              : "bg-slate-700/50 border-2 border-slate-600"
                          }`}
                        >
                          <span className="font-bold mr-2">{key}.</span>
                          {value}
                          {key === q.correct_answer && (
                            <span className="ml-2 text-green-400">✓ Correct</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <p className="text-sm text-slate-400 italic">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <main className="flex-1 flex overflow-hidden gap-6 px-6">
        {/* LEFT PANEL - PDF Preview (full height, no scroll) */}
        <div
          className={`flex flex-col study-panel rounded-2xl transition-all duration-300 shrink-0 ${
            pdfCollapsed ? "w-12" : "w-[35%]"
          }`}
        >
          {/* PDF Header */}
          {!pdfCollapsed && (
            <div className="border-b p-4 study-divider shrink-0">
              <h3 className="font-bold text-sm mb-2">PDF Preview</h3>
              <p className="text-xs study-text-muted">
                Page content will appear here after explanation
              </p>
            </div>
          )}

          {/* PDF Content Area */}
          {!pdfCollapsed && (
            <div className="flex-1 overflow-hidden p-4 flex items-center justify-center">
              {pdfPageImage ? (
                <div className="study-card rounded-xl p-4 flex items-center justify-center w-full h-full">
                  <img
                    src={pdfPageImage}
                    alt={`Page ${currentPage}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
              ) : (
                <div className="study-card rounded-xl p-4 text-xs leading-relaxed flex items-center justify-center w-full h-full">
                  <p className="study-text-muted">Loading PDF page...</p>
                </div>
              )}
            </div>
          )}

          {/* Page Navigation Controls */}
          <div className="border-t p-3 flex items-center justify-between gap-2 study-divider shrink-0">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 disabled:opacity-50 rounded-lg transition-colors"
              style={{ border: "1px solid #334155" }}
            >
              <ChevronLeft size={18} />
            </button>

            {!pdfCollapsed && (
              <span className="text-xs font-bold text-center flex-1">
                Page {currentPage}
              </span>
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-2 disabled:opacity-50 rounded-lg transition-colors"
              style={{ border: "1px solid #334155" }}
            >
              <ChevronRight size={18} />
            </button>

            <button
              onClick={() => setPdfCollapsed(!pdfCollapsed)}
              className="p-2 rounded-lg transition-colors"
              style={{ border: "1px solid #334155" }}
            >
              {pdfCollapsed ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL - ChatGPT style */}
        <div className="flex-1 flex flex-col overflow-hidden rounded-2xl study-panel" style={{ background: '#212121' }}>
          {/* Scrollable content (explanation + messages) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Explanation Card */}
            <div className="study-explanation-panel rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold study-accent">Page Explanation</h2>
                {!hasExplanation && !explanationLoading && (
                  <button
                    onClick={handleExplain}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold study-btn"
                  >
                    <Play size={16} /> Explain
                  </button>
                )}
                {explanationLoading && (
                  <Loader className="animate-spin study-accent" size={18} />
                )}
              </div>

              {explanationLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Loader className="animate-spin mx-auto mb-2 text-sky-400" />
                    <p className="text-sm text-slate-400">
                      AI is explaining this page...
                    </p>
                  </div>
                </div>
              ) : hasExplanation ? (
                <div className="text-sm leading-relaxed markdown-content" style={{ color: '#D1D5DB' }}>
                  <ReactMarkdown>{explanation || "No explanation available"}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-center">
                  <div>
                    <HelpCircle className="mx-auto mb-3 text-slate-600" size={48} />
                    <p className="text-slate-500 font-medium mb-2">
                      Click "Explain" to get AI explanation
                    </p>
                    <p className="text-xs text-slate-600">
                      Get detailed explanation with real-world examples
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Messages */}
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <p className="font-medium mb-2" style={{ color: '#9CA3AF' }}>
                    {hasExplanation
                      ? "Ask your doubts about this page"
                      : "Get explanation first, then ask doubts"}
                  </p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>
                    The AI will answer based on the page content
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-2xl px-5 py-4 rounded-2xl text-[14.5px] ${
                      msg.role === "user"
                        ? "study-user-message rounded-br-none"
                        : "study-ai-message rounded-bl-none markdown-content"
                    }`}
                  >
                    {msg.role === "user" ? (
                      msg.text
                    ) : (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl rounded-bl-none" style={{ background: '#343541' }}>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#9CA3AF' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce delay-100" style={{ background: '#9CA3AF' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce delay-200" style={{ background: '#9CA3AF' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="shrink-0 border-t p-4 study-divider" style={{ background: '#212121', borderColor: '#374151' }}>
            <form onSubmit={handleSendDoubt} className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  hasExplanation
                    ? "Ask your doubt..."
                    : "Get explanation first..."
                }
                disabled={isLoading || !hasExplanation}
                className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none transition-all disabled:opacity-50"
                style={{
                  background: "#40414F",
                  border: "1px solid #565869",
                  color: "#ECECF1",
                }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading || !hasExplanation}
                className="px-4 py-3 rounded-2xl transition-all flex items-center justify-center font-bold disabled:opacity-50 hover:opacity-90"
                style={{ background: "#10A37F", color: "#FFFFFF" }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
