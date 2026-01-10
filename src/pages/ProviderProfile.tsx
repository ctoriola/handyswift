import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";
import { Button } from "../components/ui/button";
import { Star, MapPin, CheckCircle2, Award, Clock, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState } from "react";

export function ProviderProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider;

  // Default provider data if none is passed
  const defaultProvider = {
    id: 1,
    name: "Adebayo Ogundimu",
    verified: true,
    service: "Home Repairs & Maintenance",
    rating: 4.9,
    reviewCount: 127,
    location: "Lagos",
    price: "₦3,000",
    image: "https://images.unsplash.com/photo-1740754699699-c8b4b1635faf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoYW5keW1hbiUyMHdvcmtlcnxlbnwxfHx8fDE3NjE2MDcwNTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    yearsExperience: 8,
    completedJobs: 450,
    responseTime: "Within 2 hours",
    about: "Professional handyman with over 8 years of experience in home repairs and maintenance. Specialized in plumbing, electrical work, carpentry, and general home improvements. Committed to delivering quality service and customer satisfaction.",
    services: [
      "Plumbing repairs and installation",
      "Electrical wiring and fixtures",
      "Carpentry and furniture assembly",
      "Painting and wall repairs",
      "Door and window installation",
      "General home maintenance"
    ],
    certifications: [
      "Certified Plumber - Lagos State",
      "Electrical Safety Training",
      "First Aid and Safety Certified"
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwcmVwYWlyJTIwd29ya3xlbnwxfHx8fDE3NjE2MDcwNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmluZyUyMHdvcmt8ZW58MXx8fHwxNzYxNjA3MDU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwd29ya3xlbnwxfHx8fDE3NjE2MDcwNTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJwZW50cnklMjB3b3JrfGVufDF8fHx8MTc2MTYwNzA1OXww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    reviews: [
      {
        id: 1,
        name: "Chioma Adeleke",
        rating: 5,
        date: "2 weeks ago",
        comment: "Excellent work! Fixed my plumbing issue quickly and professionally. Highly recommend!"
      },
      {
        id: 2,
        name: "Tunde Bakare",
        rating: 5,
        date: "1 month ago",
        comment: "Very reliable and skilled. Installed new electrical fixtures in my home. Great service!"
      },
      {
        id: 3,
        name: "Aisha Mohammed",
        rating: 4,
        date: "2 months ago",
        comment: "Good work on furniture assembly. Arrived on time and completed the job efficiently."
      }
    ]
  };

  // Merge provider with default values to ensure all properties exist
  const currentProvider = {
    ...defaultProvider,
    ...provider
  };

  // Ref for the reviews container
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [reviewsVisible, setReviewsVisible] = useState(false);

  // Function to toggle reviews visibility
  const toggleReviews = () => {
    setReviewsVisible(!reviewsVisible);
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reviews carousel state
  const [canScrollReviewsLeft, setCanScrollReviewsLeft] = useState(false);
  const [canScrollReviewsRight, setCanScrollReviewsRight] = useState(true);
  const [activeReview, setActiveReview] = useState(0);

  const scrollReviews = (direction: 'left' | 'right') => {
    const container = reviewsRef.current;
    if (!container) return;

    const scrollAmount = 400;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleReviewsScroll = () => {
    const container = reviewsRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    setCanScrollReviewsLeft(scrollLeft > 10);
    setCanScrollReviewsRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate active review
    const reviewWidth = 400 + 16; // review width + gap
    const currentReview = Math.round(scrollLeft / reviewWidth);
    setActiveReview(Math.min(currentReview, currentProvider.reviews.length - 1));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-50 via-white to-slate-50 pt-24 pb-8 border-b border-slate-100">
          <div className="container mx-auto px-4">
            {/* Back Button */}
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 hover:text-primary mb-6 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to providers</span>
            </button>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Provider Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row gap-6 p-8">
                  {/* Profile Image */}
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <ImageWithFallback
                      src={currentProvider.image}
                      alt={currentProvider.name}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                    {currentProvider.verified && (
                      <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 shadow-lg">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl text-slate-900 mb-2">{currentProvider.name}</h1>
                        <p className="text-xl text-slate-600">{currentProvider.service}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                        <div className="flex flex-col">
                          <div className="text-lg text-slate-900">{currentProvider.rating}</div>
                          <div className="text-xs text-slate-500">Rating</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <Award className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="flex flex-col">
                          <div className="text-lg text-slate-900">{currentProvider.yearsExperience}+</div>
                          <div className="text-xs text-slate-500">Years Exp.</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                        <div className="flex flex-col">
                          <div className="text-lg text-slate-900">{currentProvider.completedJobs}+</div>
                          <div className="text-xs text-slate-500">Jobs Done</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <Clock className="w-5 h-5 text-slate-600 flex-shrink-0" />
                        <div className="flex flex-col">
                          <div className="text-sm text-slate-900 leading-tight">{currentProvider.responseTime}</div>
                          <div className="text-xs text-slate-500">Response</div>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-slate-600">
                      <MapPin className="w-5 h-5 mr-2 text-slate-400" />
                      <span>{currentProvider.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <h2 className="text-2xl text-slate-900 mb-4">About</h2>
                <p className="text-slate-600 leading-relaxed">{currentProvider.about}</p>
              </div>

              {/* Services Offered */}
              {currentProvider.services && currentProvider.services.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                  <h2 className="text-2xl text-slate-900 mb-6">Services Offered</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentProvider.services.map((service, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {currentProvider.certifications && currentProvider.certifications.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                  <h2 className="text-2xl text-slate-900 mb-6">Certifications</h2>
                  <div className="space-y-3">
                    {currentProvider.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio */}
              {currentProvider.portfolio && currentProvider.portfolio.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                  <h2 className="text-2xl text-slate-900 mb-6">Portfolio</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {currentProvider.portfolio.map((image, index) => (
                      <div key={index} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                        <ImageWithFallback
                          src={image}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {currentProvider.reviews && currentProvider.reviews.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl text-slate-900">Reviews</h2>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-slate-900">{currentProvider.rating}</span>
                      <span className="text-slate-500">({currentProvider.reviewCount} reviews)</span>
                    </div>
                  </div>
                  
                  {/* Desktop - Vertical List */}
                  <div className="hidden md:block space-y-6">
                    {currentProvider.reviews.map((review) => (
                      <div key={review.id} className="border-b border-slate-100 last:border-b-0 pb-6 last:pb-0">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-slate-900">{review.name}</h4>
                          <span className="text-sm text-slate-500">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Mobile - Horizontal Carousel */}
                  <div className="md:hidden relative">
                    {/* Navigation Arrows */}
                    {canScrollReviewsLeft && (
                      <button
                        onClick={() => scrollReviews('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
                        aria-label="Previous review"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                    
                    {canScrollReviewsRight && (
                      <button
                        onClick={() => scrollReviews('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
                        aria-label="Next review"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}

                    {/* Scrollable Reviews Container */}
                    <div
                      ref={reviewsRef}
                      onScroll={handleReviewsScroll}
                      className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                      }}
                    >
                      {currentProvider.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="flex-shrink-0 w-[calc(100%-20px)] snap-start bg-slate-50 rounded-xl p-5"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-slate-900">{review.name}</h4>
                            <span className="text-sm text-slate-500">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-slate-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2 mt-4">
                      {currentProvider.reviews.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            index === activeReview ? 'bg-primary' : 'bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6">
                  <div className="mb-6">
                    <p className="text-sm text-slate-500 mb-1">Starting from</p>
                    <p className="text-4xl text-primary mb-2">{currentProvider.price}</p>
                    <p className="text-sm text-slate-500">All fees negotiated directly with provider</p>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl shadow-md hover:shadow-lg transition-all mb-4">
                    Book Now
                  </Button>

                  <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary/5 py-6 rounded-xl transition-all">
                    Send Message
                  </Button>

                  {/* Trust Indicators */}
                  <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>Background verified</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span>Satisfaction guaranteed</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <span>Fast response time</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}