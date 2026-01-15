import { CheckCircle2, AlertCircle } from "lucide-react";
import type { PredictionResponse } from "@/lib/schemas";

interface PredictionResultProps {
  result: PredictionResponse;
}

export function PredictionResult({ result }: PredictionResultProps) {
  const isHealthy = !result.prediction.includes("Disease Detected") || 
                    result.prediction.includes("No Liver Disease");
  
  return (
    <div
      className={`
        rounded-xl border-2 p-6 animate-slide-up
        ${isHealthy 
          ? "bg-liver-healthy-light border-liver-healthy" 
          : "bg-liver-alert-light border-liver-alert"
        }
      `}
    >
      <div className="flex items-start gap-4">
        <div
          className={`
            flex-shrink-0 p-2 rounded-full
            ${isHealthy 
              ? "bg-liver-healthy/20 text-liver-healthy animate-health-pulse" 
              : "bg-liver-alert/20 text-liver-alert animate-alert-pulse"
            }
          `}
        >
          {isHealthy ? (
            <CheckCircle2 className="w-8 h-8" />
          ) : (
            <AlertCircle className="w-8 h-8" />
          )}
        </div>
        
        <div className="flex-1">
          <h3
            className={`
              text-xl font-bold font-['Outfit']
              ${isHealthy ? "text-liver-healthy" : "text-liver-alert"}
            `}
          >
            {isHealthy ? "● No Liver Disease Detected" : "● Liver Disease Detected"}
          </h3>
          
          <p className="text-foreground/80 mt-2">
            {result.summary}
          </p>
          

          
          <p className="text-muted-foreground text-sm mt-4">
            {isHealthy 
              ? "However, regular check-ups are recommended for maintaining good liver health."
              : "Please consult a healthcare professional for further evaluation and diagnosis."
            }
          </p>
        </div>
      </div>
    </div>
  );
}
