import { usePage, Head } from "@inertiajs/react"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useState } from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, registerables } from 'chart.js'
import { format } from 'date-fns'
import { Menu } from '@headlessui/react'

// Register ChartJS components
ChartJS.register(...registerables)

// No more dummy data - using real data from backend

// Real data analytics for department

export default function Index({ auth }) {
    const { report } = usePage().props;
    const metrics = report?.data?.metrics || {};
    const eventParticipation = report?.data?.department_metrics?.event_participation || [];
    
    // Calculate additional metrics from the real data
    const totalStudents = metrics.total_students || 0;
    const activeStudents = metrics.active_students || 0;
    const totalCertificates = metrics.total_certificates || 0;
    const eventsParticipated = metrics.events_participated || 0;
    
    // Calculate success metrics
    const successRate = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;
    const certificateRate = totalStudents > 0 ? Math.round((totalCertificates / totalStudents) * 100) : 0;
    const highPotentialStudents = Math.round(activeStudents * 0.75); // Estimate based on active students

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

                {/* Real Department Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <MetricCard 
                        label="Total Students" 
                        value={totalStudents}
                        icon="school"
                        description="Total students in department"
                    />
                    <MetricCard 
                        label="Active Students" 
                        value={activeStudents}
                        icon="trending_up"
                        description={`${successRate}% participation rate`}
                    />
                    <MetricCard 
                        label="Certificates Awarded" 
                        value={totalCertificates}
                        icon="card_membership"
                        description={`${certificateRate}% certificate rate`}
                    />
                    <div className="bg-[#24225a] p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="text-lg font-semibold mb-2">Monthly Events</h3>
                        <div className="h-[150px]">
                            <Line 
                                data={{
                                    labels: eventParticipation.map(item => item.month),
                                    datasets: [{
                                        label: 'Events',
                                        data: eventParticipation.map(item => item.count),
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

                {/* Department Performance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#24225a] p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                            <span className="material-icons text-blue-400 mr-2">assessment</span>
                            Performance Metrics
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Participation Rate</span>
                                <span className="text-blue-400 font-bold">{successRate}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Certificate Rate</span>
                                <span className="text-green-400 font-bold">{certificateRate}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Events Participated</span>
                                <span className="text-purple-400 font-bold">{eventsParticipated}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#24225a] p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                            <span className="material-icons text-yellow-400 mr-2">insights</span>
                            Department Insights
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <span className="material-icons text-green-400 mr-2">trending_up</span>
                                <span className="text-gray-300 text-sm">
                                    {activeStudents > totalStudents * 0.6 ? 'High engagement rate' : 'Room for improvement'}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="material-icons text-blue-400 mr-2">event</span>
                                <span className="text-gray-300 text-sm">
                                    {eventsParticipated > 10 ? 'Active in events' : 'Limited event participation'}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="material-icons text-purple-400 mr-2">star</span>
                                <span className="text-gray-300 text-sm">
                                    {certificateRate > 25 ? 'Strong achievement rate' : 'Moderate achievement rate'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#24225a] p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                            <span className="material-icons text-green-400 mr-2">emoji_events</span>
                            Achievement Summary
                        </h3>
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-400">{totalCertificates}</div>
                                <div className="text-gray-400 text-sm">Total Certificates</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">{activeStudents}</div>
                                <div className="text-gray-400 text-sm">Active Participants</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Department Analytics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#24225a] p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
                            <span className="material-icons text-purple-400 mr-2">analytics</span>
                            Participation Trends
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-[#1e1b4b] rounded-lg">
                                <span className="text-gray-300">Total Event Participation</span>
                                <span className="text-purple-400 font-bold">{eventsParticipated}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-[#1e1b4b] rounded-lg">
                                <span className="text-gray-300">Average Monthly Events</span>
                                <span className="text-blue-400 font-bold">
                                    {eventParticipation.length > 0 ? Math.round(eventParticipation.reduce((sum, item) => sum + item.count, 0) / eventParticipation.length) : 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-[#1e1b4b] rounded-lg">
                                <span className="text-gray-300">Student Engagement</span>
                                <span className={`font-bold ${successRate >= 70 ? 'text-green-400' : successRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {successRate >= 70 ? 'High' : successRate >= 50 ? 'Medium' : 'Low'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#24225a] p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
                            <span className="material-icons text-green-400 mr-2">school</span>
                            Department Overview
                        </h2>
                        <div className="space-y-4">
                            <div className="text-center p-4 bg-[#1e1b4b] rounded-lg">
                                <div className="text-2xl font-bold text-blue-400">{report?.data?.name}</div>
                                <div className="text-gray-400 text-sm">Department/Faculty</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-[#1e1b4b] rounded-lg">
                                    <div className="text-lg font-bold text-green-400">{totalStudents}</div>
                                    <div className="text-gray-400 text-xs">Students</div>
                                </div>
                                <div className="text-center p-3 bg-[#1e1b4b] rounded-lg">
                                    <div className="text-lg font-bold text-purple-400">{totalCertificates}</div>
                                    <div className="text-gray-400 text-xs">Certificates</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Real Department Analytics Table */}
                <div className="bg-[#24225a] p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-white">Department Analytics Summary</h2>
                    <table className="min-w-full text-gray-300">
                        <thead>
                            <tr className="border-b border-gray-600">
                                <th className="px-4 py-2 text-left">Metric</th>
                                <th className="px-4 py-2 text-left">Value</th>
                                <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-[#1e1b4b]">
                                <td className="border-t border-gray-600 px-4 py-2">Total Students</td>
                                <td className="border-t border-gray-600 px-4 py-2">{totalStudents}</td>
                                <td className="border-t border-gray-600 px-4 py-2">
                                    <span className="text-blue-400">Active Department</span>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#1e1b4b]">
                                <td className="border-t border-gray-600 px-4 py-2">Active Participants</td>
                                <td className="border-t border-gray-600 px-4 py-2">{activeStudents}</td>
                                <td className="border-t border-gray-600 px-4 py-2">
                                    <span className={successRate >= 70 ? 'text-green-400' : successRate >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                                        {successRate >= 70 ? 'Excellent' : successRate >= 50 ? 'Good' : 'Needs Improvement'}
                                    </span>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#1e1b4b]">
                                <td className="border-t border-gray-600 px-4 py-2">Certificates Awarded</td>
                                <td className="border-t border-gray-600 px-4 py-2">{totalCertificates}</td>
                                <td className="border-t border-gray-600 px-4 py-2">
                                    <span className={certificateRate >= 30 ? 'text-green-400' : certificateRate >= 15 ? 'text-yellow-400' : 'text-red-400'}>
                                        {certificateRate >= 30 ? 'High Achievement' : certificateRate >= 15 ? 'Moderate' : 'Low Achievement'}
                                    </span>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#1e1b4b]">
                                <td className="border-t border-gray-600 px-4 py-2">Events Participated</td>
                                <td className="border-t border-gray-600 px-4 py-2">{eventsParticipated}</td>
                                <td className="border-t border-gray-600 px-4 py-2">
                                    <span className={eventsParticipated >= 10 ? 'text-green-400' : eventsParticipated >= 5 ? 'text-yellow-400' : 'text-red-400'}>
                                        {eventsParticipated >= 10 ? 'Highly Active' : eventsParticipated >= 5 ? 'Moderately Active' : 'Limited Activity'}
                                    </span>
                                </td>
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