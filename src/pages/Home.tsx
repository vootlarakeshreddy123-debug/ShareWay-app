import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  Package, 
  ShoppingBag, 
  PlusCircle, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Shield,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { MapWrapper } from '@/components/ui/Map';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';

const CATEGORIES = [
  { id: 'rides', label: 'Share Ride', icon: Car, color: 'bg-blue-500' },
  { id: 'parcels', label: 'Send Parcel', icon: Package, color: 'bg-orange-500' },
  { id: 'grocery', label: 'Grocery', icon: ShoppingBag, color: 'bg-green-500' },
  { id: 'medicine', label: 'Medicine', icon: PlusCircle, color: 'bg-red-500' },
];

const MOCK_ROUTES = [
  {
    id: '1',
    user: 'Rahul S.',
    origin: 'Hitech City',
    destination: 'Secunderabad',
    time: 'Today, 6:00 PM',
    seats: 3,
    fare: 150,
    type: 'Carpool',
    rating: 4.8
  },
  {
    id: '2',
    user: 'Priya K.',
    origin: 'Gachibowli',
    destination: 'Airport',
    time: 'Today, 8:30 PM',
    seats: 2,
    fare: 450,
    type: 'SUV',
    rating: 4.9
  },
  {
    id: '3',
    user: 'Amit V.',
    origin: 'Kukatpally',
    destination: 'Banjara Hills',
    time: 'Tomorrow, 9:00 AM',
    seats: 4,
    fare: 120,
    type: 'Hatchback',
    rating: 4.7
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('rides');
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Left Column: Map & Primary Stats */}
      <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
          Route <span className="text-blue-600">Overview</span>
        </h2>
        
        {/* Large Bold Map Container */}
        <div className="flex-1 min-h-[400px] border-4 border-black relative overflow-hidden bg-blue-50 shadow-bold-lg">
           <MapWrapper className="h-full w-full opacity-60 mix-blend-multiply" />
           
           {/* Mock Overlay Elements from Design */}
           <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           
           <div className="absolute top-10 left-10 w-full h-full border-l-2 border-b-2 border-black border-dashed opacity-30"></div>

           {/* Floating Map Controls */}
           <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
            <button className="w-10 h-10 bg-white border-4 border-black font-black text-xl flex items-center justify-center shadow-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">+</button>
            <button className="w-10 h-10 bg-white border-4 border-black font-black text-xl flex items-center justify-center shadow-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">-</button>
           </div>

           {/* Custom Markers (Styled like the design) */}
           <div className="absolute top-[60%] left-[20%] -translate-x-1/2 -translate-y-1/2">
             <div className="w-6 h-6 bg-black rotate-45 border-2 border-white"></div>
             <div className="absolute top-8 left-0 whitespace-nowrap bg-white border-2 border-black px-2 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Start: Current</div>
           </div>
        </div>
        
        {/* Stats Row */}
        <div className="h-32 border-4 border-black bg-white flex items-center p-6 gap-6 shadow-bold-lg">
           <div className="text-center">
             <p className="text-[10px] font-black text-gray-400 uppercase">Estimated Arrival</p>
             <p className="text-4xl font-black italic">24 <span className="text-lg">MIN</span></p>
           </div>
           <div className="w-1 h-12 bg-black"></div>
           <div className="text-center">
             <p className="text-[10px] font-black text-gray-400 uppercase">Distance</p>
             <p className="text-4xl font-black italic">18.4 <span className="text-lg">KM</span></p>
           </div>
           <div className="flex-1 flex flex-col justify-center hidden sm:flex">
             <div className="h-4 bg-gray-200 w-full border-2 border-black">
               <div className="h-full bg-blue-500 w-3/4"></div>
             </div>
             <p className="text-[10px] font-black mt-2 uppercase italic">AI MATCHING: 92% Route Efficiency</p>
           </div>
        </div>
      </div>

      {/* Right Column: Activities & Matches */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">
            Pending Matches <span className="text-blue-600">(3)</span>
          </h2>
          <Button variant="link" className="font-black italic text-xs uppercase p-0">View All</Button>
        </div>

        {/* Action Cards */}
        <div className="space-y-6">
          {MOCK_ROUTES.map((route) => (
            <div 
              key={route.id}
              className="bg-white border-4 border-black p-5 flex flex-col gap-4 shadow-bold hover:-translate-y-1 transition-transform group"
            >
              <div className="flex justify-between items-start">
                <div className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">{route.type.toUpperCase()}</div>
                <p className="font-black text-green-600 italic">₹{route.fare}.00</p>
              </div>
              
              <div className="flex gap-4 items-center">
                 <div className="w-14 h-14 bg-gray-100 border-4 border-black flex items-center justify-center overflow-hidden">
                   <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${route.user}`} 
                    alt="avatar" 
                    className="w-full h-full bg-blue-50 p-1"
                  />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-lg font-black uppercase leading-tight truncate">{route.user}</p>
                   <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                     <MapPin size={10} className="text-blue-600" />
                     {route.origin} → {route.destination}
                   </p>
                 </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-black text-white py-4 font-black text-xs uppercase tracking-widest h-auto border-2 border-black hover:bg-white hover:text-black transition-colors"
                  onClick={() => navigate('/rides')}
                >
                  Confirm Match & Route
                </Button>
                <Button variant="outline" className="w-12 h-12 border-4 border-black font-black italic text-xl p-0 hover:bg-red-500 hover:text-white transition-colors">
                  ✕
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Service Icons */}
        <div className="mt-4">
          <p className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Available Sub-Tasks</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => navigate(`/${cat.id === 'rides' ? 'rides' : cat.id === 'parcels' ? 'parcels' : cat.id === 'grocery' || cat.id === 'medicine' ? 'errands' : cat.id}`)}
                className="group flex flex-col items-center gap-2 p-4 border-4 border-black bg-white shadow-bold hover:-translate-y-1 hover:shadow-none transition-all active:translate-y-1"
              >
                <cat.icon size={20} className="group-hover:scale-125 transition-transform" />
                <span className="text-[10px] font-black uppercase italic truncate w-full px-1">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

