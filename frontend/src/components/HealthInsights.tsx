import { AlertTriangle, Info } from "lucide-react";
import type { MedicalWarning, Severity } from "@/lib/schemas";

interface HealthInsightsProps {
  warnings: MedicalWarning[];
}

function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case "mild":
      return "text-liver-warning-mild bg-liver-warning-mild/10 border-liver-warning-mild/30";
    case "moderate":
      return "text-liver-warning-moderate bg-liver-warning-moderate/10 border-liver-warning-moderate/30";
    case "high":
      return "text-liver-warning-high bg-liver-warning-high/10 border-liver-warning-high/30";
    default:
      return "text-muted-foreground bg-muted border-border";
  }
}

function getSeverityLabel(severity: Severity): string {
  switch (severity) {
    case "mild":
      return "Mildly Elevated";
    case "moderate":
      return "Moderately Elevated";
    case "high":
      return "Highly Elevated";
    default:
      return severity;
  }
}

export function HealthInsights({ warnings }: HealthInsightsProps) {
  if (warnings.length === 0) {
    return (
      <div className="mt-8 animate-slide-up stagger-2">
        <h3 className="text-xl font-bold font-['Outfit'] text-foreground mb-4">
          Liver Health Insights
        </h3>
        <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
          <Info className="w-5 h-5 text-liver-teal flex-shrink-0" />
          <p className="text-muted-foreground">
            All liver function parameters appear to be within normal ranges.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 animate-slide-up stagger-2">
      <h3 className="text-xl font-bold font-['Outfit'] text-foreground mb-4">
        Liver Health Insights
      </h3>
      
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Prediction Analysis
        </h4>
        
        {warnings.map((warning, index) => (
          <div
            key={warning.marker}
            className={`
              rounded-lg border p-4 flex items-start gap-3 animate-slide-up
            `}
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <div className={`p-1.5 rounded-full flex-shrink-0 ${getSeverityColor(warning.severity)}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground">
                  {warning.marker}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getSeverityColor(warning.severity)}`}>
                  {getSeverityLabel(warning.severity)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mt-1">
                {warning.message}
              </p>
              
              <p className="text-xs text-muted-foreground/70 mt-1">
                Value: {warning.value} (Normal upper limit: {warning.upper_limit})
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
