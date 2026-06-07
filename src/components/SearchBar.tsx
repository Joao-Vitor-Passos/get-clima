'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchCities } from '../services/weather';

interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 3) {
        const data = await searchCities(query);
        setSuggestions(data || []);
      } else {
        setSuggestions([]);
      }
    };
    const delayDebounce = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (cityName: string) => {
    router.push(`/?city=${encodeURIComponent(cityName)}`);
    setSuggestions([]);
    setQuery('');
  };

  return (
    <div className="w-full max-w-md relative mb-12 z-50">
      <div className={`relative group transition-all duration-300 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
        <div className={`absolute -inset-0.5 bg-linear-to-r from-cyan-400 to-blue-600 rounded-2xl blur opacity-20 transition-opacity duration-300 ${isFocused ? 'opacity-60' : 'group-hover:opacity-40'}`}></div>
        
        <div className="relative flex items-center bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
          <svg className="w-6 h-6 text-white/50 ml-4 absolute pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rastrear localização..."
            className="w-full py-4 pl-12 pr-4 bg-transparent text-white placeholder-white/40 focus:outline-none tracking-wide"
          />
        </div>
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-3 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
          {suggestions.map((city, index) => (
            <li 
              key={index}
              onClick={() => handleSelect(city.name)}
              className="p-4 hover:bg-white/10 cursor-pointer transition-colors text-white/90 border-b border-white/5 last:border-0 flex items-center gap-3"
            >
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <div className="flex flex-col">
                <span className="font-semibold text-white tracking-wide">{city.name}</span>
                {city.state && <span className="text-xs text-white/40">{city.state}</span>}
              </div>
              <span className="text-sm opacity-60 ml-auto">{city.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}