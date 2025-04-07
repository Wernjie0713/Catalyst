import { usePage, Head } from "@inertiajs/react"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useState } from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, registerables } from 'chart.js'
import { format } from 'date-fns'
import { Menu } from '@headlessui/react'

// Register ChartJS components
ChartJS.register(...registerables)

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

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <MetricCard 
                        label="Total Students" 
                        value={metrics.total_students}
                        icon="people"
                        description="Total registered students"
                    />
                    <MetricCard 
                        label="Active Students" 
                        value={metrics.active_students}
                        icon="people"
                        description="Currently active students"
                    />
                    <MetricCard 
                        label="Total Certificates" 
                        value={metrics.total_certificates}
                        icon="school"
                        description="Certificates awarded"
                    />
                    <MetricCard 
                        label="Events Participated" 
                        value={metrics.events_participated}
                        icon="calendar_today"
                        description="Total events participated"
                    />
                </div>

                {/* Monthly Events Chart */}
                <div className="bg-[#24225a] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-xl font-semibold">Monthly Events</h3>
                        <p className="text-gray-400 text-sm mt-1">
                            Event distribution across months
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="h-[400px]">
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
                                                font: { size: 12 }
                                            }
                                        },
                                        x: {
                                            grid: { display: false },
                                            ticks: {
                                                color: '#9ca3af',
                                                font: { size: 12 }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function MetricCard({ label, value, icon, description }) {
    return (
        <div className="bg-[#24225a] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
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