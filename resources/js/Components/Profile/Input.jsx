export default function Input({
    type = 'text',
    className = '',
    options = [],
    ...props
}) {
    const baseClasses = "w-full px-4 py-2.5 bg-white border border-orange-200 rounded-xl " +
        "text-gray-800 placeholder-gray-500 focus:border-orange-500 focus:ring-1 " +
        "focus:ring-orange-500 transition-colors duration-200";

    if (type === 'select') {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {props.label}
                </label>
                <select
                    {...props}
                    className={`${baseClasses} ${className}
                        appearance-none bg-white
                        background-image: url("data:image/svg+xml,...") // Add a custom dropdown arrow
                    `}
                >
                    <option value="" disabled>Select {props.label}</option>
                    {options.map((option) => (
                        <option 
                            key={option} 
                            value={option}
                            className="bg-white text-gray-800"
                        >
                            {option}
                        </option>
                    ))}
                </select>
                {props.error && (
                    <p className="mt-1 text-sm text-red-500">{props.error}</p>
                )}
            </div>
        );
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {props.label}
            </label>
            <input
                type={type}
                {...props}
                className={`${baseClasses} ${className}`}
            />
            {props.error && (
                <p className="mt-1 text-sm text-red-500">{props.error}</p>
            )}
        </div>
    );
}
