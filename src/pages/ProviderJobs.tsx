import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";
import { Button } from "../components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Clock, 
  CheckCircle2, 
  MapPin, 
  User,
  MessageSquare,
  XCircle,
  Calendar,
  Briefcase
} from "lucide-react";
import { useState, useEffect } from "react";

export function ProviderJobs() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'requested';
  const [activeTab, setActiveTab] = useState<'requested' | 'ongoing' | 'completed' | 'cancelled'>(
    tabFromUrl as 'requested' | 'ongoing' | 'completed' | 'cancelled'
  );

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab as 'requested' | 'ongoing' | 'completed' | 'cancelled');
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'requested' | 'ongoing' | 'completed' | 'cancelled') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Mock jobs data
  const requestedJobs = [
    {
      id: 1,
      service: "Plumbing Repair",
      client: "Kemi Adeyemi",
      location: "Victoria Island, Lagos",
      description: "Leaking kitchen sink needs urgent repair",
      postedDate: "2024-01-03",
      status: "New Request"
    },
    {
      id: 2,
      service: "Electrical Installation",
      client: "David Okafor",
      location: "Garki, Abuja",
      description: "Install ceiling fan and fix faulty outlets",
      postedDate: "2024-01-03",
      status: "Offer Sent"
    }
  ];

  const ongoingJobs = [
    {
      id: 3,
      service: "Home Repair",
      client: "Amina Yusuf",
      location: "Ikeja, Lagos",
      description: "Fix broken door lock and cabinet hinges",
      startDate: "2024-01-02",
      status: "In Progress"
    },
    {
      id: 4,
      service: "Carpentry Work",
      client: "Chidi Okeke",
      location: "Lekki, Lagos",
      description: "Custom wardrobe installation",
      startDate: "2024-01-01",
      status: "In Progress"
    }
  ];

  const completedJobs = [
    {
      id: 5,
      service: "Plumbing Services",
      client: "Grace Nnamdi",
      location: "Wuse, Abuja",
      description: "Fixed bathroom leakage and installed new taps",
      completedDate: "2023-12-30",
      rating: 5
    },
    {
      id: 6,
      service: "Electrical Repair",
      client: "Fatima Ibrahim",
      location: "Surulere, Lagos",
      description: "Rewired faulty electrical sockets",
      completedDate: "2023-12-28",
      rating: 5
    }
  ];

  const cancelledJobs = [
    {
      id: 7,
      service: "Painting Services",
      client: "Tunde Balogun",
      location: "Ajah, Lagos",
      description: "Paint 3-bedroom apartment",
      cancelledDate: "2023-12-25",
      reason: "Client cancelled"
    }
  ];

  const renderJobCard = (job: any, type: string) => (
    <div
      key={job.id}
      className="bg-white p-6 border border-slate-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg text-slate-900">{job.service}</h3>
            {type === 'requested' && (
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                job.status === 'New Request' 
                  ? 'bg-green-50 text-green-700'
                  : 'bg-blue-50 text-blue-700'
              }`}>
                {job.status}
              </span>
            )}
            {type === 'ongoing' && (
              <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded-full">
                {job.status}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 mb-3 text-sm">
            <div className="flex items-center gap-1 text-slate-600">
              <User className="w-4 h-4 text-slate-400" />
              {job.client}
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              {job.location}
            </div>
          </div>

          <p className="text-slate-600 mb-3">{job.description}</p>

          <div className="flex items-center gap-1 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            {type === 'requested' && `Posted: ${job.postedDate}`}
            {type === 'ongoing' && `Started: ${job.startDate}`}
            {type === 'completed' && `Completed: ${job.completedDate}`}
            {type === 'cancelled' && `Cancelled: ${job.cancelledDate}`}
          </div>
        </div>

        <div className="flex md:flex-col gap-2">
          {type === 'requested' && (
            <>
              <Button
                onClick={() => navigate(`/messages`)}
                className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-white"
              >
                <MessageSquare className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Contact Client</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 md:flex-none border-slate-300"
              >
                View Details
              </Button>
            </>
          )}
          {type === 'ongoing' && (
            <>
              <Button
                onClick={() => navigate(`/messages`)}
                className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-white"
              >
                <MessageSquare className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Message Client</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 md:flex-none border-slate-300"
              >
                Mark Complete
              </Button>
            </>
          )}
          {type === 'completed' && (
            <>
              <div className="flex items-center justify-center md:justify-start gap-1 text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full border-slate-300"
              >
                View Details
              </Button>
            </>
          )}
          {type === 'cancelled' && (
            <Button
              variant="outline"
              className="w-full border-slate-300"
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="inline-block px-4 py-1.5 bg-secondary/20 rounded-full mb-4">
                <p className="text-sm text-white">Job Management</p>
              </div>
              <h1 className="text-4xl md:text-5xl text-white mb-4">
                My Jobs
              </h1>
              <p className="text-xl text-white/90">
                Track and manage all your job requests and bookings
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Tabs */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 mb-8 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              <button
                onClick={() => handleTabChange('requested')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  activeTab === 'requested'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Requested</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'requested'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {requestedJobs.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('ongoing')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  activeTab === 'ongoing'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Ongoing</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'ongoing'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {ongoingJobs.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('completed')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  activeTab === 'completed'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'completed'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {completedJobs.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('cancelled')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  activeTab === 'cancelled'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Cancelled</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'cancelled'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {cancelledJobs.length}
                </span>
              </button>
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {activeTab === 'requested' && requestedJobs.map(job => renderJobCard(job, 'requested'))}
            {activeTab === 'ongoing' && ongoingJobs.map(job => renderJobCard(job, 'ongoing'))}
            {activeTab === 'completed' && completedJobs.map(job => renderJobCard(job, 'completed'))}
            {activeTab === 'cancelled' && cancelledJobs.map(job => renderJobCard(job, 'cancelled'))}
          </div>

          {/* Empty State */}
          {((activeTab === 'requested' && requestedJobs.length === 0) ||
            (activeTab === 'ongoing' && ongoingJobs.length === 0) ||
            (activeTab === 'completed' && completedJobs.length === 0) ||
            (activeTab === 'cancelled' && cancelledJobs.length === 0)) && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-2xl text-slate-900 mb-2">No jobs found</h3>
              <p className="text-slate-600 mb-6">
                You don't have any {activeTab} jobs at the moment.
              </p>
              <Button
                onClick={() => navigate('/provider-dashboard')}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl"
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}
