import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PublicListings from "./components/PublicListings";
import ClosedDeals from "./components/ClosedDeals";
import LeadForms from "./components/LeadForms";
import AgentPortal from "./components/AgentPortal";
import AgentLockScreen from "./components/AgentLockScreen";
import { RealtorProfile, Listing, ClosedDeal, LeadSubmission } from "./types";
import { 
  INITIAL_REALTOR_PROFILE, 
  INITIAL_LISTINGS, 
  INITIAL_CLOSED_DEALS, 
  INITIAL_LEADS 
} from "./data";
import { Mail, Phone, MapPin, Building, Lock, Compass, Award, ShieldCheck, Sparkles } from "lucide-react";

export default function App() {
  // Mode Routing: 'public' | 'agent'
  const [viewMode, setViewMode] = useState<"public" | "agent">("public");

  // Agent authorization state
  const [isAgentUnlocked, setIsAgentUnlocked] = useState<boolean>(false);

  // Auto-lock when switching back to public view
  useEffect(() => {
    if (viewMode === "public") {
      setIsAgentUnlocked(false);
    }
  }, [viewMode]);

  const handleLockPortal = () => {
    setIsAgentUnlocked(false);
    setViewMode("public");
  };

  // Core Persistent State Pools
  const [profile, setProfile] = useState<RealtorProfile>(INITIAL_REALTOR_PROFILE);
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [deals, setDeals] = useState<ClosedDeal[]>(INITIAL_CLOSED_DEALS);
  const [leads, setLeads] = useState<LeadSubmission[]>(INITIAL_LEADS);

  // External active filters state for deep links
  const [externalFilter, setExternalFilter] = useState<{
    type: "buy" | "rent";
    location: string;
    propertyType?: string;
  } | null>(null);

  // 1. Initial State Loading from Local Storage
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("rks_realtor_profile");
      const storedListings = localStorage.getItem("rks_listings");
      const storedDeals = localStorage.getItem("rks_closed_deals");
      const storedLeads = localStorage.getItem("rks_leads");

      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (!parsed.photoUrl || parsed.photoUrl.includes("unsplash.com")) {
          parsed.photoUrl = INITIAL_REALTOR_PROFILE.photoUrl;
          localStorage.setItem("rks_realtor_profile", JSON.stringify(parsed));
        }
        setProfile({ ...INITIAL_REALTOR_PROFILE, ...parsed });
      }
      if (storedListings) setListings(JSON.parse(storedListings));
      if (storedDeals) setDeals(JSON.parse(storedDeals));
      if (storedLeads) setLeads(JSON.parse(storedLeads));
    } catch (err) {
      console.error("Local storage load failed. Using defaults.", err);
    }
  }, []);

  // 2. State pool synchronization helpers
  const updateProfile = (newProfile: RealtorProfile) => {
    setProfile(newProfile);
    localStorage.setItem("rks_realtor_profile", JSON.stringify(newProfile));
  };

  const addListing = (newListing: Listing) => {
    const updated = [newListing, ...listings];
    setListings(updated);
    localStorage.setItem("rks_listings", JSON.stringify(updated));
  };

  const updateListing = (updatedListing: Listing) => {
    const updated = listings.map((l) => (l.id === updatedListing.id ? updatedListing : l));
    setListings(updated);
    localStorage.setItem("rks_listings", JSON.stringify(updated));
  };

  const deleteListing = (id: string) => {
    const updated = listings.filter((l) => l.id !== id);
    setListings(updated);
    localStorage.setItem("rks_listings", JSON.stringify(updated));
  };

  const addDeal = (newDeal: ClosedDeal) => {
    const updated = [newDeal, ...deals];
    setDeals(updated);
    localStorage.setItem("rks_closed_deals", JSON.stringify(updated));
  };

  const deleteDeal = (id: string) => {
    const updated = deals.filter((d) => d.id !== id);
    setDeals(updated);
    localStorage.setItem("rks_closed_deals", JSON.stringify(updated));
  };

  const addLead = (newLeadData: Omit<LeadSubmission, "id" | "submittedAt">) => {
    const completeLead: LeadSubmission = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    const updated = [completeLead, ...leads];
    setLeads(updated);
    localStorage.setItem("rks_leads", JSON.stringify(updated));
  };

  const updateLeadStatus = (id: string, status: LeadSubmission["status"]) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status } : l));
    setLeads(updated);
    localStorage.setItem("rks_leads", JSON.stringify(updated));
  };

  const deleteLead = (id: string) => {
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);
    localStorage.setItem("rks_leads", JSON.stringify(updated));
  };

  // 3. Quick deep-link filtering triggered by Hero
  const handleQuickSearch = (type: "buy" | "rent", location: string, propertyType?: string) => {
    setExternalFilter({ type, location, propertyType });
  };

  const clearExternalFilter = () => {
    setExternalFilter(null);
  };

  // unread leads count calculator
  const unreadLeadsCount = leads.filter((l) => l.status === "New").length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Universal Sticky Header */}
      <Header 
        currentView={viewMode} 
        onViewChange={(mode) => setViewMode(mode)} 
        unreadLeadsCount={unreadLeadsCount}
      />

      {/* Dynamic Content Switching */}
      <main className="flex-1">
        {viewMode === "public" ? (
          <>
            {/* PUBLIC VISITOR LANDING SCREEN SECTIONS */}
            <Hero 
              profile={profile} 
              onQuickSearch={handleQuickSearch} 
            />
            
            <PublicListings 
              listings={listings} 
              onAddLead={addLead}
              externalFilter={externalFilter}
              onClearExternalFilter={clearExternalFilter}
            />
            
            <LeadForms 
              onAddLead={addLead} 
            />
          </>
        ) : (
          /* PASSCODE/AUTHORIZED AGENT DASHBOARD SECTION */
          !isAgentUnlocked ? (
            <AgentLockScreen 
              onUnlock={() => setIsAgentUnlocked(true)} 
              onCancel={() => setViewMode("public")} 
            />
          ) : (
            <AgentPortal
              profile={profile}
              onUpdateProfile={updateProfile}
              listings={listings}
              onAddListing={addListing}
              onUpdateListing={updateListing}
              onDeleteListing={deleteListing}
              deals={deals}
              onAddDeal={addDeal}
              onDeleteDeal={deleteDeal}
              leads={leads}
              onUpdateLeadStatus={updateLeadStatus}
              onDeleteLead={deleteLead}
              onLockPortal={handleLockPortal}
            />
          )
        )}
      </main>

      {/* Universal Sleek Interface Footer */}
      <footer className="bg-white border-t border-slate-200 py-16 text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-left mb-12">
            
             {/* Brand column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-full overflow-hidden shadow-md shrink-0 flex items-center justify-center bg-slate-950 border border-slate-800">
                  <svg viewBox="0 0 100 100" className="w-full h-full select-none" id="footer-logo-icon">
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
                <span className="font-sans font-bold text-lg text-slate-900 tracking-tight">
                  {profile.companyName || "chennaidreamzland"}
                </span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm">
                Danav's personal property showcase at dreamzland_chennai. Curated high-growth ready properties across prime sectors in Chennai. Direct, transparent, and hassle-free transaction management.
              </p>
              <div className="text-xs text-slate-400 font-mono space-y-1">
                <p>RERA Registration: TN/01/Agent/0241/2026</p>
                <p>License ID: {profile.licenseNo}</p>
              </div>
            </div>

            {/* Quick links */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-mono text-xs uppercase tracking-widest text-slate-900 font-bold">
                Specialized Localities
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li><span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleQuickSearch("buy", "Tiruvanmiyar")}>Tiruvanmiyar Coastal Strip</span></li>
                <li><span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleQuickSearch("buy", "OMR")}>OMR Tech Corridor</span></li>
                <li><span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleQuickSearch("buy", "Chitlapuram")}>Chitlapuram Central</span></li>
                <li><span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleQuickSearch("buy", "Alwarpet")}>Alwarpet Luxury Enclaves</span></li>
              </ul>
            </div>

            {/* Contact details */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-mono text-xs uppercase tracking-widest text-slate-900 font-bold">
                Showcase HQ Office
              </h4>
              <div className="space-y-3.5 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4.5 w-4.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>{profile.officeAddress}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4.5 w-4.5 text-indigo-600 flex-shrink-0" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4.5 w-4.5 text-indigo-600 flex-shrink-0" />
                  <a href={`mailto:${profile.email}`} className="hover:text-indigo-600 transition-colors">{profile.email}</a>
                </div>
              </div>
            </div>

          </div>

          {/* Footer bottom bar */}
          <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} {profile.companyName || "chennaidreamzland"}. All rights reserved. Made in Chennai, India.</p>
            <div className="flex items-center space-x-6">
              <button
                id="footer-agent-login-shortcut"
                onClick={() => setViewMode(viewMode === "public" ? "agent" : "public")}
                className="flex items-center space-x-1.5 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>{viewMode === "public" ? "Agent Console Link" : "Return to Public Page"}</span>
              </button>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400">RERA Registered Agent</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
