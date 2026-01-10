import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { GetStarted } from './pages/GetStarted';
import { ProviderProfile } from './pages/ProviderProfile';
import { PostJob } from './pages/PostJob';
import { UserSignUp } from './pages/UserSignUp';
import { Login } from './pages/Login';
import { ProviderSignUp } from './pages/ProviderSignUp';
import { SearchResults } from './pages/SearchResults';
import { UserDashboard } from './pages/UserDashboard';
import { Messages } from './pages/Messages';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { ProviderJobs } from './pages/ProviderJobs';
import { ProviderProfileEdit } from './pages/ProviderProfileEdit';
import { SendOffer } from './pages/SendOffer';
import { ScrollToTop } from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/provider-signup" element={<ProviderSignUp />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/provider-jobs" element={<ProviderJobs />} />
          <Route path="/provider-profile-edit" element={<ProviderProfileEdit />} />
          <Route path="/send-offer/:jobId" element={<SendOffer />} />
          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}