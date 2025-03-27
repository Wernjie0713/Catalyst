import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Certificates({ user }) {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const response = await axios.get(route('student.certificates'));
            setCertificates(response.data);
        } catch (error) {
            console.error('Failed to fetch certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[200px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    if (certificates.length === 0) {
        return (
            <div className="min-h-[200px] flex flex-col items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2">
                    workspace_premium
                </span>
                <p>No certificates yet</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {certificates.map((certificate) => (
                <div 
                    key={certificate.certificate_id} 
                    className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-[#635985]/50 transition-all duration-200"
                >
                    <div className="flex flex-col h-full">
                        {/* Certificate Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <span className="material-symbols-outlined text-[#635985]">
                                    {certificate.template.is_participant_template ? 'workspace_premium' : 'military_tech'}
                                </span>
                                <span className="text-white font-medium">
                                    {certificate.template.is_participant_template ? 'Participant' : 'Winner'}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400">
                                {new Date(certificate.issue_date).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Certificate Content */}
                        <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-white mb-2">
                                {certificate.template.title}
                            </h3>
                            <p className="text-sm text-gray-400 mb-4">
                                {certificate.event.title}
                            </p>
                            <div className="text-xs text-gray-500 mb-4">
                                Certificate No: {certificate.certificate_number}
                            </div>
                        </div>

                        {/* Download Button */}
                        <button
                            onClick={() => window.open(route('certificates.download', certificate.certificate_id))}
                            className="w-full px-4 py-2 bg-[#635985] text-white rounded-lg hover:bg-[#635985]/80 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">download</span>
                            Download Certificate
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
