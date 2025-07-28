import z, { isValid } from "zod";
import { IsActive, Role } from "./user.interface";

//! create users data ---------------------------------
export const createUserZodSchema = z.object({
  /*   name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, { message: "Name too short, Minimum 2 characters" })
    .max(50, { message: "Name too long, Maximum 50 characters" }), */
  name: z.object({
    firstName: z
      .string({ invalid_type_error: "Name must be a string" })
      .min(2, { message: "Name too short, Minimum 2 characters" })
      .max(50, { message: "Name too long, Maximum 50 characters" }),
    lastName: z
      .string({ invalid_type_error: "Name must be a string" })
      .min(2, { message: "Name too short, Minimum 2 characters" })
      .max(50, { message: "Name too long, Maximum 50 characters" }),
  }),

  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email too short" })
    .max(100, { message: "Email too long" }),

  password: z
    .string()
    .min(8, { message: "Password must be at Least 8 Characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at Least 1 Uppercase letter",
    })
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
      message: "Password must contain at Least 1 Special character",
    })
    .regex(/\d/, {
      message: "Password must contain at Least 1 Digit Number",
    }),

  phone: z
    .string()
    .regex(/^01[0-9]{9}$/, {
      message:
        "Phone number must be a valid Bangladesh Number (e.g., 01XXXXXXXXX)",
    })
    .optional(),

  address: z
    .string()
    .max(200, { message: "Address too long, Maximum 200 Characters" })
    .optional(),
});

//!update user data----------------
export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, { message: "Name too short, Minimum 2 characters" })
    .max(50, { message: "Name too long, Maximum 50 characters" })
    .optional(),

  password: z
    .string()
    .min(8, { message: "Password must be at Least 8 Characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at Least 1 Uppercase letter",
    })
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
      message: "Password must contain at Least 1 Special character",
    })
    .regex(/\d/, {
      message: "Password must contain at Least 1 Digit Number",
    })
    .optional(),

  phone: z
    .string()
    .regex(/^01[0-9]{9}$/, {
      message:
        "Phone number must be a valid Bangladesh Number (e.g., 01XXXXXXXXX)",
    })
    .optional(),
  role: z
    .enum(Object.values(Role) as [string])
    .optional()
    .optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z
    .boolean({ invalid_type_error: "isDeleted must be true or false" })
    .optional(),
  isVarified: z
    .boolean({ invalid_type_error: "isValified must be true or false" })
    .optional(),
  address: z
    .string()
    .max(200, { message: "Address too long, Maximum 200 Characters" })
    .optional(),
});
