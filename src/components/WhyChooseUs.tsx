import { Shield, Zap, MapPin } from "lucide-react";

// Custom Naira symbol component
function NairaIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 4v16"/>
      <path d="M18 4v16"/>
      <path d="M6 4l12 16"/>
      <path d="M4 8h16"/>
      <path d="M4 16h16"/>
    </svg>
  );
}

export function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All providers undergo background checks and verification"
    },
    {
      icon: Zap,
      title: "Fast Response Times",
      description: "Get connected with providers within minutes"
    },
    {
      icon: NairaIcon,
      title: "We Don't Take Any Commission",
      description: "All fees and pricing are negotiated directly with service providers"
    },
    {
      icon: MapPin,
      title: "Location-Based Matching",
      description: "Find providers in your area for quick service"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50/60 bg-enhanced relative">
      {/* Additional background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-16 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-16 left-20 w-48 h-48 bg-primary/8 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl text-slate-900 mb-4">
            Why Choose HandySwift?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We're committed to connecting you with the best professionals in Nigeria
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                <feature.icon className="w-8 h-8 text-slate-600 group-hover:text-primary transition-colors duration-300" />
              </div>
              <h3 className="text-xl text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}