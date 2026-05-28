import { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { cn } from '@/lib/utils';
import { Crosshair, Navigation, Users, HelpCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface MapWrapperProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  className?: string;
  origin?: google.maps.LatLngLiteral | string | null;
  destination?: google.maps.LatLngLiteral | string | null;
  onRoutesComputed?: (info: { distance: string; duration: string }) => void;
  markers?: Array<{ position: google.maps.LatLngLiteral; title?: string; type?: 'user' | 'driver' | 'errand' }>;
}

// Inner Component to handle polyline rendering to avoid context issues
function RouteRenderer({
  origin,
  destination,
  onRoutesComputed
}: {
  origin: google.maps.LatLngLiteral | string | null;
  destination: google.maps.LatLngLiteral | string | null;
  onRoutesComputed?: (info: { distance: string; duration: string }) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
      return;
    }

    // Clear previous routes on route change
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    // format locations
    let startLoc: google.maps.LatLngLiteral | string = origin;
    let endLoc: google.maps.LatLngLiteral | string = destination;

    routesLib.Route.computeRoutes({
      origin: startLoc,
      destination: endLoc,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    })
      .then(({ routes }) => {
        if (routes?.[0]) {
          const newPolylines = routes[0].createPolylines();
          newPolylines.forEach(p => {
            p.setOptions({
              strokeColor: '#2563eb', // Gutsy blue
              strokeWeight: 6,
              strokeOpacity: 0.85,
            });
            p.setMap(map);
          });
          polylinesRef.current = newPolylines;

          if (routes[0].viewport) {
            map.fitBounds(routes[0].viewport);
          }

          // Compute readable distance & duration
          const distKm = (routes[0].distanceMeters ? routes[0].distanceMeters / 1000 : 0).toFixed(1);
          const rawDuration = routes[0].durationMillis;
          const durMillis = typeof rawDuration === 'string' ? parseInt(rawDuration) : Number(rawDuration || 0);
          const durMin = Math.round(durMillis / 60000);
          
          if (onRoutesComputed) {
            onRoutesComputed({
              distance: `${distKm} km`,
              duration: `${durMin} mins`
            });
          }
        }
      })
      .catch((err) => {
        console.error("Route calculation error: ", err);
      });

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
    };
  }, [routesLib, map, origin, destination]);

  return null;
}

// Inner Component for handling center tracking
function CenterTracker({ position }: { position: google.maps.LatLngLiteral }) {
  const map = useMap();
  useEffect(() => {
    if (map && position) {
      map.panTo(position);
    }
  }, [map, position]);
  return null;
}

