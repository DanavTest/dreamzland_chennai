export interface RealtorProfile {
  name: string;
  title: string;
  companyName: string;
  bio: string;
  photoUrl: string;
  phone: string;
  email: string;
  licenseNo: string;
  experienceYears: number;
  closedDealsCount: number;
  activeListingsCount: number;
  clientSatisfaction: string;
  languages: string[];
  officeAddress: string;
  socials: {
    whatsapp?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  preferredLocalities: string[];
}

export interface Listing {
  id: string;
  title: string;
  price: number; // in INR (Lakhs or Crores, or raw numbers - let's store raw numbers, e.g. 15000000 for 1.5 Cr)
  type: "buy" | "rent";
  propertyType: "Apartment" | "Villa" | "Independent House" | "Penthouse" | "Plot";
  bhk?: number;
  bathrooms?: number;
  sqft: number;
  location: string; // e.g. "Adyar", "Anna Nagar"
  image: string; // fallback / unsplash URL
  gallery?: string[]; // array of images for slideshow
  description: string;
  amenities: string[];
  status: "Active" | "Under Offer" | "Sold";
}

export interface ClosedDeal {
  id: string;
  title: string;
  price: number; // in INR
  location: string;
  type: "sale" | "lease";
  closedDate: string; // e.g. "June 2026"
  propertyType: string;
  bhk?: number;
}

export interface LeadSubmission {
  id: string;
  type: "buy" | "sell";
  name: string;
  email: string;
  phone: string;
  location: string;
  budgetMin?: number; // raw INR
  budgetMax?: number; // raw INR
  propertyType: string;
  bhkPreferred?: number;
  notes?: string;
  submittedAt: string;
  status: "New" | "In Progress" | "Completed" | "Spam";
}
