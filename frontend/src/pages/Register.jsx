import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, User, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { registerUser } from "../services/api";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await registerUser(formData);
      
      // FIX: Parse JSON response
      const data = await response.json();
      
      if (response.ok) {
        // Registration successful - redirect to login
        navigate("/login", { state: { email: formData.email } });
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>

      <div className="w-full max-w-[450px] relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-2 rounded-xl">
              <BrainCircuit className="text-white w-7 h-7" />
            </div>
            <span className="text-2xl font-black text-white">StudyMate<span className="text-sky-500">.ai</span></span>
          </Link>
          <h2 className="text-2xl font-bold mt-6">Create Account</h2>
          <p className="text-slate-500 text-sm mt-1">Start your AI-powered study session today.</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 p-10 rounded-[3rem] shadow-2xl">
          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
              <AlertCircle size={20} className="text-red-400" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-slate-500 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text" required placeholder="Rajkumar Singh"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-sky-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-slate-500 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email" required placeholder="raj@example.com"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-sky-500 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-slate-500 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-white focus:border-sky-500 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  disabled={isLoading}
                />
                <button 
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-sky-500"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              disabled={isLoading} type="submit"
              className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-slate-600 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-sky-500/20"
            >
              {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 text-sm font-medium">
            Already have an account? <Link to="/login" className="text-sky-500 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}