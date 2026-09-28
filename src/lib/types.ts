export type Role = "guest" | "tourist" | "admin";

export type Currency = "USD" | "EUR" | "GBP" | "AUD" | "CHF" | "LKR";

export type PlanStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "in_discussion"
  | "awaiting_tour_deposit"
  | "awaiting_final_balance"
  | "bank_transfer_pending"
  | "fully_paid"
  | "on_hold"
  | "expired"
  | "cancelled"
  | "completed";

export type BookingType = "custom" | "package_asis" | "package_customized";

export type PaymentType = "review_fee" | "tour_deposit" | "final_balance" | "refund";
export type PaymentMethod = "gateway" | "bank_transfer";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface Pax { adults: number; children: number; infants: number; }

export interface Plan {
  id: string;
  ref: string;
  owner: boolean; // belongs to the demo tourist
  type: BookingType;
  packageId?: string;
  pkgName?: string;
  tourist: string;
  country: string;
  currency: Currency;
  start: string;
  end: string;
  pax: Pax;
  star: 0 | 3 | 4 | 5;
  experiences: string[];
  places: string[];
  mustVisit: string;
  budgetPPMin: number; // per person
  budgetPPMax: number;
  contact: { methods: string[]; phone: string };
  notes: string; // shared note (not private)
  status: PlanStatus;
  claimedBy: string | null;
  total: number | null;
  deposit: number | null;
  depositDue: string | null;
  finalDue: string | null;
  amountsLocked: boolean;
  declaredBy?: string;
  finalMethod: "online" | "bank" | null;
  holdReason?: string | null;
  prevStatus?: PlanStatus | null;
  createdAt: string;
  versions: string[];
}

export interface Payment {
  id: string;
  ref: string; // RCPT-####
  planRef: string;
  type: PaymentType;
  method: PaymentMethod;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  date: string;
  receiptId?: string;
}

export interface BankReceipt {
  id: string;
  ref: string; // BR-YYYY-####
  planRef: string;
  paymentRef: string;
  fileName: string;
  uploadedBy: string; // "tourist" | "admin:Nimal Perera"
  status: "pending" | "approved" | "rejected";
  rejectReason?: string;
  version: number;
  createdAt: string;
}

export interface Experience {
  id: string;
  name: string;
  icon: string;
  blurb: string;
  description: string;
}

export interface MapStop { city: string; x: number; y: number; note?: string; }

export interface DayTour {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  duration: string;
  cities: string[];
  stops: MapStop[];
}

export interface DestinationCategory {
  id: string;
  name: string;
  blurb: string;
  places: { name: string; blurb: string; rating: number }[];
}

export interface PackageDay {
  day: number;
  place: string;
  x: number;
  y: number;
  title: string;
  description: string;
  experiences: string[];
  specialty: string;
}

export interface Pkg {
  id: string;
  slug: string;
  name: string;
  collection: "round_tour" | "honeymoon" | "family" | "wildlife";
  summary: string;
  days: number;
  nights: number;
  pricePP: number; // USD
  image?: string;
  itinerary: PackageDay[];
}

export interface Review {
  id: string;
  source: "tripadvisor" | "manual";
  author: string;
  country: string;
  rating: number;
  date: string;
  text: string;
  featured: boolean;
}

export interface Notification {
  id: string;
  forRole: "tourist" | "staff";
  title: string;
  body: string;
  t: string;
  read: boolean;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  place: string; // location shown on the card
  consentBy: string; // which tourist consented (policy requirement)
  addedBy: string; // staff member who published it
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string; // hero image URL
  location: { name: string; region: string; x: number; y: number }; // x/y on the schematic SL map
  content: string[]; // paragraphs
  author: string;
  date: string; // ISO
  readMins: number;
  published: boolean; // false = draft (admin-only visibility)
  createdBy: string;
  updatedAt: string;
}

export type Locale = "en" | "de" | "fr";
