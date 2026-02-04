import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const success = await login(email, password);
      if (success) {
        // Get the user object to check their role
        setTimeout(() => {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            // Redirect based on role
            if (user.role === 'provider') {
              navigate("/provider-dashboard");
            } else {
              // Users and admins go to user dashboard for now
              navigate("/user-dashboard");
            }
          }
        }, 500);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
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
                  Welcome Back to HandySwift
                </h2>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Continue your journey of connecting with trusted professionals across Nigeria.
                </p>
                
                {/* Benefits */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                    <span className="text-lg">Instant access to services</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                    <span className="text-lg">Track your bookings</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                    <span className="text-lg">Manage your profile</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="flex items-center justify-center bg-slate-50 px-4 py-12 lg:px-12">
              <div className="w-full max-w-md">
                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl text-slate-900 mb-3">
                      Welcome Back!
                    </h1>
                    <p className="text-slate-600">
                      Login to continue using HandySwift.
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  {/* Demo Credentials */}
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-900 mb-2">Demo Account:</p>
                    <p className="text-xs text-blue-700">Email: john@example.com</p>
                    <p className="text-xs text-blue-700">Password: Test123!</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-slate-900 mb-2 block">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="h-12 rounded-xl border-slate-300 focus:border-primary focus:ring-primary/20"
                        required
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="password" className="text-slate-900">
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <button
                          type="button"
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="h-12 rounded-xl border-slate-300 focus:border-primary focus:ring-primary/20 pr-12"
                          required
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

                    {/* Remember Me */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                      />
                      <label htmlFor="remember" className="text-sm text-slate-600">
                        Remember me
                      </label>
                    </div>

                    {/* Login Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-[#007AFF] hover:bg-[#007AFF]/90 active:bg-[#D3D3D3] text-white rounded-xl shadow-md hover:shadow-lg transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-slate-200"></div>
                    <span className="px-4 text-sm text-slate-500">or</span>
                    <div className="flex-1 border-t border-slate-200"></div>
                  </div>

                  {/* Footer */}
                  <div className="text-center">
                    <p className="text-slate-600">
                      Don't have an account?{" "}
                      <button
                        onClick={() => navigate("/signup")}
                        className="text-primary hover:underline"
                      >
                        Sign up here
                      </button>
                    </p>
                  </div>

                  {/* Provider Login Link */}
                  <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-600">
                      Are you a service provider?{" "}
                      <button
                        onClick={() => navigate("/provider-signup")}
                        className="text-primary hover:underline"
                      >
                        Join as a Provider
                      </button>
                    </p>
                  </div>
                </div>

                {/* Mobile Image Preview */}
                <div className="lg:hidden mt-6 text-center">
                  <p className="text-sm text-slate-500">
                    Trusted by 50,000+ customers across Nigeria
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