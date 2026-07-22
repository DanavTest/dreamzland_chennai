import React, { useState, useMemo } from "react";
import { Listing, LeadSubmission } from "../types";
import { formatIndianPrice, CHENNAI_LOCALITIES } from "../data";
import { 
  MapPin, Home, BedDouble, Key, Mail, Phone, Maximize, Compass, 
  MessageSquareCode, Sparkles, ChevronLeft, ChevronRight, X, Images 
} from "lucide-react";

interface PublicListingsProps {
  listings: Listing[];
  onAddLead: (lead: Omit<LeadSubmission, "id" | "submittedAt">) => void;
  // External filter control
  externalFilter?: {
    type: "buy" | "rent";
    location: string;
    propertyType?: string;
  } | null;
  onClearExternalFilter?: () => void;
}

export default function PublicListings({
  listings,
  onAddLead,
  externalFilter,
  onClearExternalFilter,
}: PublicListingsProps) {
  // Filters State
  const [type, setType] = useState<"buy" | "rent">("buy");
  const [location, setLocation] = useState<string>("All");
  const [propertyType, setPropertyType] = useState<string>("All");
  const [bhk, setBhk] = useState<string>("All");
  const [budgetRange, setBudgetRange] = useState<string>("All");

  // Selected Listing for Modal
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Lightbox & Thumbnail Active Image states
  const [lightboxListing, setLightboxListing] = useState<Listing | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [detailActiveImageIndex, setDetailActiveImageIndex] = useState<number>(0);

  // Helper to safely get gallery images (always returns at least one image)
  const getListingGallery = (item: Listing | null): string[] => {
    if (!item) return [];
    if (item.gallery && item.gallery.length > 0) return item.gallery;
    return [item.image];
  };

  // Reset active detail image index whenever detail modal is opened
  React.useEffect(() => {
    setDetailActiveImageIndex(0);
  }, [selectedListing]);

  // Keyboard navigation for Lightbox
  React.useEffect(() => {
    if (!lightboxListing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const gallery = getListingGallery(lightboxListing);
      if (gallery.length === 0) return;
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev + 1) % gallery.length);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
      } else if (e.key === "Escape") {
        setLightboxListing(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxListing]);

  // Listing Specific Enquiry Form State
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryPhone, setEnquiryPhone] = useState("");
  const [enquiryNotes, setEnquiryNotes] = useState("");
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Sync external filters if triggered by Hero quick search
  React.useEffect(() => {
    if (externalFilter) {
      setType(externalFilter.type);
      setLocation(externalFilter.location);
      if (externalFilter.propertyType) {
        setPropertyType(externalFilter.propertyType);
      } else {
        setPropertyType("All");
      }
      setBhk("All");
      setBudgetRange("All");
      // Scroll to listings section
      const element = document.getElementById("listings");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      // Clear after applying
      if (onClearExternalFilter) onClearExternalFilter();
    }
  }, [externalFilter, onClearExternalFilter]);

  // Reset standard filters if buy/rent changes to keep budget relevant
  const handleTypeChange = (newType: "buy" | "rent") => {
    setType(newType);
    setBudgetRange("All");
  };

  // Filter listings based on current selection
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // 1. Type (Buy vs Rent)
      if (item.type !== type) return false;

      // 2. Location
      if (location !== "All" && item.location !== location) return false;

      // 3. Property Type
      if (propertyType !== "All" && item.propertyType !== propertyType) return false;

      // 4. BHK
      if (bhk !== "All") {
        const numBhk = parseInt(bhk, 10);
        if (item.bhk !== numBhk) return false;
      }

      // 5. Budget Range
      if (budgetRange !== "All") {
        const p = item.price;
        if (type === "buy") {
          // Buy Budgets (Crores/Lakhs)
          if (budgetRange === "under-1.5cr" && p > 15000000) return false;
          if (budgetRange === "1.5cr-3.5cr" && (p < 15000000 || p > 35000000)) return false;
          if (budgetRange === "3.5cr-5.5cr" && (p < 35000000 || p > 55000000)) return false;
          if (budgetRange === "above-5.5cr" && p < 55000000) return false;
        } else {
          // Rent Budgets
          if (budgetRange === "under-50k" && p > 50000) return false;
          if (budgetRange === "50k-1L" && (p < 50000 || p > 100000)) return false;
          if (budgetRange === "above-1L" && p < 100000) return false;
        }
      }

      return true;
    });
  }, [listings, type, location, propertyType, bhk, budgetRange]);

  // Handle Enquiry submission inside detail modal
  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName || !enquiryPhone || !selectedListing) return;

    onAddLead({
      type: selectedListing.type,
      name: enquiryName,
      email: enquiryEmail,
      phone: enquiryPhone,
      location: selectedListing.location,
      propertyType: selectedListing.propertyType,
      bhkPreferred: selectedListing.bhk,
      budgetMin: selectedListing.price,
      budgetMax: selectedListing.price,
      notes: `Inquiry regarding specific listed property: "${selectedListing.title}" (ID: ${selectedListing.id}). Customer notes: ${enquiryNotes}`,
      status: "New",
    });

    setEnquirySuccess(true);
    setTimeout(() => {
      // Clear form
      setEnquiryName("");
      setEnquiryEmail("");
      setEnquiryPhone("");
      setEnquiryNotes("");
      setEnquirySuccess(false);
      setSelectedListing(null); // Close modal on success
    }, 2500);
  };

  return (
    <section id="listings" className="py-24 bg-slate-50 text-slate-900 border-t border-slate-250/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-indigo-600 font-bold">
            Featured Portfolio
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 mt-2 tracking-tight">
            Exclusive Chennai Properties
          </h2>
          <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
            Meticulously vetted real estate listings ranging from opulent beachfront estates along ECR to strategically located urban condominiums in core Chennai sectors.
          </p>
        </div>

        {/* Filter Toolbar Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-12 shadow-xs">
          <div className="flex flex-col space-y-6">
            
            {/* 1. Buy vs Rent Segmented Control */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 flex-wrap gap-4">
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60">
                <button
                  id="filter-buy-btn"
                  onClick={() => handleTypeChange("buy")}
                  className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    type === "buy"
                      ? "bg-white text-slate-950 shadow-xs border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Properties For Sale
                </button>
                <button
                  id="filter-rent-btn"
                  onClick={() => handleTypeChange("rent")}
                  className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    type === "rent"
                      ? "bg-white text-slate-950 shadow-xs border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Properties For Rent
                </button>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200">
                Showing <strong className="text-indigo-600 font-bold">{filteredListings.length}</strong> matching match(es)
              </span>
            </div>

            {/* 2. Responsive Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Location Select */}
              <div className="flex flex-col space-y-1.5 text-left">
                <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Locality</label>
                <select
                  id="select-locality"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                >
                  <option value="All">All Localities</option>
                  {CHENNAI_LOCALITIES.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type Select */}
              <div className="flex flex-col space-y-1.5 text-left">
                <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Type</label>
                <select
                  id="select-prop-type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                >
                  <option value="All">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Plot">Plot</option>
                </select>
              </div>

              {/* BHK Select */}
              <div className="flex flex-col space-y-1.5 text-left">
                <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Configuration</label>
                <select
                  id="select-bhk"
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                >
                  <option value="All">Any BHK</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                </select>
              </div>

              {/* Budget Range Select */}
              <div className="flex flex-col space-y-1.5 text-left">
                <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Budget Range</label>
                <select
                  id="select-budget"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                >
                  <option value="All">Any Budget</option>
                  {type === "buy" ? (
                    <>
                      <option value="under-1.5cr">Under ₹1.5 Cr</option>
                      <option value="1.5cr-3.5cr">₹1.5 Cr - ₹3.5 Cr</option>
                      <option value="3.5cr-5.5cr">₹3.5 Cr - ₹5.5 Cr</option>
                      <option value="above-5.5cr">Above ₹5.5 Cr</option>
                    </>
                  ) : (
                    <>
                      <option value="under-50k">Under ₹50k / mo</option>
                      <option value="50k-1L">₹50k - ₹1 Lakh / mo</option>
                      <option value="above-1L">Above ₹1 Lakh / mo</option>
                    </>
                  )}
                </select>
              </div>

              {/* Reset Filters Link */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setLocation("All");
                    setPropertyType("All");
                    setBhk("All");
                    setBudgetRange("All");
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors py-2.5 rounded-lg text-[10px] font-bold tracking-wider uppercase h-[43px]"
                >
                  Reset Filters
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Listings Cards Grid */}
        {filteredListings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl py-16 px-6 text-center max-w-xl mx-auto shadow-xs">
            <Home className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No matching listings found</h3>
            <p className="text-slate-500 text-sm mt-2">
              Try widening your budget filter, choosing "All Localities," or checking again soon as RKS Chennai Estates expands its portfolio daily.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col hover:border-slate-350 hover:shadow-md transition-all group"
              >
                {/* Photo Header */}
                <div 
                  onClick={() => {
                    setSelectedListing(item);
                    setEnquiryNotes(`Hi Rajesh, I am interested in exploring details regarding the "${item.title}" in ${item.location}. Kindly connect with me at your earliest convenience.`);
                  }}
                  className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                  
                  {/* Absolute badging */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest font-bold bg-slate-900 text-white px-2.5 py-1 rounded-md leading-none shadow-xs">
                      {item.type === "buy" ? "For Sale" : "Rent"}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest font-bold bg-white text-slate-800 border border-slate-200 px-2.5 py-1 rounded-md leading-none shadow-xs">
                      {item.propertyType}
                    </span>
                  </div>

                  {/* Status Overlay */}
                  {item.status !== "Active" && (
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center">
                      <span className="font-sans font-bold text-xs uppercase tracking-wider bg-red-600 text-white px-3.5 py-1.5 rounded-lg border border-red-500 shadow-md">
                        {item.status}
                      </span>
                    </div>
                  )}

                  {/* Gallery overlay on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxListing(item);
                      setLightboxIndex(0);
                    }}
                    className="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-xs text-white border border-slate-700 hover:bg-slate-950 text-[10px] py-1.5 px-3 rounded-lg shadow-md transition-all duration-200 flex items-center space-x-1.5 font-sans font-bold opacity-0 group-hover:opacity-100"
                  >
                    <Images className="h-3 w-3 text-amber-500" />
                    <span>View Gallery ({getListingGallery(item).length})</span>
                  </button>

                  {/* Price Banner */}
                  <div className="absolute bottom-4 right-4 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-md">
                    <span className="font-sans font-bold text-indigo-600 text-sm sm:text-base">
                      {formatIndianPrice(item.price)}
                      {item.type === "rent" && <span className="text-[10px] text-slate-500 font-mono ml-0.5">/mo</span>}
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-6 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
                      <span className="text-xs font-mono font-bold tracking-tight text-slate-600">
                        {item.location}
                      </span>
                    </div>
                    
                    <h3 className="font-sans font-bold text-lg text-slate-900 mt-2 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-tight">
                      {item.title}
                    </h3>
                    
                    <p className="mt-3 text-slate-500 text-xs line-clamp-3 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>

                  {/* Key specs & Buttons */}
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="grid grid-cols-3 gap-2 text-center text-slate-500 font-mono text-[11px] mb-5">
                      {item.bhk && (
                        <div className="bg-slate-50 py-1.5 px-2 rounded-lg border border-slate-100 flex items-center justify-center space-x-1">
                          <BedDouble className="h-3.5 w-3.5 text-indigo-500" />
                          <span className="text-slate-700 font-bold">{item.bhk} BHK</span>
                        </div>
                      )}
                      <div className="bg-slate-50 py-1.5 px-2 rounded-lg border border-slate-100 flex items-center justify-center space-x-1">
                        <Maximize className="h-3.5 w-3.5 text-indigo-500" />
                        <span className="text-slate-700 font-bold">{item.sqft} sqft</span>
                      </div>
                      <div className="bg-slate-50 py-1.5 px-2 rounded-lg border border-slate-100 flex items-center justify-center space-x-1 col-span-1">
                        <Home className="h-3.5 w-3.5 text-indigo-500" />
                        <span className="text-slate-700 font-bold capitalize">{item.propertyType}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedListing(item);
                        setEnquiryNotes(`Hi Rajesh, I am interested in exploring details regarding the "${item.title}" in ${item.location}. Kindly connect with me at your earliest convenience.`);
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-center text-xs transition-colors tracking-wider uppercase"
                    >
                      View Full Specifications
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Property Details Modal with Direct Lead Enquiry Integration */}
      {selectedListing && (
        <div 
          onClick={() => setSelectedListing(null)}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-start md:items-center justify-center p-3 sm:p-4 md:py-12 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white border border-slate-200 text-slate-900 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 cursor-default my-4 md:my-0"
          >
            
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedListing(null);
              }}
              className="fixed top-4 right-4 md:absolute md:top-4 md:right-4 bg-slate-900 md:bg-white text-white md:text-slate-700 hover:bg-slate-800 md:hover:bg-slate-100 hover:text-rose-600 rounded-full p-3 md:p-2.5 z-50 border border-slate-800 md:border-slate-200 shadow-xl md:shadow-md transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
              title="Close Specifications"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 stroke-[2.5]" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Side: Property media and details */}
              <div className="lg:col-span-7 flex flex-col">
                <div 
                  onClick={() => {
                    setLightboxListing(selectedListing);
                    setLightboxIndex(detailActiveImageIndex);
                  }}
                  className="relative aspect-[16/10] bg-slate-100 cursor-pointer overflow-hidden group/modalimg"
                >
                  <img
                    src={getListingGallery(selectedListing)[detailActiveImageIndex]}
                    alt={selectedListing.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover/modalimg:scale-102 transition-transform duration-500"
                  />
                  
                  {/* Click to Expand Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover/modalimg:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <span className="opacity-0 group-hover/modalimg:opacity-100 bg-slate-900/90 backdrop-blur-xs text-white text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 font-sans font-bold transition-all shadow-lg transform scale-90 group-hover/modalimg:scale-100">
                      <Maximize className="h-3.5 w-3.5 text-amber-500" />
                      <span>Click to view fullscreen gallery</span>
                    </span>
                  </div>

                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest font-bold bg-slate-900 text-white px-2.5 py-1 rounded-md shadow-xs">
                      {selectedListing.type === "buy" ? "For Sale" : "Rent"}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest font-bold bg-white text-slate-800 border border-slate-200 px-2.5 py-1 rounded-md shadow-xs">
                      {selectedListing.propertyType}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/95 border border-slate-200 px-4 py-2 rounded-xl shadow-lg">
                    <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wider">Invest Price</span>
                    <span className="font-sans font-black text-indigo-600 text-lg sm:text-xl leading-none">
                      {formatIndianPrice(selectedListing.price)}
                      {selectedListing.type === "rent" && <span className="text-xs text-slate-500 font-mono ml-0.5">/mo</span>}
                    </span>
                  </div>
                </div>

                {/* Horizontal gallery thumbnails */}
                <div className="flex gap-2 p-3 bg-slate-50 border-b border-slate-150 overflow-x-auto shrink-0 scrollbar-thin">
                  {getListingGallery(selectedListing).map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDetailActiveImageIndex(idx)}
                      className={`relative w-20 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        detailActiveImageIndex === idx
                          ? "border-indigo-600 ring-2 ring-indigo-600/10 scale-95"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img src={imgUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>

                <div className="p-6 text-left space-y-5 flex-1 overflow-y-auto max-h-[350px] lg:max-h-[400px]">
                  <div>
                    <div className="flex items-center space-x-1.5 text-indigo-600">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="text-xs font-mono tracking-wide text-slate-600 font-bold">{selectedListing.location}, Chennai</span>
                    </div>
                    <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-slate-900 mt-1.5 leading-snug">
                      {selectedListing.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-150 text-center font-mono text-xs">
                    {selectedListing.bhk && (
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Config</span>
                        <span className="text-indigo-600 font-bold text-sm block mt-1">{selectedListing.bhk} BHK</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Size</span>
                      <span className="text-slate-900 font-bold text-sm block mt-1">{selectedListing.sqft} sqft</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Status</span>
                      <span className="text-emerald-600 font-bold text-sm block mt-1 capitalize">{selectedListing.status}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-800 border-b border-slate-100 pb-1.5 mb-2">Description</h4>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
                      {selectedListing.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-800 border-b border-slate-100 pb-1.5 mb-3.5">Included Premium Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedListing.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-50 border border-slate-200/80 text-slate-800 text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1"
                        >
                          <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full"></span>
                          <span>{amenity}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Seamless Lead Form */}
              <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-200 text-left">
                <div className="mb-6">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-indigo-600 font-bold block">Exclusive Representation</span>
                  <h4 className="font-sans font-bold text-lg text-slate-900 mt-1">Submit Property Query</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    Complete your contact details below. Rajesh K. Swamy will receive this lead on his workspace inbox immediately.
                  </p>
                </div>

                {enquirySuccess ? (
                  <div className="bg-white border border-indigo-100 text-center p-6 rounded-xl flex flex-col items-center justify-center h-full my-auto space-y-3 shadow-xs">
                    <div className="bg-indigo-50 p-3 rounded-full border border-indigo-100 text-indigo-600">
                      <Sparkles className="h-8 w-8 animate-pulse" />
                    </div>
                    <h5 className="font-sans font-bold text-slate-900 text-base">Enquiry Logged!</h5>
                    <p className="text-slate-600 text-xs leading-relaxed max-w-xs">
                      Your query was captured. Rajesh will review this in his Agent Portal and connect with you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={enquiryName}
                        onChange={(e) => setEnquiryName(e.target.value)}
                        placeholder="Arun Swaminathan"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={enquiryPhone}
                        onChange={(e) => setEnquiryPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Email Address</label>
                      <input
                        type="email"
                        value={enquiryEmail}
                        onChange={(e) => setEnquiryEmail(e.target.value)}
                        placeholder="arun@example.com"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Inquiry Notes</label>
                      <textarea
                        rows={3}
                        value={enquiryNotes}
                        onChange={(e) => setEnquiryNotes(e.target.value)}
                        placeholder="Type any specific requests..."
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md shadow-indigo-150 transform active:scale-98 mt-2"
                    >
                      Connect with Agent
                    </button>
                  </form>
                )}

                {/* Highly visible footer Close button */}
                <button
                  type="button"
                  onClick={() => setSelectedListing(null)}
                  className="w-full mt-4 bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-950 font-sans font-bold py-3 px-4 rounded-xl text-xs tracking-wider uppercase transition-all transform active:scale-98 flex items-center justify-center space-x-2 border border-slate-300/80 shadow-sm"
                >
                  <X className="h-4 w-4 stroke-[2.5] text-slate-500" />
                  <span>Close Specifications</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Lightbox Gallery Slideshow Modal */}
      {lightboxListing && (
        <div 
          onClick={() => setLightboxListing(null)}
          className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 md:p-8 animate-in fade-in duration-200 cursor-pointer"
        >
          
          {/* Lightbox Header / Controls */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex justify-between items-center text-white shrink-0 z-10 cursor-default"
          >
            <div className="text-left">
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500 font-bold block">
                Gallery Slideshow
              </span>
              <h4 className="font-sans font-bold text-sm sm:text-base text-white/90 line-clamp-1">
                {lightboxListing.title}
              </h4>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
                {lightboxIndex + 1} / {getListingGallery(lightboxListing).length}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxListing(null);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs px-4 py-2.5 rounded-full flex items-center space-x-1.5 shadow-xl hover:scale-105 active:scale-95 transition-all border border-amber-600"
                aria-label="Close gallery"
              >
                <X className="h-4.5 w-4.5 stroke-[3]" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Lightbox Main Image & Navigation Arrows */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center relative my-4 sm:my-6 md:my-8 max-h-[70vh] cursor-default"
          >
            {/* Left Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  (prev) => (prev - 1 + getListingGallery(lightboxListing).length) % getListingGallery(lightboxListing).length
                );
              }}
              className="absolute left-2 sm:left-4 z-10 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-white p-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-amber-500" />
            </button>

            {/* Slide Image */}
            <div className="relative max-w-full max-h-full aspect-video sm:aspect-auto flex items-center justify-center overflow-hidden rounded-xl bg-slate-900/50 border border-slate-800/40">
              <img
                src={getListingGallery(lightboxListing)[lightboxIndex]}
                alt={`${lightboxListing.title} - Fullscreen view`}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[60vh] md:max-h-[65vh] object-contain select-none transition-all duration-300 transform scale-100"
              />
            </div>

            {/* Right Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  (prev) => (prev + 1) % getListingGallery(lightboxListing).length
                );
              }}
              className="absolute right-2 sm:right-4 z-10 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-white p-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-amber-500" />
            </button>
          </div>

          {/* Bottom Thumbnails */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 flex flex-col items-center z-10 cursor-default"
          >
            <div className="flex gap-2.5 p-2 bg-slate-900/60 border border-slate-800/60 rounded-2xl max-w-full overflow-x-auto scrollbar-thin">
              {getListingGallery(lightboxListing).map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(idx);
                  }}
                  className={`relative w-16 sm:w-20 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    lightboxIndex === idx
                      ? "border-amber-500 scale-95 ring-4 ring-amber-500/15"
                      : "border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600"
                  }`}
                >
                  <img src={imgUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
            
            {/* Short helper/hint */}
            <span className="text-[10px] font-mono text-slate-500 mt-3 select-none hidden sm:block">
              Tip: Use Left & Right Arrow keys, or Escape to close.
            </span>
          </div>

        </div>
      )}

    </section>
  );
}
