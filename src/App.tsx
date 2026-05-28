import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Shell } from './components/layout/Shell';
import Home from './pages/Home';
import Auth from './pages/Auth';
import RideShare from './pages/RideShare';
import ParcelBooking from './pages/ParcelBooking';
import ErrandsBooking from './pages/ErrandsBooking';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Chat from './pages/Chat';
import History from './pages/History';
import Admin from './pages/Admin';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-full" />
          <p className="text-muted-foreground font-medium">ShareWay</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
          
          <Route element={user ? <Shell /> : <Navigate to="/auth" />}>
            <Route path="/" element={<Home />} />
            <Route path="/rides" element={<RideShare />} />
            <Route path="/parcels" element={<ParcelBooking />} />
            <Route path="/errands" element={<ErrandsBooking />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster position="top-center" />
      </BrowserRouter>
    </TooltipProvider>
  );
}
