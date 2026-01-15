import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Database, 
  Filter, 
  Sparkles, 
  Layers, 
  FileText,
  ArrowRight
} from "lucide-react";

import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({ component: HowItWorksPage });

function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      icon: <Database className="w-6 h-6" />,
      title: "Data Collection",
      description:
        "Input your clinical test results including bilirubin levels, enzyme levels, and other relevant health metrics.",
    },
    {
      number: 2,
      icon: <Filter className="w-6 h-6" />,
      title: "Data Preprocessing",
      description:
        "Our system normalizes and processes your data to prepare it for analysis.",
    },
    {
      number: 3,
      icon: <Sparkles className="w-6 h-6" />,
      title: "Feature Engineering",
      description:
        "Key features are extracted and selected to ensure the most accurate prediction.",
    },
    {
      number: 4,
      icon: <Layers className="w-6 h-6" />,
      title: "Ensemble Modeling",
      description:
        "Multiple machine learning models analyze your data to provide a comprehensive assessment.",
    },
    {
      number: 5,
      icon: <FileText className="w-6 h-6" />,
      title: "Result Interpretation",
      description:
        "Receive an easy-to-understand report with your liver health status.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Banner */}
      <section className="bg-slate-900 py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-['Outfit'] animate-fade-in">
            How It Works
          </h1>
          <p className="text-lg text-white/80 mt-4 animate-slide-up">
            Understanding our prediction process
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl font-bold font-['Outfit'] text-foreground mb-4">
              The Prediction Process
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ExplaiLiver+ uses a sophisticated machine learning pipeline to analyze your clinical 
              parameters and provide a reliable prediction about your liver health status.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="flex gap-6 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-liver-teal text-white flex items-center justify-center font-bold text-lg font-['Outfit']">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-full bg-liver-teal/20 mx-auto mt-2" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pb-8">
                  <div className="bg-card rounded-xl border p-6 feature-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-liver-teal">{step.icon}</div>
                      <h3 className="text-xl font-bold font-['Outfit'] text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12 animate-slide-up stagger-5">
            <p className="text-muted-foreground mb-4">
              Ready to try it yourself?
            </p>
            <Link to="/predict">
              <Button 
                size="lg"
                className="bg-liver-teal hover:bg-liver-teal/90 text-white font-semibold px-8"
              >
                Start Prediction
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
