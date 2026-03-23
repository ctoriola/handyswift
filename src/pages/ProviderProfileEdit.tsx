import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { 
  Star, 
  MapPin, 
  CheckCircle2,
  Upload,
  Plus,
  X,
  Briefcase,
  Award,
  Clock,
  TrendingUp,
  Camera,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/api";

interface ProviderProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profilePhoto?: string;
  specialization?: string[];
}

export function ProviderProfileEdit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  
  const [formData, setFormData] = useState<ProviderProfileData>({
    id: '',
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    profilePhoto: '',
    specialization: [],
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const serviceCategories = [
    "Home Repairs & Maintenance",
    "Professional Cleaning",
    "Auto Services",
    "Electrical Services",
    "Plumbing Services",
    "Carpentry & Woodwork",
    "Painting & Decoration",
    "Beauty & Wellness",
    "Health Services",
    "Security Services",
    "Gardening & Landscaping",
    "Appliance Repair",
    "Other Services"
  ];

  // Fetch provider profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await authAPI.getProfile(token);
        console.log('Profile response:', response);
        
        // Handle both response.data and direct response
        const profileData = response.data || response;
        
        if (response.success && profileData) {
          setFormData({
            id: profileData.id || '',
            name: profileData.name || profileData.full_name || '',
            email: profileData.email || '',
            phone: profileData.phone || profileData.phone_number || '',
            location: profileData.location || profileData.city || '',
            bio: profileData.bio || '',
            profilePhoto: profileData.profilePhoto || profileData.profile_photo_url || '',
            specialization: profileData.specialization || [],
          });
          
          console.log('Form data set to:', {
            name: profileData.name || profileData.full_name,
            specialization: profileData.specialization
          });
          
          // Set selected category from user data
          if (profileData.specialization && profileData.specialization.length > 0) {
            setSelectedCategory(profileData.specialization[0]);
          }
        } else {
          setError('Failed to load profile data');
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError('Error loading profile. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    // Validation
    if (!formData.name.trim()) {
      setError('Full name is required');
      setSaving(false);
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      setSaving(false);
      return;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      setSaving(false);
      return;
    }
    if (!selectedCategory) {
      setError('Please select a service category');
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await authAPI.updateProfile(token, {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        specialization: [selectedCategory],
      });

      if (response.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          navigate('/provider-dashboard');
        }, 2000);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <div className="flex items-center justify-center pt-32 pb-12">
            <Loader className="w-8 h-8 text-primary animate-spin" />
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="inline-block px-4 py-1.5 bg-secondary/20 rounded-full mb-4">
                <p className="text-sm text-white">Profile Management</p>
              </div>
              <h1 className="text-4xl md:text-5xl text-white mb-4">
                Edit Your Profile
              </h1>
              <p className="text-xl text-white/90">
                Keep your profile updated to attract more clients
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-900">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2 mb-6">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-900">{success}</p>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
                <h2 className="text-2xl text-slate-900 mb-6">Basic Information</h2>
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-2 h-12 rounded-xl"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="mt-2 h-12 rounded-xl bg-slate-100 text-slate-600"
                    />
                    <p className="text-sm text-slate-500 mt-2">Email cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-2 h-12 rounded-xl"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-2 h-12 rounded-xl"
                      placeholder="e.g., Lagos, Nigeria"
                    />
                  </div>
                </div>
              </div>

              {/* Service Category */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
                <h2 className="text-2xl text-slate-900 mb-6">Service Category</h2>
                <p className="text-slate-600 mb-4">
                  Select your primary service category. This helps clients find you and determines which job requests you'll see.
                </p>
                
                <div>
                  <Label htmlFor="category">Primary Service Category *</Label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setError('');
                    }}
                    className="w-full mt-2 h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {serviceCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* About */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
                <h2 className="text-2xl text-slate-900 mb-6">About Me</h2>
                <div>
                  <Label htmlFor="bio">Professional Summary</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={5}
                    className="mt-2 rounded-xl resize-none"
                    placeholder="Tell clients about your experience, skills, and what makes you unique..."
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    This appears at the top of your profile. Make it compelling!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4">
                <Button
                  type="button"
                  onClick={() => navigate('/provider-dashboard')}
                  variant="outline"
                  className="flex-1 h-12 border-slate-300 rounded-xl"
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white rounded-xl disabled:bg-primary/50"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}
