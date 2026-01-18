import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BrainCircuit, Sparkles, FileUp, MessageSquare, 
  ChevronRight, Play, CheckCircle2, GraduationCap, 
  BarChart3, Zap, Moon, Sun, LogOut, X
} from "lucide-react";

export default function Landing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const user = localStorage.getItem("userName");
    if (token) {
      setIsLoggedIn(true);
      setUserName(user || "User");
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 3000);
    }
  }, []);

  const steps = [
    {
      icon: <FileUp className="text-blue-400" />,
      title: "Upload PDF",
      desc: "Books, Notes ya Research Papers—kuch bhi upload karein."
    },
    {
      icon: <Sparkles className="text-yellow-400" />,
      title: "Page-by-Page Logic",
      desc: "AI har page ko real-life examples ke sath break down karta hai."
    },
    {
      icon: <MessageSquare className="text-green-400" />,
      title: "Clear Doubts",
      desc: "Kisi bhi line par atak gaye? AI Tutor se turant puchiye."
    },
    {
      icon: <GraduationCap className="text-purple-400" />,
      title: "AI Quiz",
      desc: "Padhne ke baad select kiye gaye pages se customized quiz dein."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-sky-500/30 font-sans">
      
      {/* --- WELCOME POPUP --- */}
      {showWelcome && (
        <div className="fixed top-20 right-6 z-[60] bg-gradient-to-br from-sky-500/20 to-blue-500/10 border border-sky-500/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl animate-slide-down max-w-sm">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="text-green-400" size={24} />
            <h3 className="text-lg font-bold text-sky-300">Welcome back! 🎉</h3>
          </div>
          <p className="text-slate-300 text-sm mb-4">
            Hi <span className="font-bold text-sky-400">{userName}</span>, ready to ace your studies?
          </p>
          <button 
            onClick={() => setShowWelcome(false)}
            className="w-full bg-sky-500 hover:bg-sky-400 text-black px-4 py-2 rounded-xl font-bold text-sm transition-all"
          >
            Let's Go! 🚀
          </button>
        </div>
      )}

      {/* --- GRID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">StudyMate.ai</span>
          </div>

          <div className="flex items-center gap-6">
            {!isLoggedIn ? (
              <button 
                onClick={() => navigate("/login")}
                className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-sky-400 transition-all active:scale-95"
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-3 px-4 py-2 rounded-full border-2 border-sky-500 hover:bg-sky-500/10 transition-all shadow-lg shadow-sky-500/20">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-sky-300 hidden sm:inline">{userName}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-4 w-48 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-2xl">
                    <div className="px-4 py-3 border-b border-slate-800 text-center">
                      <p className="text-xs text-slate-500">Logged in as</p>
                      <p className="text-sm font-bold text-sky-400">{userName}</p>
                    </div>
                    <button onClick={() => navigate("/dashboard")} className="w-full text-left px-4 py-2 hover:bg-slate-800 rounded-xl flex items-center gap-2 text-sm mt-2"><BarChart3 size={16}/> Dashboard</button>
                    <button onClick={() => {localStorage.removeItem("userToken"); localStorage.removeItem("userName"); setIsLoggedIn(false); setProfileOpen(false); navigate("/")}} className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-400 rounded-xl flex items-center gap-2 text-sm mt-1"><LogOut size={16}/> Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-4 py-1.5 rounded-full text-sky-400 text-sm font-medium mb-8 animate-fade-in">
            <Zap size={14} className="fill-sky-400" /> <span>2026 Next-Gen Study Tech</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8">
            Don't just read PDFs. <br />
            <span className="text-sky-500">Conquer</span> them.
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            StudyMate.ai breaks down complex pages into simple stories. Explain, ask doubts, and quiz yourself—all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate(isLoggedIn ? "/Upload" : "/login")}
              className="bg-sky-500 hover:bg-sky-400 text-[#020617] px-10 py-5 rounded-2xl font-black text-xl transition-all flex items-center gap-3 shadow-[0_20px_40px_rgba(14,165,233,0.3)] hover:-translate-y-1"
            >
              Get Started <ChevronRight />
            </button>
            <button className="flex items-center gap-2 px-8 py-5 rounded-2xl border border-slate-700 font-bold text-lg hover:bg-slate-800 transition-all">
              <Play size={18} fill="currentColor" /> Watch Demo
            </button>
          </div>
        </div>
      </main>

      {/* --- ROADMAP / STEPS SECTION --- */}
      <section className="relative z-10 py-24 bg-slate-900/30 backdrop-blur-3xl border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Connecting Line (Desktop Only) */}
            <div className="hidden md:block absolute top-1/4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-700 to-transparent z-0" />
            
            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 text-center group">
                <div className="w-16 h-16 bg-slate-950 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:border-sky-500 transition-colors shadow-xl">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BENTO FEATURE PREVIEW --- */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black mb-4 italic uppercase tracking-widest">Built for the Toppers</h2>
          <p className="text-slate-500 font-medium">Ye features aapki learning speed 10x badha denge.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Large Card */}
          <div className="md:col-span-2 row-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[3rem] p-10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <BrainCircuit size={200} />
             </div>
             <h3 className="text-3xl font-bold mb-6">Interactive Page Explainer</h3>
             <p className="text-slate-400 max-w-md mb-8">AI sirf text nahi padhta, diagrams aur complex equations ko bhi real-world analogies se samjhata hai. Har page ke baad ek doubt session aur check-point.</p>
             <div className="flex gap-2">
                <span className="bg-sky-500/10 text-sky-400 px-4 py-1 rounded-full text-xs font-bold border border-sky-500/20">IMAGE RECOGNITION</span>
                <span className="bg-purple-500/10 text-purple-400 px-4 py-1 rounded-full text-xs font-bold border border-purple-500/20">CONTEXT AWARE</span>
             </div>
          </div>

          {/* Small Card 1 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 hover:bg-slate-800/50 transition-colors">
            <MessageSquare className="text-sky-500 mb-6" size={32} />
            <h4 className="text-xl font-bold mb-3">Doubt Resolver</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Chat with the specific context of the page you're reading. No more generic answers.</p>
          </div>

          {/* Small Card 2 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 hover:bg-slate-800/50 transition-colors">
            <CheckCircle2 className="text-green-500 mb-6" size={32} />
            <h4 className="text-xl font-bold mb-3">Instant Quiz</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Turn your study session into a game. Test yourself on what you just learned.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 py-12 text-center border-t border-slate-900">
        <p className="text-slate-600 text-sm font-medium tracking-tighter uppercase">
          StudyMate.ai AI &copy; 2026 • Designed for the Future of Education
        </p>
      </footer>
    </div>
  );
}
