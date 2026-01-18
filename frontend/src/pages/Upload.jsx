import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit, Upload as UploadIcon, ArrowLeft, Loader } from "lucide-react";
import { uploadPDF } from "../services/api";
import { API_BASE_URL } from "../config/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("hinglish");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid PDF file");
      setFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.pdf_id) {
        // Store language preference in session
        sessionStorage.setItem("explanationLanguage", language);
        navigate(`/study/${data.pdf_id}`);
      } else {
        setError(data.error || "Upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-sky-600/10 blur-[100px] rounded-full"></div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors mb-8"
          >
            <ArrowLeft size={20} /> Back to Home
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 group mb-6">
              <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-2 rounded-xl">
                <BrainCircuit className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white">
                StudyMate<span className="text-sky-500">.ai</span>
              </span>
            </div>
            <h1 className="text-4xl font-black mb-2">Upload Your PDF</h1>
            <p className="text-slate-400">
              Share your book, notes, or research paper. AI will break it down for you.
            </p>
          </div>
        </div>

        {/* Upload Card */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-[3rem] p-12 shadow-2xl">
          <form onSubmit={handleUpload} className="space-y-8">
            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-sky-500 transition-colors cursor-pointer"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("border-sky-500");
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove("border-sky-500");
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("border-sky-500");
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile && droppedFile.type === "application/pdf") {
                  setFile(droppedFile);
                  setError("");
                }
              }}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdfInput"
                disabled={isLoading}
              />
              <label htmlFor="pdfInput" className="cursor-pointer">
                <UploadIcon className="w-16 h-16 mx-auto mb-4 text-sky-400" />
                <p className="text-lg font-bold mb-2">
                  {file ? file.name : "Drop your PDF here"}
                </p>
                <p className="text-slate-500 text-sm">
                  or click to browse from your computer
                </p>
              </label>
            </div>

            {/* File Info */}
            {file && (
              <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center">
                    <UploadIcon className="text-sky-400" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-sky-300">{file.name}</p>
                    <p className="text-sm text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Language Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-400 block">
                Explanation Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-sky-500 outline-none transition-all"
              >
                <option value="hinglish">Hinglish (Hindi + English)</option>
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || isLoading}
              className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-slate-600 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-sky-500/20"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Processing Your PDF...
                </>
              ) : (
                <>
                  <UploadIcon size={20} /> Upload & Start Learning
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 text-xs mt-8 font-medium">
            Your PDFs are processed securely. No data is stored permanently.
          </p>
        </div>
      </div>
    </div>
  );
}