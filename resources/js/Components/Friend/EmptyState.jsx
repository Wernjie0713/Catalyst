import { motion } from 'framer-motion';

export default function EmptyState({ icon = "group", message, description }) {
    return (
        <div className="bg-white border border-orange-200 rounded-xl p-6 text-center shadow-lg">
            <div className="flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-orange-500 mb-2">
                    {icon}
                </span>
                <p className="text-gray-700 font-medium">{message}</p>
                {description && (
                    <p className="text-gray-600 text-sm mt-1">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
} 