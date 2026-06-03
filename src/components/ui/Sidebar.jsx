import { NavLink } from "react-router-dom";
import {
  Home,
  CalendarDays,
  Settings,
  Users,
  BookOpen,
  LayoutDashboard,
  Building2,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/setup", label: "Setup Wizard", icon: BookOpen },
  { to: "/timetable", label: "Timetable", icon: CalendarDays },
  { to: "/teachers", label: "Teachers", icon: Users },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/rooms", label: "Rooms & Labs", icon: Building2 },
  { to: "/settings", label: "Settings", icon: Settings },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-20 h-full w-full max-w-full bg-slate-950/95 border-b border-slate-800 border-r border-slate-800/80 md:w-72 md:rounded-r-3xl md:border-none md:shadow-glass">
      <div className="flex h-full flex-col justify-between p-6">
        <div>
          <NavLink
            to="/dashboard"
            className="mb-10 inline-flex items-center gap-3 text-2xl font-semibold text-slate-100"
          >
            <Home className="h-6 w-6" />
            SchedNova
          </NavLink>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-800 text-white shadow-glass"
                        : "text-slate-400 hover:bg-slate-900/80 hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Quick Start</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Use the setup wizard to define your institute, teachers, subjects,
            sections, and rules.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
