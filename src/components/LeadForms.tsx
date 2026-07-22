import React, { useState } from "react";
import { LeadSubmission } from "../types";
import { CHENNAI_LOCALITIES } from "../data";
import { Send, Sparkles, Building, Key, CheckCircle, Mail, Phone, MapPin } from "lucide-react";

interface LeadFormsProps {
  onAddLead: (lead: Omit<LeadSubmission, "id" | "submittedAt">) => void;
}

export default function LeadForms({ onAddLead }: LeadFormsProps) {
  const [formType, setFormType] = useState<"buy" | "sell">("buy");
  
  // Buyer fields
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerLocality, setBuyerLocality] = useState(CHENNAI_LOCALITIES[0]);
  const [buyerPropType, setBuyerPropType] = useState("Apartment");
  const [buyerBhk, setBuyerBhk] = useState(3);
  const [buyerMinBudget, setBuyerMinBudget] = useState(10000000); // 1 Cr default
  const [buyerMaxBudget, setBuyerMaxBudget] = useState(25000000); // 2.5 Cr default
  const [buyerNotes, setBuyerNotes] = useState("");

  // Seller fields
  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerLocality, setSellerLocality] = useState(CHENNAI_LOCALITIES[0]);
  const [sellerPropType, setSellerPropType] = useState("Apartment");
  const [sellerBhk, setSellerBhk] = useState(3);
  const [sellerAskingPrice, setSellerAskingPrice] = useState(15000000); // 1.5 Cr default
  const [sellerAddress, setSellerAddress] = useState("");
  const [sellerNotes, setSellerNotes] = useState("");

  // Submission Status
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formType === "buy") {
      if (!buyerName || !buyerPhone || !buyerEmail) return;
      onAddLead({
        type: "buy",
        name: buyerName,
        email: buyerEmail,
        phone: buyerPhone,
        location: buyerLocality,
        propertyType: buyerPropType,
        bhkPreferred: buyerBhk,
        budgetMin: buyerMinBudget,
        budgetMax: buyerMaxBudget,
        notes: `Interests: looking to BUY a ${buyerBhk} BHK ${buyerPropType} in ${buyerLocality}. Budget range is between ₹${(buyerMinBudget/100000).toFixed(0)} Lakhs and ₹${(buyerMaxBudget/10000000).toFixed(1)} Cr. Additional Notes: ${buyerNotes}`,
        status: "New",
      });
      // Clear
      setBuyerName("");
      setBuyerEmail("");
      setBuyerPhone("");
      setBuyerNotes("");
    } else {
      if (!sellerName || !sellerPhone || !sellerEmail) return;
      onAddLead({
        type: "sell",
        name: sellerName,
        email: sellerEmail,
        phone: sellerPhone,
        location: sellerLocality,
        propertyType: sellerPropType,
        bhkPreferred: sellerBhk,
        budgetMin: sellerAskingPrice,
        budgetMax: sellerAskingPrice,
        notes: `Property to SELL: ${sellerBhk} BHK ${sellerPropType} located at "${sellerAddress}" in ${sellerLocality}. Asking Price: ₹${(sellerAskingPrice/10000000).toFixed(2)} Cr. Additional Notes: ${sellerNotes}`,
        status: "New",
      });
      // Clear
      setSellerName("");
      setSellerEmail("");
      setSellerPhone("");
      setSellerAddress("");
      setSellerNotes("");
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <section id="lead-section" className="py-24 bg-slate-50 text-slate-900 relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Block: Marketing Info / Lead Context */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-indigo-600 font-bold block">
                Let's Partner Up
              </span>
              <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 mt-2 tracking-tight">
                Are You Looking to <br />
                <span className="text-indigo-600">
                  Buy or Sell in Chennai?
                </span>
              </h2>
            </div>
            
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Chennai's real estate market offers unique hyper-local parameters. Navigating Adyar's luxury coastal rules, Velachery's extreme connectivity benefits, or OMR's rapid IT corridor appreciation requires professional advisorship.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3.5">
                <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100 text-indigo-600 mt-1">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-slate-800 font-bold text-sm">Complimentary Property Valuation</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Sellers receive a precise, data-driven analysis of comparative sales in their locality.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100 text-indigo-600 mt-1">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-slate-800 font-bold text-sm">Bespoke Buyer Sourcing</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Buyers get curated off-market match alerts before they are advertised on public platforms.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Block: Dynamic Dual Form Container */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs relative">
              
              {/* Form Navigation Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60 mb-8 max-w-sm mx-auto">
                <button
                  type="button"
                  id="tab-buy-enquiry"
                  onClick={() => {
                    setFormType("buy");
                    setSuccess(false);
                  }}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                    formType === "buy"
                      ? "bg-white text-slate-950 shadow-xs border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  I Want to Buy
                </button>
                <button
                  type="button"
                  id="tab-sell-enquiry"
                  onClick={() => {
                    setFormType("sell");
                    setSuccess(false);
                  }}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                    formType === "sell"
                      ? "bg-white text-slate-950 shadow-xs border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  I Want to Sell
                </button>
              </div>

              {success ? (
                <div className="bg-indigo-50/50 border border-indigo-100 py-16 px-6 rounded-2xl text-center space-y-4">
                  <div className="bg-indigo-100 h-16 w-16 rounded-full flex items-center justify-center text-indigo-600 mx-auto animate-bounce">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h3 className="font-sans font-extrabold text-2xl text-slate-900">Enquiry Logged Successfully!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Rajesh has been notified and will verify this in his <strong>Agent Workspace</strong> immediately. Expect a phone call or email within the next 24 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                  
                  {/* Common Contact Fields Block */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formType === "buy" ? buyerName : sellerName}
                        onChange={(e) => formType === "buy" ? setBuyerName(e.target.value) : setSellerName(e.target.value)}
                        placeholder="Vijay Chandrasekhar"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={formType === "buy" ? buyerPhone : sellerPhone}
                        onChange={(e) => formType === "buy" ? setBuyerPhone(e.target.value) : setSellerPhone(e.target.value)}
                        placeholder="+91 98400 98765"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formType === "buy" ? buyerEmail : sellerEmail}
                      onChange={(e) => formType === "buy" ? setBuyerEmail(e.target.value) : setSellerEmail(e.target.value)}
                      placeholder="vijay@gmail.com"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Form Specific Dynamic Blocks */}
                  {formType === "buy" ? (
                    <>
                      {/* Buyer Parameters */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Locality Preference</label>
                          <select
                            value={buyerLocality}
                            onChange={(e) => setBuyerLocality(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                          >
                            {CHENNAI_LOCALITIES.map((loc) => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Property Category</label>
                          <select
                            value={buyerPropType}
                            onChange={(e) => setBuyerPropType(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="Penthouse">Penthouse</option>
                            <option value="Independent House">Independent House</option>
                            <option value="Plot">Plot</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Preferred Layout</label>
                          <select
                            value={buyerBhk}
                            onChange={(e) => setBuyerBhk(parseInt(e.target.value, 10))}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="1">1 BHK</option>
                            <option value="2">2 BHK</option>
                            <option value="3">3 BHK</option>
                            <option value="4">4 BHK+</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Minimum Budget (₹)</label>
                          <input
                            type="number"
                            value={buyerMinBudget}
                            onChange={(e) => setBuyerMinBudget(parseInt(e.target.value, 10))}
                            placeholder="e.g. 8000000 (80 Lakhs)"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Maximum Budget (₹)</label>
                          <input
                            type="number"
                            value={buyerMaxBudget}
                            onChange={(e) => setBuyerMaxBudget(parseInt(e.target.value, 10))}
                            placeholder="e.g. 25000000 (2.5 Cr)"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Requirements Note</label>
                        <textarea
                          rows={3}
                          value={buyerNotes}
                          onChange={(e) => setBuyerNotes(e.target.value)}
                          placeholder="What makes a property ideal for you? E.g., sea-facing, proximity to schools, vastu direction..."
                          className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Seller Parameters */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Property Locality</label>
                          <select
                            value={sellerLocality}
                            onChange={(e) => setSellerLocality(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                          >
                            {CHENNAI_LOCALITIES.map((loc) => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Property Type</label>
                          <select
                            value={sellerPropType}
                            onChange={(e) => setSellerPropType(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="Penthouse">Penthouse</option>
                            <option value="Independent House">Independent House</option>
                            <option value="Plot">Plot</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">BHK Size</label>
                          <select
                            value={sellerBhk}
                            onChange={(e) => setSellerBhk(parseInt(e.target.value, 10))}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="1">1 BHK</option>
                            <option value="2">2 BHK</option>
                            <option value="3">3 BHK</option>
                            <option value="4">4 BHK+</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Expected Listing Asking Price (₹)</label>
                        <input
                          type="number"
                          value={sellerAskingPrice}
                          onChange={(e) => setSellerAskingPrice(parseInt(e.target.value, 10))}
                          placeholder="e.g. 15000000 (1.5 Cr)"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Physical Street Address / Building name *</label>
                        <input
                          type="text"
                          required
                          value={sellerAddress}
                          onChange={(e) => setSellerAddress(e.target.value)}
                          placeholder="E.g. Flat 3A, Temple View Apartments, Kasturba Nagar 3rd Cross Street"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Condition / Features Note</label>
                        <textarea
                          rows={2}
                          value={sellerNotes}
                          onChange={(e) => setSellerNotes(e.target.value)}
                          placeholder="E.g., 5 years old, newly renovated toilets, covered car parking..."
                          className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* Submission CTA */}
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-extrabold py-4 rounded-xl text-sm uppercase tracking-wider transition-all shadow-md shadow-indigo-100 flex items-center justify-center space-x-2 transform active:scale-98"
                  >
                    <span>Request Callback from Rajesh</span>
                    <Send className="h-4 w-4" />
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
