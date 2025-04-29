import { usePage, Head } from "@inertiajs/react"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useState } from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, registerables } from 'chart.js'
import { format } from 'date-fns'
import { Menu } from '@headlessui/react'

// Register ChartJS components
ChartJS.register(...registerables)

// Dummy data for prototyping
const dummyMetrics = {
    total_students: 1200,
    active_students: 800, // This will be removed
    total_certificates: 300, // This will be removed
    events_participated: 50, // This will be removed
    student_success_startup: 150,
    startup_plans_ongoing: 30,
    high_potential_students: 75
};

const dummyEventParticipation = [
    { month: 'January', count: 5 },
    { month: 'February', count: 10 },
    { month: 'March', count: 15 },
    { month: 'April', count: 20 },
    { month: 'May', count: 25 },
    { month: 'June', count: 30 },
    { month: 'July', count: 35 },
    { month: 'August', count: 40 },
    { month: 'September', count: 45 },
    { month: 'October', count: 50 },
    { month: 'November', count: 55 },
    { month: 'December', count: 60 }
];

// Enhanced styles and animations
const carouselItems = [1, 2, 3, 4, 5];

export default function Index({ auth }) {
    const { report } = usePage().props;
    const metrics = report?.data?.metrics || {};
    const eventParticipation = report?.data?.department_metrics?.event_participation || [];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head>
                <title>Department Report</title>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            </Head>

            <div className="p-6 bg-[#1e1b4b] text-white min-h-screen">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">{report?.data?.name}</h1>
                    <p className="text-gray-400">
                        Generated on {report?.data?.generatedDate}
                    </p>
                </div>

                {/* Updated Metrics Grid with smaller graph */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <MetricCard 
                        label="Student Success Startups" 
                        value={dummyMetrics.student_success_startup}
                        icon="trending_up"
                        description="Number of successful startups this year"
                    />
                    <MetricCard 
                        label="Ongoing Startup Plans" 
                        value={dummyMetrics.startup_plans_ongoing}
                        icon="lightbulb"
                        description="Current startup plans in progress"
                    />
                    <MetricCard 
                        label="High Potential Students" 
                        value={dummyMetrics.high_potential_students}
                        icon="star"
                        description="Students with success rate >= 75%"
                    />
                    <div className="bg-[#24225a] p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="text-lg font-semibold mb-2">Monthly Events</h3>
                        <div className="h-[150px]">
                            <Line 
                                data={{
                                    labels: dummyEventParticipation.map(item => item.month),
                                    datasets: [{
                                        label: 'Events',
                                        data: dummyEventParticipation.map(item => item.count),
                                        borderColor: '#8b5cf6',
                                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                        borderWidth: 2,
                                        tension: 0.4,
                                        fill: true
                                    }]
                                }} 
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            backgroundColor: '#1e1b4b',
                                            titleColor: '#fff',
                                            bodyColor: '#9ca3af',
                                            padding: 12,
                                            displayColors: false
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            grid: {
                                                color: 'rgba(255, 255, 255, 0.1)',
                                            },
                                            ticks: {
                                                color: '#9ca3af',
                                                font: { size: 10 }
                                            }
                                        },
                                        x: {
                                            grid: { display: false },
                                            ticks: {
                                                color: '#9ca3af',
                                                font: { size: 10 }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Student Carousel */}
                <div className="carousel mt-8 mb-8">
                    <h3 className="text-xl font-semibold mb-4">Student Success Rates</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {carouselItems.map((student, index) => (
                            <div key={index} className="bg-[#24225a] p-4 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                                <h4 className="text-lg font-bold">Student {index + 1}</h4>
                                <p className="text-gray-400">Success Rate: {Math.floor(Math.random() * 100)}%</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Bookmarked Projects and Students Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#1e1b4b] p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
                            <span className="material-icons text-purple-400 mr-2">bookmark</span>
                            Bookmarked Projects
                        </h2>
                        <ul className="list-disc list-inside text-gray-300">
                            <li className="flex items-center">
                                <span className="material-icons text-green-400 mr-2">lightbulb</span>
                                Project A - Innovative AI Solutions
                            </li>
                            <li className="flex items-center">
                                <span className="material-icons text-blue-400 mr-2">eco</span>
                                Project B - Sustainable Energy
                            </li>
                            <li className="flex items-center">
                                <span className="material-icons text-red-400 mr-2">android</span>
                                Project C - Advanced Robotics
                            </li>
                        </ul>
                    </div>

                    <div className="bg-[#1e1b4b] p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
                            <span className="material-icons text-purple-400 mr-2">bookmark</span>
                            Bookmarked Students
                        </h2>
                        <ul className="list-disc list-inside text-gray-300">
                            <li className="flex items-center">
                                <span className="material-icons text-yellow-400 mr-2">person</span>
                                Student 1 - AI Researcher
                            </li>
                            <li className="flex items-center">
                                <span className="material-icons text-green-400 mr-2">person</span>
                                Student 2 - Renewable Energy Advocate
                            </li>
                            <li className="flex items-center">
                                <span className="material-icons text-blue-400 mr-2">person</span>
                                Student 3 - Robotics Engineer
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Add Key Insights Table */}
                <div className="bg-[#24225a] p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-white">Key Insights</h2>
                    <table className="min-w-full text-gray-300">
                        <thead>
                            <tr className="border-b border-gray-600">
                                <th className="px-4 py-2 text-left">Metric</th>
                                <th className="px-4 py-2 text-left">Value</th>
                                <th className="px-4 py-2 text-left">Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-[#1e1b4b]">
                                <td className="border-t border-gray-600 px-4 py-2">Total Students</td>
                                <td className="border-t border-gray-600 px-4 py-2">1200</td>
                                <td className="border-t border-gray-600 px-4 py-2">+5%</td>
                            </tr>
                            <tr className="hover:bg-[#1e1b4b]">
                                <td className="border-t border-gray-600 px-4 py-2">Successful Startups</td>
                                <td className="border-t border-gray-600 px-4 py-2">150</td>
                                <td className="border-t border-gray-600 px-4 py-2">+10%</td>
                            </tr>
                            <tr className="hover:bg-[#1e1b4b]">
                                <td className="border-t border-gray-600 px-4 py-2">Ongoing Plans</td>
                                <td className="border-t border-gray-600 px-4 py-2">30</td>
                                <td className="border-t border-gray-600 px-4 py-2">+20%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Remove animation styles for static carousel */}
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </AuthenticatedLayout>
    );
}

// Updated Student Carousel with auto sliding and motion
function MetricCard({ label, value, icon, description }) {
    return (
        <div className="bg-[#24225a] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-900/50 rounded-lg">
                    <span className="material-icons !text-2xl text-purple-400" 
                          style={{ fontFamily: 'Material Icons' }}>
                        {icon}
                    </span>
                </div>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{value || 0}</p>
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
    );
}

// Participation Chart Component
function ParticipationChart({ data }) {
    const chartData = {
        labels: data.labels,
        datasets: [{
            label: 'Participation Rate',
            data: data.values,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    }

    return (
        <Card>
            <CardHeader>
                <h3 className="text-lg font-medium">Participation Trends</h3>
            </CardHeader>
            <CardContent>
                <Line data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false
                }} />
            </CardContent>
        </Card>
    )
}

// Role-specific Components
function SystemMetrics({ data }) {
    return (
        <Card className="mb-6">
            <CardHeader>
                <h2 className="text-xl font-bold">System Overview</h2>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-medium mb-2">Universities</h3>
                        <ul className="space-y-2">
                            {data.universities.map(uni => (
                                <li key={uni.id} className="flex justify-between">
                                    <span>{uni.name}</span>
                                    <span>{uni.studentCount} students</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium mb-2">Overall Statistics</h3>
                        <ul className="space-y-2">
                            <li>Total Students: {data.totalStudents}</li>
                            <li>Active Events: {data.activeEvents}</li>
                            <li>Achievement Rate: {data.achievementRate}%</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function UniversityMetrics({ data }) {
    return (
        <Card className="mb-6">
            <CardHeader>
                <h2 className="text-xl font-bold">University Performance</h2>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-medium mb-2">Faculty Breakdown</h3>
                        {/* Faculty metrics */}
                    </div>
                    <div>
                        <h3 className="font-medium mb-2">Key Metrics</h3>
                        {/* University specific metrics */}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function FacultyMetrics({ data }) {
    return (
        <Card className="mb-6">
            <CardHeader>
                <h2 className="text-xl font-bold">Faculty Insights</h2>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-medium mb-2">Student Performance</h3>
                        {/* Student metrics */}
                    </div>
                    <div>
                        <h3 className="font-medium mb-2">Event Participation</h3>
                        {/* Event metrics */}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Function to export report
function exportReport() {
    // Placeholder for export functionality
    alert('Report exported successfully!');
} 