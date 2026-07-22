import React from "react";
import { ClosedDeal } from "../types";
import { formatIndianPrice } from "../data";
import { BadgeCheck, Calendar, MapPin, Sparkles, TrendingUp, DollarSign } from "lucide-react";

interface ClosedDealsProps {
  deals: ClosedDeal[];
}

export default function ClosedDeals({ deals }: ClosedDealsProps) {
  // Aggregate stats based on current deals
  const totalVolume = React.useMemo(() => {
    return deals.reduce((acc, deal) => acc + deal.price, 0);
  }, [deals]);

  const salesDeals = React.useMemo(() => {
    return deals.filter((d) => d.type === "sale");
  }, [deals]);

  const avgSalesPrice = React.useMemo(() => {
    if (salesDeals.length === 0) return 0;
    const totalSalesPrice = salesDeals.reduce((acc, d) => acc + d.price, 0);
    return Math.round(totalSalesPrice / salesDeals.length);
  }, [salesDeals]);

  return (
    <section id="closed-deals" className="py-24 bg-white text-slate-900 relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-indigo-600 font-bold">
            Track Record & Authority
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 mt-2 tracking-tight">
            Our Closed Deals Showcase
          </h2>
          <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
            Proof of performance. Review a selection of our most recently finalized residential acquisitions and long-term commercial leases across Chennai.
          </p>
        </div>

        {/* Dynamic Aggregated Analytics Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left flex items-center space-x-4 shadow-2xs">
            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-indigo-600 flex-shrink-0">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Total Deal Volume</span>
              <h4 className="font-sans font-black text-slate-900 text-xl sm:text-2xl mt-1 leading-none">
                {formatIndianPrice(totalVolume)}
              </h4>
              <p className="text-slate-500 text-xs mt-1">Accumulated overall transactions</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left flex items-center space-x-4 shadow-2xs">
            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-indigo-600 flex-shrink-0">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Average Sale Price</span>
              <h4 className="font-sans font-black text-slate-900 text-xl sm:text-2xl mt-1 leading-none">
                {formatIndianPrice(avgSalesPrice || 35000000)}
              </h4>
              <p className="text-slate-500 text-xs mt-1">Avg size of premium sales</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left flex items-center space-x-4 shadow-2xs">
            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-indigo-600 flex-shrink-0">
              <BadgeCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold">Completed Deals</span>
              <h4 className="font-sans font-black text-slate-900 text-xl sm:text-2xl mt-1 leading-none">
                {deals.length} Active Listings
              </h4>
              <p className="text-slate-500 text-xs mt-1">Successfully closed locally</p>
            </div>
          </div>

        </div>

        {/* List of Closed Deals as Premium Cards */}
        <div className="max-w-4xl mx-auto space-y-4">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white border border-slate-200 hover:border-slate-350 hover:shadow-xs p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between transition-all group gap-4 text-left"
            >
              <div className="flex items-center space-x-4">
                {/* Visual Icon representing the closed status */}
                <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 text-indigo-600 group-hover:border-indigo-300 group-hover:text-indigo-500 transition-colors">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                      {deal.propertyType}
                    </span>
                    <span className={`font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                      deal.type === "sale" 
                        ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
                        : "text-indigo-700 bg-indigo-50 border-indigo-100"
                    }`}>
                      {deal.type === "sale" ? "Sold" : "Leased"}
                    </span>
                    {deal.bhk && (
                      <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-slate-400">
                        {deal.bhk} BHK
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-sans font-bold text-base text-slate-900 mt-1.5 leading-snug">
                    {deal.title}
                  </h3>

                  <div className="flex items-center space-x-1.5 mt-1 text-slate-500 text-xs">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
                    <span>{deal.location}, Chennai</span>
                  </div>
                </div>
              </div>

              {/* Price and Close Date side */}
              <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <span className="font-sans font-black text-indigo-600 text-base sm:text-lg">
                  {formatIndianPrice(deal.price)}
                </span>
                <span className="font-mono text-[10px] text-slate-500 flex items-center space-x-1 mt-1 font-bold">
                  <Calendar className="h-3.5 w-3.5 text-slate-400 mr-1" />
                  <span>Closed in {deal.closedDate}</span>
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
