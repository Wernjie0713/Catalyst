import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function TemplateBuilder({ event, selectedUsers }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        body_text: '',
        background_image: null,
        signature_image: null,
        is_participant_template: true, // New field to distinguish template type
        layout_settings: {
            titlePosition: { x: 50, y: 30 },
            namePosition: { x: 50, y: 40 }, // Position for student name
            bodyPosition: { x: 50, y: 50 },
            signaturePosition: { x: 80, y: 85 },
            titleFontSize: 48,
            nameFontSize: 32, // Font size for student name
            bodyFontSize: 18,
            signatureWidth: 150,
            titleColor: '#000000',
            nameColor: '#333333',
            bodyColor: '#444444',
            titleFontWeight: 'bold',
            titleTextAlign: 'center',
            nameTextAlign: 'center',
            bodyTextAlign: 'center',
        }
    });

    const [previewUrls, setPreviewUrls] = useState({
        background: null,
        signature: null
    });

    // Handle file preview
    const handleFileChange = (field, file) => {
        setData(field, file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrls(prev => ({ ...prev, [field.replace('_image', '')]: url }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        Object.keys(data).forEach(key => {
            if (key === 'layout_settings') {
                formData.append(key, JSON.stringify(data[key]));
            } else if (data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        post(route('certificates.store', event.event_id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Certificate Builder" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#18122B] overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit}>
                            {/* Certificate Type Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Certificate Type
                                </label>
                                <div className="flex space-x-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            checked={data.is_participant_template}
                                            onChange={() => setData('is_participant_template', true)}
                                            className="form-radio text-[#635985]"
                                        />
                                        <span className="ml-2 text-gray-300">Participant Certificate</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            checked={!data.is_participant_template}
                                            onChange={() => setData('is_participant_template', false)}
                                            className="form-radio text-[#635985]"
                                        />
                                        <span className="ml-2 text-gray-300">Winner Certificate</span>
                                    </label>
                                </div>
                            </div>

                            {/* Certificate Preview */}
                            <div className="mb-8 relative w-full aspect-[1.414] bg-white rounded-lg overflow-hidden">
                                {previewUrls.background && (
                                    <img 
                                        src={previewUrls.background}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        alt="Background"
                                    />
                                )}
                                
                                {/* Title */}
                                <div 
                                    style={{
                                        position: 'absolute',
                                        left: `${data.layout_settings.titlePosition.x}%`,
                                        top: `${data.layout_settings.titlePosition.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: `${data.layout_settings.titleFontSize}px`,
                                        fontWeight: data.layout_settings.titleFontWeight,
                                        color: data.layout_settings.titleColor,
                                        width: '80%',
                                        textAlign: data.layout_settings.titleTextAlign
                                    }}
                                >
                                    {data.title || 'Certificate Title'}
                                </div>

                                {/* Example Student Name */}
                                <div 
                                    style={{
                                        position: 'absolute',
                                        left: `${data.layout_settings.namePosition.x}%`,
                                        top: `${data.layout_settings.namePosition.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: `${data.layout_settings.nameFontSize}px`,
                                        color: data.layout_settings.nameColor,
                                        width: '70%',
                                        textAlign: data.layout_settings.nameTextAlign
                                    }}
                                >
                                    {data.is_participant_template ? 
                                        '[Student Name]' : 
                                        (selectedUsers?.[0]?.name || '[Winner Name]')}
                                </div>

                                {/* Body Text */}
                                <div 
                                    style={{
                                        position: 'absolute',
                                        left: `${data.layout_settings.bodyPosition.x}%`,
                                        top: `${data.layout_settings.bodyPosition.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: `${data.layout_settings.bodyFontSize}px`,
                                        color: data.layout_settings.bodyColor,
                                        width: '80%',
                                        textAlign: data.layout_settings.bodyTextAlign
                                    }}
                                >
                                    {data.body_text || 'Certificate Body Text'}
                                </div>

                                {/* Signature */}
                                {previewUrls.signature && (
                                    <div 
                                        style={{
                                            position: 'absolute',
                                            left: `${data.layout_settings.signaturePosition.x}%`,
                                            top: `${data.layout_settings.signaturePosition.y}%`,
                                            transform: 'translate(-50%, -50%)',
                                            width: `${data.layout_settings.signatureWidth}px`
                                        }}
                                    >
                                        <img 
                                            src={previewUrls.signature}
                                            className="w-full h-auto"
                                            alt="Signature"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Form Controls */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="mt-1 block w-full rounded-md bg-[#242031] border-gray-700 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300">
                                        Body Text
                                    </label>
                                    <textarea
                                        value={data.body_text}
                                        onChange={e => setData('body_text', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md bg-[#242031] border-gray-700 text-white"
                                        placeholder="Enter certificate body text..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300">
                                        Background Image
                                    </label>
                                    <input
                                        type="file"
                                        onChange={e => handleFileChange('background_image', e.target.files[0])}
                                        className="mt-1 block w-full text-gray-300"
                                        accept="image/*"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300">
                                        Signature Image
                                    </label>
                                    <input
                                        type="file"
                                        onChange={e => handleFileChange('signature_image', e.target.files[0])}
                                        className="mt-1 block w-full text-gray-300"
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            {/* Selected Winners (only show for winner certificates) */}
                            {!data.is_participant_template && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                                        Selected Winners
                                    </h3>
                                    <div className="bg-[#242031] rounded-lg p-4">
                                        {selectedUsers?.length > 0 ? (
                                            <ul className="space-y-2">
                                                {selectedUsers.map(user => (
                                                    <li key={user.id} className="text-gray-300">
                                                        {user.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-400">No winners selected</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-[#635985] text-white rounded-md hover:bg-[#443C68] transition-colors"
                                >
                                    {processing ? 'Creating...' : 'Create Certificate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 