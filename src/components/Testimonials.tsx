import { Star, User, Quote } from "lucide-react";
import { useState, useEffect } from "react";

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Kemi",
      location: "Lagos",
      rating: 5,
      review: "HandySwift helped me find an amazing plumber within 30 minutes. The service was professional and affordable!"
    },
    {
      id: 2,
      name: "David",
      location: "Abuja",
      rating: 5,
      review: "As a provider, HandySwift has transformed my business. I get consistent bookings and the platform is easy to use."
    },
    {
      id: 3,
      name: "Amina",
      location: "Kano",
      rating: 5,
      review: "The verification process gives me confidence. I know I'm hiring trusted professionals for my home repairs."
    }
  ];

  // Auto-play effect for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setIsTransitioning(false);
      }, 500); // Fade out duration
    }, 15000); // 15 seconds per review

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/8 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl text-slate-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers and providers
          </p>
        </div>

        {/* Desktop Grid - Hidden on Mobile/Tablet */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="group bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 relative"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg opacity-90 group-hover:scale-110 transition-transform duration-300">
                <Quote className="w-6 h-6 text-white" />
              </div>
              
              {/* Rating */}
              <div className="flex items-center mb-5 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              
              {/* Review */}
              <p className="text-slate-700 mb-8 leading-relaxed">
                "{testimonial.review}"
              </p>
              
              {/* User Info */}
              <div className="flex items-center pt-6 border-t border-slate-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-slate-900">{testimonial.name}</h4>
                  <p className="text-slate-500 text-sm">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile/Tablet - Single Review with Auto-Fade */}
        <div className="md:hidden relative">
          {/* Single Review Display */}
          <div className="max-w-md mx-auto">
            <div
              className={`group bg-white rounded-2xl p-8 border border-slate-200 shadow-lg relative transition-opacity duration-500 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {/* Quote icon - Fixed positioning to prevent cutoff */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg opacity-90">
                <Quote className="w-6 h-6 text-white" />
              </div>
              
              {/* Rating */}
              <div className="flex items-center mb-5 gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonials[currentIndex].rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              
              {/* Review */}
              <p className="text-slate-700 mb-8 leading-relaxed">
                "{testimonials[currentIndex].review}"
              </p>
              
              {/* User Info */}
              <div className="flex items-center pt-6 border-t border-slate-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-slate-900">{testimonials[currentIndex].name}</h4>
                  <p className="text-slate-500 text-sm">{testimonials[currentIndex].location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicator Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index ? 'bg-primary w-6' : 'bg-slate-300'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}