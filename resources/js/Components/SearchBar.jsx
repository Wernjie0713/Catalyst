import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setResults([]);
                setIsSearching(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);

        if (searchQuery.length > 0) {
            setIsSearching(true);
            try {
                const response = await axios.get(route('search.users', { query: searchQuery }));
                setResults(response.data.users);
            } catch (error) {
                console.error('Search failed:', error);
            }
        } else {
            setResults([]);
            setIsSearching(false);
        }
    };

    return (
        <div className="relative" ref={searchRef}>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={query}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F37022] focus:border-[#F37022] text-gray-900 placeholder-gray-400"
                />
                <span className="absolute right-3 top-2.5 text-gray-500 material-symbols-outlined">
                    search
                </span>
            </div>

            <AnimatePresence>
                {results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                    >
                        {results.map((user) => (
                            <Link
                                key={user.id}
                                href={route('profile.view', user.id)}
                                className="block px-4 py-3 hover:bg-orange-50 transition-colors duration-150"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                        {user.profile_photo ? (
                                            <img
                                                src={user.profile_photo}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-gray-500">
                                                    person
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.name}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}