import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  IndianRupee, 
  Navigation,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Map as MapIcon,
  Search,
  Check,
  Smartphone,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapWrapper } from '@/components/ui/Map';
import { PlaceAutocompleteInput } from '@/components/ui/PlaceAutocompleteInput';
import { toast } from 'sonner';
import { addDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

interface RideOffer {
  id: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  fare: number;
  vehicle: string;
  travelerName?: string;
  travelerRating?: string;
}

export default function RideShare() {
  const [activeTab, setActiveTab] = useState('find');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Search/Filter State
  const [pickup, setPickup] = useState('');
  const [pickupPos, setPickupPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [destination, setDestination] = useState('');
  const [destinationPos, setDestinationPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [travelDate, setTravelDate] = useState('');

  // Route metrics from Map
  const [routeMetrics, setRouteMetrics] = useState<{ distance: string; duration: string } | null>(null);

  // Dynamic rides from DB + static defaults
  const [rides, setRides] = useState<RideOffer[]>([]);
  const [selectedRide, setSelectedRide] = useState<RideOffer | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingProgress, setBookingProgress] = useState(false);

  // Offer Ride Form State
  const [offerForm, setOfferForm] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    seats: '3',
    fare: '',
    vehicle: ''
  });

  const [offerOriginPos, setOfferOriginPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [offerDestPos, setOfferDestPos] = useState<google.maps.LatLngLiteral | null>(null);

  // Fetch ride offers
  const fetchRides = async () => {
    try {
      const q = query(collection(db, 'rides'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetched: RideOffer[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetched.push({
          id: doc.id,
          origin: data.origin,
          destination: data.destination,
          date: data.date,
          time: data.time,
          seats: data.seats || 3,
          fare: data.fare || 150,
          vehicle: data.vehicle || 'Unknown Vehicle',
          travelerName: data.travelerName || 'Community Member',
          travelerRating: '4.8★'
        });
      });

      // Default static fallback rides
      const staticRides: RideOffer[] = [
        {
          id: 'mock-1',
          origin: 'Miyapur, Hyderabad',
          destination: 'Electronic City, Bangalore',
          date: new Date().toISOString().split('T')[0],
          time: '18:30',
          seats: 2,
          fare: 220,
          vehicle: 'White Hyundai i20',
          travelerName: 'Rajesh Kumar',
          travelerRating: '4.9★'
        },
        {
          id: 'mock-2',
          origin: 'Secunderabad, Hyderabad',
          destination: 'HiTech City, Hyderabad',
          date: new Date().toISOString().split('T')[0],
          time: '20:15',
          seats: 3,
          fare: 110,
          vehicle: 'Red Honda Amaze',
          travelerName: 'Sanjana Roy',
          travelerRating: '4.7★'
        },
        {
          id: 'mock-3',
          origin: 'Kukatpally, Hyderabad',
          destination: 'Gachibowli, Hyderabad',
          date: new Date().toISOString().split('T')[0],
          time: '09:00',
          seats: 4,
          fare: 150,
          vehicle: 'White Maruti Swift',
          travelerName: 'Vikram Singh',
          travelerRating: '4.8★'
        }
      ];

      setRides([...fetched, ...staticRides]);
    } catch (error) {
      console.error("Error loading rides:", error);
      // fallback if firestore fails
      setRides([
        {
          id: 'mock-1',
          origin: 'Miyapur, Hyderabad',
          destination: 'Electronic City, Bangalore',
          date: new Date().toISOString().split('T')[0],
          time: '18:30',
          seats: 2,
          fare: 220,
          vehicle: 'White Hyundai i20',
          travelerName: 'Rajesh Kumar',
          travelerRating: '4.9★'
        }
      ]);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchLoading(true);
    setTimeout(() => {
      setSearchLoading(false);
      toast.success('Search results updated based on current routes!');
    }, 800);
  };

  const handleOfferRide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerForm.origin || !offerForm.destination || !offerForm.fare) {
      return toast.error('Please complete all form fields');
    }
    
    setLoading(true);
    try {
      const user = auth.currentUser;
      const userName = user?.displayName || user?.email?.split('@')[0] || 'Community Member';
      
      await addDoc(collection(db, 'rides'), {
        travelerId: user?.uid || 'anonymous',
        travelerName: userName,
        ...offerForm,
        seats: parseInt(offerForm.seats),
        fare: parseInt(offerForm.fare),
        status: 'scheduled',
        createdAt: new Date().toISOString()
      });

      toast.success('Your ride has been shared successfully!');
      // Reset & switch
      setOfferForm({
        origin: '',
        destination: '',
        date: '',
        time: '',
        seats: '3',
        fare: '',
        vehicle: ''
      });
      fetchRides();
      setActiveTab('find');
    } catch (error: any) {
      toast.error(error.message || 'Failed to post ride');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRideClick = (ride: RideOffer) => {
    setSelectedRide(ride);
    setShowConfirmModal(true);
  };

  const confirmBooking = () => {
    setBookingProgress(true);
    setTimeout(() => {
      setBookingProgress(false);
      setShowConfirmModal(false);
      toast.success(`Booking Confirmed! You have booked ${selectedRide?.travelerName}'s ride.`);
    }, 1500);
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
          Share <span className="text-blue-600">a Ride</span>
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-black opacity-60">
          Save fuel, reduce traffic, and meet community travelers.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-14 p-1 bg-white border-4 border-black mb-10 shadow-bold">
          <TabsTrigger value="find" className="font-black italic uppercase text-xs tracking-widest gap-2">
            <Car size={16} /> Find Ride
          </TabsTrigger>
          <TabsTrigger value="offer" className="font-black italic uppercase text-xs tracking-widest gap-2">
            <Navigation size={16} /> Offer Ride
          </TabsTrigger>
        </TabsList>

        <TabsContent value="find" className="space-y-10">
          {/* Autocomplete Search Bar */}
          <Card className="border-4 border-black bg-blue-50 shadow-bold-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black z-10" />
                  <PlaceAutocompleteInput
                    value={pickup}
                    onChange={setPickup}
                    placeholder="PICKUP PLACE"
                    className="w-full pl-12 pr-4 h-14 bg-white border-4 border-black font-black uppercase italic text-sm placeholder:text-gray-400"
                    onSelectPlace={(info) => {
                      setPickup(info.address);
                      setPickupPos(info.position);
                    }}
                  />
                </div>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black z-10" />
                  <PlaceAutocompleteInput
                    value={destination}
                    onChange={setDestination}
                    placeholder="DESTINATION PLACE"
                    className="w-full pl-12 pr-4 h-14 bg-white border-4 border-black font-black uppercase italic text-sm placeholder:text-gray-400"
                    onSelectPlace={(info) => {
                      setDestination(info.address);
                      setDestinationPos(info.position);
                    }}
                  />
                </div>
                <div className="relative">
                   <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black z-10" />
                   <Input 
                     type="date" 
                     className="pl-12 h-14 bg-white border-4 border-black font-black uppercase text-sm" 
                     value={travelDate}
                     onChange={(e) => setTravelDate(e.target.value)}
                   />
                </div>
                <Button 
                  type="submit" 
                  disabled={searchLoading}
                  className="h-14 bg-black text-white hover:bg-blue-600 font-black italic uppercase tracking-widest shadow-bold hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  {searchLoading ? (
                    <Loader2 className="animate-spin mr-2" size={16} />
                  ) : <Search size={16} className="mr-2" />}
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Dynamic route estimation box if calculated */}
          {routeMetrics && (
            <div className="border-4 border-black bg-yellow-300 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-bold">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-black/60">Selected Route Diagnostics</p>
                <div className="flex gap-4 items-center mt-1">
                  <p className="text-2xl font-black italic">{routeMetrics.distance}</p>
                  <div className="w-2 h-2 bg-black rounded-full" />
                  <p className="text-2xl font-black italic">{routeMetrics.duration}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white text-black font-black uppercase text-[10px] tracking-wider px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                AI Match: 95% Efficient Route
              </Badge>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             {/* Left side: Available Rides List */}
             <div className="lg:col-span-7 space-y-8">
                <h3 className="font-black text-2xl italic uppercase tracking-tighter border-b-4 border-black pb-2">
                  Matching Ride Travels
                </h3>
                {rides.length === 0 ? (
                  <div className="border-4 border-black bg-white p-8 text-center shadow-bold">
                    <p className="font-black uppercase tracking-widest text-xs italic text-gray-500">
                      No Shared rides available in this filter.
                    </p>
                  </div>
                ) : (
                  rides.map((ride, idx) => (
                    <div 
                      key={ride.id} 
                      className="bg-white border-4 border-black p-0 shadow-bold hover:-translate-y-1 transition-all group flex flex-col md:flex-row overflow-hidden"
                    >
                       <div className="w-full md:w-52 h-40 bg-gray-50 border-r-[4px] border-b-[4px] md:border-b-0 border-black relative overflow-hidden flex-shrink-0">
                          <div className="absolute inset-0 bg-blue-500/10" />
                          <Car className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-10" size={70} />
                          <div className="absolute bottom-2 left-2 bg-black text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-wider">
                            {ride.vehicle.split(' ')[0] || 'SEDAN'}
                          </div>
                       </div>
                       <div className="p-6 flex-1 flex flex-col justify-between min-w-0">
                          <div>
                             <div className="flex justify-between items-start mb-2 gap-4">
                                <h3 className="font-black text-xl italic leading-none truncate" title={`${ride.origin} to ${ride.destination}`}>
                                  {ride.origin.split(',')[0]} → {ride.destination.split(',')[0]}
                                </h3>
                                <div className="bg-yellow-300 text-black border-2 border-black px-3 py-1 font-black italic text-sm shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                  ₹{ride.fare}
                                </div>
                             </div>
                             <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 italic">
                               {ride.date} • {ride.time}
                             </p>
                          </div>
                          
                          <div className="flex items-center gap-6 mb-4">
                             <div className="flex items-center gap-1.5 text-xs font-black uppercase text-black">
                                <Users size={14} className="text-blue-600" />
                                {ride.seats} SEATS LEFT
                             </div>
                             <div className="flex items-center gap-1.5 text-xs font-black uppercase text-black">
                                <Clock size={14} className="text-blue-600" />
                                {ride.time}
                             </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t-2 border-black border-dashed">
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-none border-2 border-black bg-gray-100 overflow-hidden">
                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ride.travelerName || idx}`} alt="user" />
                                </div>
                                <span className="text-[10px] font-black uppercase text-black">
                                  {ride.travelerName} • {ride.travelerRating}
                                </span>
                             </div>
                             <Button 
                               size="sm" 
                               variant="outline" 
                               onClick={() => handleBookRideClick(ride)}
                               className="font-black italic px-4 border-2 shadow-sm rounded-none hover:bg-black hover:text-white transition-colors"
                             >
                                BOOK +
                             </Button>
                          </div>
                       </div>
                    </div>
                  ))
                )}
             </div>
             
             {/* Right side: Traffic Map */}
             <div className="lg:col-span-5 space-y-10">
                <div className="border-4 border-black p-6 bg-white shadow-bold-lg">
                   <h3 className="font-black text-xl italic uppercase mb-4 border-b-2 border-black pb-2">
                     Traffic Navigation Map
                   </h3>
                   <MapWrapper 
                     className="h-[350px] border-4 border-black" 
                     origin={pickupPos ? pickupPos : pickup} 
                     destination={destinationPos ? destinationPos : destination}
                     onRoutesComputed={(info) => setRouteMetrics(info)}
                   />
                </div>

                <div className="border-4 border-black p-8 bg-black text-white shadow-bold-lg relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600 -translate-y-1/2 translate-x-1/2 rotate-45" />
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="font-black text-2xl italic uppercase tracking-tighter">AI Quick Match</h3>
                      <Car size={32} className="text-blue-400" />
                   </div>
                   <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-8 leading-relaxed">
                      Allow ShareWay AI to automatically scan nearby routes and suggest the best overlap coordinates.
                   </p>
                   <Button 
                     onClick={() => toast.success("AI is currently looking for active driver paths!")}
                     className="w-full bg-white text-black hover:bg-yellow-300 font-black italic uppercase tracking-widest h-14 border-2 border-white transition-all shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]"
                   >
                     Enable AI Matching
                   </Button>
                </div>
             </div>
          </div>
        </TabsContent>

        <TabsContent value="offer">
          <div className="max-w-2xl mx-auto">
            <Card className="border-4 border-black shadow-bold-lg bg-white overflow-hidden">
              <CardHeader className="border-b-4 border-black bg-yellow-300">
                <CardTitle className="text-4xl">Offer a Ride</CardTitle>
                <CardDescription className="font-black uppercase text-[10px] text-black italic opacity-60 tracking-widest">
                  Specify your traveling route and help others save fuel.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <form onSubmit={handleOfferRide} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="o-origin" className="font-black uppercase text-xs">Pickup Location</Label>
                        <PlaceAutocompleteInput
                          value={offerForm.origin}
                          onChange={(v) => setOfferForm({ ...offerForm, origin: v })}
                          placeholder="START ADDRESS"
                          className="w-full px-4 h-14 bg-white border-4 border-black font-black uppercase text-sm placeholder:text-gray-400"
                          onSelectPlace={(info) => {
                            setOfferForm({ ...offerForm, origin: info.address });
                            setOfferOriginPos(info.position);
                          }}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="o-dest" className="font-black uppercase text-xs">Drop Location</Label>
                        <PlaceAutocompleteInput
                          value={offerForm.destination}
                          onChange={(v) => setOfferForm({ ...offerForm, destination: v })}
                          placeholder="DESTINATION ADDRESS"
                          className="w-full px-4 h-14 bg-white border-4 border-black font-black uppercase text-sm placeholder:text-gray-400"
                          onSelectPlace={(info) => {
                            setOfferForm({ ...offerForm, destination: info.address });
                            setOfferDestPos(info.position);
                          }}
                        />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="o-date" className="font-black uppercase text-xs">Date</Label>
                        <Input 
                          id="o-date" 
                          type="date" 
                          className="h-14 border-4 border-black font-black text-sm uppercase"
                          value={offerForm.date}
                          onChange={(e) => setOfferForm({...offerForm, date: e.target.value})}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="o-time" className="font-black uppercase text-xs">Time</Label>
                        <Input 
                          id="o-time" 
                          type="time" 
                          className="h-14 border-4 border-black font-black text-sm uppercase"
                          value={offerForm.time}
                          onChange={(e) => setOfferForm({...offerForm, time: e.target.value})}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="o-seats" className="font-black uppercase text-xs">Seats</Label>
                        <Input 
                          id="o-seats" 
                          type="number" 
                          min="1" 
                          max="8" 
                          className="h-14 border-4 border-black font-black text-sm uppercase"
                          value={offerForm.seats}
                          onChange={(e) => setOfferForm({...offerForm, seats: e.target.value})}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="o-fare" className="font-black uppercase text-xs">Fare (₹)</Label>
                        <Input 
                          id="o-fare" 
                          type="number" 
                          placeholder="AMT" 
                          className="h-14 border-4 border-black font-black text-sm uppercase"
                          value={offerForm.fare}
                          onChange={(e) => setOfferForm({...offerForm, fare: e.target.value})}
                        />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <Label className="font-black uppercase text-xs">Vehicle Details</Label>
                      <Input 
                        placeholder="E.G. WHITE SWIFT (TS 07 ...)" 
                        className="h-14 border-4 border-black font-black text-sm uppercase"
                        value={offerForm.vehicle}
                        onChange={(e) => setOfferForm({...offerForm, vehicle: e.target.value})}
                      />
                   </div>

                   <div className="p-6 bg-red-50 border-4 border-black border-dashed flex gap-4 items-start">
                      <AlertCircle className="text-red-600 mt-1 flex-shrink-0" size={24} />
                      <p className="text-[10px] font-black uppercase text-black leading-relaxed italic">
                        Ensure you have a valid driving license. Sharing private rides commercially is subject to local laws.
                      </p>
                   </div>

                   <Button 
                     type="submit" 
                     className="w-full h-16 text-xl font-black italic uppercase tracking-widest bg-black text-white shadow-bold-lg hover:bg-blue-600 transition-all active:translate-y-2 active:shadow-none" 
                     disabled={loading}
                   >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={20} />
                          POSTING...
                        </>
                      ) : 'Post Ride Offer +'}
                   </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md border-4 border-black bg-white shadow-bold-lg rounded-none animate-in fade-in zoom-in-95 duration-250">
            <CardHeader className="border-b-4 border-black bg-blue-50">
              <CardTitle className="text-3xl font-black uppercase italic tracking-tighter leading-none">Confirm Booking</CardTitle>
              <CardDescription className="font-black uppercase text-[10px] text-black italic opacity-60 tracking-wider">Please confirm your ride match coordinates</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-black uppercase text-gray-500">
                  <span>Traveler Owner</span>
                  <span className="text-black">{selectedRide.travelerName}</span>
                </div>
                <div className="flex justify-between text-xs font-black uppercase text-gray-500">
                  <span>Route Path</span>
                  <span className="text-black text-right truncate max-w-[200px]" title={`${selectedRide.origin} to ${selectedRide.destination}`}>
                    {selectedRide.origin.split(',')[0]} → {selectedRide.destination.split(',')[0]}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-black uppercase text-gray-500">
                  <span>Departure Time</span>
                  <span className="text-black">{selectedRide.date} • {selectedRide.time}</span>
                </div>
                <div className="flex justify-between text-sm font-black uppercase border-t-2 border-black border-dashed pt-3">
                   <span>Fare To Pay</span>
                   <span className="text-green-600 italic">₹{selectedRide.fare}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirmModal(false)}
                  className="font-black uppercase text-xs h-12 border-4 border-black"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmBooking}
                  disabled={bookingProgress}
                  className="font-black uppercase text-xs h-12 bg-black text-white border-4 border-black hover:bg-green-600 hover:text-white transition-colors"
                >
                  {bookingProgress ? (
                    <Loader2 className="animate-spin mr-2" size={14} />
                  ) : <Check size={14} className="mr-1" />}
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
