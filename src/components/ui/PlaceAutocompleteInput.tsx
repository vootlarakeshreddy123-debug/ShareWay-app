import { useState, useEffect, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface PlaceAutocompleteInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  onSelectPlace?: (info: { address: string; position: google.maps.LatLngLiteral }) => void;
}

export function PlaceAutocompleteInput({
  value,
  onChange,
  placeholder,
  className,
  onSelectPlace
}: PlaceAutocompleteInputProps) {
  const placesLib = useMapsLibrary('places');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!placesLib || !value || value.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      const service = new placesLib.AutocompleteService();
      service.getPlacePredictions({ input: value }, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [placesLib, value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (pred: google.maps.places.AutocompletePrediction) => {
    onChange(pred.description);
    setSuggestions([]);
    setIsOpen(false);

    if (onSelectPlace && placesLib) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ placeId: pred.place_id }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const loc = results[0].geometry.location;
          onSelectPlace({
            address: pred.description,
            position: {
              lat: loc.lat(),
              lng: loc.lng()
            }
          });
        }
      });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={className}
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-60 overflow-y-auto rounded-none p-0 divide-y-2 divide-black">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              onClick={() => handleSelect(s)}
              className="p-3 text-xs font-black uppercase text-black hover:bg-yellow-300 cursor-pointer transition-colors"
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
