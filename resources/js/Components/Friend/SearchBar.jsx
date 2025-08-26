export default function SearchBar({ value, onChange, placeholder = "Search friends by name..." }) {
    return (
        <div className="w-full">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <span className="material-symbols-outlined text-lg">search</span>
                </span>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-orange-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 shadow-sm"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
} 