import * as React from 'react';
import { useState } from 'react';
import { 
  ShoppingBag, 
  PlusCircle, 
  Truck, 
  Plus, 
  Trash2, 
  Store, 
  MapPin, 
  AlertCircle,
  Stethoscope,
  FileText,
  Clock,
  Navigation,
  Loader2,
  Check,
  CheckCircle2,
  Crosshair,
  Map as MapIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { MapWrapper } from '@/components/ui/Map';
import { PlaceAutocompleteInput } from '@/components/ui/PlaceAutocompleteInput';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ErrandsBooking() {
  const [activeSubTab, setActiveSubTab] = useState('grocery');
  const [items, setItems] = useState([{ name: '', qty: '' }]);
  const [loading, setLoading] = useState(false);

  // Addresses and positions state
  const [groceryStore, setGroceryStore] = useState('');
  const [groceryStorePos, setGroceryStorePos] = useState<google.maps.LatLngLiteral | null>(null);
  
  const [medStore, setMedStore] = useState('');
  const [medStorePos, setMedStorePos] = useState<google.maps.LatLngLiteral | null>(null);

  const [deliveryDrop, setDeliveryDrop] = useState('');
  const [deliveryDropPos, setDeliveryDropPos] = useState<google.maps.LatLngLiteral | null>(null);

  const [deliveryFee, setDeliveryFee] = useState('80');
  const [medicineRemarks, setMedicineRemarks] = useState('');

  // Prescription upload state
  const [fileLoading, setFileLoading] = useState(false);
  const [hasFile, setHasFile] = useState(false);

  // Route metrics from Map
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  const addItem = () => setItems([...items, { name: '', qty: '' }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const handlePrescriptionUpload = () => {
    setFileLoading(true);
    setTimeout(() => {
      setFileLoading(false);
      setHasFile(true);
      toast.success("Prescription JPEG analyzed and attached securely!");
    }, 1500);
  };

  const handleGrocerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryDrop) {
      return toast.error("Please select a Delivery Dropping address first!");
    }
    
    // Validate empty shopping list
    const validItems = items.filter(it => it.name.trim() !== '');
    if (validItems.length === 0) {
      return toast.error("Please add at least one item to your Grocery list.");
    }

    setLoading(true);
    setTimeout(() => {
       setLoading(false);
       toast.success('Grocery Pickup request posted to nearby transit matching!');
       // Reset states
       setGroceryStore('');
       setGroceryStorePos(null);
       setDeliveryDrop('');
       setDeliveryDropPos(null);
       setItems([{ name: '', qty: '' }]);
       setRouteInfo(null);
    }, 1800);
  };

  const handleMedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medStore) {
      return toast.error("Please specify which Pharmacy Store to visit!");
    }
    if (!deliveryDrop) {
      return toast.error("Please input your Delivery Dropping address!");
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Medicine Pickup request is now matching active riders!');
      // Reset
      setMedStore('');
      setMedStorePos(null);
      setDeliveryDrop('');
      setDeliveryDropPos(null);
      setHasFile(false);
      setMedicineRemarks('');
      setRouteInfo(null);
    }, 1800);
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
          Local <span className="text-blue-600">Errands</span>
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-black opacity-60">
          Request grocery shopping or medicine pickups from people traveling in your direction.
        </p>
      </header>

      <Tabs value={activeSubTab} onValueChange={(v) => { setActiveSubTab(v); setRouteInfo(null); }} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-14 p-1 bg-white border-4 border-black mb-10 shadow-bold">
          <TabsTrigger value="grocery" className="font-black italic uppercase text-xs tracking-widest gap-2">
            <ShoppingBag size={16} /> Grocery Pickup
          </TabsTrigger>
          <TabsTrigger value="medicine" className="font-black italic uppercase text-xs tracking-widest gap-2">
            <Stethoscope size={16} /> Medicine Pickup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grocery">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             
             {/* Left Column forms */}
             <div className="lg:col-span-7">
               <Card className="border-4 border-black bg-white shadow-bold-lg overflow-hidden">
                  <div className="h-4 bg-green-500 w-full border-b-4 border-black" />
                  <CardHeader>
                     <CardTitle className="text-3xl font-black italic uppercase tracking-tighter">Grocery Shopping</CardTitle>
                     <CardDescription className="text-xs font-black uppercase text-black italic opacity-60 tracking-wider">
                       Specify preferred mart and your household shopping list.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <Label className="font-black uppercase text-xs tracking-wider">Preferred Mart (Optional)</Label>
                           <div className="relative">
                              <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-black z-10" size={16} />
                              <PlaceAutocompleteInput 
                                value={groceryStore}
                                onChange={setGroceryStore}
                                placeholder="E.G. RATNADEEP, BANJARA"
                                className="w-full pl-12 pr-4 h-14 bg-white border-4 border-black font-black uppercase text-sm placeholder:text-gray-400"
                                onSelectPlace={(info) => {
                                  setGroceryStore(info.address);
                                  setGroceryStorePos(info.position);
                                }}
                              />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <Label className="font-black uppercase text-xs tracking-wider">My Delivery Address</Label>
                           <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 z-10" size={16} />
                              <PlaceAutocompleteInput 
                                value={deliveryDrop}
                                onChange={setDeliveryDrop}
                                placeholder="DELIVERY DROP COORDINATES"
                                className="w-full pl-12 pr-4 h-14 bg-white border-4 border-black font-black uppercase text-sm placeholder:text-gray-400"
                                onSelectPlace={(info) => {
                                  setDeliveryDrop(info.address);
                                  setDeliveryDropPos(info.position);
                                }}
                              />
                           </div>
                        </div>
                     </div>

                     {/* Itemized Shopping lists */}
                     <div className="space-y-4">
                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                           <Label className="text-sm font-black uppercase">Shopping List Items</Label>
                           <Button 
                             type="button" 
                             variant="outline" 
                             onClick={addItem} 
                             className="border-2 border-black font-black uppercase text-xs tracking-widest h-9 rounded-none hover:bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
                           >
                              <Plus size={14} className="mr-1" /> Add Item
                           </Button>
                        </div>
                        
                        <div className="space-y-4">
                           {items.map((item, idx) => (
                             <div key={idx} className="flex gap-4 animate-in slide-in-from-left-2 duration-150">
                                <Input 
                                  placeholder="ITEM NAME (E.G. FRESH MILK)" 
                                  className="flex-1 h-14 border-4 border-black font-black uppercase text-xs"
                                  value={item.name}
                                  onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[idx].name = e.target.value;
                                    setItems(newItems);
                                  }}
                                />
                                <Input 
                                  placeholder="QTY" 
                                  className="w-24 h-14 border-4 border-black font-black uppercase text-xs"
                                  value={item.qty}
                                  onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[idx].qty = e.target.value;
                                    setItems(newItems);
                                  }}
                                />
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removeItem(idx)} 
                                  className="h-14 w-14 border-4 border-black bg-white hover:bg-red-500 hover:text-white text-destructive shadow-bold active:translate-y-1 active:shadow-none transition-all cursor-pointer flex-shrink-0"
                                >
                                   <Trash2 size={18} />
                                </Button>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-4 border-black border-dashed">
                        <div className="space-y-3">
                           <Label className="font-black uppercase text-xs tracking-wider">Suggested Bounty Fee (₹)</Label>
                           <Input 
                             type="number" 
                             value={deliveryFee}
                             onChange={(e) => setDeliveryFee(e.target.value)}
                             placeholder="E.G. 120" 
                             className="h-14 border-4 border-black font-black uppercase tracking-wider text-sm" 
                           />
                        </div>
                        <div className="flex items-end">
                           <Button 
                             onClick={handleGrocerySubmit} 
                             className="w-full h-14 text-sm font-black italic uppercase tracking-widest bg-black text-white shadow-bold-lg hover:bg-green-600 transition-all active:translate-y-1 active:shadow-none" 
                             disabled={loading}
                           >
                              {loading ? (
                                <>
                                  <Loader2 className="animate-spin mr-2" size={16} />
                                  SUBMITTING...
                                </>
                              ) : 'Request Grocery Pickup +'}
                           </Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>
             </div>

             {/* Right Column Maps & Diagnostics */}
             <div className="lg:col-span-5 space-y-10">
                <div className="border-4 border-black p-6 bg-white shadow-bold-lg">
                   <h3 className="font-black text-xl italic uppercase mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
                     <MapIcon size={18} />
                     Grocery Errands Tracker
                   </h3>
                   <MapWrapper 
                     className="h-[300px] border-4 border-black" 
                     origin={groceryStorePos ? groceryStorePos : groceryStore} 
                     destination={deliveryDropPos ? deliveryDropPos : deliveryDrop}
                     onRoutesComputed={(info) => setRouteInfo(info)}
                   />
                </div>

                {routeInfo && (
                  <div className="border-4 border-black bg-blue-50 p-6 shadow-bold-lg">
                     <h4 className="font-black text-[10px] uppercase text-gray-500 tracking-wider">Errand Trajectory Calculations</h4>
                     <div className="grid grid-cols-2 gap-4 mt-3">
                        <div className="bg-white border-2 border-black p-3 shadow-bold">
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Errand Distance</p>
                           <p className="text-lg font-black italic mt-1">{routeInfo.distance}</p>
                        </div>
                        <div className="bg-white border-2 border-black p-3 shadow-bold">
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Est. Store Trip</p>
                           <p className="text-lg font-black italic mt-1">{routeInfo.duration}</p>
                        </div>
                     </div>
                  </div>
                )}
             </div>

           </div>
        </TabsContent>

        <TabsContent value="medicine">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             
             {/* Left Column forms */}
             <div className="lg:col-span-7">
               <Card className="border-4 border-black bg-white shadow-bold-lg overflow-hidden">
                  <div className="h-4 bg-red-500 w-full border-b-4 border-black" />
                  <CardHeader>
                     <CardTitle className="text-3xl font-black italic uppercase tracking-tighter">Medicine Pickup</CardTitle>
                     <CardDescription className="text-xs font-black uppercase text-black italic opacity-60 tracking-wider">
                       Secure medical collect service with digital prescription uploads.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                     <div className="p-4 bg-red-50 border-4 border-black border-dashed flex gap-3">
                        <AlertCircle className="text-red-600 mt-1 shrink-0" size={18} />
                        <p className="text-[10px] text-black font-black uppercase leading-relaxed italic">
                           Critical Policy: Scheduled medicine pick-and-drop requiring regulatory prescription must carry a photographed copy uploaded.
                        </p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-3">
                           <Label className="font-black uppercase text-xs tracking-wider">Required Prescription</Label>
                           <div 
                             onClick={handlePrescriptionUpload}
                             className={cn(
                               "h-44 border-4 border-dashed border-black flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-neutral-50 shadow-bold hover:shadow-none hover:translate-x-1 hover:translate-y-1",
                               hasFile && "bg-green-50 border-green-600 border-solid"
                             )}
                           >
                              {fileLoading ? (
                                <Loader2 className="animate-spin text-black" size={32} />
                              ) : hasFile ? (
                                <CheckCircle2 className="text-green-600 animate-in zoom-in-50" size={32} />
                              ) : (
                                <FileText className="text-gray-400" size={32} />
                              )}
                              <span className="text-[10px] font-black uppercase text-black tracking-widest mt-1">
                                {fileLoading ? "SAVING JPG..." : hasFile ? "PRESCRIPTION LOADED!" : "CLICK TO CAPTURE"}
                              </span>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="space-y-3">
                              <Label className="font-black uppercase text-xs tracking-wider">Medical Store / Pharmacy</Label>
                              <div className="relative">
                                 <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-black z-10" size={16} />
                                 <PlaceAutocompleteInput 
                                   value={medStore}
                                   onChange={setMedStore}
                                   placeholder="E.G. APOLLO PHARMACY, JUBILEE"
                                   className="w-full pl-12 pr-4 h-14 bg-white border-4 border-black font-black uppercase text-sm placeholder:text-gray-400"
                                   onSelectPlace={(info) => {
                                     setMedStore(info.address);
                                     setMedStorePos(info.position);
                                   }}
                                 />
                              </div>
                           </div>

                           <div className="space-y-3">
                              <Label className="font-black uppercase text-xs tracking-wider">Delivery Drop Address</Label>
                              <div className="relative">
                                 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 z-10" size={16} />
                                 <PlaceAutocompleteInput 
                                   value={deliveryDrop}
                                   onChange={setDeliveryDrop}
                                   placeholder="DELIVERY COMPLETED ADDRESS"
                                   className="w-full pl-12 pr-4 h-14 bg-white border-4 border-black font-black uppercase text-sm placeholder:text-gray-400"
                                   onSelectPlace={(info) => {
                                     setDeliveryDrop(info.address);
                                     setDeliveryDropPos(info.position);
                                   }}
                                 />
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <Label className="font-black uppercase text-xs tracking-wider">Specific Medication Instructions</Label>
                        <Textarea 
                          value={medicineRemarks}
                          onChange={(e) => setMedicineRemarks(e.target.value)}
                          placeholder="E.G. PLEASE PICK ONLY THE 20MG DOSAGE BOX..." 
                          className="border-4 border-black uppercase font-black text-xs tracking-wider min-h-[96px]" 
                        />
                     </div>

                     <Button 
                       onClick={handleMedSubmit} 
                       className="w-full h-16 text-lg font-black italic uppercase tracking-widest bg-black text-white shadow-bold-lg hover:bg-red-600 transition-all active:translate-y-1 active:shadow-none" 
                       disabled={loading}
                     >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            SUBMITTING PHARMACY JOB...
                          </>
                        ) : 'Request Medicine Delivery +'}
                     </Button>
                  </CardContent>
               </Card>
             </div>

             {/* Right Column Maps & Diagnostics */}
             <div className="lg:col-span-5 space-y-10">
                <div className="border-4 border-black p-6 bg-white shadow-bold-lg">
                   <h3 className="font-black text-xl italic uppercase mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
                     <MapIcon size={18} />
                     Medical Transit Map
                   </h3>
                   <MapWrapper 
                     className="h-[300px] border-4 border-black" 
                     origin={medStorePos ? medStorePos : medStore} 
                     destination={deliveryDropPos ? deliveryDropPos : deliveryDrop}
                     onRoutesComputed={(info) => setRouteInfo(info)}
                   />
                </div>

                {routeInfo && (
                  <div className="border-4 border-black bg-blue-50 p-6 shadow-bold-lg">
                     <h4 className="font-black text-[10px] uppercase text-gray-400 tracking-wider">Errand Trajectory Calculations</h4>
                     <div className="grid grid-cols-2 gap-4 mt-3">
                        <div className="bg-white border-2 border-black p-3 shadow-bold">
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pharmacy Distance</p>
                           <p className="text-lg font-black italic mt-1">{routeInfo.distance}</p>
                        </div>
                        <div className="bg-white border-2 border-black p-3 shadow-bold">
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Est. Store Trip</p>
                           <p className="text-lg font-black italic mt-1">{routeInfo.duration}</p>
                        </div>
                     </div>
                  </div>
                )}
             </div>

           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
