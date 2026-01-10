import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  variant?: 'hero' | 'page';
  className?: string;
}

export function SearchBar({ variant = 'hero', className = '' }: SearchBarProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [location, setLocation] = useState("Use my location");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Organized service suggestions by category
  const searchSuggestions = [
    // Home Services
    "Plumbing repairs",
    "Electrical services", 
    "House cleaning",
    "Deep cleaning",
    "Painting services",
    "Carpet cleaning",
    "Upholstery cleaning",
    "Window cleaning",
    "Laundry services",
    "Ironing services",
    
    // Technical Repairs
    "Air conditioning repair",
    "Refrigerator repair",
    "Washing machine repair",
    "TV repair",
    "Computer repair",
    "Phone repair",
    "Laptop repair",
    "Microwave repair",
    "Dishwasher repair",
    "Generator repair",
    
    // Automotive
    "Car wash",
    "Auto mechanic",
    "Car AC repair",
    "Tire services",
    "Car detailing",
    "Auto electrical",
    "Battery replacement",
    "Oil change",
    
    // Specialized Trades
    "Carpenter services",
    "Handyman services",
    "Tiling services",
    "Roofing services",
    "Welding services",
    "Glass installation",
    "Door installation",
    "Furniture assembly",
    "Cabinet making",
    "Locksmith services",
    
    // Health & Wellness
    "Massage therapy",
    "Physiotherapy",
    "Home nursing",
    "Caregiver services",
    "Fitness trainer",
    
    // Security & Maintenance
    "Security services",
    "CCTV installation",
    "Alarm system installation",
    "Fumigation & Pest Control",
    "Gardening services",
    "Lawn mowing",
    "Pool cleaning",
    "Moving services",
    "Delivery services"
  ];

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationClick = () => {
    setIsGettingLocation(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation("Current location");
          setIsGettingLocation(false);
        },
        (error) => {
          let errorMessage = "Unable to get location";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timeout";
              break;
            default:
              errorMessage = "Location error occurred";
              break;
          }
          
          console.warn("Geolocation error:", errorMessage, error.message);
          setLocation("Enter location");
          setIsGettingLocation(false);
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000
        }
      );
    } else {
      setLocation("Enter location");
      setIsGettingLocation(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={searchRef} style={{ zIndex: 40 }}>
      <div className="bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
        <div className="flex items-center gap-3 p-2">
          {/* Search Input */}
          <div className="flex-1 min-w-0 pl-2">
            <Input 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyPress={handleKeyPress}
              placeholder="Search for services" 
              className="border-0 h-12 bg-transparent focus:ring-0 placeholder:text-slate-500 px-0 text-slate-900"
            />
          </div>
          
          {/* Search Button */}
          <Button 
            onClick={handleSearch}
            className="bg-primary hover:bg-primary/90 h-12 px-6 lg:px-8 rounded-lg transition-all duration-200 hover:shadow-md flex-shrink-0"
          >
            <Search className="w-5 h-5 lg:mr-2 text-white" />
            <span className="hidden lg:inline text-white">Search</span>
          </Button>
        </div>
      </div>
      
      {/* Search Suggestions Dropdown */}
      {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-300 max-h-96 overflow-y-auto" style={{ zIndex: 45 }}>
          {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-5 py-3.5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-center gap-3 group"
            >
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0 group-hover:text-primary transition-colors" />
              <span className="text-slate-700 group-hover:text-slate-900">{suggestion}</span>
            </button>
          ))}
          {filteredSuggestions.length > 10 && (
            <div className="px-5 py-3 text-center text-sm text-slate-500 bg-slate-50">
              +{filteredSuggestions.length - 10} more services available
            </div>
          )}
        </div>
      )}
    </div>
  );
}