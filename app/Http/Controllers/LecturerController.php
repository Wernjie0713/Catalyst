<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Facades\DB;

class LecturerController extends Controller
{
    public function facultyStudents(Request $request)
    {
        $user = auth()->user()->load('lecturer');
        abort_unless($user && $user->lecturer, 403);

        $faculty = $user->lecturer->faculty;
        $university = $user->lecturer->university;

        $students = Student::with(['user'])
            ->where('faculty', $faculty)
            ->where('university', $university)
            ->withCount(['certificates'])
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function (Student $s) {
                $u = $s->user;
                // Count projects owned by student OR via accepted team membership
                $projectsCount = DB::table('projects')
                    ->where(function($query) use ($s, $u) {
                        $query->where('student_id', $s->student_id)
                              ->orWhereExists(function($subQuery) use ($u) {
                                  $subQuery->select(DB::raw(1))
                                      ->from('team_members')
                                      ->join('teams', 'team_members.team_id', '=', 'teams.id')
                                      ->whereColumn('teams.id', 'projects.team_id')
                                      ->where('team_members.user_id', $u?->id)
                                      ->where('team_members.status', 'accepted');
                              });
                    })
                    ->count();
                return [
                    'user_id' => $u?->id,
                    'name' => $u?->name,
                    'matric_no' => $s->matric_no,
                    'faculty' => $s->faculty,
                    'university' => $s->university,
                    'year' => $s->year,
                    'level' => $s->level,
                    'profile_photo_path' => $s->profile_photo_path,
                    'certificates_count' => $s->certificates_count,
                    'projects_count' => $projectsCount,
                    'is_active' => optional($u)->updated_at ? now()->diffInDays($u->updated_at) <= 30 : false,
                    'updated_at' => optional($u)->updated_at?->toDateTimeString(),
                ];
            });

        $stats = [
            'total' => $students->count(),
            'active' => $students->where('is_active', true)->count(),
            'with_projects' => $students->where('projects_count', '>', 0)->count(),
            'with_certs' => $students->where('certificates_count', '>', 0)->count(),
        ];

        return Inertia::render('Lecturers/FacultyStudents', [
            'students' => $students,
            'stats' => $stats,
        ]);
    }
}


