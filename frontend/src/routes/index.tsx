import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Brain, 
  BarChart3, 
  Settings2, 
  HeartPulse, 
  ArrowRight,
  Check
} from "lucide-react";

import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const features = [
    {
      icon: <Brain className="w-10 h-10" />,
      title: "Advanced Prediction",
      description:
        "Multi-stage stacking framework for accurate liver disease prediction.",
    },
    {
      icon: <BarChart3 className="w-10 h-10" />,
      title: "SHAP Analysis",
      description:
        "Interpretable AI with SHAP values for transparent decision making.",
    },
    {
      icon: <Settings2 className="w-10 h-10" />,
      title: "Smart Features",
      description:
        "Comprehensive feature analysis and selection for optimal performance.",
    },
    {
      icon: <HeartPulse className="w-10 h-10" />,
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-slate-900 relative py-20 md:py-32 px-6 text-center overflow-hidden">
        <div className="relative max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-['Outfit'] leading-tight animate-fade-in">
            Liver+: A Multi-Stage Stacking Framework with{" "}
            <span className="text-liver-cyan">SHAP-Based Interpretability</span>{" "}
            for Clinical Liver Disease Prediction
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mt-6 animate-slide-up stagger-1">
            Enter your clinical test values and get instant prediction with confidence score.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-slide-up stagger-2">
            <Link to="/predict">
              <Button 
                size="lg" 
                className="bg-liver-teal hover:bg-liver-teal/90 text-white font-semibold px-8 py-6 text-lg group"
              >
                START PREDICTION
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-liver-navy font-semibold px-8 py-6 text-lg"
              >
                LEARN MORE
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card bg-card rounded-xl p-6 border shadow-sm animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-liver-teal mb-4">{feature.icon}</div>
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

      {/* About Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold font-['Outfit'] text-foreground mb-4">
                About ExplaiLiver+
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A cutting-edge framework for liver disease prediction with explainable AI capabilities.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our multi-stage stacking approach combines the strengths of multiple machine learning 
                models to deliver superior prediction accuracy while maintaining interpretability 
                through SHAP (Shapley Additive exPlanations) values.
              </p>
              <Link to="/about">
                <Button variant="link" className="text-liver-teal p-0 font-semibold">
                  LEARN MORE ABOUT US
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            <div className="animate-slide-up stagger-2">
              <h3 className="text-xl font-bold font-['Outfit'] text-foreground mb-4">
                Why Choose Our Solution?
              </h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-liver-teal flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
