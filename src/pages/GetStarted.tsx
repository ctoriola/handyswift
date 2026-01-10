import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PostJobBanner } from "../components/PostJobBanner";
import { PageTransition } from "../components/PageTransition";
import { SearchBar } from "../components/SearchBar";
import { useState, useEffect } from "react";
import { Star, MapPin, CheckCircle2, SlidersHorizontal, ChevronDown, Grid3x3, List } from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../components/ui/dropdown-menu";

interface Provider {
  id: number;
  name: string;
  verified: boolean;
  service: string;
  rating: number;
  reviewCount: number;
  location: string;
  price: string;
  image: string;
}

const mockProviders: Provider[] = [
  {
    id: 1,
    name: "Adebayo Ogundimu",
    verified: true,
    service: "Home Repairs & Maintenance",
    rating: 4.9,
    reviewCount: 127,
    location: "Lagos",
    price: "₦3,000",
    image: "https://images.unsplash.com/photo-1740754699699-c8b4b1635faf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoYW5keW1hbiUyMHdvcmtlcnxlbnwxfHx8fDE3NjE2MDcwNTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    name: "Fatima Aliyu",
    verified: true,
    service: "Professional Cleaning",
    rating: 4.8,
    reviewCount: 89,
    location: "Abuja",
    price: "₦5,000",
    image: "https://images.unsplash.com/photo-1679137315174-ff25263f2e1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjbGVhbmVyJTIwc2VydmljZXxlbnwxfHx8fDE3NjE2MDcwNTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 3,
    name: "Emmanuel Okoro",
    verified: true,
    service: "Auto Mechanic",
    rating: 4.7,
    reviewCount: 156,
    location: "Lagos",
    price: "₦8,000",
    image: "https://images.unsplash.com/photo-1642399299924-c9c97617bf86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwbWVjaGFuaWMlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYxNjA3MDUyfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 4,
    name: "Chioma Nwosu",
    verified: true,
    service: "Beauty & Wellness",
    rating: 4.9,
    reviewCount: 203,
    location: "Port Harcourt",
    price: "₦4,500",
    image: "https://images.unsplash.com/photo-1760038548850-bfc356d88b12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzYWxvbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjE1NTUwODd8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 5,
    name: "Yusuf Mohammed",
    verified: true,
    service: "Electrical Services",
    rating: 4.8,
    reviewCount: 142,
    location: "Kano",
    price: "₦6,500",
    image: "https://images.unsplash.com/photo-1467733238130-bb6846885316?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHByb2Zlc3Npb25hbCUyMHdvcmtlcnxlbnwxfHx8fDE3NjE2MDcwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 6,
    name: "Grace Okonkwo",
    verified: true,
    service: "Health Services",
    rating: 4.9,
    reviewCount: 178,
    location: "Abuja",
    price: "₦7,000",
    image: "https://images.unsplash.com/photo-1758691463087-43ac1462410f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsJTIwd29ya2VyfGVufDF8fHx8MTc2MTYwNzA1NHww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 7,
    name: "Kunle Adeyemi",
    verified: true,
    service: "Barber Services",
    rating: 4.9,
    reviewCount: 245,
    location: "Lagos",
    price: "₦2,500",
    image: "https://images.unsplash.com/photo-1761931403671-d020a14928d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBiYXJiZXIlMjBoYWlyY3V0fGVufDF8fHx8MTc2NDU5MTk5NHww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 8,
    name: "Tunde Balogun",
    verified: true,
    service: "Plumbing Services",
    rating: 4.8,
    reviewCount: 198,
    location: "Abuja",
    price: "₦4,500",
    image: "https://images.unsplash.com/photo-1740754699699-c8b4b1635faf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoYW5keW1hbiUyMHdvcmtlcnxlbnwxfHx8fDE3NjE2MDcwNTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 9,
    name: "Samuel Oluwole",
    verified: true,
    service: "Painting & Decoration",
    rating: 4.9,
    reviewCount: 312,
    location: "Port Harcourt",
    price: "₦5,500",
    image: "https://images.unsplash.com/photo-1747832512459-5566e6d0ee5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXJzaG9wJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2NDU5MTk4OXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 10,
    name: "Ibrahim Musa",
    verified: true,
    service: "Fumigation & Pest Control",
    rating: 4.8,
    reviewCount: 165,
    location: "Lagos",
    price: "₦7,500",
    image: "https://images.unsplash.com/photo-1740754699699-c8b4b1635faf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoYW5keW1hbiUyMHdvcmtlcnxlbnwxfHx8fDE3NjE2MDcwNTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 11,
    name: "Ngozi Eze",
    verified: true,
    service: "Fumigation & Pest Control",
    rating: 4.9,
    reviewCount: 212,
    location: "Abuja",
    price: "₦8,000",
    image: "https://images.unsplash.com/photo-1679137315174-ff25263f2e1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjbGVhbmVyJTIwc2VydmljZXxlbnwxfHx8fDE3NjE2MDcwNTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export function GetStarted() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("highest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Handle category from navigation state
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location.state]);

  const categories = [
    "Home Repairs",
    "Cleaning Services",
    "Auto Services",
    "Technical Repairs",
    "Beauty & Wellness",
    "Barbers",
    "Health Services",
    "Fumigation"
  ];

  const locations = ["Lagos", "Abuja", "Port Harcourt", "Kano"];

  const filteredProviders = mockProviders.filter(provider => {
    // Rating filter
    if (selectedRating && provider.rating < selectedRating) return false;
    
    // Category filter - check if service contains any words from the category
    if (selectedCategory) {
      const categoryWords = selectedCategory.toLowerCase().split(' ');
      const serviceWords = provider.service.toLowerCase();
      const hasMatch = categoryWords.some(word => serviceWords.includes(word));
      if (!hasMatch) return false;
    }
    
    // Location filter
    if (selectedLocation && provider.location !== selectedLocation) return false;
    
    return true;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Navbar />
        
        {/* Hero Section with Search */}
        <section className="bg-gradient-to-br from-slate-50 via-white to-slate-50 pt-24 pb-12 border-b border-slate-100">
          <div className="container mx-auto px-4">
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <SearchBar variant="page" />
            </div>
            
            {/* Page Title */}
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl text-slate-900 mb-3">
                Service Providers
              </h1>
              <p className="text-lg text-slate-600">
                Showing {filteredProviders.length} providers in your area
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Filters Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-5 h-5 text-slate-600" />
                <h2 className="text-xl text-slate-900">Filters</h2>
              </div>
              
              {/* Mobile View Toggle */}
              <div className="md:hidden flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid" ? "bg-white shadow-sm" : "text-slate-500"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "list" ? "bg-white shadow-sm" : "text-slate-500"
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              {/* Service Category Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`rounded-full border-slate-300 hover:border-primary hover:text-primary transition-all ${
                      selectedCategory ? "bg-primary/10 text-primary border-primary" : "bg-white text-slate-700"
                    }`}
                  >
                    {selectedCategory || "Category"}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                    All Categories
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Rating Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`rounded-full border-slate-300 hover:border-primary hover:text-primary transition-all ${
                      selectedRating ? "bg-primary/10 text-primary border-primary" : "bg-white text-slate-700"
                    }`}
                  >
                    {selectedRating ? (selectedRating === 5 ? "5 Star" : `${selectedRating}★ & Up`) : "Rating"}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <DropdownMenuLabel>Minimum Rating</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedRating(null)}>
                    All Ratings
                  </DropdownMenuItem>
                  {[5, 4, 3].map((rating) => (
                    <DropdownMenuItem
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                    >
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {rating === 5 ? "5 Star" : `${rating} & Up`}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Location Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`rounded-full border-slate-300 hover:border-primary hover:text-primary transition-all ${
                      selectedLocation ? "bg-primary/10 text-primary border-primary" : "bg-white text-slate-700"
                    }`}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {selectedLocation || "Location"}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>Select Location</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedLocation(null)}>
                    All Locations
                  </DropdownMenuItem>
                  {locations.map((loc) => (
                    <DropdownMenuItem
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                    >
                      {loc}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="rounded-full border-slate-300 hover:border-primary hover:text-primary transition-all bg-white text-slate-700"
                  >
                    Sort: {sortBy === "highest" ? "Highest Rated" : sortBy === "reviews" ? "Most Reviews" : sortBy === "price-low" ? "Price: Low to High" : "Price: High to Low"}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortBy("highest")}>
                    Highest Rated
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("reviews")}>
                    Most Reviews
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-low")}>
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-high")}>
                    Price: High to Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Filters */}
              {(selectedCategory || selectedRating || selectedLocation) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedRating(null);
                    setSelectedLocation(null);
                  }}
                  className="rounded-full text-slate-600 hover:text-primary"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Provider Grid */}
          <div className={`mb-16 ${ 
            viewMode === "grid" 
              ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6" 
              : "flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6"
          }`}>
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className={`group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 ${
                  viewMode === "list" ? "md:flex-none" : ""
                }`}
              >
                {/* Provider Image */}
                <div className={`relative bg-slate-100 overflow-hidden ${
                  viewMode === "grid" ? "h-40 md:h-64" : "h-48 md:h-64"
                }`}>
                  <ImageWithFallback
                    src={provider.image}
                    alt={provider.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                  />
                  {provider.verified && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-slate-900">Verified</span>
                    </div>
                  )}
                </div>

                {/* Provider Info */}
                <div className={viewMode === "grid" ? "p-3 md:p-6" : "p-4 md:p-6"}>
                  {/* Name */}
                  <h3 className={`text-slate-900 mb-1 ${viewMode === "grid" ? "text-base md:text-xl" : "text-lg md:text-xl"}`}>
                    {provider.name}
                  </h3>

                  {/* Service */}
                  <p className={`text-slate-600 mb-3 md:mb-4 ${viewMode === "grid" ? "text-sm line-clamp-1" : "text-sm"}`}>
                    {provider.service}
                  </p>

                  {/* Rating and Location */}
                  <div className={`flex items-center mb-3 md:mb-5 pb-3 md:pb-5 border-b border-slate-100 ${
                    viewMode === "grid" ? "flex-col gap-2 items-start md:flex-row md:justify-between" : "justify-between"
                  }`}>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                      <span className={`text-slate-900 ${viewMode === "grid" ? "text-sm" : ""}`}>{provider.rating}</span>
                      <span className="text-slate-500 text-xs md:text-sm">({provider.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
                      <span className="text-xs md:text-sm">{provider.location}</span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className={`flex items-center ${viewMode === "grid" ? "flex-col gap-2 items-start md:flex-row md:justify-between" : "justify-between"}`}>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Starting from</p>
                      <p className={`text-primary ${viewMode === "grid" ? "text-lg md:text-2xl" : "text-xl md:text-2xl"}`}>
                        {provider.price}
                      </p>
                    </div>
                    <Button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/provider/${provider.id}`, { state: { provider } });
                      }}
                      className={`bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm hover:shadow-md transition-all ${
                        viewMode === "grid" ? "w-full md:w-auto px-4 py-2 text-sm md:px-6" : "px-5 py-2"
                      }`}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProviders.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-2xl text-slate-900 mb-2">No providers found</h3>
              <p className="text-slate-600">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>

        {/* Post a Job Banner */}
        <PostJobBanner />

        <Footer />
      </div>
    </PageTransition>
  );
}