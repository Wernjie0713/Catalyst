<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Report;
use App\Models\DepartmentStaff;
use App\Models\University;
use Illuminate\Routing\Controller as BaseController;
use App\Models\User;
use App\Models\Event;
use App\Models\Certificate;
use Illuminate\Support\Facades\DB;
use App\Models\Student;
use Illuminate\Support\Facades\Log;

class ReportController extends BaseController
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
        $this->middleware('can:report_view');
    }

    public function index()
    {
        try {
            $user = auth()->user();
            $role = $user->role;

            \Log::info('Report accessed', ['role' => $role]);

            // Get report data based on role
            $report = match($role) {
                'admin' => $this->getAdminReport(),
                'university' => $this->getUniversityDashboardReport(),
                'department_staff' => $this->getDepartmentReport(),
                default => null
            };

            if (!$report) {
                \Log::warning('Invalid role accessed reports', ['role' => $role]);
                return back()->with('error', 'Unauthorized access');
            }

            // Map components
            $component = match($role) {
                'admin' => 'Reports/Admin/Index',
                'university' => 'Reports/University/Index',
                'department_staff' => 'Reports/Department/Index',
                default => null
            };

            return Inertia::render($component, [
                'report' => $report
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in report:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Failed to load report');
        }
    }

    private function getAdminReport()
    {
        try {
            // Basic metrics
            $metrics = [
                'total_users' => DB::table('users')->count(),
                'total_students' => DB::table('students')->count(),
                'total_universities' => DB::table('universities')->count(),
                'total_events' => DB::table('events')->count()
            ];

            // Get event participation data
            $eventParticipation = DB::table('events')
                ->select(
                    DB::raw('MONTH(created_at) as month_number'),
                    DB::raw('DATE_FORMAT(created_at, "%M") as month'),
                    DB::raw('COUNT(DISTINCT event_id) as count')
                )
                ->whereYear('created_at', now()->year)
                ->groupBy('month_number', 'month')
                ->orderBy('month_number')
                ->get();

            // Get university student distribution
            $universityDistribution = DB::table('students')
                ->select('university', DB::raw('count(*) as count'))
                ->whereNotNull('university')
                ->groupBy('university')
                ->get()
                ->map(function($item) {
                    return [
                        'label' => $item->university,
                        'value' => $item->count,
                        'color' => $this->getRandomColor()
                    ];
                });

            return [
                'data' => [
                    'name' => 'System Overview',
                    'generatedDate' => now()->format('F d, Y'),
                    'metrics' => $metrics,
                    'department_metrics' => [
                        'event_participation' => $eventParticipation,
                        'university_distribution' => $universityDistribution
                    ]
                ]
            ];

        } catch (\Exception $e) {
            \Log::error('Error generating admin report:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    private function getUniversityDashboardReport()
    {
        try {
            $user = auth()->user();
            if (!$user || !$user->university) {
                \Log::error('No university found for user');
                throw new \Exception('University data not found');
            }

            $universityName = $user->university->name;
            \Log::info('Getting university report for:', ['university' => $universityName, 'user_id' => $user->id]);

            // University-specific queries with proper filtering
            $totalStudents = DB::table('students')
                ->where('university', $universityName)
                ->count();

            $activeStudents = DB::table('students')
                ->join('users', 'students.user_id', '=', 'users.id')
                ->join('enrollments', 'users.id', '=', 'enrollments.user_id')
                ->where('students.university', $universityName)
                ->distinct('students.student_id')
                ->count('students.student_id');

            $totalEvents = DB::table('events')
                ->join('enrollments', 'events.event_id', '=', 'enrollments.event_id')
                ->join('users', 'enrollments.user_id', '=', 'users.id')
                ->join('students', 'users.id', '=', 'students.user_id')
                ->where('students.university', $universityName)
                ->distinct('events.event_id')
                ->count('events.event_id');

            $certificatesAwarded = DB::table('certificates')
                ->join('students', 'certificates.student_id', '=', 'students.student_id')
                ->where('students.university', $universityName)
                ->count();

            $metrics = [
                'totalStudents' => $totalStudents,
                'activeStudents' => $activeStudents,
                'totalEvents' => $totalEvents,
                'certificatesAwarded' => $certificatesAwarded
            ];

            \Log::info('University metrics calculated:', $metrics);

            // Faculty distribution
            $facultyDistribution = DB::table('students')
                ->where('university', $universityName)
                ->whereNotNull('faculty')
                ->select('faculty', DB::raw('count(*) as count'))
                ->groupBy('faculty')
                ->get()
                ->map(function($item) {
                    return [
                        'label' => $item->faculty,
                        'value' => $item->count,
                        'color' => $this->getRandomColor()
                    ];
                });

            // Monthly events data
            $monthlyEvents = DB::table('events')
                ->join('enrollments', 'events.event_id', '=', 'enrollments.event_id')
                ->join('users', 'enrollments.user_id', '=', 'users.id')
                ->join('students', 'users.id', '=', 'students.user_id')
                ->where('students.university', $universityName)
                ->whereYear('events.created_at', now()->year)
                ->select(
                    DB::raw('MONTH(events.created_at) as month_number'),
                    DB::raw('MONTHNAME(events.created_at) as month'),
                    DB::raw('COUNT(DISTINCT events.event_id) as count')
                )
                ->groupBy('month_number', 'month')
                ->orderBy('month_number')
                ->get();

            // Log the data for debugging
            \Log::info('University report data prepared', [
                'university' => $universityName,
                'metrics' => $metrics,
                'faculty_count' => $facultyDistribution->count(),
                'monthly_events' => $monthlyEvents->count()
            ]);

            return [
                'data' => [
                    'name' => $universityName,
                    'generatedDate' => now()->format('F d, Y'),
                    'metrics' => $metrics,
                    'university_metrics' => [
                        'faculty_distribution' => $facultyDistribution,
                        'monthly_events' => $monthlyEvents
                    ]
                ]
            ];

        } catch (\Exception $e) {
            \Log::error('Error in university report:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    private function getRandomColor()
    {
        $colors = [
            '#4c1d95', '#5b21b6', '#6d28d9', 
            '#7c3aed', '#8b5cf6', '#a78bfa',
            '#c4b5fd', '#ddd6fe', '#ede9fe'
        ];
        static $index = 0;
        return $colors[$index++ % count($colors)];
    }

    private function getDepartmentReport()
    {
        try {
            $departmentStaff = DepartmentStaff::where('user_id', auth()->id())->first();
            
            if (!$departmentStaff) {
                \Log::error('Department staff not found', ['user_id' => auth()->id()]);
                throw new \Exception('Department staff data not found');
            }

            $facultyName = $departmentStaff->faculty;
            \Log::info('Getting department report for faculty:', ['faculty' => $facultyName]);

            // Get basic student metrics
            $totalStudents = Student::where('faculty', $facultyName)->count();
            $activeStudents = Student::where('faculty', $facultyName)
                ->whereHas('user.enrolledEvents')->count();

            // Get certificate data
            $totalCertificates = Certificate::whereHas('student', function($query) use ($facultyName) {
                $query->where('faculty', $facultyName);
            })->count();

            // Get events participated (unique events where faculty students enrolled)
            $eventsParticipated = Event::whereHas('enrolledUsers.student', function($query) use ($facultyName) {
                $query->where('faculty', $facultyName);
            })->count();

            // Get detailed event participation by month
            $eventParticipation = DB::table('events')
                ->join('enrollments', 'events.event_id', '=', 'enrollments.event_id')
                ->join('users', 'enrollments.user_id', '=', 'users.id')
                ->join('students', 'users.id', '=', 'students.user_id')
                ->where('students.faculty', $facultyName)
                ->whereYear('events.created_at', now()->year)
                ->select(
                    DB::raw('MONTH(events.created_at) as month_number'),
                    DB::raw('MONTHNAME(events.created_at) as month'),
                    DB::raw('COUNT(DISTINCT events.event_id) as count')
                )
                ->groupBy('month_number', 'month')
                ->orderBy('month_number')
                ->get();

            // Add months with 0 events to complete the year
            $allMonths = collect([
                1 => 'January', 2 => 'February', 3 => 'March', 4 => 'April',
                5 => 'May', 6 => 'June', 7 => 'July', 8 => 'August',
                9 => 'September', 10 => 'October', 11 => 'November', 12 => 'December'
            ]);

            $eventParticipationComplete = $allMonths->map(function ($monthName, $monthNumber) use ($eventParticipation) {
                $existing = $eventParticipation->where('month_number', $monthNumber)->first();
                return [
                    'month_number' => $monthNumber,
                    'month' => $monthName,
                    'count' => $existing ? $existing->count : 0
                ];
            })->values();

            \Log::info('Department report metrics calculated:', [
                'total_students' => $totalStudents,
                'active_students' => $activeStudents,
                'total_certificates' => $totalCertificates,
                'events_participated' => $eventsParticipated
            ]);

            return [
                'data' => [
                    'name' => $facultyName,
                    'generatedDate' => now()->format('F d, Y'),
                    'metrics' => [
                        'total_students' => $totalStudents,
                        'active_students' => $activeStudents,
                        'total_certificates' => $totalCertificates,
                        'events_participated' => $eventsParticipated,
                    ],
                    'department_metrics' => [
                        'event_participation' => $eventParticipationComplete
                    ]
                ]
            ];

        } catch (\Exception $e) {
            \Log::error('Error in department report:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function getFacultyReport($facultyId)
    {
        $this->authorize('view-faculty-reports');
        
        $report = $this->reportService->generateReport($facultyId);

        return Inertia::render('Reports/Faculty', [
            'report' => $report,
            'faculty' => Faculty::find($facultyId),
            'filters' => request()->all('search', 'date')
        ]);
    }

    public function getUniversityReport($universityId)
    {
        $this->authorize('view-university-reports');
        
        $report = $this->reportService->generateReport(null, $universityId);

        return Inertia::render('Reports/University', [
            'report' => $report,
            'university' => University::find($universityId)
        ]);
    }

    public function getSystemReport()
    {
        $this->authorize('view-all-reports');
        
        $report = $this->reportService->generateReport();

        return Inertia::render('Reports/System', [
            'report' => $report
        ]);
    }

    public function departmentReport()
    {
        try {
            \Log::info('Department report accessed');
            $departmentStaff = DepartmentStaff::where('user_id', auth()->id())->first();
            
            if (!$departmentStaff) {
                \Log::error('Department staff not found', ['user_id' => auth()->id()]);
                return back()->with('error', 'Department staff data not found');
            }

            $facultyName = $departmentStaff->faculty;

            // Get event participation data
            $eventParticipation = DB::table('events')
                ->join('enrollments', 'events.event_id', '=', 'enrollments.event_id')
                ->join('users', 'enrollments.user_id', '=', 'users.id')
                ->join('students', 'users.id', '=', 'students.user_id')
                ->where('students.faculty', $facultyName)
                ->select(
                    DB::raw('MONTH(events.created_at) as month_number'),
                    DB::raw('DATE_FORMAT(events.created_at, "%M") as month'),
                    DB::raw('COUNT(DISTINCT events.event_id) as count')
                )
                ->groupBy('month_number', 'month')
                ->orderBy('month_number')
                ->get();

            return Inertia::render('Reports/Department/Index', [
                'report' => [
                    'data' => [
                        'name' => $facultyName,
                        'generatedDate' => now()->format('F d, Y'),
                        'metrics' => [
                            'total_students' => Student::where('faculty', $facultyName)->count(),
                            'active_students' => Student::where('faculty', $facultyName)
                                ->whereHas('user.enrolledEvents')->count(),
                            'total_certificates' => Certificate::whereHas('student', function($query) use ($facultyName) {
                                $query->where('faculty', $facultyName);
                            })->count(),
                            'events_participated' => Event::whereHas('enrolledUsers.student', function($query) use ($facultyName) {
                                $query->where('faculty', $facultyName);
                            })->count(),
                        ],
                        'department_metrics' => [
                            'event_participation' => $eventParticipation
                        ]
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in department report:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to load report');
        }
    }

    public function universityReport()
    {
        try {
            \Log::info('University report accessed');
            $report = $this->getUniversityDashboardReport();
            return Inertia::render('Reports/University/Index', ['report' => $report]);
        } catch (\Exception $e) {
            \Log::error('Error in university report:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to load report');
        }
    }

    public function adminReport()
    {
        try {
            \Log::info('Admin report accessed');
            return Inertia::render('Reports/Admin/Index', [
                'report' => $this->getAdminDashboardReport()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in admin report:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to load report');
        }
    }
} 