import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { X, Mail, Lock, User, ArrowLeft, Loader2, Sparkles, AlertCircle } from "lucide-react";

interface LoginFormProps {
  onClose?: () => void;
  onSuccess?: (username: string) => void;
}

export default function LoginForm({ onClose, onSuccess }: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (isSignUp && !name.trim()) {
      setError("Please enter your name.");
      setIsLoading(false);
      return;
    }

    if (isSignUp && !agreeTerms) {
      setError("You must agree to the terms and conditions.");
      setIsLoading(false);
      return;
    }

    // Simulate standard authentication delay
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) {
        onSuccess(name || email.split("@")[0]);
      }
      if (onClose) {
        onClose();
      }
    }, 1500);
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden relative font-sans">
      {/* Back/Close buttons */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-150 transition-colors z-50 text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <X size={20} />
        </button>
      )}

      {/* Left side artwork: Apple-style premium minimalist image */}
      <div className="w-1/2 hidden md:block relative h-full bg-slate-950">
        <img
          className="h-full w-full object-cover opacity-85"
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
          alt="Modern Abstract Aesthetic Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-left space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-white font-medium select-none">
            <Sparkles size={12} className="text-indigo-300 animate-pulse" />
            <span>Join 4,800+ micro-businesses today</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans leading-tight">
            Build one beautiful page. <br />
            Own your online presence instantly.
          </h1>
          <p className="text-sm text-slate-300 font-medium max-w-sm">
            Everything your business needs — booking slot engine, custom lead capture forms, WhatsApp automations, and SEO tags.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto bg-slate-50/25">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to site</span>
          </button>
        )}

        <div className="w-full max-w-md bg-white border border-slate-150 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-100/50">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <h2 className="text-3xl sm:text-4xl text-slate-900 font-bold tracking-tight text-center">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 text-center font-medium">
              {isSignUp
                ? "Get started with your free OnlyPage subdomain today."
                : "Enter your credentials to manage your custom presence."}
            </p>

            {/* Error alerts */}
            {error && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Google Authentication Trigger */}
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  if (onSuccess) onSuccess("Google User");
                  if (onClose) onClose();
                }, 1000);
              }}
              className="w-full mt-6 bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center h-12 rounded-full font-bold text-xs text-slate-700 transition-all cursor-pointer shadow-3xs"
            >
              <img
                className="w-4 h-4 mr-2"
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                alt="googleLogo"
              />
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-4 w-full my-5">
              <div className="w-full h-px bg-slate-200"></div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-nowrap shrink-0">
                or sign {isSignUp ? "up" : "in"} with email
              </p>
              <div className="w-full h-px bg-slate-200"></div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              {isSignUp && (
                <div className="flex items-center bg-white border border-slate-200 hover:border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all h-12 rounded-full overflow-hidden pl-5 pr-2 gap-2.5 shadow-3xs">
                  <User size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent text-slate-800 placeholder-slate-400 outline-none text-xs font-semibold w-full h-full"
                    required={isSignUp}
                  />
                </div>
              )}

              <div className="flex items-center bg-white border border-slate-200 hover:border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all h-12 rounded-full overflow-hidden pl-5 pr-2 gap-2.5 shadow-3xs">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <input
                  type="email"
                  placeholder="Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-slate-800 placeholder-slate-400 outline-none text-xs font-semibold w-full h-full"
                  required
                />
              </div>

              <div className="flex items-center bg-white border border-slate-200 hover:border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all h-12 rounded-full overflow-hidden pl-5 pr-2 gap-2.5 shadow-3xs">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-slate-800 placeholder-slate-400 outline-none text-xs font-semibold w-full h-full"
                  required
                />
              </div>
            </div>

            {/* Remember Me / Forgot Password */}
            {!isSignUp ? (
              <div className="w-full flex items-center justify-between mt-4 text-slate-500">
                <div className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                    type="checkbox"
                    id="remember_me"
                  />
                  <label className="text-xs font-bold text-slate-500 cursor-pointer" htmlFor="remember_me">
                    Remember me
                  </label>
                </div>
                <a className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                  Forgot password?
                </a>
              </div>
            ) : (
              <div className="w-full flex items-start gap-2 mt-4 select-none">
                <input
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer mt-0.5"
                  type="checkbox"
                  id="agree_terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <label className="text-xs font-semibold text-slate-500 cursor-pointer" htmlFor="agree_terms">
                  I agree to the{" "}
                  <a className="text-indigo-600 hover:underline font-bold">Terms of Service</a>{" "}
                  and{" "}
                  <a className="text-indigo-600 hover:underline font-bold">Privacy Policy</a>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full h-12 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-md active:scale-98 transition-all flex items-center justify-center font-bold text-xs cursor-pointer shadow-md shadow-indigo-100"
            >
              {isLoading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Processing...</span>
                </span>
              ) : (
                <span>{isSignUp ? "Sign Up" : "Sign In"}</span>
              )}
            </button>

            {/* Footer switcher */}
            <p className="text-slate-500 text-xs mt-5 text-center font-semibold">
              {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setIsSignUp(!isSignUp);
                }}
                className="text-indigo-600 hover:underline font-bold bg-transparent border-none cursor-pointer p-0 ml-1"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
