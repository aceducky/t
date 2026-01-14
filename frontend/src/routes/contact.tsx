import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";

import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "contact@liversense.demo",
      description: "Send us an email anytime",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 5pm",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      value: "Demo City, DC 12345",
      description: "Visit our research center",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Banner */}
      <section className="bg-slate-900 py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-['Outfit'] animate-fade-in">
            Contact Us
          </h1>
          <p className="text-lg text-white/80 mt-4 animate-slide-up">
            Get in touch with our team
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <div
                key={info.title}
                className="feature-card bg-card rounded-xl border p-6 text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-liver-teal/10 text-liver-teal mb-4">
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold font-['Outfit'] text-foreground mb-1">
                  {info.title}
                </h3>
                <p className="text-liver-teal font-medium mb-1">{info.value}</p>
                <p className="text-muted-foreground text-sm">{info.description}</p>
              </div>
            ))}
          </div>

          {/* Information Card */}
          <div className="bg-card rounded-xl border p-8 animate-slide-up stagger-3">
            <h2 className="text-2xl font-bold font-['Outfit'] text-foreground mb-4">
              About This Demo
            </h2>
            <div className="prose prose-muted max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                LiverSense is a demonstration project showcasing the capabilities of 
                machine learning in healthcare prediction. This is not a production 
                medical application and should not be used for actual medical diagnosis.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The prediction model was trained on the Indian Liver Patient Dataset (ILPD) 
                and uses advanced ensemble techniques to provide probability-based predictions 
                for liver disease risk assessment.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                For any real medical concerns, please consult with qualified healthcare 
                professionals who can provide proper diagnosis and treatment recommendations.
              </p>
            </div>

            <div className="mt-8 p-6 bg-secondary/50 rounded-lg">
              <h3 className="font-bold text-foreground font-['Outfit'] mb-2">
                Try the Prediction Tool
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Experience our liver disease prediction model with sample clinical values.
              </p>
              <Link to="/predict">
                <Button className="bg-liver-teal hover:bg-liver-teal/90 text-white">
                  Go to Prediction
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
