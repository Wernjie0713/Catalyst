import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ShareButton = ({ event, className = "" }) => {
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
    const [isGeneratingNewLink, setIsGeneratingNewLink] = useState(false);
    const [shareUrl, setShareUrl] = useState(event.share_url || event.getShareUrl?.() || '');
    const [dropdownPosition, setDropdownPosition] = useState('bottom'); // 'top' or 'bottom'

    const handleShare = async (platform) => {
        const url = shareUrl || event.share_url || event.getShareUrl?.();
        const text = `Check out this event: ${event.title}`;
        
        let shareLink = '';
        
        switch (platform) {
            case 'copy':
                try {
                    await navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                } catch (err) {
                    console.error('Failed to copy: ', err);
                    // Fallback for older browsers or when clipboard API fails
                    const textArea = document.createElement('textarea');
                    textArea.value = url;
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        alert('Link copied to clipboard!');
                    } catch (fallbackErr) {
                        console.error('Fallback copy failed: ', fallbackErr);
                        alert('Failed to copy link. Please copy manually: ' + url);
                    }
                    document.body.removeChild(textArea);
                }
                break;
                
            case 'whatsapp':
                shareLink = `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`;
                break;
                
            case 'telegram':
                shareLink = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
                
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
                
            case 'email':
                shareLink = `mailto:?subject=${encodeURIComponent(`Event: ${event.title}`)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
                break;
                
            default:
                break;
        }
        
        if (shareLink) {
            window.open(shareLink, '_blank', 'width=600,height=400');
        }
        
        setIsShareMenuOpen(false);
    };

    const generateNewLink = async () => {
        if (!event.event_id) return;
        
        setIsGeneratingNewLink(true);
        try {
            const response = await axios.post(route('events.regenerate-share-token', event.event_id));
            setShareUrl(response.data.share_url);
            alert('New share link generated!');
        } catch (error) {
            console.error('Failed to generate new link:', error);
            alert('Failed to generate new link. Please try again.');
        } finally {
            setIsGeneratingNewLink(false);
        }
    };

    const shareOptions = [
        { name: 'WhatsApp', icon: '/images/icon/WhatsApp_Logo_green.svg.png', action: 'whatsapp', isCustomIcon: true },
        { name: 'Telegram', icon: '/images/icon/Telegram_2019_Logo.svg.png', action: 'telegram', isCustomIcon: true },
        { name: 'Facebook', icon: '/images/icon/2023_Facebook_icon.svg.png', action: 'facebook', isCustomIcon: true },
        { name: 'Gmail', icon: '/images/icon/Gmail_icon_(2020).svg.png', action: 'email', isCustomIcon: true },
    ];

    return (
        <div className={`relative ${className}`}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    // Check if there's enough space below, if not, show above
                    const button = document.activeElement;
                    if (button) {
                        const rect = button.getBoundingClientRect();
                        const spaceBelow = window.innerHeight - rect.bottom;
                        const spaceAbove = rect.top;
                        setDropdownPosition(spaceBelow < 300 && spaceAbove > 300 ? 'top' : 'bottom');
                    }
                    setIsShareMenuOpen(!isShareMenuOpen);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                <span className="text-sm font-medium">Share</span>
            </motion.button>

            <AnimatePresence>
                {isShareMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsShareMenuOpen(false)}
                            className="fixed inset-0 z-[9998]"
                        />

                        {/* Share Menu */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: dropdownPosition === 'top' ? -10 : 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: dropdownPosition === 'top' ? -10 : 10 }}
                            className={`absolute right-0 w-64 bg-[#2A2A3A] border border-gray-700 rounded-lg shadow-xl z-[9999] ${
                                dropdownPosition === 'top' 
                                    ? 'bottom-full mb-2' 
                                    : 'top-full mt-2'
                            }`}
                        >
                            {/* Arrow indicator */}
                            <div className={`absolute right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent ${
                                dropdownPosition === 'top' 
                                    ? 'top-full border-t-4 border-t-[#2A2A3A]' 
                                    : 'bottom-full border-b-4 border-b-[#2A2A3A]'
                            }`}></div>
                            <div className="p-4">
                                <h3 className="text-white font-medium mb-3">Share Event</h3>
                                
                                {/* Share URL Display */}
                                <div className="mb-4">
                                    <label className="block text-xs text-gray-400 mb-1">Share Link</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={shareUrl || ''}
                                            readOnly
                                            className="flex-1 bg-[#1E1E2E] border border-gray-600 rounded px-3 py-2 text-xs text-white"
                                        />
                                        <button
                                            onClick={() => handleShare('copy')}
                                            className="px-2 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Generate New Link Button (for event creators) */}
                                {event.creator_id === window.auth?.user?.id && (
                                    <div className="mb-4">
                                        <button
                                            onClick={generateNewLink}
                                            disabled={isGeneratingNewLink}
                                            className="w-full px-3 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
                                        >
                                            {isGeneratingNewLink ? 'Generating...' : 'Generate New Link'}
                                        </button>
                                    </div>
                                )}

                                {/* Share Options */}
                                <div className="space-y-2">
                                    {shareOptions.map((option) => (
                                        <button
                                            key={option.action}
                                            onClick={() => handleShare(option.action)}
                                            className="w-full flex items-center space-x-3 px-3 py-2 text-left text-white hover:bg-[#1E1E2E] rounded transition-colors"
                                        >
                                            {option.isCustomIcon ? (
                                                <img 
                                                    src={option.icon} 
                                                    alt={option.name}
                                                    className="w-5 h-5 object-contain"
                                                />
                                            ) : (
                                                <span className="material-symbols-outlined text-lg">
                                                    {option.icon}
                                                </span>
                                            )}
                                            <span className="text-sm">{option.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShareButton;
