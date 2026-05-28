import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Car, 
  Package, 
  ShoppingBag, 
  Wallet, 
  MessageSquare, 
  User, 
  ShieldCheck, 
  Sun, 
  Moon 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Car, label: 'Rides', path: '/rides' },
  { icon: Package, label: 'Parcels', path: '/parcels' },
  { icon: ShoppingBag, label: 'Errands', path: '/errands' },
  { icon: MessageSquare, label: 'Chat', path: '/chat' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function Shell() {
  const location = useLocation();

  // Theme support
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-white dark:bg-zinc-900 border-r-4 border-black dark:border-white flex-col sticky top-0 h-screen overflow-y-auto z-50 transition-colors duration-200">
        <div className="p-8">
          <Link to="/" className="block">
            <h1 className="text-5xl font-black tracking-tighter leading-none mb-2 hover:text-blue-600 transition-colors">
              SHARE<br/>WAY.
            </h1>
          </Link>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">On your way, anyway.</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            const number = (idx + 1).toString().padStart(2, '0');
            return (
              <Link key={item.path} to={item.path}>
                <div className={cn(
                  "p-4 border-2 transition-all flex items-center justify-between cursor-pointer group",
                  isActive 
                    ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white" 
                    : "hover:bg-gray-100 dark:hover:bg-zinc-800 border-transparent text-foreground"
                )}>
                  <span className={cn(
                    "font-black text-lg italic tracking-tighter",
                    !isActive && "opacity-45 group-hover:opacity-100"
                  )}>
                    {number}. {item.label.toUpperCase()}
                  </span>
                  {isActive && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                </div>
              </Link>
            );
          })}
          <Link to="/admin">
            <div className={cn(
               "p-4 border-2 transition-all flex items-center justify-between cursor-pointer group",
               location.pathname === '/admin' 
                ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white" 
                : "hover:bg-gray-100 dark:hover:bg-zinc-800 border-transparent text-foreground"
            )}>
              <span className={cn(
                 "font-black text-lg italic tracking-tighter",
                 location.pathname !== '/admin' && "opacity-45 group-hover:opacity-100"
              )}>
                08. ADMIN PANEL
              </span>
              {location.pathname === '/admin' && <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>}
            </div>
          </Link>
        </nav>

        <div className="p-6 border-t-4 border-black dark:border-white bg-yellow-300 dark:bg-yellow-400 text-black">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-black text-white flex items-center justify-center font-black italic border-2 border-black">
              US
            </div>
            <div>
              <p className="text-xs font-black uppercase leading-tight">USER SESSION</p>
              <p className="text-[9px] font-bold uppercase opacity-60">Verified Member</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header (Desktop) */}
        <header className="hidden md:flex h-24 bg-white dark:bg-zinc-900 border-b-4 border-black dark:border-white items-center justify-between px-10 sticky top-0 z-40 backdrop-blur-md transition-colors duration-200">
          <div className="flex gap-8">
            <div className="group cursor-pointer">
              <p className="text-[10px] font-black uppercase text-gray-400">Section</p>
              <p className="text-xl font-black italic tracking-tighter uppercase text-foreground">
                {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle Switch */}
            <button
              onClick={toggleTheme}
              className="w-12 h-12 border-4 border-black dark:border-white bg-white dark:bg-zinc-800 text-black dark:text-white flex items-center justify-center font-black shadow-bold hover:bg-yellow-300 dark:hover:bg-yellow-400 dark:hover:text-black hover:scale-105 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <Link to="/rides">
              <div className="px-6 py-2 border-4 border-black dark:border-white bg-white dark:bg-zinc-950 text-foreground font-black text-sm uppercase tracking-tighter hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer shadow-bold active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                + Offer a Ride
              </div>
            </Link>

            <div className="w-10 h-10 border-4 border-black dark:border-white flex items-center justify-center bg-white dark:bg-zinc-800 shadow-bold">
              <div className="w-3.5 h-3.5 bg-red-500 rounded-full animate-pulse"></div>
            </div>

          </div>
        </header>

        {/* Mobile Mini Header */}
        <header className="md:hidden flex h-20 items-center justify-between px-6 border-b-4 border-black dark:border-white bg-white dark:bg-zinc-900 sticky top-0 z-50 transition-colors duration-200">
          <Link to="/" className="text-3xl font-black italic tracking-tighter leading-none text-foreground">
            SW.
          </Link>
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle (Mobile) */}
            <button
               onClick={toggleTheme}
               className="w-10 h-10 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-black dark:text-white flex items-center justify-center cursor-pointer font-black"
            >
               {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <div className="w-8 h-8 rounded-none bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-xs">
              U
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 pb-28 md:pb-12 w-full max-w-[1400px] mx-auto p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile bottom navigation bar */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 border-4 border-black dark:border-white bg-white dark:bg-zinc-900 flex items-center justify-around h-20 z-50 shadow-bold-lg transition-colors duration-200">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="flex-1 h-full">
                <div className={cn(
                  "flex flex-col items-center justify-center h-full transition-all",
                  isActive 
                    ? "bg-black text-white dark:bg-white dark:text-black" 
                    : "text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-zinc-800"
                )}>
                  <item.icon size={22} />
                  <span className="text-[8px] font-black uppercase mt-1 tracking-wider">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
