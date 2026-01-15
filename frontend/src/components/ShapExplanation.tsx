import { TrendingUp, TrendingDown } from "lucide-react";
import type { ShapContribution } from "@/lib/schemas";

interface ShapExplanationProps {
  contributions: ShapContribution[];
}

export function ShapExplanation({ contributions }: ShapExplanationProps) {
  // Find max absolute contribution for scaling bars
  const maxContribution = Math.max(...contributions.map((c) => Math.abs(c.contribution)));
  
  return (
    <div className="mt-6 rounded-xl border bg-card p-6 animate-slide-up">
      <h3 className="text-lg font-bold font-['Outfit'] text-foreground mb-2">
        Feature Contributions (SHAP Analysis)
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Each bar shows how much each clinical value pushed the prediction toward or away from liver disease risk.
      </p>
      
      <div className="space-y-3">
        {contributions.map((contrib, index) => {
          const barWidth = Math.abs(contrib.contribution) / maxContribution * 100;
          const isPositive = contrib.impact === "positive";
          
          return (
            <div
              key={contrib.feature}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 text-liver-alert" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-liver-healthy" />
                  )}
                  <span className="font-medium text-foreground">{contrib.feature}</span>
                  <span className="text-muted-foreground">= {contrib.value}</span>
                </div>
                <span
                  className={`font-mono text-xs px-2 py-0.5 rounded ${
                    isPositive
                      ? "bg-liver-alert/10 text-liver-alert"
                      : "bg-liver-healthy/10 text-liver-healthy"
                  }`}
                >
                  {isPositive ? "+" : ""}{contrib.contribution.toFixed(3)}
                </span>
              </div>
              
              {/* Horizontal bar visualization */}
              <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`absolute h-full rounded-full transition-all duration-500 ${
                    isPositive ? "bg-liver-alert" : "bg-liver-healthy"
                  }`}
                  style={{
                    width: `${barWidth}%`,
                    left: isPositive ? "50%" : `${50 - barWidth}%`,
                  }}
                />
                {/* Center line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-foreground/20" />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-liver-healthy" />
          <span>Decreases risk</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-liver-alert" />
          <span>Increases risk</span>
        </div>
      </div>
    </div>
  );
}
