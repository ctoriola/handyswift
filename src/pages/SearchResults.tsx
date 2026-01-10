import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";
import { SearchBar } from "../components/SearchBar";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Star, MapPin, CheckCircle2, SlidersHorizontal, Grid3x3, List } from "lucide-react";
import { useState } from "react";

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

const allProviders: Provider[] = [
  {
    id: 1,
    name: "Adebayo Ogundimu",
    verified: true,
    service: "Plumbing Repairs & Home Maintenance",
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
    service: "Professional Cleaning Services",
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
    service: "Auto Mechanic & Car Repair",
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
    service: "Beauty & Wellness Services",
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
    service: "Electrical Services & Installation",
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
    service: "Health Services & Home Nursing",
    rating: 4.9,
    reviewCount: 178,
    location: "Abuja",
    price: "₦7,000",
    image: "https://images.unsplash.com/photo-1758691463087-43ac1462410f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsJTIwd29ya2VyfGVufDF8fHx8MTc2MTYwNzA1NHww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 7,
    name: "Tunde Balogun",
    verified: true,
    service: "Carpentry & Furniture Services",
    rating: 4.7,
    reviewCount: 95,
    location: "Lagos",
    price: "₦5,500",
    image: "https://images.unsplash.com/photo-1740754699699-c8b4b1635faf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoYW5keW1hbiUyMHdvcmtlcnxlbnwxfHx8fDE3NjE2MDcwNTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 8,
    name: "Aisha Abdullahi",
    verified: true,
    service: "House Cleaning & Deep Cleaning",
    rating: 4.9,
    reviewCount: 134,
    location: "Abuja",
    price: "₦4,000",
    image: "https://images.unsplash.com/photo-1679137315174-ff25263f2e1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjbGVhbmVyJTIwc2VydmljZXxlbnwxfHx8fDE3NjE2MDcwNTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 9,
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
    id: 10,
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

export function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const filteredProviders = allProviders.filter(provider => {
    const query = searchQuery.toLowerCase();
    return (
      provider.name.toLowerCase().includes(query) ||
      provider.service.toLowerCase().includes(query) ||
      provider.location.toLowerCase().includes(query)
    );
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
                Search Results
              </h1>
              <p className="text-lg text-slate-600">
                {filteredProviders.length} {filteredProviders.length === 1 ? 'provider' : 'providers'} found for "{searchQuery}"
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* View Toggle for Mobile */}
          {filteredProviders.length > 0 && (
            <div className="md:hidden flex items-center justify-end mb-6">
              <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-slate-500'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'text-slate-500'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {filteredProviders.length > 0 ? (
            <div className={`${
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6'
                : 'flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6'
            }`}>
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className={`group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 ${
                    viewMode === 'list' ? 'md:flex-none' : ''
                  }`}
                >
                  {/* Provider Image */}
                  <div className={`relative bg-slate-100 overflow-hidden ${
                    viewMode === 'grid' ? 'h-40 md:h-64' : 'h-48 md:h-64'
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
                  <div className="p-6">
                    {/* Name */}
                    <h3 className="text-xl text-slate-900 mb-1">{provider.name}</h3>

                    {/* Service */}
                    <p className="text-slate-600 mb-4">{provider.service}</p>

                    {/* Rating and Location */}
                    <div className="flex items-center justify-between mb-5 pb-5 border-b border-slate-100">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-slate-900">{provider.rating}</span>
                        <span className="text-slate-500 text-sm">({provider.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{provider.location}</span>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Starting from</p>
                        <p className="text-2xl text-primary">{provider.price}</p>
                      </div>
                      <Button 
                        type="button"
                        onClick={() => navigate(`/provider/${provider.id}`, { state: { provider } })}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl shadow-sm hover:shadow-md transition-all w-full md:w-auto"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-2xl text-slate-900 mb-2">No providers found</h3>
              <p className="text-slate-600 mb-6">
                We couldn't find any providers matching "{searchQuery}". Try searching for something else.
              </p>
              <Button onClick={() => navigate('/get-started')} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl">
                Browse All Providers
              </Button>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}