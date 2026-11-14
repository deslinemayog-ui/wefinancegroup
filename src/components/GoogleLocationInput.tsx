import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface GoogleLocationInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

const GOOGLE_PLACES_API_KEY = 'AIzaSyCVqRUfYn4fzqxWxJ_neVe-UXF2I84jaNU';

export const GoogleLocationInput: React.FC<GoogleLocationInputProps> = ({
  value,
  onChange,
  placeholder = 'Search pick-up address via Google Maps...',
  className = ''
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [autocomplete, setAutocomplete] = useState<any>(null);

  useEffect(() => {
    // Check if script already present
    const win = window as any;
    if (win.google && win.google.maps && win.google.maps.places) {
      setIsLoaded(true);
      initAutocomplete();
      return;
    }

    const scriptId = 'google-maps-places-script';
    let existingScript = document.getElementById(scriptId) as HTMLScriptElement;

    if (!existingScript) {
      existingScript = document.createElement('script');
      existingScript.id = scriptId;
      existingScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`;
      existingScript.async = true;
      existingScript.defer = true;
      document.head.appendChild(existingScript);
    }

    const handleLoad = () => {
      setIsLoaded(true);
      initAutocomplete();
    };

    existingScript.addEventListener('load', handleLoad);

    return () => {
      existingScript.removeEventListener('load', handleLoad);
    };
  }, []);

  const initAutocomplete = () => {
    const win = window as any;
    if (inputRef.current && win.google && win.google.maps && win.google.maps.places) {
      try {
        const auto = new win.google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'za' } // South Africa default
        });

        auto.addListener('place_changed', () => {
          const place = auto.getPlace();
          if (place && place.formatted_address) {
            onChange(place.formatted_address);
          } else if (inputRef.current?.value) {
            onChange(inputRef.current.value);
          }
        });

        setAutocomplete(auto);
      } catch (err) {
        console.warn('[Google Places] Failed to initialize autocomplete:', err);
      }
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 z-10 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-9 pr-8 py-2.5 bg-[#0A0C10] border border-gray-800 rounded-xl text-white text-xs placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors ${className}`}
        />
        {!isLoaded && (
          <Loader2 className="w-3.5 h-3.5 text-gray-500 animate-spin absolute right-3 pointer-events-none" />
        )}
      </div>
    </div>
  );
};
