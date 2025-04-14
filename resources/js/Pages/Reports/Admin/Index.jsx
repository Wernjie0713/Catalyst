import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(...registerables);

export default function Index({ auth }) {
    const { report } = usePage().props;
    const metrics = report?.data?.metrics || {};
    const eventParticipation = report?.data?.department_metrics?.event_participation || [];
    const universityDistribution = report?.data?.department_metrics?.university_distribution || [];

    // Keep only the activeMetric state
    const [activeMetric, setActiveMetric] = useState(null);

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
            scale: 1.05,
            boxShadow: "0 10px 25px -5px rgba(76, 29, 149, 0.2)",
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.98,
            transition: { duration: 0.1 }
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

    // Function to handle metric card click
    const handleMetricClick = (metricType) => {
        setActiveMetric(activeMetric === metricType ? null : metricType);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <motion.div 
                className="p-6 bg-[#1e1b4b] text-white min-h-screen"
                initial="initial"
                animate="animate"
                variants={pageVariants}
            >
                {/* Header without Time Range Selector */}
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
                        label="Total Users" 
                        value={metrics.total_users}
                        icon="people"
                        description="All system users"
                        isActive={activeMetric === 'users'}
                        onClick={() => handleMetricClick('users')}
                        index={0}
                        variants={cardVariants}
                    />
                    <AnimatedMetricCard 
                        label="Total Students" 
                        value={metrics.total_students}
                        icon="school"
                        description="Registered students"
                        isActive={activeMetric === 'students'}
                        onClick={() => handleMetricClick('students')}
                        index={1}
                        variants={cardVariants}
                    />
                    <AnimatedMetricCard 
                        label="Total Events" 
                        value={metrics.total_events}
                        icon="calendar_today"
                        description="Active events"
                        isActive={activeMetric === 'events'}
                        onClick={() => handleMetricClick('events')}
                        index={2}
                        variants={cardVariants}
                    />
                    <AnimatedMetricCard 
                        label="Universities" 
                        value={metrics.total_universities}
                        icon="account_balance"
                        description="Registered institutions"
                        isActive={activeMetric === 'universities'}
                        onClick={() => handleMetricClick('universities')}
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
                                        interaction: {
                                            mode: 'index',
                                            intersect: false,
                                        },
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

                    {/* University Distribution Chart */}
                    <motion.div 
                        className="bg-[#24225a] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                        variants={chartVariants}
                        custom={1}
                        whileHover="hover"
                    >
                        <div className="p-6 border-b border-white/10">
                            <h3 className="text-xl font-semibold">University Distribution</h3>
                            <p className="text-gray-400 text-sm mt-1">
                                Student distribution by university
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="h-[400px]">
                                <Pie 
                                    data={{
                                        labels: universityDistribution.map(item => item.label),
                                        datasets: [{
                                            data: universityDistribution.map(item => item.value),
                                            backgroundColor: universityDistribution.map(item => item.color)
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
                                                    font: { size: 12 },
                                                    usePointStyle: true,
                                                    padding: 20
                                                }
                                            },
                                            tooltip: {
                                                backgroundColor: '#1e1b4b',
                                                titleColor: '#fff',
                                                bodyColor: '#9ca3af',
                                                padding: 12,
                                                callbacks: {
                                                    label: (context) => {
                                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                        const percentage = ((context.raw / total) * 100).toFixed(1);
                                                        return `${context.label}: ${context.raw} (${percentage}%)`;
                                                    }
                                                }
                                            }
                                        },
                                        animation: {
                                            duration: 1500,
                                            animateRotate: true,
                                            animateScale: true
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

function AnimatedMetricCard({ label, value, icon, description, isActive, onClick, index, variants }) {
    return (
        <motion.div 
            className={`bg-[#24225a] p-6 rounded-lg shadow-lg cursor-pointer
                transition-all duration-300
                ${isActive ? 'ring-2 ring-purple-500 shadow-purple-500/20' : ''}
            `}
            onClick={onClick}
            variants={variants}
            custom={index}
            whileHover="hover"
            whileTap="tap"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-purple-900/50 rounded-lg transition-all duration-300
                    ${isActive ? 'bg-purple-600/50' : 'bg-purple-900/50'}
                `}>
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

function MetricCard({ label, value, icon, description, isActive, onClick }) {
    return (
        <div 
            className={`bg-[#24225a] p-6 rounded-lg shadow-lg cursor-pointer 
                transition-all duration-300 hover:shadow-xl hover:scale-105
                ${isActive ? 'ring-2 ring-purple-500 shadow-purple-500/20' : ''}
            `}
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-purple-900/50 rounded-lg transition-all duration-300
                    ${isActive ? 'bg-purple-600/50' : 'bg-purple-900/50'}
                `}>
                    <span className="material-symbols-outlined text-purple-400 text-2xl">{icon}</span>
                </div>
            </div>
            <p className="text-3xl font-bold mb-2">{value || 0}</p>
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
    );
}
