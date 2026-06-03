import { Link } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";

function AppLayout({ children, title = "SchedNova" }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="ml-0 md:ml-72 p-6 md:p-8 transition-all duration-300">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              {title}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
          </div>
          <Link
            to="/settings"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500 hover:bg-slate-900"
          >
            Settings
          </Link>
        </div>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}

export default AppLayout;
