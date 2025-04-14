import { usePage } from "@inertiajs/react"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Pie, Line } from 'react-chartjs-2'
import { Chart as ChartJS, registerables } from 'chart.js'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion';

// Register ChartJS components
ChartJS.register(...registerables)

export default function Index({ auth }) {
    const { report } = usePage().props;
    
    // Animation variants
    const pageVariants = {
        initial: { opacity: 0 },
        animate: { 
            opacity: 1, 
            transition: { 
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const headerVariants = {
        initial: { opacity: 0, y: -20 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const cardVariants = {
        initial: { opacity: 0, y: 20 },
        animate: i => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5
            }
        }),
        hover: {
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.2)",
            transition: { duration: 0.2 }
        }
    };

    const chartVariants = {
        initial: { opacity: 0, y: 30 },
        animate: i => ({
            opacity: 1, 
            y: 0,
            transition: { 
                delay: 0.2 + (i * 0.2),
                duration: 0.6,
                ease: "easeOut"
            }
        }),
        hover: {
            y: -5,
            transition: { duration: 0.3 }
        }
    };

    // Add debug log
    console.log('Report data:', report);

    if (!report?.data) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <div className="p-6">
                    <motion.div 
                        className="text-red-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        No report data available
                    </motion.div>
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
        },
        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1500
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <motion.div 
                className="p-6 bg-[#1e1b4b] text-white min-h-screen"
                initial="initial"
                animate="animate"
                variants={pageVariants}
            >
                {/* Header */}
                <motion.div 
                    className="mb-8"
                    variants={headerVariants}
                >
                    <h1 className="text-3xl font-bold mb-2">{report?.data?.name}</h1>
                    <p className="text-gray-400">
                        Generated on {report?.data?.generatedDate}
                    </p>
                </motion.div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedMetricCard 
                        label="Total Students" 
                        value={metrics.totalStudents}
                        icon="school"
                        description="Registered students"
                        index={0}
                        variants={cardVariants}
                    />
                    <AnimatedMetricCard 
                        label="Active Students" 
                        value={metrics.activeStudents}
                        icon="people"
                        description="Currently active"
                        index={1}
                        variants={cardVariants}
                    />
                    <AnimatedMetricCard 
                        label="Total Events" 
                        value={metrics.totalEvents}
                        icon="calendar_today"
                        description="Events created"
                        index={2}
                        variants={cardVariants}
                    />
                    <AnimatedMetricCard 
                        label="Certificates" 
                        value={metrics.certificatesAwarded}
                        icon="card_membership"
                        description="Certificates awarded"
                        index={3}
                        variants={cardVariants}
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Monthly Events Chart */}
                    <motion.div 
                        className="bg-[#24225a] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                        variants={chartVariants}
                        custom={0}
                        whileHover="hover"
                    >
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
                                        },
                                        animation: {
                                            duration: 2000,
                                            easing: 'easeOutQuart'
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Faculty Distribution Chart */}
                    <motion.div 
                        className="bg-[#24225a] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                        variants={chartVariants}
                        custom={1}
                        whileHover="hover"
                    >
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
                                        },
                                        animation: {
                                            animateRotate: true,
                                            animateScale: true,
                                            duration: 1500
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}

function AnimatedMetricCard({ label, value, icon, description, index, variants }) {
    return (
        <motion.div 
            className="bg-[#24225a] p-6 rounded-lg shadow-lg"
            variants={variants}
            custom={index}
            whileHover="hover"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-900/50 rounded-lg">
                    <span className="material-symbols-outlined text-purple-400 text-2xl">{icon}</span>
                </div>
            </div>
            <motion.p 
                className="text-3xl font-bold mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: {
                        delay: 0.1 + (index * 0.1),
                        duration: 0.4,
                        type: "spring",
                        stiffness: 100
                    }
                }}
            >
                {value || 0}
            </motion.p>
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            <p className="text-xs text-gray-500">{description}</p>
        </motion.div>
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
