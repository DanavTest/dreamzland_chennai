import React, { useState, useEffect, useRef } from "react";
import { Lock, Unlock, X, ShieldAlert, Key, Eye, EyeOff, CornerDownLeft } from "lucide-react";

interface AgentLockScreenProps {
  onUnlock: () => void;
  onCancel: () => void;
}

export default function AgentLockScreen({ onUnlock, onCancel }: AgentLockScreenProps) {
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [showPin, setShowPin] = useState<boolean>(false);
  const lockScreenRef = useRef<HTMLDivElement>(null);

  // Retrieve the stored passcode, defaulting to "1509"
  const getStoredPasscode = () => {
    return localStorage.getItem("rks_agent_passcode") || "1509";
  };

  // Listen for physical keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus element check to prevent breaking standard inputs if there are any
      if (e.key >= "0" && e.key <= "9") {
        if (pin.length < 4) {
          setError(false);
          setPin(prev => prev + e.key);
        }
      } else if (e.key === "Backspace") {
        setError(false);
        setPin(prev => prev.slice(0, -1));
      } else if (e.key === "Enter") {
        if (pin.length === 4) {
          verifyPin(pin);
        }
      } else if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Autofocus lock container for seamless keyboard typing
    lockScreenRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pin, onCancel]);

  // Handle virtual button press
  const handleNumberPress = (num: string) => {
    if (pin.length < 4) {
      setError(false);
      const newPin = pin + num;
      setPin(newPin);
      // Auto-submit if reaches 4 digits
      if (newPin.length === 4) {
        // Slight delay for visual satisfaction of the fourth dot filling up
        setTimeout(() => verifyPin(newPin), 200);
      }
    }
  };

  const handleBackspace = () => {
    setError(false);
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setError(false);
    setPin("");
  };

  const verifyPin = (codeToVerify: string) => {
    const correctPasscode = getStoredPasscode();
    if (codeToVerify === correctPasscode) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      // Vibrate if supported
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      // Reset after a short shaking duration
      setTimeout(() => {
        setPin("");
      }, 500);
    }
  };

  return (
    <div 
      ref={lockScreenRef}
      tabIndex={0}
      className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-md flex flex-col items-center justify-center p-4 focus:outline-none select-none text-white transition-all overflow-y-auto"
    >
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
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            error 
              ? "bg-rose-500/20 border-2 border-rose-500 text-rose-500 animate-bounce" 
              : pin.length === 4 
                ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400" 
                : "bg-indigo-500/15 border-2 border-indigo-500/40 text-indigo-400"
          }`}>
            {error ? (
              <ShieldAlert className="h-7 w-7" />
            ) : pin.length === 4 ? (
              <Unlock className="h-7 w-7" />
            ) : (
              <Lock className="h-7 w-7" />
            )}
          </div>

          <h2 className="text-xl font-bold font-sans tracking-tight text-white mt-4 flex items-center space-x-2">
            <span>dreamzland_chennai</span>
          </h2>
          <p className="text-xs font-mono text-amber-500 uppercase tracking-widest mt-1">
            Agent Workspace Gate
          </p>
          <p className="text-xs text-slate-400 font-sans max-w-xs mt-3 leading-relaxed">
            Please enter your 4-digit passcode to access premium CRM data, edit property listings, and respond to clients.
          </p>
        </div>

        {/* Passcode Indicator Dots */}
        <div className={`flex justify-center items-center space-x-4 my-4 p-3 rounded-2xl bg-slate-950/40 border border-slate-800/50 w-full max-w-[240px] ${
          error ? "animate-[shake_0.4s_ease-in-out]" : ""
        }`}>
          {[0, 1, 2, 3].map((index) => {
            const hasDigit = pin.length > index;
            const isCurrent = pin.length === index;
            return (
              <div 
                key={index} 
                className={`relative w-4.5 h-4.5 rounded-full transition-all duration-250 border ${
                  error
                    ? "bg-rose-600 border-rose-500 scale-105"
                    : hasDigit
                      ? "bg-indigo-500 border-indigo-400 scale-110 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                      : isCurrent
                        ? "bg-slate-800 border-indigo-500/60 scale-100 ring-2 ring-indigo-500/20"
                        : "bg-slate-900 border-slate-800 scale-100"
                }`}
              >
                {hasDigit && showPin && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-sans font-black text-white">
                    {pin[index]}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Show/Hide PIN Button */}
        {pin.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="flex items-center space-x-1 text-slate-400 hover:text-indigo-400 text-[10px] uppercase tracking-wider font-semibold transition-colors mt-1 mb-4"
          >
            {showPin ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            <span>{showPin ? "Hide Digits" : "Reveal Digits"}</span>
          </button>
        )}

        {/* Keypad Grid */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[280px] my-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleNumberPress(num)}
              className="h-14 rounded-2xl bg-slate-850 hover:bg-slate-800 active:bg-indigo-600 active:text-white border border-slate-800/80 hover:border-slate-700 font-mono text-lg font-bold text-slate-100 transition-all flex items-center justify-center shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-rose-900/40 text-slate-400 hover:text-rose-500 font-sans text-xs font-semibold tracking-wider transition-all flex items-center justify-center border border-slate-850"
          >
            CLEAR
          </button>
          <button
            type="button"
            onClick={() => handleNumberPress("0")}
            className="h-14 rounded-2xl bg-slate-850 hover:bg-slate-800 active:bg-indigo-600 active:text-white border border-slate-800/80 hover:border-slate-700 font-mono text-lg font-bold text-slate-100 transition-all flex items-center justify-center shadow-sm"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-slate-750 text-slate-400 hover:text-white font-sans text-xs font-semibold tracking-wider transition-all flex items-center justify-center border border-slate-850"
            title="Backspace"
          >
            DELETE
          </button>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <p className="text-xs font-sans text-rose-500 font-bold mt-2 animate-pulse">
            Incorrect passcode. Please try again!
          </p>
        )}

        {/* Return to Public Button */}
        <button
          type="button"
          onClick={onCancel}
          className="mt-6 w-full max-w-[280px] py-3 px-4 border border-slate-800 hover:border-slate-700 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow"
        >
          <span>Cancel & Exit Gate</span>
        </button>

        {/* Helpful Administrator Hint Card */}
        <div className="mt-8 p-3.5 bg-indigo-950/20 border border-indigo-900/30 rounded-2xl text-left w-full">
          <div className="flex items-start space-x-2.5">
            <Key className="h-4.5 w-4.5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                Authorization Tip
              </p>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-0.5">
                The default security code for Danav is <span className="text-amber-500 font-bold">1509</span>. Feel free to customize this inside your Realtor Settings later.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Embedded CSS for shake animation to ensure compile safety without external styles */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-6px); }
          30%, 60%, 90% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
