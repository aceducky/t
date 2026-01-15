import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/predict", label: "Predict" },
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/contact", label: "Contact" },
] as const;

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <header className="bg-liver-navy/95 backdrop-blur-sm text-white shadow-lg sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Heart className="w-8 h-8 text-liver-teal group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="font-['Outfit'] font-bold text-xl tracking-tight">
                ExplaiLiver+
              </span>
              <span className="text-[10px] text-white/60 -mt-1 hidden sm:block">
                Explainable Liver Disease Prediction
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? "bg-liver-teal text-white" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10 animate-slide-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = currentPath === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      px-4 py-3 rounded-lg text-sm font-medium transition-all
                      ${isActive 
                        ? "bg-liver-teal text-white" 
                        : "text-white/80 hover:text-white hover:bg-white/10"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
