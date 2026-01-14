import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Brain, 
  BarChart3, 
  Settings2, 
  HeartPulse, 
  ArrowRight,
  Check,
  Shield,
  Zap
} from "lucide-react";

import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  const features = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Advanced Prediction",
      description:
        "Multi-stage stacking framework for accurate liver disease prediction.",
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "SHAP Analysis",
      description:
        "Interpretable AI with SHAP values for transparent decision making.",
    },
    {
      icon: <Settings2 className="w-12 h-12" />,
      title: "Smart Features",
      description:
        "Comprehensive feature analysis and selection for optimal performance.",
    },
    {
      icon: <HeartPulse className="w-12 h-12" />,
      title: "Clinical Support",
      description:
        "Designed to assist healthcare professionals in diagnosis.",
    },
  ];

  const benefits = [
    "Higher accuracy than traditional methods",
    "Explainable AI for transparent decisions",
    "User-friendly interface for healthcare professionals",
    "Real-time prediction with confidence scores",
    "Comprehensive feature importance analysis",
  ];

  const capabilities = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Robust Validation",
      description: "Rigorous cross-validation ensures reliable predictions across diverse patient populations."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Processing",
      description: "Get instant predictions with our optimized machine learning pipeline."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Banner */}
      <section className="bg-slate-900 py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-['Outfit'] animate-fade-in">
            About LiverSense
          </h1>
          <p className="text-lg text-white/80 mt-4 animate-slide-up">
            Advanced liver disease prediction powered by explainable AI
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card bg-card rounded-xl p-6 border shadow-sm text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-liver-teal mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold font-['Outfit'] text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold font-['Outfit'] text-foreground mb-6">
                About ExplaiLiver+
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A cutting-edge framework for liver disease prediction with explainable AI capabilities.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our multi-stage stacking approach combines the strengths of multiple machine learning 
                models to deliver superior prediction accuracy while maintaining interpretability 
                through SHAP (Shapley Additive exPlanations) values.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The system analyzes key liver function markers including bilirubin levels, 
                enzyme activities, and protein concentrations to provide comprehensive 
                health assessments.
              </p>

              <div className="space-y-4 mt-8">
                {capabilities.map((cap, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-secondary/50 rounded-lg">
                    <div className="text-liver-teal flex-shrink-0">{cap.icon}</div>
                    <div>
                      <h4 className="font-semibold text-foreground">{cap.title}</h4>
                      <p className="text-sm text-muted-foreground">{cap.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/how-it-works" className="inline-block mt-6">
                <Button variant="link" className="text-liver-teal p-0 font-semibold">
                  LEARN MORE ABOUT US
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            {/* Right Column */}
            <div className="animate-slide-up stagger-2">
              <h3 className="text-2xl font-bold font-['Outfit'] text-foreground mb-6">
                Why Choose Our Solution?
              </h3>
              <div className="bg-card rounded-xl border p-6">
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="w-5 h-5 text-liver-teal" />
                      </div>
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 p-6 bg-liver-teal/10 rounded-xl border border-liver-teal/20">
                <h4 className="font-bold text-foreground font-['Outfit'] mb-2">
                  Ready to get started?
                </h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Try our prediction tool with your clinical test values.
                </p>
                <Link to="/predict">
                  <Button className="bg-liver-teal hover:bg-liver-teal/90 text-white w-full">
                    Start Prediction
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