export function MapWrapper({
  center = { lat: 17.4483, lng: 78.3741 }, // Default to Gachibowli, Hyderabad
  zoom = 13,
  className,
  origin = null,
  destination = null,
  onRoutesComputed,
  markers = []
}: MapWrapperProps) {
  const [positionState, setPositionState] = useState<google.maps.LatLngLiteral>(center);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [simulatedTravelers, setSimulatedTravelers] = useState<Array<{ position: google.maps.LatLngLiteral; name: string; course: number }>>([]);

  // Auto Geolocate on Mount
  useEffect(() => {
    requestGeoLocation();
  }, []);

  const requestGeoLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser");
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setPositionState(coords);
        setGpsLoading(false);
        toast.success("Successfully obtained exact GPS location!");

        // Set up nearby simulated travelers based on real location!
        generateNearbyTravelers(coords);

        // Track changes continuously
        navigator.geolocation.watchPosition(
          (watchPos) => {
            setPositionState({
              lat: watchPos.coords.latitude,
              lng: watchPos.coords.longitude
            });
          },
          (err) => console.warn("Continuous location tracking failure:", err),
          { enableHighAccuracy: true }
        );
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError("Location Permission Denied. Using fallback location.");
          toast.error("Location permission denied. Map set to Hyderabad Gachibowli.");
        } else {
          setGpsError("Unable to retrieve GPS coordinates.");
        }
        // Generate simulated travelers around default center
        generateNearbyTravelers(center);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const generateNearbyTravelers = (base: google.maps.LatLngLiteral) => {
    // Generate 4 simulated cars/travelers close to base coordinate
    const simulated = [
      { lat: base.lat + 0.003, lng: base.lng - 0.002, name: "Suresh K.", course: 45 },
      { lat: base.lat - 0.004, lng: base.lng + 0.003, name: "Aditi G.", course: 180 },
      { lat: base.lat + 0.001, lng: base.lng + 0.005, name: "Kiran J.", course: 270 },
      { lat: base.lat - 0.002, lng: base.lng - 0.006, name: "Radharaman T.", course: 90 },
    ];
    setSimulatedTravelers(simulated);
  };

  if (!hasValidKey) {
    return (
      <div className={cn("bg-white border-4 border-black p-8 text-center shadow-bold-lg flex flex-col items-center justify-center min-h-[400px]", className)}>
        <div className="max-w-md">
          <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-red-600">Google Maps Key Needed</h3>
          <p className="text-xs uppercase font-black tracking-widest text-black opacity-60 mb-6">
            An active API key is required to render live GPS and autocompletes.
          </p>
          <div className="bg-yellow-300 border-4 border-black p-4 text-left shadow-bold text-[11px] font-black uppercase leading-relaxed space-y-2">
            <div>1. Open Settings (⚙️ Top-Right Corner)</div>
            <div>2. Go to Secrets (API Keys)</div>
            <div>3. Add secret: GOOGLE_MAPS_PLATFORM_KEY</div>
            <div>4. Paste your key & click save. App rebuilds automatically!</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-[450px] border-4 border-black bg-[#E5E7EB] overflow-hidden shadow-bold-lg", className)}>
      
      {/* Geolocation Loading State */}
      {gpsLoading && (
        <div className="absolute inset-0 bg-white/70 z-30 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={36} />
          <p className="font-extrabold uppercase tracking-widest text-xs italic text-black">Awaiting GPS Coordinates...</p>
        </div>
      )}

      {/* Geolocation Banner Errors */}
      {gpsError && (
        <div className="absolute top-4 left-4 right-4 bg-yellow-300 border-4 border-black p-3 z-20 shadow-bold flex items-center gap-2">
          <HelpCircle className="text-black inline shrink-0" size={18} />
          <p className="text-[10px] font-black uppercase text-black leading-tight">
            {gpsError} (Double check browser permission in location toolbar!)
          </p>
        </div>
      )}

      {/* API Provider Wrapper */}
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={positionState}
          defaultZoom={zoom}
          mapId="SHAREWAY_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          disableDefaultUI={true}
          gestureHandling="greedy"
        >
          {/* Always track and keep eye on centered model */}
          <CenterTracker position={positionState} />

          {/* User Marker - Live pulsing representation */}
          <AdvancedMarker position={positionState} title="My Current Position">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-8 w-8 animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <div className="relative w-6 h-6 rounded-none bg-blue-600 border-2 border-black flex items-center justify-center text-white font-black text-xs shadow-bold">
                M
              </div>
            </div>
          </AdvancedMarker>

          {/* Render props markers */}
          {markers.map((mk, idx) => (
            <AdvancedMarker key={idx} position={mk.position} title={mk.title}>
              <Pin 
                background={mk.type === 'driver' ? '#eab308' : mk.type === 'errand' ? '#22c55e' : '#ef4444'} 
                glyphColor="#000" 
              />
            </AdvancedMarker>
          ))}

          {/* Render simulated nearby dynamic drivers */}
          {simulatedTravelers.map((driver, idx) => (
            <AdvancedMarker key={`sim-${idx}`} position={driver.position} title={driver.name}>
              <div className="flex flex-col items-center">
                <div className="bg-yellow-300 text-black border-2 border-black px-2 py-0.5 text-[8px] font-black uppercase italic tracking-widest shadow-sm rounded-none">
                  {driver.name.split(' ')[0]}
                </div>
                <div className="w-5 h-5 bg-yellow-300 border-2 border-black rotate-45 flex items-center justify-center z-10 -mt-1 shadow-sm">
                  <Navigation 
                    size={10} 
                    className="text-black transform -rotate-45" 
                    style={{ transform: `rotate(${driver.course - 45}deg)` }} 
                  />
                </div>
              </div>
            </AdvancedMarker>
          ))}

          {/* Active Direct Route renderer */}
          <RouteRenderer 
            origin={origin} 
            destination={destination} 
            onRoutesComputed={onRoutesComputed} 
          />
        </Map>
      </APIProvider>

      {/* Floating GPS Recenter button & Permission Trigger */}
      <button
        onClick={requestGeoLocation}
        disabled={gpsLoading}
        className="absolute bottom-6 right-6 w-12 h-12 bg-white hover:bg-yellow-300 text-black border-4 border-black flex items-center justify-center shadow-bold z-20 hover:scale-105 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        title="Recenter on GPS Location"
      >
        <Crosshair size={22} className={cn(gpsLoading && "animate-spin text-blue-600")} />
      </button>

      {/* Simulated Overlapping routes stats in real-time */}
      <div className="absolute bottom-6 left-6 bg-black text-white px-4 py-2 border-2 border-white text-[9px] font-black uppercase tracking-widest leading-none z-20 shadow-bold">
        🌐 GPS LIVE TRACKER ACTIVE
      </div>
    </div>
  );
}
