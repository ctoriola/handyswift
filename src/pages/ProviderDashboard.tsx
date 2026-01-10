import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  Briefcase, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Star, 
  MapPin, 
  User,
  TrendingUp,
  Calendar,
  ArrowRight,
  Zap,
  Crown,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export function ProviderDashboard() {
  const navigate = useNavigate();
  const { user, isProvider } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'30days' | '3months' | '6months'>('30days');
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState('');

  // Redirect if not authenticated or not a provider
  useEffect(() => {
    if (!user || !isProvider) {
      navigate('/login');
    }
  }, [user, isProvider, navigate]);

  // Fetch available jobs for provider
  useEffect(() => {
    const fetchAvailableJobs = async () => {
      try {
        setLoadingJobs(true);
        setJobsError('');
        const token = localStorage.getItem('authToken');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/jobs/available/for-provider`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success && data.data?.jobs) {
          setAvailableJobs(data.data.jobs);
        } else {
          setJobsError(data.message || 'Failed to load available jobs');
        }
      } catch (error: any) {
        console.error('Fetch error:', error);
        setJobsError(error.message || 'Error fetching available jobs. Make sure backend is running on port 5000.');
      } finally {
        setLoadingJobs(false);
      }
    };

    if (user && isProvider) {
      fetchAvailableJobs();
    }
  }, [user, isProvider]);

  // Mock data for ratings performance chart
  const ratingsData30Days = [
    { date: 'Week 1', rating: 4.6 },
    { date: 'Week 2', rating: 4.7 },
    { date: 'Week 3', rating: 4.8 },
    { date: 'Week 4', rating: 4.9 },
  ];

  const ratingsData3Months = [
    { date: 'Month 1', rating: 4.5 },
    { date: 'Month 2', rating: 4.7 },
    { date: 'Month 3', rating: 4.9 },
  ];

  const ratingsData6Months = [
    { date: 'Jan', rating: 4.3 },
    { date: 'Feb', rating: 4.4 },
    { date: 'Mar', rating: 4.5 },
    { date: 'Apr', rating: 4.6 },
    { date: 'May', rating: 4.8 },
    { date: 'Jun', rating: 4.9 },
  ];

  const getRatingsData = () => {
    switch(selectedTimeRange) {
      case '30days': return ratingsData30Days;
      case '3months': return ratingsData3Months;
      case '6months': return ratingsData6Months;
      default: return ratingsData30Days;
    }
  };

  // Mock active chats
  const activeChats = [
    {
      id: 1,
      userName: "Fatima Ibrahim",
      lastMessage: "When can you start the repairs?",
      time: "10 mins ago",
      unread: true
    },
    {
      id: 2,
      userName: "Chidi Okeke",
      lastMessage: "Thanks for the quote!",
      time: "1 hour ago",
      unread: false
    },
    {
      id: 3,
      userName: "Grace Nnamdi",
      lastMessage: "I'll be available tomorrow afternoon",
      time: "3 hours ago",
      unread: true
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="inline-block px-4 py-1.5 bg-secondary/20 rounded-full mb-4">
                <p className="text-sm text-white">Provider Dashboard</p>
              </div>
              <h1 className="text-4xl md:text-5xl text-white mb-4">
                Welcome Back, {user?.full_name}!
              </h1>
              <p className="text-xl text-white/90">
                Manage your jobs, connect with clients, and grow your business
              </p>
            </div>
          </div>
        </section>

        {/* Main Dashboard Content */}
        <div className="container mx-auto px-4 -mt-8 pb-16">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {/* Open Job Requests */}
            <div 
              onClick={() => navigate('/provider-jobs?tab=requested')}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-3xl text-slate-900 mb-1">12</p>
              <p className="text-sm text-slate-600">Open Requests</p>
            </div>

            {/* Active Chats */}
            <div 
              onClick={() => navigate('/messages')}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-3xl text-slate-900 mb-1">8</p>
              <p className="text-sm text-slate-600">Active Chats</p>
            </div>

            {/* Ongoing Jobs */}
            <div 
              onClick={() => navigate('/provider-jobs?tab=ongoing')}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-3xl text-slate-900 mb-1">5</p>
              <p className="text-sm text-slate-600">Ongoing Jobs</p>
            </div>

            {/* Completed Jobs */}
            <div 
              onClick={() => navigate('/provider-jobs?tab=completed')}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-purple-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-3xl text-slate-900 mb-1">127</p>
              <p className="text-sm text-slate-600">Completed Jobs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Performance Insights */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl text-slate-900">Ratings Performance</h3>
                    <p className="text-sm text-slate-600">Track your service quality over time</p>
                  </div>
                </div>
              </div>

              {/* Time Range Selector */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setSelectedTimeRange('30days')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedTimeRange === '30days'
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => setSelectedTimeRange('3months')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedTimeRange === '3months'
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Last 3 Months
                </button>
                <button
                  onClick={() => setSelectedTimeRange('6months')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedTimeRange === '6months'
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Last 6 Months
                </button>
              </div>

              {/* Chart */}
              <div className="w-full" style={{ height: '256px' }}>
                <ResponsiveContainer width="100%" height={256}>
                  <LineChart data={getRatingsData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                    <YAxis domain={[4.0, 5.0]} stroke="#64748b" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rating" 
                      stroke="#1f4e79" 
                      strokeWidth={3}
                      dot={{ fill: '#1f4e79', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Current Rating */}
              <div className="mt-6 p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <span className="text-2xl text-slate-900">4.9</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Current Rating</p>
                    <p className="text-xs text-slate-500">Based on 127 reviews</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">↑ 0.2</p>
                  <p className="text-xs text-slate-500">vs last period</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-xl text-slate-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/provider-profile-edit')}
                  className="w-full justify-start bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200"
                  variant="outline"
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  onClick={() => navigate('/provider-jobs')}
                  className="w-full justify-start bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200"
                  variant="outline"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  View All Jobs
                </Button>
                <Button
                  onClick={() => navigate('/messages')}
                  className="w-full justify-start bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200"
                  variant="outline"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View Messages
                </Button>
                <Button
                  onClick={() => navigate('/get-started')}
                  className="w-full justify-start bg-primary hover:bg-primary/90 text-white"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Browse Services
                </Button>
              </div>

              {/* Provider can also act as user */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-900 mb-2">Need a service?</p>
                <p className="text-xs text-blue-700 mb-3">
                  As a provider, you can also post jobs and hire other professionals
                </p>
                <Button
                  onClick={() => navigate('/post-job')}
                  variant="outline"
                  size="sm"
                  className="w-full text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  Post a Job
                </Button>
              </div>
            </div>
          </div>

          {/* Get Featured Section */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-6 md:p-8 border border-amber-200 shadow-sm mb-8 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-secondary/10 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl text-slate-900 mb-2">Get Featured on HandySwift</h3>
                  <p className="text-slate-700">
                    Boost your visibility and get more job requests by appearing on our homepage and featured sections
                  </p>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* 1 Week Plan */}
                <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span className="text-sm text-slate-600">Starter</span>
                  </div>
                  <div className="mb-4">
                    <p className="text-3xl text-slate-900 mb-1">₦50,000</p>
                    <p className="text-sm text-slate-600">Featured for 1 Week</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Homepage featured section</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Top of search results</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Priority badge</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
                    onClick={() => alert('Feature request submitted! We will contact you shortly.')}
                  >
                    Select Plan
                  </Button>
                </div>

                {/* 2 Weeks Plan - Popular */}
                <div className="bg-white rounded-xl p-6 border-2 border-primary hover:border-primary hover:shadow-xl transition-all duration-300 group cursor-pointer relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs rounded-full shadow-md">
                    Most Popular
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span className="text-sm text-primary">Professional</span>
                  </div>
                  <div className="mb-4">
                    <p className="text-3xl text-slate-900 mb-1">₦70,000</p>
                    <p className="text-sm text-slate-600">Featured for 2 Weeks</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Everything in Starter</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Extended visibility</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Better ROI</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all"
                    onClick={() => alert('Feature request submitted! We will contact you shortly.')}
                  >
                    Select Plan
                  </Button>
                </div>

                {/* 1 Month Plan */}
                <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span className="text-sm text-slate-600">Premium</span>
                  </div>
                  <div className="mb-4">
                    <p className="text-3xl text-slate-900 mb-1">₦120,000</p>
                    <p className="text-sm text-slate-600">Featured for 1 Month</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Everything in Professional</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Maximum exposure</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Best value</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
                    onClick={() => alert('Feature request submitted! We will contact you shortly.')}
                  >
                    Select Plan
                  </Button>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-amber-200">
                <h4 className="text-sm text-slate-900 mb-3">Why get featured?</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>10x more profile views</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>5x more job requests</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>Build trust faster</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Open Job Requests Section */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-slate-900">Open Job Requests</h3>
              <Button
                onClick={() => navigate('/provider-jobs?tab=requested')}
                variant="ghost"
                className="text-primary hover:text-primary/80"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="space-y-4">
              {loadingJobs && (
                <div className="text-center py-8 text-slate-600">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-spin" />
                  Loading job requests...
                </div>
              )}

              {jobsError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-900">{jobsError}</p>
                  </div>
                </div>
              )}

              {!loadingJobs && availableJobs.length === 0 && !jobsError && (
                <div className="text-center py-8">
                  <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600">No job requests available in your specialization</p>
                </div>
              )}

              {!loadingJobs && availableJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 border border-slate-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg text-slate-900">{job.title}</h4>
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">
                          New
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-3 flex-wrap">
                        <div className="flex items-center gap-1 text-slate-600 text-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 text-sm">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {job.timeline === 'urgent' ? 'Urgent' : job.timeline === 'week' ? 'This Week' : job.timeline === 'month' ? 'This Month' : 'Flexible'}
                        </div>
                        <div className="text-slate-600 text-sm font-medium">
                          ₦{job.budget?.toLocaleString() || '0'}
                        </div>
                      </div>
                      <p className="text-slate-600 mb-2 line-clamp-2">{job.description}</p>
                      <p className="text-sm text-slate-500">Category: {job.category}</p>
                    </div>
                    <div className="flex md:flex-col gap-2">
                      <Button
                        onClick={() => navigate(`/provider-job-details/${job.id}`)}
                        className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-white"
                      >
                        View Job
                      </Button>
                      <Button
                        onClick={() => navigate(`/send-offer/${job.id}`)}
                        variant="outline"
                        className="flex-1 md:flex-none border-slate-300 hover:bg-slate-50"
                      >
                        Send Offer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Chats Section */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-slate-900">Active Conversations</h3>
              <Button
                onClick={() => navigate('/messages')}
                variant="ghost"
                className="text-primary hover:text-primary/80"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="space-y-3">
              {activeChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => navigate('/messages')}
                  className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-slate-900">{chat.userName}</h4>
                      {chat.unread && (
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 truncate">{chat.lastMessage}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-500">{chat.time}</p>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all mt-1 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}