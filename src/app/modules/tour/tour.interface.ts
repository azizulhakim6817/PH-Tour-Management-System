import { Types } from "mongoose";

export interface ITourType {
  name: string;
}
export interface ITour {
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  images?: string[];
  location?: string;
  costFrom?: number;
  startDate?: Date;
  endDate?: Date;
  departureLocation?: string;
  arrivalLocation?: string;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: string;
  maxGuest?: string;
  minAge?: number;
  division: Types.ObjectId;
  tourType: Types.ObjectId;
}
