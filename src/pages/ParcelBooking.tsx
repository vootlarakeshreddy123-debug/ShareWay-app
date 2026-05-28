import * as React from 'react';
import { useState } from 'react';
import { 
  Package, 
  Weight, 
  MapPin, 
  Camera, 
  AlertCircle,
  Truck,
  Box,
  Gift,
  FileText,
  Smartphone,
  ChevronRight,
  ArrowRight,
  Loader2,
  Check,
  Map as MapIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapWrapper } from '@/components/ui/Map';
import { PlaceAutocompleteInput } from '@/components/ui/PlaceAutocompleteInput';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'docs', label: 'Documents', icon: FileText },
  { id: 'gadgets', label: 'Electronic', icon: Smartphone },
  { id: 'gift', label: 'Gift', icon: Gift },
  { id: 'other', label: 'Other', icon: Box },
];

export default function ParcelBooking() {
  const [loading, setLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState('docs');
  
  // Geolocation and routes tracking state
  const [pickup, setPickup] = useState('');
  const [pickupPos, setPickupPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [destination, setDestination] = useState('');
  const [destinationPos, setDestinationPos] = useState<google.maps.LatLngLiteral | null>(null);

  // Parcel parameters
  const [weight, setWeight] = useState('0.5');
  const [remarks, setRemarks] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  // Route metrics
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  const simulatePhotoUpload = () => {
    setPhotoLoading(true);
    setTimeout(() => {
      setPhotoLoading(false);
      setHasPhoto(true);
      toast.success("Parcel image attached successfully from device camera!");
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !destination) {
      return toast.error("Please select both Pickup and Drop-off locations.");
    }
    setLoading(true);
    setTimeout(() => {
       setLoading(false);
       toast.success('Your parcel delivery request is now live in traveler matchmaking stream!');
       // Reset
       setPickup('');
       setPickupPos(null);
       setDestination('');
       setDestinationPos(null);
       setRemarks('');
       setHasPhoto(false);
       setRouteInfo(null);
    }, 1800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col gap-2">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
          Send <span className="text-blue-600">a Parcel</span>
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-black opacity-60">
          Safe, quick, community-powered courier delivery.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left side Form Columns */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-4 border-black bg-white shadow-bold-lg overflow-hidden">
            <CardHeader className="border-b-4 border-black bg-yellow-300">
               <CardTitle className="text-3xl font-black uppercase italic tracking-tighter leading-none flex items-center gap-2">
                  <Box className="text-black" size={24} />
                  Parcel Details
               </CardTitle>
               <CardDescription className="font-black uppercase text-[10px] text-black italic opacity-60 tracking-wider">
                 Fill coordinates and details of delivery item
               </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                     <Label className="font-black uppercase text-xs tracking-wider">Select Category</Label>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {CATEGORIES.map((cat) => {
                          const IconComp = cat.icon;
                          const isSel = selectedCat === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setSelectedCat(cat.id)}
                              className={cn(
                                "flex flex-col items-center gap-3 p-4 border-4 border-black transition-all font-black text-xs uppercase italic tracking-widest cursor-pointer",
                                isSel 
                                  ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]" 
                                  : "bg-white text-black shadow-bold hover:bg-gray-100"
                              )}
                            >
                               <IconComp size={18} className={cn(isSel ? "text-blue-400" : "text-black")} />
                               <span className="text-[10px]">{cat.label}</span>
                            </button>
                          );
                        })}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <Label htmlFor="p-weight" className="font-black uppercase text-xs tracking-wider">Approx Weight (kg)</Label>
                        <div className="relative">
                           <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-black z-10" size={16} />
                           <Input 
                             id="p-weight"
                             type="number" 
                             value={weight}
                             onChange={(e) => setWeight(e.target.value)}
                             placeholder="0.5" 
                             className="pl-12 h-14 bg-white border-4 border-black font-black uppercase tracking-wider text-sm" 
                           />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <Label className="font-black uppercase text-xs tracking-wider">Parcel Attachment</Label>
                        <Button 
                          variant="outline" 
                          type="button" 
                          disabled={photoLoading}
                          onClick={simulatePhotoUpload}
                          className={cn(
                            "w-full h-14 border-4 border-black font-black uppercase text-xs italic tracking-widest shadow-bold hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all",
                            hasPhoto && "bg-green-100 text-black border-green-600"
                          )}
                        >
                           {photoLoading ? (
                             <Loader2 size={16} className="animate-spin mr-2" />
                           ) : hasPhoto ? (
                             <Check size={16} className="text-green-600 mr-2" />
                           ) : <Camera size={16} className="mr-2" />}
                           {hasPhoto ? "IMAGE ATTACHED" : "TAKE INSTANT PHOTO"}
                        </Button>
                     </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t-4 border-black border-dashed">
                     <div className="space-y-3">
                        <Label className="font-black uppercase text-xs tracking-wider">Pickup Address</Label>
                        <div className="relative">
                           <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 z-10" size={16} />
                           <PlaceAutocompleteInput 
                             value={pickup}
                             onChange={setPickup}
                             placeholder="WHERE DO WE COLLECT?" 
                             className="w-full pl-12 pr-4 h-14 bg-white border-4 border-black font-black uppercase text-sm placeholder:text-gray-400"
                             onSelectPlace={(info) => {
                               setPickup(info.address);
                               setPickupPos(info.position);
                             }}
                           />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <Label className="font-black uppercase text-xs tracking-wider">Drop-off Address</Label>
                        <div className="relative">
                           <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600 z-10" size={16} />
                           <PlaceAutocompleteInput
                             value={destination}
                             onChange={setDestination}
                             placeholder="WHERE IS THE DESTINATION?" 
                             className="w-full pl-12 pr-4 h-14 bg-white border-4 border-black font-black uppercase text-sm placeholder:text-gray-400"
                             onSelectPlace={(info) => {
                               setDestination(info.address);
                               setDestinationPos(info.position);
                             }}
                           />
                        </div>
                     </div>

                     <div className="space-y-3">
                       <Label className="font-black uppercase text-xs tracking-wider">Special Delivery Remarks</Label>
                       <Input 
                         type="text"
                         value={remarks}
                         onChange={(e) => setRemarks(e.target.value)}
                         placeholder="E.G. KEEP PARCEL DRY, CALL RECIPIENT BEFORE DISPATCH"
                         className="h-14 border-4 border-black font-black uppercase tracking-wider text-xs placeholder:text-gray-400"
                       />
                     </div>
                  </div>

                  <div className="p-6 bg-yellow-50 border-4 border-black border-dashed flex gap-4 items-start">
                     <AlertCircle className="text-black shrink-0 mt-0.5" size={24} />
                     <p className="text-[10px] text-black font-black uppercase italic leading-relaxed">
                       Recipients will receive a secure 4-digit OTP code to authorize collection. Traveling package handler retains review rights for security.
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
                         MAKING REQUEST LIVE...
                       </>
                     ) : 'Book Local Delivery +'}
                  </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right side Map and diagnostics Column */}
        <div className="lg:col-span-5 space-y-10">
           
           {/* Navigation track Map */}
           <div className="border-4 border-black p-6 bg-white shadow-bold-lg">
             <h3 className="font-black text-xl italic uppercase mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
               <MapIcon size={18} />
               Delivery Route Finder
             </h3>
             <MapWrapper 
               className="h-[300px] border-4 border-black" 
               origin={pickupPos ? pickupPos : pickup} 
               destination={destinationPos ? destinationPos : destination}
               onRoutesComputed={(info) => setRouteInfo(info)}
             />
           </div>

           {/* Metrics Card if route specified */}
           {routeInfo && (
             <div className="border-4 border-black bg-blue-50 p-6 shadow-bold-lg">
                <h4 className="font-black text-[10px] uppercase text-gray-500 tracking-wider">Expected Courier Trajectory</h4>
                <div className="grid grid-cols-2 gap-4 mt-3">
                   <div className="bg-white border-2 border-black p-3 shadow-bold">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Distance</p>
                      <p className="text-xl font-black italic mt-1">{routeInfo.distance}</p>
                   </div>
                   <div className="bg-white border-2 border-black p-3 shadow-bold">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Est. Travel Time</p>
                      <p className="text-xl font-black italic mt-1">{routeInfo.duration}</p>
                   </div>
                </div>
             </div>
           )}

           <Card className="border-4 border-black bg-yellow-300 p-8 shadow-bold-lg relative overflow-hidden">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none mb-4">Why ShareWay Courier?</h3>
              <ul className="space-y-4">
                 <li className="flex gap-3 text-xs font-black uppercase leading-tight italic">
                    <span className="w-5 h-5 rounded-none bg-black text-white flex items-center justify-center text-[10px] font-black">1</span>
                    Substantially cheaper than commercial freight logistics.
                 </li>
                 <li className="flex gap-3 text-xs font-black uppercase leading-tight italic">
                    <span className="w-5 h-5 rounded-none bg-black text-white flex items-center justify-center text-[10px] font-black">2</span>
                    Instant pick & drop delivery directly via commuting citizens.
                 </li>
                 <li className="flex gap-3 text-xs font-black uppercase leading-tight italic">
                    <span className="w-5 h-5 rounded-none bg-black text-white flex items-center justify-center text-[10px] font-black">3</span>
                    Active live maps GPS trace of package handler travels.
                 </li>
              </ul>
           </Card>

           <Card className="border-4 border-black bg-white shadow-bold-lg shrink-0">
             <CardHeader className="pb-0 border-b-2 border-black bg-gray-50">
               <CardTitle className="text-xs uppercase tracking-wider font-black opacity-60">Commuters Around Your Region</CardTitle>
             </CardHeader>
             <CardContent className="p-6 divide-y-2 divide-black">
                {[
                  { name: "Ketan Trivedi", route: "Madhapur → Secunderabad", seed: "Ketan" },
                  { name: "Ananya Deshmukh", route: "Miyapur → Gachibowli", seed: "Ananya" }
                ].map((commuter, i) => (
                  <div key={i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 hover:bg-yellow-50 transition-colors cursor-pointer group">
                     <div className="w-10 h-10 border-2 border-black bg-gray-200 overflow-hidden flex-shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${commuter.seed}`} alt="user avatar" className="w-full h-full" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-black uppercase text-black leading-none">{commuter.name}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase mt-1.5 italic tracking-tight truncate">{commuter.route}</p>
                     </div>
                     <ChevronRight className="text-black group-hover:translate-x-1 transition-transform" size={16} />
                  </div>
                ))}
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
