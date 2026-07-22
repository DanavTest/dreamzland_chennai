import React from "react";
import { Building, Lock, UserCheck, Phone, Menu, X, ArrowRight } from "lucide-react";

interface HeaderProps {
  currentView: "public" | "agent";
  onViewChange: (view: "public" | "agent") => void;
  unreadLeadsCount: number;
}

export default function Header({ currentView, onViewChange, unreadLeadsCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView !== "public") {
      onViewChange("public");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 md:gap-6 lg:gap-8">
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer shrink-0" 
            onClick={() => {
              onViewChange("public");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="w-11 h-11 rounded-full overflow-hidden shadow-md shrink-0 flex items-center justify-center bg-slate-950 border border-slate-800">
              <svg viewBox="0 0 100 100" className="w-full h-full select-none" id="header-logo-icon">
                {/* Circle Background */}
                <circle cx="50" cy="50" r="48" fill="#111827" stroke="#D97706" strokeWidth="2.5" />
                {/* Inner border */}
                <circle cx="50" cy="50" r="44" fill="none" stroke="#F59E0B" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
                
                {/* Skyscrapers & House Roofs */}
                <rect x="42" y="24" width="8" height="36" fill="#F59E0B" opacity="0.95" />
                <rect x="44" y="26" width="1.5" height="32" fill="#111827" />
                <rect x="47" y="26" width="1.5" height="32" fill="#111827" />
                
                <rect x="52" y="32" width="8" height="28" fill="#D97706" />
                <line x1="56" y1="34" x2="56" y2="60" stroke="#111827" strokeWidth="1.5" />
                
                <polygon points="30,62 50,44 70,62" fill="#050505" stroke="#F59E0B" strokeWidth="1.5" />
                <polygon points="26,62 48,42 54,42 30,62" fill="#D97706" />
                
                {/* Palm Tree */}
                <path d="M 72 62 Q 74 52 78 44" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                <path d="M 78 44 Q 72 40 68 43" stroke="#F59E0B" strokeWidth="1" fill="none" />
                <path d="M 78 44 Q 74 36 73 35" stroke="#F59E0B" strokeWidth="1" fill="none" />
                <path d="M 78 44 Q 82 36 84 37" stroke="#F59E0B" strokeWidth="1" fill="none" />
                <path d="M 78 44 Q 84 41 86 45" stroke="#F59E0B" strokeWidth="1" fill="none" />
                <path d="M 78 44 Q 78 48 76 50" stroke="#F59E0B" strokeWidth="1" fill="none" />

                {/* Birds */}
                <path d="M 24 40 Q 26 38 28 40 Q 30 38 32 40" stroke="#F59E0B" strokeWidth="0.75" fill="none" />
                <path d="M 32 45 Q 34 43 36 45 Q 38 43 40 45" stroke="#F59E0B" strokeWidth="0.75" fill="none" />

                {/* Window */}
                <rect x="47" y="52" width="6" height="6" rx="1" fill="#FEF08A" />
                <line x1="50" y1="52" x2="50" y2="58" stroke="#111827" strokeWidth="0.5" />
                <line x1="47" y1="55" x2="53" y2="55" stroke="#111827" strokeWidth="0.5" />

                {/* Key at bottom */}
                <path d="M 40 76 H 55 M 55 74 V 78 M 58 74 V 78 M 60 76 H 62" stroke="#F59E0B" strokeWidth="1" fill="none" />
                <circle cx="37" cy="76" r="3" fill="none" stroke="#F59E0B" strokeWidth="1" />
                <circle cx="37" cy="76" r="1" fill="#F59E0B" />
              </svg>
            </div>
            <div>
              <span className="font-sans font-bold text-xl tracking-tight text-slate-900">
                dreamzland_chennai
              </span>
              <p className="font-mono text-[9px] uppercase text-indigo-600 tracking-widest leading-none mt-0.5 font-semibold">
                Premium Property Portal
              </p>
            </div>
          </div>
 
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-5 lg:space-x-8 shrink-0">
            <button 
              onClick={() => scrollToSection("home")} 
              className="text-slate-500 hover:text-slate-900 font-semibold uppercase tracking-wider text-[11px] transition-colors duration-150"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("listings")} 
              className="text-slate-500 hover:text-slate-900 font-semibold uppercase tracking-wider text-[11px] transition-colors duration-150"
            >
              Listings
            </button>
            <button 
              onClick={() => scrollToSection("lead-section")} 
              className="text-slate-500 hover:text-slate-900 font-semibold uppercase tracking-wider text-[11px] transition-colors duration-150"
            >
              Buy/Sell Enquiry
            </button>
          </nav>

          {/* Mode Switcher / Action buttons */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4 shrink-0">
            <a 
              href="tel:+919840123456" 
              className="flex items-center space-x-2 text-xs text-slate-700 font-semibold uppercase tracking-wider bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-slate-500" />
              <span>+91 98401 23456</span>
            </a>
            
            {currentView === "public" ? (
              <button
                id="header-agent-btn"
                onClick={() => onViewChange("agent")}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-md shadow-xs transition-all border border-transparent"
              >
                <Lock className="h-3.5 w-3.5 text-slate-300" />
                <span>Agent Workspace</span>
              </button>
            ) : (
              <button
                id="header-public-btn"
                onClick={() => onViewChange("public")}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-md shadow-sm transition-all"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>View Public Site</span>
                {unreadLeadsCount > 0 && (
                  <span className="ml-1.5 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadLeadsCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {unreadLeadsCount > 0 && currentView === "agent" && (
              <span className="bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {unreadLeadsCount}
              </span>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4 shadow-lg text-slate-900">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => scrollToSection("home")}
              className="text-left text-slate-600 hover:text-slate-900 hover:bg-slate-50 py-2.5 px-2 text-sm uppercase tracking-wider font-semibold border-b border-slate-100 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("listings")}
              className="text-left text-slate-600 hover:text-slate-900 hover:bg-slate-50 py-2.5 px-2 text-sm uppercase tracking-wider font-semibold border-b border-slate-100 transition-colors"
            >
              Listings
            </button>
            <button
              onClick={() => scrollToSection("lead-section")}
              className="text-left text-slate-600 hover:text-slate-900 hover:bg-slate-50 py-2.5 px-2 text-sm uppercase tracking-wider font-semibold border-b border-slate-100 transition-colors"
            >
              Buy/Sell Enquiry
            </button>
          </div>

          <div className="pt-4 border-t border-slate-150 flex flex-col space-y-3">
            <a
              href="tel:+919840123456"
              className="flex items-center justify-center space-x-2 text-sm text-slate-800 font-semibold uppercase tracking-wider bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200"
            >
              <Phone className="h-4 w-4 text-slate-500" />
              <span>+91 98401 23456</span>
            </a>

            {currentView === "public" ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onViewChange("agent");
                }}
                className="flex items-center justify-center space-x-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold uppercase tracking-widest py-3 rounded-lg shadow-sm transition-all"
              >
                <Lock className="h-4 w-4 text-slate-300" />
                <span>Agent Workspace</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onViewChange("public");
                }}
                className="flex items-center justify-center space-x-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold uppercase tracking-widest py-3 rounded-lg shadow-sm"
              >
                <UserCheck className="h-4 w-4" />
                <span>View Public Site</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
