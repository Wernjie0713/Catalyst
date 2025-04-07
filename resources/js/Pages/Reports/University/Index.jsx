import { usePage } from "@inertiajs/react"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Pie, Line } from 'react-chartjs-2'
import { Chart as ChartJS, registerables } from 'chart.js'
import { format } from 'date-fns'

// Register ChartJS components
ChartJS.register(...registerables)

export default function Index({ auth }) {
    const { report } = usePage().props;
    
    // Add debug log
    console.log('Report data:', report);

    if (!report?.data) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <div className="p-6">
                    <div className="text-red-500">No report data available</div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const metrics = report.data.metrics || {};
    const facultyData = report.data.university_metrics?.faculty_distribution || [];
    const monthlyEvents = report.data.university_metrics?.monthly_events || [];

    // Pie chart data
    const facultyChartData = {
        labels: facultyData.map(item => item.label),
        datasets: [{
            data: facultyData.map(item => item.value),
            backgroundColor: facultyData.map(item => item.color),
            borderWidth: 0
        }]
    };

    // Pie chart options
    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#fff',
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: '#1e1b4b',
                titleColor: '#fff',
                bodyColor: '#9ca3af',
                padding: 12,
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
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
                        value={metrics.totalStudents}
                        icon="school"
                        description="Registered students"
                    />
                    <MetricCard 
                        label="Active Students" 
                        value={metrics.activeStudents}
                        icon="people"
                        description="Currently active"
                    />
                    <MetricCard 
                        label="Total Events" 
                        value={metrics.totalEvents}
                        icon="calendar_today"
                        description="Events created"
                    />
                    <MetricCard 
                        label="Certificates" 
                        value={metrics.certificatesAwarded}
                        icon="card_membership"
                        description="Certificates awarded"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        labels: monthlyEvents.map(item => item.month),
                                        datasets: [{
                                            label: 'Events',
                                            data: monthlyEvents.map(item => item.count),
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

                    {/* Faculty Distribution Chart */}
                    <div className="bg-[#24225a] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="p-6 border-b border-white/10">
                            <h3 className="text-xl font-semibold">Faculty Distribution</h3>
                            <p className="text-gray-400 text-sm mt-1">
                                Student distribution by faculty
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="h-[400px]">
                                <Pie 
                                    data={{
                                        labels: facultyData.map(item => item.label),
                                        datasets: [{
                                            data: facultyData.map(item => item.value),
                                            backgroundColor: facultyData.map(item => item.color)
                                        }]
                                    }} 
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'right',
                                                labels: {
                                                    color: '#fff',
                                                    font: { size: 12 }
                                                }
                                            },
                                            tooltip: {
                                                backgroundColor: '#1e1b4b',
                                                titleColor: '#fff',
                                                bodyColor: '#9ca3af',
                                                padding: 12
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function MetricCard({ label, value, icon, description }) {
    return (
        <div className="bg-[#24225a] p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-900/50 rounded-lg">
                    <span className="material-symbols-outlined text-purple-400 text-2xl">{icon}</span>
                </div>
            </div>
            <p className="text-3xl font-bold mb-2">{value || 0}</p>
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
    );
}
