import { usePage, Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useMemo, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

// Register ChartJS components
ChartJS.register(...registerables);

// No more dummy data - using real data from backend

// Real data analytics for department

export default function Index({ auth }) {
    const { report } = usePage().props;
    const user = auth?.user || {};

    // Students provided by backend or fallback to empty (support multiple payload shapes)
    const rawStudents =
        report?.data?.students ??
        report?.students ??
        report?.data?.department_metrics?.students ??
        [];
    const staffFaculty = user?.department_staff?.faculty;
    const staffUniversity = user?.department_staff?.university;

    // Client-side guard: ensure only same university AND same faculty
    const students = useMemo(() => {
        return rawStudents.filter(s => (
            (!staffUniversity || s.university === staffUniversity) &&
            (!staffFaculty || s.faculty === staffFaculty)
        ));
    }, [rawStudents, staffFaculty, staffUniversity]);

    const metrics = report?.data?.metrics || {};
    const eventParticipation = report?.data?.department_metrics?.event_participation || [];
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 6;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return students;
        return students.filter(s => (
            (s.name || '').toLowerCase().includes(q) ||
            (s.matric_no || '').toLowerCase().includes(q)
        ));
    }, [students, query]);

    // Pagination derived values
    const totalPages = Math.max(1, Math.ceil((Array.isArray(filtered) ? filtered.length : 0) / pageSize));
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const paged = useMemo(() => {
        if (!Array.isArray(filtered)) return [];
        const start = (currentPage - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, currentPage]);

    // Debug removed

    // Derived numbers
    const totalStudents = filtered.length || metrics.total_students || 0;
    const activeStudents = metrics.active_students || 0;
    const totalCertificates = metrics.total_certificates || 0;
    const eventsParticipated = metrics.events_participated || 0;
    const successRate = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;
    const certificateRate = totalStudents > 0 ? Math.round((totalCertificates / totalStudents) * 100) : 0;

    // Charts
    const activeVsInactive = {
        labels: ['Active', 'Others'],
        datasets: [{
            data: [activeStudents, Math.max(totalStudents - activeStudents, 0)],
            backgroundColor: ['#F37022', '#fde7da'],
            borderColor: ['#F37022', '#fde7da']
        }]
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Department Report" />

            <div className="py-6 sm:py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                                <span className="material-symbols-outlined text-[#F37022] mr-2 sm:mr-3">analytics</span>
                                Department Report
                            </h1>
                        </div>
                        <div className="w-full sm:w-72">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#F37022]">search</span>
                                <input
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    placeholder="Search students by name or matric no"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-200 focus:border-[#F37022] bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Debug UI removed */}

                    {/* Top stats + charts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <Stat label="Total Students" value={totalStudents} icon="school" />
                        <Stat label="Active Students" value={activeStudents} icon="bolt" />
                        <Stat label="Certificates" value={totalCertificates} icon="military_tech" />
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                            <div className="text-sm text-gray-600 mb-2">Active vs Others</div>
                            <div className="h-24 sm:h-28">
                                <Doughnut data={activeVsInactive} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>

                    {/* Events line chart */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 mb-6 sm:mb-8">
                        <div className="flex items-center gap-2 mb-3 text-gray-800 font-medium">
                            <span className="material-symbols-outlined text-[#F37022]">timeline</span>
                            Monthly Events
                        </div>
                        <div className="h-40 sm:h-48">
                            <Line
                                data={{
                                    labels: eventParticipation.map(i => i.month),
                                    datasets: [{
                                        label: 'Events',
                                        data: eventParticipation.map(i => i.count),
                                        borderColor: '#F37022',
                                        backgroundColor: 'rgba(243,112,34,0.15)',
                                        fill: true,
                                        tension: 0.35,
                                        borderWidth: 2
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        x: { grid: { display: false } },
                                        y: { beginAtZero: true, grid: { color: '#f1f5f9' } }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Students grid */}
                    {Array.isArray(filtered) && filtered.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 shadow p-6 sm:p-12 text-center text-gray-500">
                            No students found.
                        </div>
                    ) : Array.isArray(filtered) ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {paged.map((s, i) => (
                                <Link key={s.user_id || i} href={route('profile.view', s.user_id)} className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-300 transition block">
                                    <div className="p-4 sm:p-5">
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <Avatar name={s.name} />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-semibold text-gray-900 truncate max-w-[180px] sm:max-w-[220px]">{s.name}</h3>
                                                    {s.is_active && (
                                                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Active</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">{s.matric_no}</p>
                                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                                    <span className="material-symbols-outlined text-sm">apartment</span>
                                                    <span className="truncate">{s.university} • {s.faculty}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                                            <MiniStat icon="folder" label="Projects" value={s.projects_count} color="indigo" />
                                            <MiniStat icon="military_tech" label="Certs" value={s.certificates_count} color="violet" />
                                            <MiniStat icon="schedule" label="Updated" value={s.updated_at ? new Date(s.updated_at).toLocaleDateString() : '-'} color="slate" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : null}

                    {/* Pagination controls */}
                    {Array.isArray(filtered) && filtered.length > pageSize && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-orange-50 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={currentPage === 1}
                            >
                                Prev
                            </button>
                            <span className="text-sm text-gray-600 px-2">Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                className="px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-orange-50 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Updated Student Carousel with auto sliding and motion
function Stat({ label, value, icon }){
    return (
        <div className="px-3 sm:px-4 py-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="text-[#F37022] flex items-center gap-2">
                <span className="material-symbols-outlined text-lg sm:text-xl">{icon}</span>
                <span className="text-xs sm:text-sm font-medium text-gray-700">{label}</span>
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-gray-900 mt-1">{value ?? 0}</div>
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

// Small stat for each student card
function MiniStat({icon, label, value, color='slate'}){
    const colorMap = {
        indigo: 'text-indigo-600',
        violet: 'text-violet-600',
        emerald: 'text-emerald-600',
        slate: 'text-slate-600',
        orange: 'text-[#F37022]'
    };
    return (
        <div className="rounded-md bg-white border border-gray-200 p-2 sm:p-3">
            <div className="text-xs text-gray-600 flex items-center gap-1">
                <span className={`material-symbols-outlined text-xs sm:text-sm ${colorMap[color] || 'text-slate-600'}`}>{icon}</span>
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.length > 4 ? label.substring(0, 4) : label}</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-900 mt-1">{value}</div>
        </div>
    );
}

// Simple Avatar: always show default orange circle with initial (no photo)
function Avatar({ name }){
    const initial = (name || '?').charAt(0).toUpperCase();
    return (
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F37022] text-white flex items-center justify-center text-base sm:text-lg font-medium">
            {initial}
        </div>
    );
}