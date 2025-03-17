export default function Input({
    type = 'text',
    className = '',
    options = [],
    ...props
}) {
    const baseClasses = "w-full px-4 py-2.5 bg-[#242031] border border-white/10 rounded-xl " +
        "text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 " +
        "focus:ring-[#635985] transition-colors duration-200";

    if (type === 'select') {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {props.label}
                </label>
                <select
                    {...props}
                    className={`${baseClasses} ${className}
                        appearance-none bg-[#242031]
                        background-image: url("data:image/svg+xml,...") // Add a custom dropdown arrow
                    `}
                >
                    <option value="" disabled>Select {props.label}</option>
                    {options.map((option) => (
                        <option 
                            key={option} 
                            value={option}
                            className="bg-[#242031] text-white"
                        >
                            {option}
                        </option>
                    ))}
                </select>
                {props.error && (
                    <p className="mt-1 text-sm text-red-400">{props.error}</p>
                )}
            </div>
        );
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
                {props.label}
            </label>
            <input
                type={type}
                {...props}
                className={`${baseClasses} ${className}`}
            />
            {props.error && (
                <p className="mt-1 text-sm text-red-400">{props.error}</p>
            )}
        </div>
    );
}
