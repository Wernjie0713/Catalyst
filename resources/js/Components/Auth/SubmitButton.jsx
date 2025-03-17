export default function SubmitButton({ processing, children }) {
    return (
        <button
            type="submit"
            disabled={processing}
            className="w-full relative inline-flex items-center justify-center px-8 py-3 
            overflow-hidden font-medium tracking-wider rounded-full
            bg-[#8B7FD3]
            hover:bg-[#9D93DD]
            text-white transition-all duration-300 ease-out
            transform hover:scale-[1.02]
            shadow-[0_0_20px_rgba(139,127,211,0.5)]
            hover:shadow-[0_0_25px_rgba(139,127,211,0.7)]
            disabled:opacity-50 disabled:cursor-not-allowed
            text-lg font-semibold"
        >
            {processing ? (
                <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Processing...
                </div>
            ) : (
                children
            )}
        </button>
    );
}
