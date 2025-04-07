import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// Add this at the top of your file to import the font
const fontImportStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
`;

export default function TemplateBuilder({ event, selectedUsers = [], selectedTeams = [], isParticipationCertificate = true, isTeamEvent = false }) {
    // Remove duplicate teams by team_id
    const uniqueTeams = selectedTeams.reduce((unique, team) => {
        const teamId = team.id || team.team_id;
        const exists = unique.find(t => (t.id || t.team_id) === teamId);
        if (!exists) {
            unique.push(team);
        }
        return unique;
    }, []);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        body_text: '',
        signature_image: null,
        is_participant_template: isParticipationCertificate, // Set based on incoming prop
        layout_settings: {
            titlePosition: { x: 50, y: 25 },
            namePosition: { x: 50, y: 50 }, // Position for student name
            bodyPosition: { x: 50, y: 60 },
            signaturePosition: { x: 50, y: 85 },
            titleFontSize: 40,
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
            fontFamily: "'Playfair Display', serif",
        },
        selected_users: isParticipationCertificate || isTeamEvent ? [] : selectedUsers.map(user => user.id),
        selected_teams: isParticipationCertificate ? [] : uniqueTeams.map(team => team.id || team.team_id),
    });


    const [previewUrls, setPreviewUrls] = useState({
        signature: null
    });

    // Handle file preview - only for signature now
    const handleFileChange = (field, file) => {
        setData(field, file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrls(prev => ({ ...prev, [field.replace('_image', '')]: url }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('certificates.store', event.event_id), {
            onSuccess: () => {
                console.log('Certificate template created successfully');
            },
            onError: (errors) => {
                console.error('Error creating certificate template:', errors);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Certificate Builder">
                <style>{fontImportStyle}</style>
            </Head>
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">       
                    <div className="bg-[#18122B] overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {/* Page Header with Certificate Type Indicator */}
                        <div className="mb-6 flex justify-between items-center">
                            <h1 className="text-xl font-semibold text-white">
                                {isParticipationCertificate ? 'Create Participation Certificates' : 'Create Winner Certificates'}
                                {isTeamEvent && !isParticipationCertificate && ' for Teams'}
                            </h1>
                            <div className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-600/20 text-indigo-400">
                                {isParticipationCertificate ? 'For All Participants' : 
                                 isTeamEvent ? 'For Selected Teams' : 'For Selected Winners'}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Hidden field to store certificate type - no need to show UI selection */}
                            <input 
                                type="hidden" 
                                name="is_participant_template" 
                                value={isParticipationCertificate} 
                            />

                            {/* Certificate Preview */}
                            <div className="mb-8 relative w-full aspect-[1.414] bg-white rounded-lg overflow-hidden">
                                {/* Use the correct path to the certificate background */}
                                <img 
                                    src="/images/Certificate.png" 
                                    className="absolute inset-0 w-full h-full object-cover"
                                    alt="Certificate Background"
                                    onError={(e) => {
                                        console.error("Failed to load certificate background");
                                        // Fallback to a light background color
                                        e.target.style.display = "none";
                                        e.target.parentElement.style.backgroundColor = "#f8f8f8";
                                    }}
                                />
                                
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
                                        textAlign: data.layout_settings.titleTextAlign,
                                        fontFamily: "'Playfair Display', serif",
                                        letterSpacing: '1px', 
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {data.title || (isParticipationCertificate ? 'CERTIFICATE OF PARTICIPATION' : 'CERTIFICATE OF ACHIEVEMENT')}
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
                                    {isParticipationCertificate ? 
                                        '[Student Name]' : 
                                        isTeamEvent ? 
                                        (selectedTeams?.[0]?.name || selectedTeams?.[0]?.team_name || '[Team Name]') :
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
                                    {data.body_text || (isParticipationCertificate ? 
                                        'for participating in the event' : 
                                        isTeamEvent ?
                                        'for outstanding team achievement in the event' :
                                        'for outstanding achievement in the event')}
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
                                        placeholder={isParticipationCertificate ? "CERTIFICATE OF PARTICIPATION" : "CERTIFICATE OF ACHIEVEMENT"}
                                        className="mt-1 block w-full rounded-md bg-[#242031] border-gray-700 text-white"
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
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Body Text
                                    </label>
                                    <textarea
                                        value={data.body_text}
                                        onChange={e => setData('body_text', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md bg-[#242031] border-gray-700 text-white"
                                        placeholder={isParticipationCertificate ? 
                                            "for participating in the event" : 
                                            isTeamEvent ?
                                            "for outstanding team achievement in the event" :
                                            "for outstanding achievement in the event"}
                                    />
                                </div>
                            </div>

                            {/* Selected Winners (only show for winner certificates) */}
                            {!isParticipationCertificate && isTeamEvent && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                                        Selected Teams
                                    </h3>
                                    <div className="bg-[#242031] rounded-lg p-4">
                                        {uniqueTeams?.length > 0 ? (
                                            <ul className="space-y-3">
                                                {uniqueTeams.map(team => (
                                                    <li key={team.id || team.team_id} className="text-gray-300">
                                                        <span className="font-medium">{team.name || team.team_name}</span>
                                                        <div className="mt-1 ml-4 text-sm text-gray-400">
                                                            {team.members ? (
                                                                <span>
                                                                    {team.members.map(member => member.name).join(', ')}
                                                                </span>
                                                            ) : (
                                                                <span>({team.member_count || 0} members)</span>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-400">No teams selected</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Selected Winners (only show for winner certificates) */}
                            {!isParticipationCertificate && !isTeamEvent && (
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

                            {/* If it's a winner certificate for individuals, add hidden field with selected users */}
                            {!isParticipationCertificate && !isTeamEvent && (
                                <input 
                                    type="hidden" 
                                    name="selected_users" 
                                    value={JSON.stringify(selectedUsers.map(user => user.id))} 
                                />
                            )}

                            {/* If it's a winner certificate for teams, add hidden field with selected teams */}
                            {!isParticipationCertificate && isTeamEvent && (
                                <input 
                                    type="hidden" 
                                    name="selected_teams" 
                                    value={JSON.stringify(selectedTeams.map(team => team.id || team.team_id))} 
                                />
                            )}

                            <div className="mt-6 flex justify-between">
                                <a
                                    href={route('events.my-events')}
                                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-[#635985] text-white rounded-md hover:bg-[#443C68] transition-colors"
                                >
                                    {processing ? 'Creating...' : `Create ${isParticipationCertificate ? 'Participation' : isTeamEvent ? 'Team Winner' : 'Winner'} Certificates`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 