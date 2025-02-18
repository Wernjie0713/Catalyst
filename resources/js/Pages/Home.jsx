import React from 'react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">
                        Welcome to Our Platform Catalyst
                    </h1>
                    <p className="text-xl text-gray-600 mb-12">
                        Your one-stop solution for amazing features and services
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature Cards */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Feature 1</h2>
                        <p className="text-gray-600">
                            Description of your first amazing feature goes here.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Feature 2</h2>
                        <p className="text-gray-600">
                            Description of your second amazing feature goes here.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Feature 3</h2>
                        <p className="text-gray-600">
                            Description of your third amazing feature goes here.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
