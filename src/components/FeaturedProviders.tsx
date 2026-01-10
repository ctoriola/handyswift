import { Button } from "./ui/button";
import { Star, MapPin, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

export function FeaturedProviders() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const providers = [
    {
      id: 1,
      name: "Adunni Okafor",
      service: "Home Cleaning",
      rating: 4.9,
      reviews: 127,
      location: "Victoria Island, Lagos",
      image: "https://images.unsplash.com/photo-1709202967828-e1a7823ccdf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwcHJvZmVzc2lvbmFsJTIwb21hbW4lMjBzbWlsaW5nfGVufDF8fHx8MTc1ODY0MTk2OXww&ixlib=rb-4.1.0&q=80&w=1080",
      verified: true
    },
    {
      id: 2,
      name: "Chidi Emeka",
      service: "Auto Mechanic",
      rating: 4.8,
      reviews: 89,
      location: "Ikeja, Lagos",
      image: "https://images.unsplash.com/photo-1733186718279-0936826f09a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwcHJvZmVzc2lvbmFsJTIwbWVjaGFuaWN8ZW58MXx8fHwxNzU4NjQxOTczfDA&ixlib=rb-4.1.0&q=80&w=1080",
      verified: true
    },
    {
      id: 3,
      name: "Fatima Ahmed",
      service: "Hair Stylist",
      rating: 5.0,
      reviews: 156,
      location: "Wuse, Abuja",
      image: "https://images.unsplash.com/photo-1711655371218-7888ff2c6b75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlJTIwcHJvdmlkZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTg2NDE5NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      verified: true
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 350;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    // Update arrow visibility
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate active slide based on scroll position
    const cardWidth = 300 + 16; // card width + gap
    const currentSlide = Math.round(scrollLeft / cardWidth);
    setActiveSlide(Math.min(currentSlide, providers.length - 1));
  };

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl text-slate-900 mb-4">
            Featured Providers
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Meet some of our top-rated professionals ready to help you
          </p>
        </div>

        {/* Desktop Grid - Hidden on Mobile */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <div 
              key={provider.id} 
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-2xl transition-all duration-500 will-change-transform"
            >
              {/* Provider Image */}
              <div className="relative h-80 overflow-hidden bg-slate-100">
                <ImageWithFallback
                  src={provider.image}
                  alt={provider.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform"
                />
                {provider.verified && (
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-slate-900">Verified</span>
                  </div>
                )}
                
                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Provider Info */}
              <div className="p-6">
                <h3 className="text-xl text-slate-900 mb-1">{provider.name}</h3>
                <p className="text-slate-600 mb-4">{provider.service}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-slate-900">{provider.rating}</span>
                  </div>
                  <span className="text-sm text-slate-500">
                    ({provider.reviews} reviews)
                  </span>
                </div>
                
                {/* Location */}
                <div className="flex items-center text-slate-600 mb-6 pb-6 border-b border-slate-100">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                  <span className="text-sm">{provider.location}</span>
                </div>
                
                {/* CTA Button */}
                <Button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/provider/${provider.id}`, { state: { provider } });
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile/Tablet Carousel */}
        <div className="lg:hidden relative">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-1 pb-4"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {providers.map((provider) => (
              <div 
                key={provider.id} 
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-2xl transition-all duration-500 flex-shrink-0 w-[300px] md:w-[350px] snap-start"
              >
                {/* Provider Image */}
                <div className="relative h-72 overflow-hidden bg-slate-100">
                  <ImageWithFallback
                    src={provider.image}
                    alt={provider.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {provider.verified && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-slate-900">Verified</span>
                    </div>
                  )}
                  
                  {/* Gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                
                {/* Provider Info */}
                <div className="p-5">
                  <h3 className="text-lg text-slate-900 mb-1">{provider.name}</h3>
                  <p className="text-slate-600 mb-3 text-sm">{provider.service}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-slate-900 text-sm">{provider.rating}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      ({provider.reviews} reviews)
                    </span>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center text-slate-600 mb-4 pb-4 border-b border-slate-100">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="text-xs">{provider.location}</span>
                  </div>
                  
                  {/* CTA Button */}
                  <Button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/provider/${provider.id}`, { state: { provider } });
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {providers.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === activeSlide ? 'bg-primary' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}