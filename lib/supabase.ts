import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type WaitTime = {
  id: number;
  hospital_name: string;
  hospital_url: string;
  region: string;
  specialty: string;
  outpatient_avg: number | null;
  outpatient_8in10: number | null;
  treatment_avg: number | null;
  treatment_8in10: number | null;
  last_updated: string | null;
  scraped_at: string;
};

export type SearchResult = WaitTime & { distance_km?: number };

export const SPECIALTIES = [
  "Cardiology",
  "Dermatology",
  "Ear, Nose and Throat",
  "Gastroenterology",
  "General Surgery",
  "Gynaecology",
  "Neurology",
  "Ophthalmology",
  "Orthopaedics",
  "Pain Management",
  "Respiratory",
  "Rheumatology",
  "Spinal Surgery",
  "Urology",
];

export const NHS_REGIONS: Record<string, string> = {
  london: "london",
  nwest: "nwest",
  ney: "ney",
  mids: "mids",
  east: "east",
  seast: "seast",
  swest: "swest",
};

export const POSTCODE_TO_REGION: Record<string, string> = {
  "London": "london",
  "South East": "seast",
  "South West": "swest",
  "East of England": "east",
  "East Midlands": "mids",
  "West Midlands": "mids",
  "Yorkshire and The Humber": "ney",
  "North East": "ney",
  "North West": "nwest",
};
