import { z } from "zod";
export const projectTypes = [
  "YouTube Editing",
  "Gaming",
  "VFX",
  "Motion Graphics",
  "Short Form",
  "Other",
] as const;
export const budgets = [
  "₹2,500–₹5,000",
  "₹5,000–₹10,000",
  "₹10,000–₹25,000",
  "₹25,000+",
  "Not sure yet",
] as const;
export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  projectType: z.enum(projectTypes),
  budget: z.enum(budgets),
  deadline: z.string().trim().min(1, "Required").max(120),
  description: z.string().trim().min(10, "Please share at least 10 characters").max(2000),
  reference: z.union([
    z.literal(""),
    z
      .string()
      .url("Enter a valid reference URL")
      .max(500)
      .refine((value) => /^https?:\/\//i.test(value), "Use an https or http link"),
  ]),
});
// Connect a delivery adapter here later. Undefined means no delivery is configured.
export const submitInquiry: undefined | ((data: z.infer<typeof inquirySchema>) => Promise<void>) =
  undefined;
