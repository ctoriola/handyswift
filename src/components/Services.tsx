import { ArrowRight, Home, Car, Sparkles, HeartPulse, Wrench, Shield, Scissors, ChevronLeft, ChevronRight, Bug } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

export function Services() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const services = [
    {
      icon: Home,
      title: "Home Repairs",
      description: "Plumbing, electrical, carpentry, and more",
      category: "Home Repairs"
    },
    {
      icon: Car,
      title: "Automotive Services",
      description: "Car repair, maintenance, and roadside assistance",
      category: "Auto Services"
    },
    {
      icon: Sparkles,
      title: "Personal & Lifestyle",
      description: "Beauty, fitness, tutoring, and personal care",
      category: "Beauty & Wellness"
    },
    {
      icon: Scissors,
      title: "Barbers & Grooming",
      description: "Professional haircuts, styling, and grooming",
      category: "Barbers"
    },
    {
      icon: HeartPulse,
      title: "Health & Emergency",
      description: "Medical care, first aid, and wellness services",
      category: "Health Services"
    },
    {
      icon: Wrench,
      title: "Technical Repairs",
      description: "IT support, gadget repair, and tech solutions",
      category: "Technical Repairs"
    },
    {
      icon: Bug,
      title: "Fumigation & Pest Control",
      description: "Professional pest control and fumigation services",
      category: "Fumigation"
    }
  ];

  const handleServiceClick = (category: string) => {
    navigate('/get-started', { state: { selectedCategory: category } });
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
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

    // Update scroll buttons visibility
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );

    // Calculate current index for dot indicators
    const itemWidth = 280 + 16; // card width + gap
    const newIndex = Math.round(container.scrollLeft / itemWidth);
    setCurrentIndex(newIndex);
  };

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const itemWidth = 280 + 16; // card width + gap
    container.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/30 to-white relative overflow-hidden">
      {/* Subtle background enhancement */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl text-slate-900 mb-4">
            We've Got You Covered
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            From home repairs to personal care, find verified professionals for every service you need
          </p>
        </div>

        {/* Desktop Grid - Hidden on Mobile */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => handleServiceClick(service.category)}
              className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer will-change-transform"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 will-change-transform">
                <service.icon className="w-7 h-7 text-primary group-hover:text-secondary transition-colors duration-300" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
              
              {/* CTA Link */}
              <button 
                className="flex items-center text-primary group-hover:text-secondary transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleServiceClick(service.category);
                }}
              >
                <span className="mr-2">Find Providers</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300 will-change-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Mobile/Tablet Carousel */}
        <div className="lg:hidden relative">
          {/* Scroll Buttons */}
          {canScrollLeft && currentIndex > 0 && (
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
            {services.map((service, index) => (
              <div
                key={index}
                onClick={() => handleServiceClick(service.category)}
                className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex-shrink-0 w-[280px] md:w-[320px] snap-start"
              >
                {/* Icon Container */}
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <service.icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors duration-300" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 mb-4 leading-relaxed text-sm">{service.description}</p>
                
                {/* CTA Link */}
                <button 
                  className="flex items-center text-primary group-hover:text-secondary transition-colors duration-300 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceClick(service.category);
                  }}
                >
                  <span className="mr-2">Find Providers</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            ))}
          </div>

          {/* Scroll Indicator Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === index ? 'bg-primary w-6' : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to ${services[index].title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}