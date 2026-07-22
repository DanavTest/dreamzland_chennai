import { RealtorProfile, Listing, ClosedDeal, LeadSubmission } from "./types";

// Helper to format currency in Indian format (Lakhs and Crores)
export function formatIndianPrice(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2).replace(/\.00$/, "")} Cr`;
  } else if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(2).replace(/\.00$/, "")} Lakhs`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const CHENNAI_LOCALITIES = [
  "Tiruvanmiyar",
  "OMR",
  "Chitlapuram",
  "Alwarpet",
  "Sanatorium",
  "Tambaram",
  "chromepet",
  "Hasithanapuram",
  "mudichur",
  "Adyar",
  "Anna Nagar",
  "ECR (East Coast Road)",
  "Besant Nagar",
  "Nungambakkam"
];

export const INITIAL_REALTOR_PROFILE: RealtorProfile = {
  name: "Danav J",
  title: "Premium Property Consultant & Owner",
  companyName: "dreamzland_chennai",
  bio: `Danav J\nI run an independent real estate practice focused on premium micro-markets in South Chennai. My work is grounded in local knowledge — the streets, the builders, the resale values, and what actually moves in Alwarpet, Teynampet, and Kodambakkam, Tambaram ,all over chennai etc.,\n\nWhether you're a Chennai-based family upgrading homes, or an NRI investor buying from abroad, I handle the process directly — property shortlisting, negotiation, paperwork, and registration support — so you're not left guessing at any stage.`,
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
  phone: "+91 98401 23456",
  email: "mayborndj@gmail.com",
  licenseNo: "TN/01/Agent/0241/2026",
  experienceYears: 5,
  closedDealsCount: 42,
  activeListingsCount: 9,
  clientSatisfaction: "99.2%",
  languages: ["Tamil", "English"],
  officeAddress: "Chennai, Tamil Nadu, India",
  socials: {
    whatsapp: "+919840123456",
    linkedin: "https://linkedin.com/in/danav-chennai-dreamzland",
    facebook: "https://facebook.com/chennaidreamzland",
    instagram: "https://instagram.com/chennaidreamzland",
  },
  preferredLocalities: ["Tiruvanmiyar", "OMR", "Chitlapuram", "Alwarpet", "Sanatorium", "Tambaram", "chromepet", "Hasithanapuram", "mudichur"],
};

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: "lst-001",
    title: "Cozy 3 BHK Ready Villa in Tiruvanmiyar",
    price: 18500000, // 1.85 Cr
    type: "buy",
    propertyType: "Villa",
    bhk: 3,
    bathrooms: 3,
    sqft: 2200,
    location: "Tiruvanmiyar",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Elegant 3 BHK villa located in a premium street of Tiruvanmiyar. Features marble flooring, modular kitchen, a private backyard garden, and excellent connectivity to the beach and major transport nodes. Ready to move in.",
    amenities: ["Private Garden", "Covered Car Park", "Modular Kitchen", "Metro Water Connection", "Inverter Power Backup"],
    status: "Active",
  },
  {
    id: "lst-002",
    title: "Modern Executive Flat in OMR",
    price: 7500000, // 75 Lakhs
    type: "buy",
    propertyType: "Apartment",
    bhk: 2,
    bathrooms: 2,
    sqft: 1100,
    location: "OMR",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Sleek 2 BHK apartment on the OMR tech corridor. Located inside a high-rise gated community with modern amenities. Perfect for IT professionals seeking high rental yields or direct occupancy.",
    amenities: ["Gated Security", "Gymnasium", "Swimming Pool", "Power Backup", "Covered Parking"],
    status: "Active",
  },
  {
    id: "lst-003",
    title: "Premium Semi-Furnished Flat in Chitlapuram",
    price: 5800000, // 58 Lakhs
    type: "buy",
    propertyType: "Apartment",
    bhk: 2,
    bathrooms: 2,
    sqft: 980,
    location: "Chitlapuram",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Ready-to-occupy 2 BHK flat in Chitlapuram. Includes premium woodworking, false ceiling with ambient LED lighting, private balcony, and ample borewell water supply. Quiet residential zone.",
    amenities: ["Teak Woodwork", "Balcony", "Borewell Water", "Quiet Neighbourhood", "CCTV Security"],
    status: "Active",
  },
  {
    id: "lst-004",
    title: "Spacious Luxury Residence in Alwarpet",
    price: 42000000, // 4.2 Cr
    type: "buy",
    propertyType: "Penthouse",
    bhk: 4,
    bathrooms: 4,
    sqft: 3400,
    location: "Alwarpet",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Ultra-luxury 4 BHK penthouse located in Alwarpet. Spans an entire floor with a massive wrap-around terrace, private lift access, premium imported sanitary fittings, and servant quarters. Secure and elite community.",
    amenities: ["Private Terrace", "Private Lift", "100% Power Backup", "24/7 Gated Security", "Servant Quarters"],
    status: "Active",
  },
  {
    id: "lst-005",
    title: "Elegant Gated Flat in Sanatorium",
    price: 6500000, // 65 Lakhs
    type: "buy",
    propertyType: "Apartment",
    bhk: 2,
    bathrooms: 2,
    sqft: 1050,
    location: "Sanatorium",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1527030280862-64139fbe04ca?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Superbly maintained 2 BHK apartment in Tambaram Sanatorium. Walking distance to railway station and hospital. Zero water stagnation area, clean title, and vastu-compliant design.",
    amenities: ["Vastu Compliant", "Walk to Railway", "Water Treatment", "Security Guard", "Lift Access"],
    status: "Active",
  },
  {
    id: "lst-006",
    title: "Beautiful Independent House in Tambaram",
    price: 8200000, // 82 Lakhs
    type: "buy",
    propertyType: "Independent House",
    bhk: 3,
    bathrooms: 3,
    sqft: 1600,
    location: "Tambaram",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257592-4871e5fbe76e?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A lovely independent 3 BHK house with individual land ownership in Tambaram. Quiet surroundings, covered car parking, separate borewell with sweet water, and independent spacious terrace.",
    amenities: ["Independent Terrace", "Sweet Ground Water", "Covered Car Park", "Teak Entrance Door", "Individual Land Title"],
    status: "Active",
  },
  {
    id: "lst-007",
    title: "Modern Semi-Furnished Flat in chromepet",
    price: 5200000, // 52 Lakhs
    type: "buy",
    propertyType: "Apartment",
    bhk: 2,
    bathrooms: 2,
    sqft: 920,
    location: "chromepet",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Perfectly sized 2 BHK apartment located right behind Chromepet commercial hub. High appreciation potential. Semi-furnished with customized wardrobes and modular kitchen.",
    amenities: ["Modular Kitchen", "Wardrobes", "Lift Access", "Metro Water", "Power Backup Ready"],
    status: "Active",
  },
  {
    id: "lst-008",
    title: "Cozy Residential Plot in Hasithanapuram",
    price: 4500000, // 45 Lakhs
    type: "buy",
    propertyType: "Independent House",
    bhk: 3,
    bathrooms: 2,
    sqft: 1200,
    location: "Hasithanapuram",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Superb newly built 3 BHK independent house in Hasithanapuram. Safe residential locality, wide access roads, clear documents, and immediate registration available.",
    amenities: ["Wide Access Road", "Sweet Borewell", "Covered Car Parking", "Clear Titles", "Solar Ready"],
    status: "Active",
  },
  {
    id: "lst-009",
    title: "Sleek Gated Villa in mudichur",
    price: 9500000, // 95 Lakhs
    type: "buy",
    propertyType: "Villa",
    bhk: 3,
    bathrooms: 3,
    sqft: 1850,
    location: "mudichur",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Luxury 3 BHK individual duplex villa inside a premium gated community in Mudichur. Comes with club membership, landscaped parks, round-the-clock security, and private terrace.",
    amenities: ["Gated Community", "Clubhouse Access", "Landscaped Parks", "Private Balcony", "CCTV Surveillance"],
    status: "Active",
  },
];

