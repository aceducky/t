import * as z from "zod/v4";

// Schema matching backend PredictionInput
export const predictionInputSchema = z.object({
  age: z.number({ error: "Age is required" })
    .min(1, "Age must be at least 1")
    .max(120, "Age must be at most 120"),

  gender: z.number({ error: "Gender is required" })
    .min(0, "Gender must be 0 (Female) or 1 (Male)")
    .max(1, "Gender must be 0 (Female) or 1 (Male)"),

  total_bilirubin: z.number({ error: "Total Bilirubin is required" })
    .min(0, "Total Bilirubin must be at least 0"),

  direct_bilirubin: z.number({ error: "Direct Bilirubin is required" })
    .min(0, "Direct Bilirubin must be at least 0"),

  alkaline_phosphatase: z.number({ error: "Alkaline Phosphatase is required" })
    .min(0, "Alkaline Phosphatase must be at least 0"),

  alt: z.number({ error: "ALT (SGPT) is required" })
    .min(0, "ALT must be at least 0"),

  ast: z.number({ error: "AST (SGOT) is required" })
    .min(0, "AST must be at least 0"),

  total_proteins: z.number({ error: "Total Proteins is required" })
    .min(0, "Total Proteins must be at least 0"),

  albumin: z.number({ error: "Albumin is required" })
    .min(0, "Albumin must be at least 0"),

  ag_ratio: z.number({ error: "A/G Ratio is required" })
    .min(0, "A/G Ratio must be at least 0")
    .max(3, "A/G Ratio must be between 0 and 3"),
}).refine(
  (data) => data.direct_bilirubin <= data.total_bilirubin,
  {
    message: "Direct Bilirubin cannot exceed Total Bilirubin",
    path: ["direct_bilirubin"]
  }
);

export type PredictionInput = z.infer<typeof predictionInputSchema>;

// Response types matching backend
export type Severity = "mild" | "moderate" | "high";

export interface MedicalWarning {
  marker: string;
  value: number;
  upper_limit: number;
  severity: Severity;
  message: string;
}

export interface ShapContribution {
  feature: string;
  value: number;
  contribution: number;
  impact: "positive" | "negative";
}

export interface PredictionResponse {
  prediction: string;
  risk: string;
  summary: string;
  warnings: MedicalWarning[];
  shap_contributions: ShapContribution[];
  base_value: number;
}

export interface ApiError {
  error: string;
  details?: string[];
}

// Default form values - use empty strings for form display
export const defaultPredictionValues = {
  age: "" as unknown as number,
  gender: "" as unknown as number,
  total_bilirubin: "" as unknown as number,
  direct_bilirubin: "" as unknown as number,
  alkaline_phosphatase: "" as unknown as number,
  alt: "" as unknown as number,
  ast: "" as unknown as number,
  total_proteins: "" as unknown as number,
  albumin: "" as unknown as number,
  ag_ratio: "" as unknown as number,
};

// Form field metadata for UI
export const fieldMetadata = {
  age: {
    label: "Age",
    placeholder: "Enter age",
    unit: "years",
    hint: "Patient's age in years"
  },
  gender: {
    label: "Gender",
    placeholder: "Select Gender",
    options: [
      { value: "0", label: "Female" },
      { value: "1", label: "Male" }
    ]
  },
  total_bilirubin: {
    label: "Total Bilirubin (TB)",
    placeholder: "Enter value",
    unit: "mg/dL",
    hint: "Normal: 0.1-1.2 mg/dL"
  },
  direct_bilirubin: {
    label: "Direct Bilirubin (DB)",
    placeholder: "Enter value",
    unit: "mg/dL",
    hint: "Normal: 0-0.3 mg/dL"
  },
  alkaline_phosphatase: {
    label: "Alkaline Phosphatase (Alkphos)",
    placeholder: "Enter value",
    unit: "IU/L",
    hint: "Normal: 44-147 IU/L"
  },
  alt: {
    label: "Alanine Aminotransferase (SGPT)",
    placeholder: "Enter value",
    unit: "IU/L",
    hint: "Normal: 7-56 IU/L"
  },
  ast: {
    label: "Aspartate Aminotransferase (SGOT)",
    placeholder: "Enter value",
    unit: "IU/L",
    hint: "Normal: 10-40 IU/L"
  },
  total_proteins: {
    label: "Total Proteins (TP)",
    placeholder: "Enter value",
    unit: "g/dL",
    hint: "Normal: 6.0-8.3 g/dL"
  },
  albumin: {
    label: "Albumin (ALB)",
    placeholder: "Enter value",
    unit: "g/dL",
    hint: "Normal: 3.5-5.5 g/dL"
  },
  ag_ratio: {
    label: "Albumin and Globulin Ratio (A/G Ratio)",
    placeholder: "Enter value",
    unit: "",
    hint: "Must be between 0 and 3"
  }
} as const;
