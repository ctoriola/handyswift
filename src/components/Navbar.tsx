import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Menu, User, MessageSquare, LogOut, Settings, Briefcase, LayoutDashboard, FileText } from "lucide-react";
import handySwiftLogo from 'figma:asset/528d117dd6547715c37a15b97bf509ea3d26622d.png';
import userPhoto from 'figma:asset/2a28796b137397043b571617798c141af8759769.png';
import { useAuth } from "../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isProvider } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks: { label: string; href: string }[] = [];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg" 
          : "bg-white/90 backdrop-blur-lg border-b border-slate-200/50 shadow-sm"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center cursor-pointer group" onClick={() => navigate('/')}>
              <img 
                src={handySwiftLogo} 
                alt="HandySwift Logo" 
                className="h-7 md:h-8 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Auth Buttons / User Profile - Desktop */}
            <div className="hidden md:flex items-center space-x-3 ml-auto">
              {isAuthenticated && user ? (
                <>
                  {/* Post a Job Button - Hide for providers */}
                  {!isProvider && (
                    <Button 
                      variant="outline" 
                      className="text-slate-700 hover:text-primary hover:bg-primary/5 border-slate-300 rounded-xl"
                      onClick={() => navigate('/post-job')}
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Post a Job
                    </Button>
                  )}

                  {/* Messages Icon */}
                  <button
                    onClick={() => navigate('/messages')}
                    className="relative p-2 text-slate-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    title="Messages"
                  >
                    <MessageSquare className="w-5 h-5" />
                    {/* Message notification badge */}
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* User Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={`flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-xl transition-colors ${isProvider ? 'bg-green-50' : ''}`}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isProvider ? 'bg-green-100' : 'bg-primary/20'}`}>
                          <User className={`w-5 h-5 ${isProvider ? 'text-green-700' : 'text-primary'}`} />
                        </div>
                        <span className="text-slate-900 text-sm font-medium">{user.full_name}</span>
                        {isProvider && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Provider
                          </span>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className={`px-2 py-1.5 ${isProvider ? 'bg-green-50' : ''}`}>
                        <p className="text-sm font-medium text-slate-900">{user.full_name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      {isProvider ? (
                        <>
                          <DropdownMenuItem onClick={() => navigate('/provider-dashboard')}>
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/provider-profile-edit')}>
                            <User className="w-4 h-4 mr-2" />
                            My Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/provider-jobs')}>
                            <FileText className="w-4 h-4 mr-2" />
                            My Jobs
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/messages')}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Messages
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => navigate('/user-dashboard')}>
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/messages')}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Messages
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-slate-700 hover:text-primary hover:bg-primary/5"
                    onClick={() => navigate('/login')}
                  >
                    Log In
                  </Button>
                  <Button 
                    className="bg-[#007AFF] hover:bg-[#007AFF]/90 active:bg-[#D3D3D3] text-white rounded-xl shadow-sm hover:shadow-md transition-all"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="p-2 hover:bg-primary/5 rounded-lg transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-700" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-white/98 backdrop-blur-xl border-b border-slate-200 shadow-2xl md:hidden animate-in slide-in-from-top duration-300"
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-2">
              {isAuthenticated && user ? (
                <>
                  {/* User Profile - Mobile */}
                  <div className={`flex items-center gap-3 p-3 rounded-xl mb-2 ${isProvider ? 'bg-green-50' : 'bg-slate-50'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isProvider ? 'bg-green-100' : 'bg-primary/20'}`}>
                      <User className={`w-5 h-5 ${isProvider ? 'text-green-700' : 'text-primary'}`} />
                    </div>
                    <div>
                      <p className="text-slate-900">{user.full_name}</p>
                      <p className="text-xs text-slate-500">
                        {isProvider ? 'Service Provider' : `${user.membershipType} Member`}
                      </p>
                    </div>
                  </div>
                  
                  {isProvider ? (
                    <>
                      <Button 
                        variant="ghost" 
                        className="text-slate-700 hover:text-primary justify-start hover:bg-slate-50 rounded-xl"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/provider-dashboard');
                        }}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>

                      <Button 
                        variant="ghost" 
                        className="text-slate-700 hover:text-primary justify-start hover:bg-slate-50 rounded-xl"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/provider-profile-edit');
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                      </Button>

                      <Button 
                        variant="ghost" 
                        className="text-slate-700 hover:text-primary justify-start hover:bg-slate-50 rounded-xl"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/provider-jobs');
                        }}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        My Jobs
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="ghost" 
                      className="text-slate-700 hover:text-primary justify-start hover:bg-slate-50 rounded-xl"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/user-dashboard');
                      }}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  )}
                  
                  {!isProvider && (
                    <Button 
                      variant="ghost" 
                      className="text-slate-700 hover:text-primary justify-start hover:bg-slate-50 rounded-xl"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/post-job');
                      }}
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Post a Job
                    </Button>
                  )}

                  <Button 
                    variant="ghost" 
                    className="text-slate-700 hover:text-primary justify-start hover:bg-slate-50 rounded-xl"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/messages');
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                  </Button>

                  <div className="border-t border-slate-200 my-2"></div>

                  <Button 
                    variant="ghost" 
                    className="text-red-600 hover:text-red-700 justify-start hover:bg-red-50 rounded-xl"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  {/* Auth Buttons - Mobile */}
                  <Button 
                    variant="ghost" 
                    className="text-slate-700 hover:text-primary justify-start hover:bg-slate-50 rounded-xl"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/login');
                    }}
                  >
                    Log In
                  </Button>
                  <Button 
                    className="bg-[#007AFF] hover:bg-[#007AFF]/90 active:bg-[#D3D3D3] text-white rounded-xl justify-start shadow-sm"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/signup');
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}