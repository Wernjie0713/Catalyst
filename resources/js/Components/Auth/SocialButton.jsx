export default function SocialButton({ icon, children, className = '', ...props }) {
    return (
        <button
            {...props}
            className={`flex items-center justify-center gap-2 py-3 px-4 
            rounded-full border border-[#635985] 
            bg-white/5 backdrop-blur-sm
            hover:bg-[#443C68]/30 text-white
            transition duration-200 w-full ${className}`}
        >
            {icon}
            <span>{children}</span>
        </button>
    );
}
