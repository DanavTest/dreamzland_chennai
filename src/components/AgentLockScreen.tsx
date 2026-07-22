import React, { useState, useEffect, useRef } from "react";
import { Lock, Unlock, X, ShieldAlert, Key, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";

interface AgentLockScreenProps {
  onUnlock: () => void;
  onCancel: () => void;
}

export default function AgentLockScreen({ onUnlock, onCancel }: AgentLockScreenProps) {
  const [passcode, setPasscode] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Retrieve stored passcode, defaulting to "DanJva"
  const getStoredPasscode = () => {
    return localStorage.getItem("rks_agent_passcode") || "DanJva";
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const correct = getStoredPasscode();
    
    if (passcode.trim() === correct.trim()) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  const handleFillDefault = () => {
    const defaultCode = getStoredPasscode();
    setPasscode(defaultCode);
    setError(false);
    setTimeout(() => {
      onUnlock();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-md flex flex-col items-center justify-center p-4 text-white transition-all overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center my-8">
        
        {/* Subtle decorative background glow */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header Row with Close / Exit */}
        <div className="absolute top-4 right-4">
          <button 
            type="button"
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center border border-slate-800/60"
            title="Cancel and return to public site"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Lock Icon and Header */}
        <div className="mb-6 flex flex-col items-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
            error 
              ? "bg-rose-500/20 border-2 border-rose-500 text-rose-500 animate-bounce" 
              : "bg-indigo-500/15 border-2 border-indigo-500/40 text-indigo-400"
          }`}>
            {error ? (
              <ShieldAlert className="h-8 w-8" />
            ) : (
              <Lock className="h-8 w-8" />
            )}
          </div>

          <h2 className="text-xl font-bold font-sans tracking-tight text-white mt-4 flex items-center space-x-2">
            <span>dreamzland_chennai</span>
          </h2>
          <p className="text-xs font-mono text-amber-500 uppercase tracking-widest mt-1 font-semibold">
            Agent Workspace Security Gate
          </p>
          <p className="text-xs text-slate-400 font-sans max-w-xs mt-3 leading-relaxed">
            Please enter your access password to unlock the agent workspace and manage client listings.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleVerify} className="w-full space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type={showPassword ? "text" : "password"}
              value={passcode}
              onChange={(e) => {
                setError(false);
                setPasscode(e.target.value);
              }}
              placeholder="Enter agent password..."
              className={`w-full bg-slate-950/80 border text-center text-lg font-mono font-bold text-white px-4 py-3.5 rounded-2xl focus:outline-none transition-all ${
                error 
                  ? "border-rose-500 ring-2 ring-rose-500/20" 
                  : "border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              }`}
            />
            
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error && (
            <p className="text-xs font-sans text-rose-500 font-bold animate-shake">
              Incorrect password. Please try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-sans font-extrabold rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <span>Unlock Agent Portal</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Quick Fill Default Button */}
        <div className="mt-4 w-full">
          <button
            type="button"
            onClick={handleFillDefault}
            className="w-full py-2.5 px-4 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/40 hover:border-indigo-700/60 text-indigo-300 rounded-xl text-xs font-sans font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Auto-fill passcode</span>
          </button>
        </div>

        {/* Return to Public Site */}
        <button
          type="button"
          onClick={onCancel}
          className="mt-6 w-full py-2.5 px-4 text-slate-400 hover:text-slate-200 text-xs font-sans font-medium transition-colors"
        >
          Cancel & Return to Public Site
        </button>

        {/* Administrator Tip */}
        <div className="mt-6 p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-left w-full">
          <div className="flex items-start space-x-2.5">
            <Key className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                Security Passcode
              </p>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-0.5">
                You can customize or change your security password anytime inside Agent Settings.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
