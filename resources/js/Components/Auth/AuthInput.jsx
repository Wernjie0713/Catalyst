export default function AuthInput({ 
    type = 'text', 
    className = '', 
    icon,
    error,
    ...props 
}) {
    return (
        <div className="relative">
            <input
                {...props}
                type={type}
                className={`w-full px-4 py-3 rounded-full border 
                ${error ? 'border-red-300' : 'border-[#635985]'} 
                bg-[#443C68]/20 backdrop-blur-sm
                text-white placeholder-gray-300
                focus:ring-2 focus:ring-[#635985] focus:border-[#635985] 
                focus:shadow-[0_0_15px_rgba(99,89,133,0.5)]
                transition-all duration-300
                outline-none ${icon ? 'pl-12' : ''} ${className}`}
            />
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#635985]">
                    {icon}
                </div>
            )}
        </div>
    );
}
