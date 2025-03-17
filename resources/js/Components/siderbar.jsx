import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import "../../css/sidebar.css";

const navItems = [
  {
    name: "Profile",
    icon: "person",
    route: "profile.show",
    path: "/profile"
  },
  {
    name: "Dashboard",
    icon: "dashboard",
    route: "dashboard",
    path: "/dashboard"
  },
  {
    name: "Event",
    icon: "celebration",
    route: "events.index",
    path: "/events"
  },
  {
    name: "MyEvents",
    icon: "work_history",
    route: "events.my-events",
    path: "/my-events"
  },
  {
    name: "Settings",
    icon: "settings",
    route: "setting.edit",
    path: "/setting"
  },
  {
    name: "Roles Management",
    icon: "settings_accessibility",
    route: "admin.roles.index",
    path: "/admin/roles"
  },
  {
    name: "Logout",
    icon: "logout",
    action: () => router.post(route('logout'))
  }
];

const logo = "/images/Catalyst.png";

export const Sidebar = () => {
  const { url, auth } = usePage().props;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const filteredNavItems = navItems.filter(item => {
    if (item.name === "Roles Management" && auth?.user?.role !== "Admin") {
      return false;
    }
    if (item.name === "Profile" && auth?.user?.role === "Admin") {
      return false;
    }
    return true;
  });

  const getActiveIndex = () => {
    const currentPath = url ? `/${url}`.replace(/^\/+/, '/') : '';
    return filteredNavItems.findIndex(item => {
      if (!item.path) return false;
      const itemPath = item.path.replace(/^\/+/, '/');
      if (itemPath === '/' && currentPath === '/') return true;
      return currentPath === itemPath || 
             (currentPath.startsWith(itemPath + '/') && itemPath !== '/');
    });
  };

  const handleClick = (item) => {
    if (item.action) {
      item.action();
    } else if (item.route) {
      router.get(route(item.route));
    }
    setIsMobileMenuOpen(false);
  };

  const activeIndex = getActiveIndex();

  // Mobile Menu Component
  const MobileMenu = () => (
    <div className="md:hidden">
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
      >
        <span className="sr-only">Open menu</span>
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-16 left-4 z-50 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {filteredNavItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(item)}
                  className={`
                    w-full text-left px-4 py-2 text-sm flex items-center space-x-3
                    ${activeIndex === index 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Desktop Sidebar Component
  const DesktopSidebar = () => (
    <section className="page sidebar-page hidden md:block">
      <aside className="sidebar">
        <div className="inner">
          <div className="header">
            <img src={logo} className="logo" alt="Catalyst Logo" />
            <h1 className="text-white">Catalyst</h1>
          </div>
          <nav
            className="menu"
            style={{ "--top": `${activeIndex === -1 ? 0 : activeIndex * 56}px` }}
          >
            {filteredNavItems.map((item, index) => (
              <button
                className={activeIndex === index ? "active" : ""}
                key={index}
                type="button"
                onClick={() => handleClick(item)}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <p>{item.name}</p>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </section>
  );

  return (
    <>
      <MobileMenu />
      <DesktopSidebar />
    </>
  );
};