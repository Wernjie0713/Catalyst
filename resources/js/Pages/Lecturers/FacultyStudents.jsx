import React, { useMemo, useState, useLayoutEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function FacultyStudents({ students = [], stats = {}, auth }) {
  const [query, setQuery] = useState('');
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const gridRef = useRef(null);

  useLayoutEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const mod = await import('gsap');
        if (!isMounted) return;
        const gsap = mod.gsap || mod.default || mod;
        gsap.defaults({ force3D: true });

        if (headerRef.current) {
          gsap.fromTo(headerRef.current, { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' });
        }

        if (statsRef.current) {
          const items = Array.from(statsRef.current.querySelectorAll('[data-stat]'));
          gsap.fromTo(items, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.06, delay: 0.05 });
        }

        // Note: Student cards intentionally have no entrance animation
      } catch (e) {
        // If GSAP isn't installed, page still works without animations
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(s =>
      (s.name || '').toLowerCase().includes(q) ||
      (s.matric_no || '').toLowerCase().includes(q)
    );
  }, [students, query]);

  return (
    <AuthenticatedLayout>
      <Head title="Faculty Students" />
      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div ref={headerRef} className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="material-symbols-outlined text-[#F37022] mr-3">groups_3</span>
                Faculty Students
              </h1>
              <p className="mt-2 text-gray-600">Browse students from your faculty and university</p>
            </div>
            <div ref={statsRef} className="flex items-center gap-3">
              <div className="hidden sm:flex gap-4">
                <div data-stat><Stat label="Total" value={stats.total} icon="database" color="orange" /></div>
                <div data-stat><Stat label="Active" value={stats.active} icon="bolt" color="emerald" /></div>
                <div data-stat><Stat label="With Projects" value={stats.with_projects} icon="school" color="indigo" /></div>
                <div data-stat><Stat label="With Certificates" value={stats.with_certs} icon="military_tech" color="violet" /></div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#F37022]">search</span>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name or matric no"
                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-200 focus:border-[#F37022] bg-white"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow p-12 text-center text-gray-500">
              No students found.
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s, i) => (
                <div key={s.user_id || i} data-card className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-300 transition will-change-transform will-change-opacity">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <Avatar name={s.name} photo={s.profile_photo_path} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 truncate max-w-[220px]">{s.name}</h3>
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
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <MiniStat icon="folder" label="Projects" value={s.projects_count} color="indigo" />
                      <MiniStat icon="military_tech" label="Certs" value={s.certificates_count} color="violet" />
                      <MiniStat icon="schedule" label="Updated" value={s.updated_at ? new Date(s.updated_at).toLocaleDateString() : '-'} color="slate" />
                    </div>
                    <div className="mt-4">
                      <Link href={route('profile.view', s.user_id)} className="inline-flex items-center gap-1 text-sm text-[#F37022] hover:text-orange-600">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

function Stat({label, value, icon, color='orange'}){
  const colorMap = {
    orange: {
      ring: 'ring-orange-200',
      text: 'text-[#F37022]',
      icon: 'text-[#F37022]'
    },
    emerald: { ring: 'ring-emerald-200', text: 'text-emerald-600', icon: 'text-emerald-500' },
    indigo: { ring: 'ring-indigo-200', text: 'text-indigo-600', icon: 'text-indigo-500' },
    violet: { ring: 'ring-violet-200', text: 'text-violet-600', icon: 'text-violet-500' }
  }[color] || { ring: 'ring-orange-200', text: 'text-[#F37022]', icon: 'text-[#F37022]' };
  return (
    <div className={`px-4 py-2 rounded-md bg-white border border-gray-200 hover:ring-2 ${colorMap.ring} transition`}>
      <div className={`flex items-center gap-2 ${colorMap.text}`}>
        <span className={`material-symbols-outlined text-base ${colorMap.icon}`}>{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-gray-900 -mt-1">{value ?? 0}</div>
    </div>
  );
}

function MiniStat({icon, label, value, color='slate'}){
  const colorMap = {
    indigo: 'text-indigo-600',
    violet: 'text-violet-600',
    emerald: 'text-emerald-600',
    slate: 'text-slate-600',
    orange: 'text-[#F37022]'
  };
  return (
    <div className="rounded-md bg-white border border-gray-200 p-3">
      <div className="text-xs text-gray-600 flex items-center gap-1">
        <span className={`material-symbols-outlined text-sm ${colorMap[color] || 'text-slate-600'}`}>{icon}</span>
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-900 mt-1">{value}</div>
    </div>
  );
}

function Avatar({ name, photo }){
  if (photo) {
    return <img src={photo} alt={name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
  }
  const initial = (name || '?').charAt(0).toUpperCase();
  return (
    <div className="w-12 h-12 rounded-full bg-[#F37022] text-white flex items-center justify-center text-lg font-medium">
      {initial}
    </div>
  );
}


