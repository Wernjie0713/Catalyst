import { motion } from 'framer-motion';

export default function EmptyState({ icon = "group", message, description }) {
    return (
        <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-gray-950/30 rounded-xl p-6 text-center">
            <div className="flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">
                    {icon}
                </span>
                <p className="text-gray-400">{message}</p>
                {description && (
                    <p className="text-gray-500 text-sm">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
} 