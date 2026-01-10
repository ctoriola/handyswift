import { SearchBar } from "./SearchBar";
import professionalTeamImage from '../assets/5c21b3f63311a7a5846dc0ef02095b6718eead83.png';

function ProfessionalTeamIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Background blend elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl pointer-events-none"></div>
      <div className="absolute -inset-4 bg-gradient-to-tr from-secondary/3 via-transparent to-primary/3 rounded-3xl blur-sm pointer-events-none"></div>
      
      {/* Main image with enhanced blending */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/20 via-transparent to-slate-50/10 rounded-2xl pointer-events-none"></div>
        <img
          src={professionalTeamImage}
          alt="Professional service providers working in home"
          className="w-full h-auto max-w-md mx-auto rounded-2xl shadow-xl relative z-10 mix-blend-multiply will-change-transform"
          loading="eager"
        />
        
        {/* Subtle overlay to blend with background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/30 rounded-2xl pointer-events-none"></div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/10 rounded-full blur-md animate-pulse pointer-events-none"></div>
      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-secondary/10 rounded-full blur-lg animate-pulse delay-1000 pointer-events-none"></div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative bg-enhanced bg-slate-50 py-20 md:py-28 mt-16 overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-primary/6 rounded-full blur-3xl will-change-transform"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/6 rounded-full blur-3xl will-change-transform"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/4 rounded-full blur-2xl will-change-transform"></div>
      </div>
      
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 bg-geometric opacity-30 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Content - Left Aligned */}
          <div className="flex-1 text-left max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Connect with<br />
              trusted handymen<br />
              and professionals<br />
              in your area.
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-lg">
              Your one-stop platform for reliable home, auto, health, and business services.
            </p>
            
            {/* Professional Search Bar */}
            <SearchBar variant="hero" className="max-w-2xl" />
          </div>

          {/* Professional Team Illustration - Right Side */}
          <div className="flex-1 max-w-xl lg:max-w-2xl">
            <ProfessionalTeamIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
