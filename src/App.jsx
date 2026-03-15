import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Marketplace from './pages/Marketplace';
import CreateListing from './pages/CreateListing';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ListingDetail from './pages/ListingDetail';
import Leaderboard from './pages/Leaderboard';
import GroupSessions from './pages/GroupSessions';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/listing/:listingId" element={<ListingDetail />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/group-sessions" element={<GroupSessions />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
