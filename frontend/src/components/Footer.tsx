import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-liver-navy text-white/80 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-liver-teal" />
            <span className="font-['Outfit'] font-semibold text-white">
              LiverSense
            </span>
          </div>
          
          <p className="text-sm text-center md:text-right">
            <span className="text-white/60">
              Not intended for medical diagnosis. Please consult healthcare professionals.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
