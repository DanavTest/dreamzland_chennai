import React, { useState } from "react";
import { RealtorProfile } from "../types";
import { Award, ShieldCheck, Users, ArrowDown, MapPin, MessageSquareText, Camera, Upload } from "lucide-react";

interface HeroProps {
  profile: RealtorProfile;
  onQuickSearch: (type: "buy" | "rent", location: string, propertyType?: string) => void;
  onUpdatePhoto?: (newPhotoUrl: string) => void;
}

export default function Hero({ profile, onQuickSearch, onUpdatePhoto }: HeroProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        // Send to server backend
        try {
          await fetch("/api/profile-photo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ photoUrl: dataUrl }),
          });
        } catch (err) {
          console.error("Failed to upload to server", err);
        }
        if (onUpdatePhoto) {
          onUpdatePhoto(dataUrl);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error processing photo file", err);
      setIsUploading(false);
    }
  };
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center bg-slate-50 overflow-hidden py-16">
      {/* Background ambient radial gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-slate-200/40 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Grid lines background decoration for corporate executive feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Realtor Identity & Bio */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 text-left">
            <div>
              <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full text-white text-[10px] font-bold tracking-widest uppercase mb-6 shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                <span>RERA Registered Advisor • TN RERA Compliant</span>
              </div>
              <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 leading-tight">
                Premium Real Estate <br />
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-slate-900 bg-clip-text text-transparent">
                  Tailored For Chennai
                </span>
              </h1>
              <div className="mt-6 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-sans whitespace-pre-line">
                {profile.bio}
              </div>
            </div>

            {/* Direct engagement call to action & search shortcuts */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection("lead-section")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-extrabold px-8 py-4 rounded-xl text-center shadow-md shadow-indigo-100 transition-all duration-150 transform active:scale-[0.98] flex items-center justify-center space-x-2 text-xs uppercase tracking-widest"
                >
                  <MessageSquareText className="h-4 w-4" />
                  <span>Request Valuation / Settle Inquiry</span>
                </button>
                <button
                  onClick={() => scrollToSection("listings")}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-sans font-bold px-8 py-4 rounded-xl text-center transition-colors flex items-center justify-center space-x-2 text-xs uppercase tracking-widest shadow-xs"
                >
                  <span>Explore Properties</span>
                  <ArrowDown className="h-3.5 w-3.5 text-indigo-600 animate-bounce" />
                </button>
              </div>

              {/* Quick filter triggers */}
              <div className="pt-2">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block mb-2.5 font-bold">
                  Quick Location Hotlinks:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onQuickSearch("buy", "Tiruvanmiyar", "Villa")}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-350 transition-all font-sans font-semibold flex items-center space-x-1 shadow-xs"
                  >
                    <MapPin className="h-3 w-3 text-indigo-500" />
                    <span>Tiruvanmiyar Villa</span>
                  </button>
                  <button
                    onClick={() => onQuickSearch("buy", "OMR", "Apartment")}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-350 transition-all font-sans font-semibold flex items-center space-x-1 shadow-xs"
                  >
                    <MapPin className="h-3 w-3 text-indigo-500" />
                    <span>OMR Highrise</span>
                  </button>
                  <button
                    onClick={() => onQuickSearch("buy", "Chitlapuram", "Apartment")}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-350 transition-all font-sans font-semibold flex items-center space-x-1 shadow-xs"
                  >
                    <MapPin className="h-3 w-3 text-indigo-500" />
                    <span>Chitlapuram Flat</span>
                  </button>
                  <button
                    onClick={() => onQuickSearch("buy", "Alwarpet", "Penthouse")}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-350 transition-all font-sans font-semibold flex items-center space-x-1 shadow-xs"
                  >
                    <MapPin className="h-3 w-3 text-indigo-500" />
                    <span>Alwarpet Penthouse</span>
                  </button>
                  <button
                    onClick={() => onQuickSearch("buy", "Tambaram", "Independent House")}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-350 transition-all font-sans font-semibold flex items-center space-x-1 shadow-xs"
                  >
                    <MapPin className="h-3 w-3 text-indigo-500" />
                    <span>Tambaram House</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Realtor Portrait Frame */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-[380px] aspect-[4/5] sm:max-w-[400px]">
              {/* Luxury Frame Accents */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100 rounded-3xl transform rotate-3 scale-102 shadow-sm"></div>
              <div className="absolute inset-0 bg-white rounded-3xl transform -rotate-1 scale-101 border border-slate-200"></div>

              {/* Photo Frame Container */}
              <div className="absolute inset-2 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/50 group">
                <img
                  src={profile.photoUrl || "/api/profile-photo"}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618077360395-f3068be8e001?auto=format&fit=crop&w=800&q=80";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />

                {/* Upload Photo Quick Action Overlay */}
                <input
                  type="file"
                  id="hero-photo-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("hero-photo-input")?.click()}
                  className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-950 text-white backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs font-mono font-medium flex items-center space-x-1.5 opacity-90 hover:opacity-100 transition-all shadow-md z-20 group/btn cursor-pointer"
                  title="Upload or change Realtor profile photograph"
                >
                  <Camera className="h-3.5 w-3.5 text-indigo-400 group-hover/btn:scale-110 transition-transform" />
                  <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
                </button>
                
                {/* Info Overlay at the bottom */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent p-6 text-left">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-indigo-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
                    License No: {profile.licenseNo}
                  </span>
                  <h3 className="font-sans font-bold text-lg text-white mt-2 leading-none">
                    {profile.name}
                  </h3>
                  <p className="text-slate-300 text-xs font-sans mt-1 leading-tight">
                    {profile.title}
                  </p>
                  <p className="text-slate-400 text-[11px] font-mono mt-1">
                    Languages: {profile.languages.join(", ")}
                  </p>
                </div>
              </div>

              {/* Interactive badge decorators */}
              <div className="absolute -top-4 -right-4 bg-white border border-slate-200 text-slate-900 p-3 rounded-2xl shadow-md flex items-center space-x-2.5">
                <div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100 text-indigo-600">
                  <Award className="h-5 w-5" />
                </div>
                <div className="text-left leading-tight pr-1">
                  <p className="text-slate-950 font-extrabold text-sm">Top Professional</p>
                  <p className="text-slate-400 text-[10px] uppercase tracking-wider font-mono">South Chennai Specialist</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-2xl shadow-md flex items-center space-x-2 text-left">
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-mono tracking-wider font-bold text-slate-700">
                  Active Now
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
