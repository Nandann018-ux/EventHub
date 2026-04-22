import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
}


const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  locationFilter, 
  setLocationFilter 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const locations = [
    'All Locations', 
    'Pune', 
    'Bangalore', 
    'Mumbai', 
    'Delhi'
  ];

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-30 -mt-8 mb-16"
    >
      <div className="max-w-4xl mx-auto bg-black border border-zinc-900 rounded-[2rem] p-3 shadow-2xl flex flex-col md:flex-row items-center gap-3">
        
        {}
        <div className="relative flex-1 w-full group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors pointer-events-none">
            <Search size={22} />
          </div>
          <input
            type="text"
            placeholder="Search within discovery network..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/40 text-white placeholder:text-zinc-700 rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-semibold border border-transparent focus:border-zinc-800 appearance-none"
          />
        </div>

        {}
        <div className="relative w-full md:w-72" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between bg-zinc-900/40 rounded-2xl py-5 px-6 border transition-all text-left group ${
              isOpen ? 'border-white/40 ring-1 ring-white/10' : 'border-transparent hover:border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-4">
              <MapPin size={22} className={locationFilter && locationFilter !== 'All Locations' ? 'text-white' : 'text-zinc-600'} />
              <span className={`font-bold text-sm ${locationFilter ? 'text-white' : 'text-zinc-600'}`}>
                {locationFilter || 'All Locations'}
              </span>
            </div>
            <ChevronDown 
              size={20} 
              className={`text-zinc-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.ul
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 5, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 mt-2 bg-black border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl p-2 space-y-1"
              >
                {locations.map((loc) => (
                  <li key={loc}>
                    <button
                      onClick={() => {
                        setLocationFilter(loc);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                        locationFilter === loc 
                        ? 'bg-white text-black' 
                        : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
                      }`}
                    >
                      <span>{loc}</span>
                      {locationFilter === loc && <Check size={16} />}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchBar;
