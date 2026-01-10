import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { authAPI } from "../services/api";

export function UserSignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, type, checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (!formData.terms) {
      setError('You must accept the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone,
        role: 'user',
      });

      if (response.success) {
        setSuccess(true);
        // Store token in localStorage
        if (response.data?.token) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          navigate('/user-dashboard');
        }, 1500);
      } else {
        setError(response.message || 'Sign up failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Navbar />
        
        {/* Main Content */}
        <div className="pt-20 min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
            {/* Left Column - Image */}
            <div className="hidden lg:block relative bg-slate-900 overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1635221798248-8a3452ad07cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoYW5keW1hbiUyMHBsdW1iZXIlMjByZXBhaXJ8ZW58MXx8fHwxNzYyMTk4NDM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Professional service provider"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/50"></div>
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
                <h2 className="text-4xl lg:text-5xl mb-6 leading-tight">
                  Find Trusted Professionals Anytime, Anywhere
                </h2>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Join thousands of satisfied customers connecting with verified service providers across Nigeria.
                </p>
                
                {/* Benefits */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                    <span className="text-lg">Access to verified professionals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                    <span className="text-lg">Secure payment options</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                    <span className="text-lg">24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sign Up Form */}
            <div className="flex items-center justify-center bg-slate-50 px-4 py-12 lg:px-12">
              <div className="w-full max-w-md">
                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl text-slate-900 mb-3">
                      Create Your HandySwift Account
                    </h1>
                    <p className="text-slate-600">
                      Join our community of trusted users and find reliable professionals anytime, anywhere.
                    </p>
                  </div>

                  {/* Form */}
                  {success && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-green-700">
                      <p className="font-medium">✓ Account created successfully! Redirecting...</p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">
                      <p className="font-medium">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <Label htmlFor="fullName" className="text-slate-900 mb-2 block">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="h-12 rounded-xl border-slate-300 focus:border-primary focus:ring-primary/20"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <Label htmlFor="email" className="text-slate-900 mb-2 block">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-12 rounded-xl border-slate-300 focus:border-primary focus:ring-primary/20"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <Label htmlFor="phone" className="text-slate-900 mb-2 block">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+234 xxx xxx xxxx"
                        value={formData.phone}
                        onChange={handleChange}
                        className="h-12 rounded-xl border-slate-300 focus:border-primary focus:ring-primary/20"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <Label htmlFor="password" className="text-slate-900 mb-2 block">
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleChange}
                          className="h-12 rounded-xl border-slate-300 focus:border-primary focus:ring-primary/20 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <Label htmlFor="confirmPassword" className="text-slate-900 mb-2 block">
                        Confirm Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="h-12 rounded-xl border-slate-300 focus:border-primary focus:ring-primary/20 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={formData.terms}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                      />
                      <label htmlFor="terms" className="text-sm text-slate-600">
                        I agree to HandySwift's{" "}
                        <a href="#" className="text-primary hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    {/* Sign Up Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-[#007AFF] hover:bg-[#007AFF]/90 active:bg-[#D3D3D3] text-white rounded-xl shadow-md hover:shadow-lg transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                  </form>

                  {/* Footer */}
                  <div className="mt-6 text-center">
                    <p className="text-slate-600">
                      Already have an account?{" "}
                      <button
                        onClick={() => navigate("/login")}
                        className="text-primary hover:underline"
                      >
                        Login here
                      </button>
                    </p>
                  </div>
                </div>

                {/* Mobile Image Preview */}
                <div className="lg:hidden mt-6 text-center">
                  <p className="text-sm text-slate-500">
                    Join 50,000+ satisfied customers across Nigeria
                  </p>
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