export const INITIAL_CLOSED_DEALS: ClosedDeal[] = [
  {
    id: "deal-001",
    title: "Palatial 5 BHK Beach Villa in ECR",
    price: 84000000, // 8.40 Cr
    location: "ECR (East Coast Road)",
    type: "sale",
    closedDate: "May 2026",
    propertyType: "Villa",
    bhk: 5,
  },
  {
    id: "deal-002",
    title: "Luxury 3 BHK Flat in Gandhi Nagar",
    price: 28500000, // 2.85 Cr
    location: "Adyar",
    type: "sale",
    closedDate: "April 2026",
    propertyType: "Apartment",
    bhk: 3,
  },
  {
    id: "deal-003",
    title: "Prime Office Floor in OMR Tech Park",
    price: 125000000, // 12.5 Cr
    location: "OMR (Old Mahabalipuram Road)",
    type: "sale",
    closedDate: "February 2026",
    propertyType: "Commercial Space",
  },
  {
    id: "deal-004",
    title: "Duplex Bungalow near Shanthi Colony",
    price: 39000000, // 3.9 Cr
    location: "Anna Nagar",
    type: "sale",
    closedDate: "November 2025",
    propertyType: "Independent House",
    bhk: 4,
  },
  {
    id: "deal-005",
    title: "Penthouse at Besant Nagar",
    price: 250000, // 2.5 L Rent
    location: "Besant Nagar",
    type: "lease",
    closedDate: "October 2025",
    propertyType: "Penthouse",
    bhk: 4,
  },
];

export const INITIAL_LEADS: LeadSubmission[] = [
  {
    id: "lead-001",
    type: "buy",
    name: "Arun Raghavan",
    email: "arun.raghav@gmail.com",
    phone: "+91 94440 98765",
    location: "Adyar",
    budgetMin: 20000000,
    budgetMax: 30000000,
    propertyType: "Apartment",
    bhkPreferred: 3,
    notes: "Looking for immediate purchase. Vastu compliance is a must, preferred first floor or higher with power backup.",
    submittedAt: "2026-07-15T10:30:00Z",
    status: "New",
  },
  {
    id: "lead-002",
    type: "sell",
    name: "Meera Krishnan",
    email: "meera_k@outlook.com",
    phone: "+91 98410 43210",
    location: "ECR (East Coast Road)",
    propertyType: "Villa",
    notes: "Wanting to list a 4 BHK beachside villa in Neelankarai. Expecting valuation advice and target price around 7.5 Cr.",
    submittedAt: "2026-07-18T14:15:00Z",
    status: "In Progress",
  },
];
