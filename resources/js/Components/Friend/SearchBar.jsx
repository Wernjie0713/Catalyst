export default function SearchBar({ value, onChange, placeholder = "Search friends by name..." }) {
    return (
        <div className="w-full">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <span className="material-symbols-outlined text-lg">search</span>
                </span>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-white/5 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
} 