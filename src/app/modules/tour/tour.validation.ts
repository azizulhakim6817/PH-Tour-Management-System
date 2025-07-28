import { z } from "zod";

// Create Tour Schema----------------------
export const createTourZodSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  location: z.string(),
  costFrom: z.number().optional(),
  startDate: z
    .preprocess((val) => new Date(val as string), z.date())
    .optional(),
  endDate: z.preprocess((val) => new Date(val as string), z.date()).optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.string().optional(),
  maxGuest: z.string().optional(),
  minAge: z.number().optional(),
  division: z.string().optional(),
  tourType: z.string().optional(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),
});

// Update Tour Schema (All fields optional)
export const updateTourZodSchema = z.object({
  title: z.string(),
  description: z.string(),
  location: z.string(),
  costFrom: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  included: z.array(z.string()),
  excluded: z.array(z.string()),
  amenities: z.array(z.string()),
  tourPlan: z.string().optional(),
  maxGuest: z.string().optional(),
  minAge: z.number().optional(),
  division: z.string(),
  tourType: z.string(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),
});
export const createTourTypeZodSchema = z.object({
  name: z.string(),
});
