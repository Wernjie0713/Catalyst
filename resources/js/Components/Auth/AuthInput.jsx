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
                ${error ? 'border-red-300' : 'border-gray-300'} 
                bg-white
                text-gray-900 placeholder-gray-500
                focus:ring-2 focus:ring-[#F37022] focus:border-[#F37022] 
                focus:shadow-[0_0_15px_rgba(243,112,34,0.35)]
                transition-all duration-300
                outline-none ${icon ? 'pl-12' : ''} ${className}`}
            />
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F37022]">
                    {icon}
                </div>
            )}
        </div>
    );
}
