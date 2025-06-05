export default function FriendTabs({ activeTab, onTabChange, userRelations }) {
    const isStudent = userRelations?.isStudent;

    return (
        <div className="flex space-x-4 mb-6 justify-center">
            <button
                onClick={() => onTabChange('all')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'all' 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'text-gray-400 hover:text-gray-300'
                }`}
            >
                All Friends
            </button>
            {isStudent && (
                <button
                    onClick={() => onTabChange('mentors')}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        activeTab === 'mentors' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'text-gray-400 hover:text-gray-300'
                    }`}
                >
                    Find Mentors
                </button>
            )}
            <button
                onClick={() => onTabChange('teams')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'teams' 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                        : 'text-gray-400 hover:text-gray-300'
                }`}
            >
                Teams
            </button>
        </div>
    );
} 