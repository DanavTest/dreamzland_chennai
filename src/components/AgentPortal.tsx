import React, { useState } from "react";
import { RealtorProfile, Listing, ClosedDeal, LeadSubmission } from "../types";
import { formatIndianPrice, CHENNAI_LOCALITIES } from "../data";
import { 
  User, Building2, ListOrdered, ClipboardList, Save, Sparkles, 
  Plus, Trash, Edit, Check, X, Phone, Mail, Award, MapPin, 
  TrendingUp, MessageSquare, AlertCircle, RefreshCw, UploadCloud, Camera, Star,
  Lock, LogOut
} from "lucide-react";

interface AgentPortalProps {
  profile: RealtorProfile;
  onUpdateProfile: (p: RealtorProfile) => void;
  listings: Listing[];
  onAddListing: (l: Listing) => void;
  onUpdateListing: (l: Listing) => void;
  onDeleteListing: (id: string) => void;
  deals: ClosedDeal[];
  onAddDeal: (d: ClosedDeal) => void;
  onDeleteDeal: (id: string) => void;
  leads: LeadSubmission[];
  onUpdateLeadStatus: (id: string, status: LeadSubmission["status"]) => void;
  onDeleteLead: (id: string) => void;
  onLockPortal: () => void;
}

export default function AgentPortal({
  profile,
  onUpdateProfile,
  listings,
  onAddListing,
  onUpdateListing,
  onDeleteListing,
  deals,
  onAddDeal,
  onDeleteDeal,
  leads,
  onUpdateLeadStatus,
  onDeleteLead,
  onLockPortal,
}: AgentPortalProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"profile" | "listings" | "deals" | "leads">("leads");

  // Profile Form State
  const [profileForm, setProfileForm] = useState<RealtorProfile>({ ...profile });
  const [profileSaved, setProfileSaved] = useState(false);
  const [passcodeForm, setPasscodeForm] = useState<string>(() => {
    const stored = localStorage.getItem("rks_agent_passcode");
    if (!stored || stored === "DanJva") {
      localStorage.setItem("rks_agent_passcode", "jd10");
      return "jd10";
    }
    return stored;
  });

  // Keep profileForm synced with parent state changes
  React.useEffect(() => {
    setProfileForm({ ...profile });
  }, [profile]);

  // Drag and drop states for images
  const [dragActiveProfile, setDragActiveProfile] = useState(false);
  const [dragActiveListing, setDragActiveListing] = useState(false);

  // Helper to compress and convert images to Base64 JPEG to avoid localStorage quota limits
  const compressImageFile = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error("Image loading failed"));
        img.src = event.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Helper to convert profile image to compressed Base64 and save to server
  const handleProfileImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload or paste an image file.");
      return;
    }
    try {
      const compressedDataUrl = await compressImageFile(file, 800, 1000, 0.88);
      setProfileForm((prev) => ({ ...prev, photoUrl: compressedDataUrl }));
      
      // Persist permanently to server backend disk
      fetch("/api/profile-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: compressedDataUrl }),
      }).then((res) => res.json()).then((data) => {
        console.log("Photo synced to server:", data);
      }).catch((err) => console.error("Failed to sync photo to server:", err));
    } catch (err) {
      console.error("Failed to compress profile image", err);
    }
  };

  const handleProfileDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveProfile(true);
    } else if (e.type === "dragleave") {
      setDragActiveProfile(false);
    }
  };

  const handleProfileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveProfile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProfileImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleProfilePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          handleProfileImageFile(file);
          e.preventDefault();
        }
      }
    }
  };

  // Helper to convert listing image files (one or more) to compressed Base64
  const handleListingImageFiles = async (files: FileList | File[]) => {
    const validImageFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (validImageFiles.length === 0) {
      alert("Please upload or paste image files.");
      return;
    }

    try {
      const promises = validImageFiles.map(file => compressImageFile(file, 1000, 1000, 0.8));
      const base64Images = await Promise.all(promises);

      setListingForm((prev) => {
        const currentGallery = prev.gallery || [];
        const newGallery = [...currentGallery, ...base64Images];
        const defaultPlaceholder = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";
        const needsPrimaryImage = !prev.image || prev.image === defaultPlaceholder;
        return {
          ...prev,
          image: needsPrimaryImage ? base64Images[0] : prev.image,
          gallery: newGallery
        };
      });
    } catch (err) {
      console.error("Error reading image files:", err);
    }
  };

  const handleListingDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveListing(true);
    } else if (e.type === "dragleave") {
      setDragActiveListing(false);
    }
  };

  const handleListingDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveListing(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleListingImageFiles(e.dataTransfer.files);
    }
  };

  const handleListingPaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }
    if (files.length > 0) {
      handleListingImageFiles(files);
      e.preventDefault();
    }
  };

  // Listing Form / Add/Edit Modal State
  const PRESET_USPS = [
    "Near Metro",
    "Sea View",
    "Gated Community",
    "Beachfront",
    "Corner Plot",
    "Vastu Compliant",
    "IT Corridor",
    "Park Facing",
    "Private Terrace",
  ];

  const [showListingModal, setShowListingModal] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [listingForm, setListingForm] = useState<Partial<Listing>>({
    title: "",
    price: 15000000,
    type: "buy",
    propertyType: "Apartment",
    bhk: 3,
    bathrooms: 3,
    sqft: 1800,
    location: "Adyar",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    description: "",
    amenities: ["24/7 Gated Security", "100% Power Backup", "Vastu Compliant"],
    usps: ["Near Metro", "Sea View", "Gated Community"],
    status: "Active",
  });
  
  // AI generator sub-states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiAmenitiesString, setAiAmenitiesString] = useState("Vastu Compliant, Swimming Pool, High Rise, Sea View");

  // Closed Deals State
  const [dealForm, setDealForm] = useState<Partial<ClosedDeal>>({
    title: "",
    price: 20000000,
    location: "Adyar",
    type: "sale",
    closedDate: "July 2026",
    propertyType: "Apartment",
    bhk: 3,
  });
  const [showDealForm, setShowDealForm] = useState(false);

  // Selected lead for detail reading
  const [selectedLead, setSelectedLead] = useState<LeadSubmission | null>(null);

  // Handle Profile Update Save
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeForm.trim()) {
      alert("Access passcode cannot be empty.");
      return;
    }
    onUpdateProfile(profileForm);
    localStorage.setItem("rks_agent_passcode", passcodeForm.trim());
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // Trigger Gemini AI Description Generator
  const generateAiDescription = async () => {
    setAiLoading(true);
    setAiError("");

    try {
      const activeUsps = listingForm.usps && listingForm.usps.length > 0 
        ? listingForm.usps 
        : ["Near Metro", "Sea View", "Gated Community"];

      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyType: listingForm.propertyType,
          location: listingForm.location,
          bhk: listingForm.bhk,
          price: formatIndianPrice(listingForm.price || 0),
          amenities: aiAmenitiesString.split(",").map((s) => s.trim()).filter(Boolean),
          usps: activeUsps,
          tone: "luxurious, sophisticated, and high-converting",
        }),
      });

      const data = await response.json();
      if (response.ok && data.description) {
        setListingForm((prev) => ({
          ...prev,
          description: data.description,
          usps: activeUsps,
        }));
      } else {
        throw new Error(data.error || "Failed to generate property details.");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Could not connect to description generator. Please verify your GEMINI_API_KEY in Secrets.");
    } finally {
      setAiLoading(false);
    }
  };

  // Handle Listing Submit (Add/Edit)
  const handleListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingForm.title || !listingForm.price || !listingForm.location) return;

    const mainImg = listingForm.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";
    const currentUsps = listingForm.usps && listingForm.usps.length > 0 
      ? listingForm.usps 
      : ["Near Metro", "Sea View", "Gated Community"];

    const finalListing: Listing = {
      id: editingListing?.id || `lst-${Date.now()}`,
      title: listingForm.title,
      price: Number(listingForm.price),
      type: listingForm.type as "buy" | "rent",
      propertyType: listingForm.propertyType as Listing["propertyType"],
      bhk: Number(listingForm.bhk),
      bathrooms: Number(listingForm.bathrooms),
      sqft: Number(listingForm.sqft),
      location: listingForm.location,
      image: mainImg,
      gallery: listingForm.gallery && listingForm.gallery.length > 0 ? listingForm.gallery : [mainImg],
      description: listingForm.description || `High-spec ${listingForm.propertyType} in prime ${listingForm.location}, featuring top unique advantages like ${currentUsps.join(', ')}.`,
      amenities: listingForm.amenities || [],
      usps: currentUsps,
      status: (listingForm.status as Listing["status"]) || "Active",
    };

    if (editingListing) {
      onUpdateListing(finalListing);
    } else {
      onAddListing(finalListing);
    }

    setShowListingModal(false);
    setEditingListing(null);
  };

  // Handle Closed Deal Submit
  const handleDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealForm.title || !dealForm.price) return;

    const finalDeal: ClosedDeal = {
      id: `deal-${Date.now()}`,
      title: dealForm.title,
      price: Number(dealForm.price),
      location: dealForm.location || "Adyar",
      type: dealForm.type as "sale" | "lease",
      closedDate: dealForm.closedDate || "July 2026",
      propertyType: dealForm.propertyType || "Apartment",
      bhk: dealForm.bhk ? Number(dealForm.bhk) : undefined,
    };

    onAddDeal(finalDeal);
    setShowDealForm(false);
    setDealForm({
      title: "",
      price: 20000000,
      location: "Adyar",
      type: "sale",
      closedDate: "July 2026",
      propertyType: "Apartment",
      bhk: 3,
    });
  };

  return (
    <section className="py-12 bg-slate-50 text-slate-900 min-h-[85vh] text-left border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Title Block */}
        <div className="border-b border-slate-200 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Agent Portal & Workspace
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Personalize landing page credentials, configure active Chennai listings, audit lead pipelines, and draft premium descriptions using Gemini AI.
            </p>
          </div>
          <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 self-start md:self-auto shadow-xs">
            <span className="font-mono text-xs text-indigo-600 px-3 py-1 bg-indigo-50 rounded-lg border border-indigo-100 font-bold">
              Passcode Mode: Approved
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Admin Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold block mb-3 px-2">
              Admin Sections
            </span>
            
            <button
              id="tab-leads-inbox"
              onClick={() => setActiveTab("leads")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === "leads"
                  ? "bg-indigo-600 text-white font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <ClipboardList className="h-4.5 w-4.5" />
                <span>Leads Inbox</span>
              </div>
              {leads.filter((l) => l.status === "New").length > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "leads" ? "bg-indigo-800 text-white" : "bg-red-600 text-white"
                }`}>
                  {leads.filter((l) => l.status === "New").length}
                </span>
              )}
            </button>

             <button
              id="tab-listings-manager"
              onClick={() => setActiveTab("listings")}
              className={`w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl font-medium text-sm text-left transition-all ${
                activeTab === "listings"
                  ? "bg-indigo-600 text-white font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <ListOrdered className="h-4.5 w-4.5" />
              <span>Manage Listings ({listings.length})</span>
            </button>

            <button
              id="tab-profile-editor"
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl font-medium text-sm text-left transition-all ${
                activeTab === "profile"
                  ? "bg-indigo-600 text-white font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <User className="h-4.5 w-4.5" />
              <span>Realtor Profile Info</span>
            </button>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                id="tab-lock-portal"
                type="button"
                onClick={onLockPortal}
                className="w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl font-medium text-sm text-left text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all border border-transparent hover:border-rose-100"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span className="font-bold">Lock Workspace</span>
              </button>
            </div>

          </div>

          {/* Right Column: Tab Content Area */}
          <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs min-h-[500px]">
            
            {/* -------------------- 1. LEADS INBOX TAB -------------------- */}
            {activeTab === "leads" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4 flex-wrap gap-2">
                  <div>
                    <h3 className="font-sans font-bold text-lg text-slate-900">Client Leads Pipeline</h3>
                    <p className="text-xs text-slate-500 mt-1">Review contact cards, buying/selling targets, and notes logged by website users.</p>
                  </div>
                  <span className="text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1 rounded border border-slate-200">
                    Total Inquiries: <strong>{leads.length}</strong>
                  </span>
                </div>

                {leads.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 max-w-sm mx-auto">
                    <ClipboardList className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-700">Your Inbox is empty</p>
                    <p className="text-xs text-slate-500 mt-1">Submit test queries on the public landing page to see them pop up here immediately!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Left: Leads List */}
                    <div className="md:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {leads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all relative ${
                            selectedLead?.id === lead.id
                              ? "bg-indigo-50/50 border-indigo-500 ring-1 ring-indigo-500/10"
                              : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {lead.status === "New" && (
                            <span className="absolute top-3.5 right-3.5 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${
                              lead.type === "buy" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
                            }`}>
                              {lead.type === "buy" ? "Buyer" : "Seller"}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(lead.submittedAt).toLocaleDateString()}
                            </span>
                          </div>

                          <h4 className="font-sans font-bold text-sm text-slate-900 mt-2 truncate">{lead.name}</h4>
                          <p className="text-[11px] font-mono text-slate-500 truncate">{lead.phone}</p>
                          <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                            <MapPin className="h-3 w-3 text-indigo-600 flex-shrink-0" />
                            <span className="truncate">{lead.location} • {lead.propertyType}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right: Selected Lead Details */}
                    <div className="md:col-span-7 bg-slate-50 p-6 rounded-xl border border-slate-200 text-left">
                      {selectedLead ? (
                        <div className="space-y-6">
                          {/* Header */}
                          <div className="border-b border-slate-200 pb-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-md tracking-wider ${
                                selectedLead.type === "buy" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
                              }`}>
                                {selectedLead.type === "buy" ? "Acquisition Lead (Buyer)" : "Listing Lead (Seller)"}
                              </span>
                              
                              <select
                                value={selectedLead.status}
                                onChange={(e) => {
                                  onUpdateLeadStatus(selectedLead.id, e.target.value as LeadSubmission["status"]);
                                  setSelectedLead((prev) => prev ? { ...prev, status: e.target.value as LeadSubmission["status"] } : null);
                                }}
                                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-indigo-600 font-bold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                              >
                                <option value="New">Status: New</option>
                                <option value="In Progress">Status: In Progress</option>
                                <option value="Completed">Status: Completed</option>
                                <option value="Spam">Status: Spam</option>
                              </select>
                            </div>

                            <h3 className="font-sans font-black text-lg text-slate-900 mt-4">{selectedLead.name}</h3>
                            <p className="font-mono text-xs text-slate-500 mt-1">Submitted at {new Date(selectedLead.submittedAt).toLocaleString()}</p>
                          </div>

                          {/* Contact Info Card */}
                          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 font-mono text-xs text-slate-700">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3.5 w-3.5 text-indigo-600" />
                              <a href={`tel:${selectedLead.phone}`} className="hover:text-indigo-600 underline transition-colors">{selectedLead.phone}</a>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-3.5 w-3.5 text-indigo-600" />
                              <a href={`mailto:${selectedLead.email}`} className="hover:text-indigo-600 underline transition-colors">{selectedLead.email}</a>
                            </div>
                          </div>

                          {/* Target Specs */}
                          <div className="grid grid-cols-2 gap-4 text-xs font-sans text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-mono tracking-wider font-semibold">Target Locality</span>
                              <strong className="text-slate-800 font-semibold mt-1 block">{selectedLead.location}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-mono tracking-wider font-semibold">Property Type</span>
                              <strong className="text-slate-800 font-semibold mt-1 block">{selectedLead.propertyType}</strong>
                            </div>
                            {selectedLead.bhkPreferred && (
                              <div>
                                <span className="text-slate-400 block text-[9px] uppercase font-mono tracking-wider font-semibold">BHK Requirement</span>
                                <strong className="text-slate-800 font-semibold mt-1 block">{selectedLead.bhkPreferred} BHK</strong>
                              </div>
                            )}
                            {selectedLead.budgetMin && (
                              <div>
                                <span className="text-slate-400 block text-[9px] uppercase font-mono tracking-wider font-semibold">Target Value</span>
                                <strong className="text-indigo-600 font-semibold mt-1 block">
                                  {formatIndianPrice(selectedLead.budgetMin)} 
                                  {selectedLead.budgetMax && selectedLead.budgetMax !== selectedLead.budgetMin && ` - ${formatIndianPrice(selectedLead.budgetMax)}`}
                                </strong>
                              </div>
                            )}
                          </div>

                          {/* Requirements notes */}
                          <div>
                            <span className="font-mono text-[9px] uppercase text-slate-400 tracking-wider block font-bold mb-1.5">Enquiry Notes & Details</span>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-800 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-sans">
                              {selectedLead.notes || "No extra notes logged by user."}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex justify-between items-center border-t border-slate-200 pt-4">
                            <button
                              onClick={() => {
                                if (window.confirm("Confirm delete this lead card forever?")) {
                                  onDeleteLead(selectedLead.id);
                                  setSelectedLead(null);
                                }
                              }}
                              className="text-red-600 hover:text-red-500 text-xs font-bold flex items-center space-x-1"
                            >
                              <Trash className="h-4 w-4" />
                              <span>Delete Lead Card</span>
                            </button>
                            <span className="font-mono text-[10px] text-slate-400">Status: {selectedLead.status}</span>
                          </div>

                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
                          <MessageSquare className="h-12 w-12 text-slate-300 mb-3" />
                          <p className="text-sm font-bold text-slate-600">Select a lead card to inspect details</p>
                          <p className="text-xs text-slate-400 max-w-xs text-center mt-1">Review contact numbers, emails, target specifications, and submit actions instantly.</p>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* -------------------- 2. MANAGE LISTINGS TAB -------------------- */}
            {activeTab === "listings" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4 flex-wrap gap-4">
                  <div>
                    <h3 className="font-sans font-bold text-lg text-slate-900">Active Properties Manager</h3>
                    <p className="text-xs text-slate-500 mt-1">Configure property spec cards, upload links, and update active listing status.</p>
                  </div>
                  <button
                    id="btn-add-listing"
                    onClick={() => {
                      setEditingListing(null);
                      setListingForm({
                        title: "",
                        price: 15000000,
                        type: "buy",
                        propertyType: "Apartment",
                        bhk: 3,
                        bathrooms: 3,
                        sqft: 1800,
                        location: "Adyar",
                        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
                        gallery: [],
                        description: "",
                        amenities: ["24/7 Gated Security", "100% Power Backup", "Vastu Compliant"],
                        status: "Active",
                      });
                      setShowListingModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase flex items-center space-x-1.5 shadow"
                  >
                    <Plus className="h-4 w-4 text-white" />
                    <span>Create Listing</span>
                  </button>
                </div>

                {/* Listings Grid/Table */}
                {listings.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <p>No listings are currently set up. Click "Create Listing" above to build your first RERA-approved card.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {listings.map((lst) => (
                      <div
                        key={lst.id}
                        className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={lst.image}
                            alt={lst.title}
                            referrerPolicy="no-referrer"
                            className="h-12 w-12 rounded-lg object-cover bg-white border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                                {lst.type === "buy" ? "For Sale" : "Rent"}
                              </span>
                              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                                {lst.location}
                              </span>
                            </div>
                            <h4 className="font-sans font-bold text-sm text-slate-900 mt-1 leading-tight">{lst.title}</h4>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                              {lst.bhk ? `${lst.bhk} BHK • ` : ""}{lst.sqft} sqft • {formatIndianPrice(lst.price)}
                            </p>
                          </div>
                        </div>

                        {/* Actions block */}
                        <div className="flex items-center space-x-2 self-end sm:self-auto">
                          <button
                            id={`edit-lst-${lst.id}`}
                            onClick={() => {
                              setEditingListing(lst);
                              setListingForm({ ...lst });
                              setShowListingModal(true);
                            }}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 p-2 rounded-lg text-xs font-semibold flex items-center space-x-1"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            id={`delete-lst-${lst.id}`}
                            onClick={() => {
                              if (window.confirm("Confirm delete this property card?")) {
                                onDeleteListing(lst.id);
                              }
                            }}
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 p-2 rounded-lg text-xs font-semibold flex items-center space-x-1"
                          >
                            <Trash className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* -------------------- 3. MANAGE CLOSED DEALS TAB -------------------- */}
            {activeTab === "deals" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-900 pb-4 flex-wrap gap-4">
                  <div>
                    <h3 className="font-sans font-bold text-lg text-white">Closed Transactions Ledger</h3>
                    <p className="text-xs text-slate-400 mt-1">Add historic client successes. Closed deals automatically update cumulative site volume.</p>
                  </div>
                  <button
                    id="btn-toggle-deal-form"
                    onClick={() => setShowDealForm(!showDealForm)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase flex items-center space-x-1.5 shadow"
                  >
                    <Plus className="h-4 w-4 text-slate-950" />
                    <span>{showDealForm ? "Close Ledger" : "Record Success"}</span>
                  </button>
                </div>

                {/* Closed deal entry form */}
                {showDealForm && (
                  <form onSubmit={handleDealSubmit} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-left space-y-4">
                    <h4 className="font-sans font-bold text-sm text-amber-400">New Transaction Record Details</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Property Card Headline</label>
                        <input
                          type="text"
                          required
                          value={dealForm.title}
                          onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                          placeholder="E.g. Palatial Duplex Bunglow in Shanthi Colony"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Deal Location</label>
                        <select
                          value={dealForm.location}
                          onChange={(e) => setDealForm({ ...dealForm, location: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
                        >
                          {CHENNAI_LOCALITIES.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Transaction Type</label>
                        <select
                          value={dealForm.type}
                          onChange={(e) => setDealForm({ ...dealForm, type: e.target.value as ClosedDeal["type"] })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300"
                        >
                          <option value="sale">Outright Sale</option>
                          <option value="lease">Lease Agreement</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Property Category</label>
                        <input
                          type="text"
                          value={dealForm.propertyType}
                          onChange={(e) => setDealForm({ ...dealForm, propertyType: e.target.value })}
                          placeholder="Apartment, Villa, Plot"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Price/Value (INR raw)</label>
                        <input
                          type="number"
                          required
                          value={dealForm.price}
                          onChange={(e) => setDealForm({ ...dealForm, price: Number(e.target.value) })}
                          placeholder="e.g. 15000000"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Closing Date/Month</label>
                        <input
                          type="text"
                          value={dealForm.closedDate}
                          onChange={(e) => setDealForm({ ...dealForm, closedDate: e.target.value })}
                          placeholder="E.g. July 2026"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">BHK Size (Optional)</label>
                        <input
                          type="number"
                          value={dealForm.bhk || ""}
                          onChange={(e) => setDealForm({ ...dealForm, bhk: e.target.value ? Number(e.target.value) : undefined })}
                          placeholder="E.g. 3"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow"
                    >
                      Record in Ledger
                    </button>
                  </form>
                )}

                {/* Ledger Listing */}
                <div className="space-y-2">
                  {deals.map((dl) => (
                    <div
                      key={dl.id}
                      className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex items-center justify-between gap-4 text-left font-sans text-sm"
                    >
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-amber-500">
                          Closed in {dl.closedDate} • {dl.propertyType}
                        </span>
                        <h4 className="font-bold text-white mt-0.5 leading-tight">{dl.title}</h4>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{dl.location} • {formatIndianPrice(dl.price)} ({dl.type})</p>
                      </div>

                      <button
                        onClick={() => onDeleteDeal(dl.id)}
                        className="text-red-500 hover:text-red-400 p-2 rounded-lg bg-slate-950 border border-slate-900"
                        title="Delete record"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* -------------------- 4. PROFILE INFO TAB -------------------- */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="font-sans font-bold text-lg text-slate-900">Profile Credentials Editor</h3>
                    <p className="text-xs text-slate-500 mt-1">Input personal details, license information, profile photo and bio displayed publicly on the home section.</p>
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-extrabold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase flex items-center space-x-1 shadow"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Details</span>
                  </button>
                </div>

                {profileSaved && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-4 rounded-xl flex items-center space-x-2 font-medium">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    <span>Realtor credentials saved! All changes updated in local storage and visible on the public side instantly.</span>
                  </div>
                )}

                {/* Form fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-semibold">Your Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-semibold">Job Title</label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-semibold">Company Name</label>
                    <input
                      type="text"
                      value={profileForm.companyName}
                      onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-semibold">Government RERA License No.</label>
                    <input
                      type="text"
                      value={profileForm.licenseNo}
                      onChange={(e) => setProfileForm({ ...profileForm, licenseNo: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-semibold">Portal Access Passcode / Security Password</label>
                    <input
                      type="text"
                      value={passcodeForm}
                      onChange={(e) => setPasscodeForm(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 font-mono font-bold tracking-wider focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                      placeholder="Enter security password..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-semibold">Mobile Phone (Direct Call/WhatsApp)</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-semibold">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-semibold block mb-1">
                      Profile Photo (Paste / Drag & Drop / URL)
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {/* Avatar preview */}
                      <div className="md:col-span-3 flex justify-center">
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 bg-white shadow-sm flex items-center justify-center group">
                          {profileForm.photoUrl ? (
                            <img
                              src={profileForm.photoUrl}
                              alt="Profile preview"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618077360395-f3068be8e001?auto=format&fit=crop&w=800&q=80";
                              }}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-10 w-10 text-slate-300" />
                          )}
                          {profileForm.photoUrl && (
                            <button
                              type="button"
                              onClick={() => setProfileForm({ ...profileForm, photoUrl: "" })}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-sans font-bold"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Drop / Paste Zone container */}
                      <div className="md:col-span-9">
                        <div
                          onDragEnter={handleProfileDrag}
                          onDragOver={handleProfileDrag}
                          onDragLeave={handleProfileDrag}
                          onDrop={handleProfileDrop}
                          onPaste={handleProfilePaste}
                          onClick={() => document.getElementById("profile-file-input")?.click()}
                          tabIndex={0}
                          className={`relative border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                            dragActiveProfile
                              ? "border-indigo-600 bg-indigo-50/50"
                              : "border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50"
                          }`}
                          title="Click here to focus and press Ctrl+V to paste your image"
                        >
                          <input
                            id="profile-file-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleProfileImageFile(e.target.files[0]);
                              }
                            }}
                          />
                          <UploadCloud className={`h-7 w-7 mb-1.5 ${dragActiveProfile ? "text-indigo-600" : "text-slate-400"}`} />
                          
                          <p className="text-xs font-sans font-bold text-slate-700 text-center">
                            {dragActiveProfile ? "Drop your image now!" : "Click to browse, drag & drop, or paste image"}
                          </p>
                          <p className="text-[10px] text-slate-400 font-sans text-center mt-0.5">
                            Click this box and press <kbd className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 text-[9px] font-mono border border-slate-200">Ctrl + V</kbd> to paste!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Raw URL option */}
                    <div className="mt-2">
                      <span className="text-[10px] text-slate-400 font-mono block mb-1">Or provide direct image URL address:</span>
                      <input
                        type="text"
                        value={profileForm.photoUrl}
                        onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-semibold">Professional Brokerage Biography</label>
                    <textarea
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-800 resize-none leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-semibold">Years of Industry Experience</label>
                    <input
                      type="number"
                      value={profileForm.experienceYears}
                      onChange={(e) => setProfileForm({ ...profileForm, experienceYears: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-semibold">Total Deals Volume</label>
                    <input
                      type="number"
                      value={profileForm.closedDealsCount}
                      onChange={(e) => setProfileForm({ ...profileForm, closedDealsCount: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-semibold">Office Address</label>
                    <input
                      type="text"
                      value={profileForm.officeAddress}
                      onChange={(e) => setProfileForm({ ...profileForm, officeAddress: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-extrabold px-8 py-3 rounded-xl text-xs tracking-wider uppercase flex items-center space-x-1 shadow-lg"
                  >
                    <Save className="h-4.5 w-4.5" />
                    <span>Save Profile Details</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
          {/* -------------------- DYNAMIC PROPERTY FORM MODAL (ADD & EDIT) -------------------- */}
      {showListingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 text-left">
          <div className="relative bg-white border border-slate-200 text-slate-900 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 p-6 sm:p-8">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
              <h3 className="font-sans font-black text-xl text-slate-900">
                {editingListing ? `Edit Property specifications (ID: ${editingListing.id})` : "Create New Property Listing"}
              </h3>
              <button
                onClick={() => setShowListingModal(false)}
                className="text-slate-500 hover:text-slate-900 bg-slate-50 border border-slate-200 p-1.5 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleListingSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Property Card Name *</label>
                  <input
                    type="text"
                    required
                    value={listingForm.title}
                    onChange={(e) => setListingForm({ ...listingForm, title: e.target.value })}
                    placeholder="E.g. Signature Sea Villa on ECR"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Category</label>
                    <select
                      value={listingForm.type}
                      onChange={(e) => setListingForm({ ...listingForm, type: e.target.value as "buy" | "rent" })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    >
                      <option value="buy">Sale</option>
                      <option value="rent">Rent</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Property Type</label>
                    <select
                      value={listingForm.propertyType}
                      onChange={(e) => setListingForm({ ...listingForm, propertyType: e.target.value as Listing["propertyType"] })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Independent House">Independent House</option>
                      <option value="Plot">Plot</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Chennai Locality</label>
                  <select
                    value={listingForm.location}
                    onChange={(e) => setListingForm({ ...listingForm, location: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  >
                    {CHENNAI_LOCALITIES.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">BHK Size</label>
                  <input
                    type="number"
                    value={listingForm.bhk || ""}
                    onChange={(e) => setListingForm({ ...listingForm, bhk: Number(e.target.value) })}
                    placeholder="E.g. 3"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Square Feet</label>
                  <input
                    type="number"
                    value={listingForm.sqft || ""}
                    onChange={(e) => setListingForm({ ...listingForm, sqft: Number(e.target.value) })}
                    placeholder="E.g. 1800"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Invest Price (₹ raw)</label>
                  <input
                    type="number"
                    required
                    value={listingForm.price || ""}
                    onChange={(e) => setListingForm({ ...listingForm, price: Number(e.target.value) })}
                    placeholder="E.g. 18000000"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider block mb-1">
                  Property Showcase Photo (Paste One or More / Drag & Drop / URL)
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {/* Photo preview */}
                  <div className="sm:col-span-3 flex justify-center">
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm flex items-center justify-center group">
                      {listingForm.image ? (
                        <img
                          src={listingForm.image}
                          alt="Listing preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-slate-300" />
                      )}
                      {listingForm.image && (
                        <button
                          type="button"
                          onClick={() => setListingForm({ ...listingForm, image: "" })}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-sans font-bold"
                        >
                          Clear Primary
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Drop/Paste Zone */}
                  <div className="sm:col-span-9">
                    <div
                      onDragEnter={handleListingDrag}
                      onDragOver={handleListingDrag}
                      onDragLeave={handleListingDrag}
                      onDrop={handleListingDrop}
                      onPaste={handleListingPaste}
                      onClick={() => document.getElementById("listing-file-input")?.click()}
                      tabIndex={0}
                      className={`relative border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                        dragActiveListing
                          ? "border-indigo-600 bg-indigo-50/50"
                          : "border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50"
                      }`}
                      title="Click here to focus and press Ctrl+V to paste one or multiple images!"
                    >
                      <input
                        id="listing-file-input"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleListingImageFiles(e.target.files);
                          }
                        }}
                      />
                      <UploadCloud className={`h-6 w-6 mb-1.5 ${dragActiveListing ? "text-indigo-600" : "text-slate-400"}`} />
                      
                      <p className="text-xs font-sans font-bold text-slate-700 text-center">
                        {dragActiveListing ? "Drop your images now!" : "Click to select, drag & drop, or paste images"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-sans text-center mt-0.5">
                        Supports pasting <span className="font-semibold text-slate-500">multiple images</span> at once! Click here and press <kbd className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 text-[9px] font-mono border border-slate-200">Ctrl + V</kbd>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <span className="text-[10px] text-slate-400 font-mono block mb-1">Or provide direct image URL address:</span>
                  <input
                    type="text"
                    value={listingForm.image}
                    onChange={(e) => {
                      const url = e.target.value;
                      setListingForm(prev => {
                        const currentGallery = prev.gallery || [];
                        const inGallery = currentGallery.includes(url);
                        return {
                          ...prev,
                          image: url,
                          gallery: inGallery ? currentGallery : [...currentGallery, url]
                        };
                      });
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                  />
                </div>

                {/* Image Gallery Manager */}
                {listingForm.gallery && listingForm.gallery.length > 0 && (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-semibold">
                        Uploaded Gallery Images ({listingForm.gallery.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setListingForm(prev => ({ ...prev, gallery: [], image: "" }))}
                        className="text-[10px] font-sans font-bold text-rose-600 hover:text-rose-700 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {listingForm.gallery.map((imgUrl, index) => {
                        const isPrimary = listingForm.image === imgUrl;
                        return (
                          <div 
                            key={index} 
                            className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all bg-white ${
                              isPrimary ? "border-indigo-600 ring-2 ring-indigo-500/20" : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <img 
                              src={imgUrl} 
                              alt={`Gallery item ${index + 1}`} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Primary Badge or Make Primary Trigger */}
                            <div className="absolute top-1 left-1 flex gap-1 z-10">
                              {isPrimary ? (
                                <span className="bg-indigo-600 text-white text-[8px] font-mono uppercase font-black px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                                  <Star className="h-2.5 w-2.5 fill-white stroke-[2.5]" />
                                  <span>Primary</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setListingForm(prev => ({ ...prev, image: imgUrl }))}
                                  className="bg-white/90 hover:bg-white text-slate-700 hover:text-indigo-600 p-1 rounded shadow transition-all flex items-center justify-center"
                                  title="Make this the primary showcase image"
                                >
                                  <Star className="h-3 w-3 stroke-[2.5]" />
                                </button>
                              )}
                            </div>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setListingForm(prev => {
                                  const updatedGallery = (prev.gallery || []).filter((_, i) => i !== index);
                                  // If we deleted the primary image, pick another one as primary
                                  let newPrimary = prev.image;
                                  if (isPrimary) {
                                    newPrimary = updatedGallery.length > 0 
                                      ? updatedGallery[0] 
                                      : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";
                                  }
                                  return {
                                    ...prev,
                                    gallery: updatedGallery,
                                    image: newPrimary
                                  };
                                });
                              }}
                              className="absolute top-1 right-1 bg-rose-600/90 hover:bg-rose-600 text-white p-1 rounded shadow transition-all flex items-center justify-center"
                              title="Delete this image"
                            >
                              <X className="h-3 w-3 stroke-[2.5]" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* DYNAMIC GEMINI AI DESCRIPTION GENERATOR WITH USP SELECTION */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div>
                  <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider block font-bold mb-2">
                    Key USP Highlights (Select points like 'Near Metro', 'Sea View', 'Gated Community')
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {PRESET_USPS.map((usp) => {
                      const activeUsps = listingForm.usps || ["Near Metro", "Sea View", "Gated Community"];
                      const isSelected = activeUsps.includes(usp);
                      return (
                        <button
                          key={usp}
                          type="button"
                          onClick={() => {
                            const newUsps = isSelected
                              ? activeUsps.filter((u) => u !== usp)
                              : [...activeUsps, usp];
                            setListingForm({ ...listingForm, usps: newUsps });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-sans font-bold border transition-all flex items-center space-x-1 ${
                            isSelected
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <Sparkles className={`h-3 w-3 ${isSelected ? "text-amber-300" : "text-slate-400"}`} />
                          <span>{usp}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center flex-wrap gap-2 pt-3 border-t border-slate-200/80">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
                    <span className="font-sans font-bold text-xs text-indigo-600">✨ Gemini AI Property Description</span>
                  </div>
                  <button
                    type="button"
                    id="btn-ai-generate"
                    disabled={aiLoading}
                    onClick={generateAiDescription}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 text-white font-sans font-extrabold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-all flex items-center space-x-1 shadow-sm"
                  >
                    {aiLoading ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5 text-white" />
                        <span>Crafting AI Description...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-amber-300 mr-1" />
                        <span>Generate Brief AI Description</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="font-mono text-[9px] uppercase text-slate-400 tracking-wider">Amenities to highlight in AI Draft (comma separated)</label>
                  <input
                    type="text"
                    value={aiAmenitiesString}
                    onChange={(e) => setAiAmenitiesString(e.target.value)}
                    placeholder="Vastu, Italian Marble, private swimming pool, near IT park"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                {aiError && (
                  <div className="text-red-600 text-[10px] flex items-center space-x-1 leading-normal">
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />
                    <span>{aiError}</span>
                  </div>
                )}
              </div>

              {/* Property Description */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Property Listing Description</label>
                <textarea
                  rows={4}
                  required
                  value={listingForm.description}
                  onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })}
                  placeholder="Draft manually or click 'Draft with Gemini AI' above..."
                  className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-800 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Listing Status</label>
                  <select
                    value={listingForm.status}
                    onChange={(e) => setListingForm({ ...listingForm, status: e.target.value as Listing["status"] })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  >
                    <option value="Active">Active (Publicly listed)</option>
                    <option value="Under Offer">Under Offer (Hold)</option>
                    <option value="Sold">Sold (Success)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Bathrooms Count</label>
                  <input
                    type="number"
                    step="0.5"
                    value={listingForm.bathrooms || ""}
                    onChange={(e) => setListingForm({ ...listingForm, bathrooms: Number(e.target.value) })}
                    placeholder="E.g. 3.5"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-5 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowListingModal(false)}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-550 text-white px-6 py-2.5 rounded-lg text-xs tracking-wider uppercase font-sans font-extrabold shadow"
                >
                  {editingListing ? "Save Property" : "Publish Listing"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      </div>
    </section>
  );
}
