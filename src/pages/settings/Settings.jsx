import AppLayout from "../../layouts/AppLayout";

function Settings() {
  return (
    <AppLayout title="Settings">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glass">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Workspace settings
        </p>
        <div className="mt-8 space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">
              Account & roles
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Manage user roles, authentication, and profile settings.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">
              Timetable rules
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Review your scheduling constraints and optimization settings.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Settings;
