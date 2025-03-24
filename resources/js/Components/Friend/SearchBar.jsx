import { motion } from 'framer-motion';

export default function SearchBar({ value, onChange }) {
    return (
        <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-500/50 text-sm">search</span>
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search friends by name..."
                className="w-full pl-9 pr-4 py-2 bg-gray-900/40 border border-white/5 focus:border-white/10 rounded-lg text-sm text-white/90 placeholder-gray-500/50 focus:ring-0 focus:outline-none transition-colors duration-200"
            />
        </div>
    );
} 