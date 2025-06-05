import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';

export default function Certificates({ user, authUserId }) {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('internal'); // Default to internal
    const [formData, setFormData] = useState({
        type: 'Participant',
        title: '',
        issue_date: '',
        certificate_image: null,
        description: ''
    });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const response = await axios.get(route('student.certificates', { user: user.id }));
            setCertificates(response.data);
        } catch (error) {
            console.error('Failed to fetch certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter certificates based on active tab
    const filteredCertificates = certificates.filter(certificate => {
        if (activeTab === 'internal') {
            return certificate.type !== 'external';
        } else {
            return certificate.type === 'external';
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            certificate_image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            const response = await axios.post(route('external.certificates.store'), formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setIsModalOpen(false);
                setFormData({
                    type: 'Participant',
                    title: '',
                    issue_date: '',
                    certificate_image: null,
                    description: ''
                });
                fetchCertificates(); // Refresh the certificates list
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to upload certificate. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[200px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toggle Switch */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${activeTab === 'internal' ? 'text-white' : 'text-gray-400'}`}>
                        Internal
                    </span>
                    <button
                        onClick={() => setActiveTab(activeTab === 'internal' ? 'external' : 'internal')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#635985] focus:ring-offset-2 focus:ring-offset-gray-800 ${
                            activeTab === 'external' ? 'bg-[#635985]' : 'bg-gray-600'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                activeTab === 'external' ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                    <span className={`text-sm font-medium ${activeTab === 'external' ? 'text-white' : 'text-gray-400'}`}>
                        External
                    </span>
                </div>

                {/* Add Certificate Button - Only show on external tab and if viewing own profile */}
                {activeTab === 'external' && user.id === authUserId && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-[#635985] text-white rounded-lg hover:bg-[#635985]/80 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Add Certificate
                    </button>
                )}
            </div>

            {/* Certificates Grid */}
            {filteredCertificates.length === 0 ? (
                <div className="min-h-[200px] flex flex-col items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2">
                        workspace_premium
                    </span>
                    <p>
                        {activeTab === 'internal' 
                            ? 'No internal certificates yet' 
                            : 'No external certificates yet'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {filteredCertificates.map((certificate) => (
                        <div 
                            key={certificate.certificate_id} 
                            className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-[#635985]/50 transition-all duration-200"
                        >
                            <div className="flex flex-col h-full">
                                {/* Certificate Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="material-symbols-outlined text-[#635985]">
                                            {certificate.type === 'external' 
                                                ? (certificate.certificate_type === 'Participant' ? 'workspace_premium' : 'military_tech')
                                                : (certificate.template.is_participant_template ? 'workspace_premium' : 'military_tech')
                                            }
                                        </span>
                                        <span className="text-white font-medium">
                                            {certificate.type === 'external'
                                                ? certificate.certificate_type
                                                : (certificate.template.is_participant_template ? 'Participant' : 'Winner')
                                            }
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(certificate.issue_date).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Certificate Content */}
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {certificate.title}
                                    </h3>
                                    {certificate.type !== 'external' && (
                                        <p className="text-sm text-gray-400 mb-4">
                                            {certificate.event.title}
                                        </p>
                                    )}
                                    {certificate.description && (
                                        <p className="text-sm text-gray-400 mb-4">
                                            {certificate.description}
                                        </p>
                                    )}
                                    {certificate.type !== 'external' && (
                                        <div className="text-xs text-gray-500 mb-4">
                                            Certificate No: {certificate.certificate_number}
                                        </div>
                                    )}
                                </div>

                                {/* Download Button */}
                                {certificate.type === 'external' ? (
                                    <a
                                        href={`/${certificate.certificate_image}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full px-4 py-2 bg-[#635985] text-white rounded-lg hover:bg-[#635985]/80 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                        View Certificate
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => window.open(route('certificates.download', certificate.certificate_id))}
                                        className="w-full px-4 py-2 bg-[#635985] text-white rounded-lg hover:bg-[#635985]/80 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">download</span>
                                        Download Certificate
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Certificate Modal */}
            <Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-md rounded-xl bg-[#1a1a1a] p-6 border border-white/10">
                        <Dialog.Title className="text-xl font-semibold text-white mb-4">
                            Add External Certificate
                        </Dialog.Title>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Certificate Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Certificate Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#635985]"
                                    required
                                >
                                    <option value="Participant">Participant</option>
                                    <option value="Winner">Winner</option>
                                </select>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Certificate Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#635985]"
                                    required
                                />
                            </div>

                            {/* Issue Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Issue Date
                                </label>
                                <input
                                    type="date"
                                    name="issue_date"
                                    value={formData.issue_date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#635985]"
                                    required
                                />
                            </div>

                            {/* Certificate Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Certificate Image
                                </label>
                                <input
                                    type="file"
                                    name="certificate_image"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#635985]"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#635985]"
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm">{error}</div>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-4 py-2 bg-[#635985] text-white rounded-lg hover:bg-[#635985]/80 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? 'Uploading...' : 'Upload Certificate'}
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
