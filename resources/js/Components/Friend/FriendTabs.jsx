export default function FriendTabs({ activeTab, onTabChange, userRelations }) {
    const isStudent = userRelations?.isStudent;

    return (
        <div className="flex space-x-4 mb-6 justify-center">
            <button
                onClick={() => onTabChange('all')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'all' 
                        ? 'bg-orange-500 text-white border border-orange-500 shadow-lg' 
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
            >
                All Friends
            </button>
            {isStudent && (
                <button
                    onClick={() => onTabChange('mentors')}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        activeTab === 'mentors' 
                            ? 'bg-orange-500 text-white border border-orange-500 shadow-lg' 
                            : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                >
                    Find Mentors
                </button>
            )}
            <button
                onClick={() => onTabChange('teams')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'teams' 
                        ? 'bg-orange-500 text-white border border-orange-500 shadow-lg' 
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
            >
                Teams
            </button>
        </div>
    );
} 