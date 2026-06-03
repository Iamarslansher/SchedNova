import { motion } from "framer-motion";
import AppLayout from "../../layouts/AppLayout";

function Dashboard() {
  return (
    <AppLayout title="Dashboard">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="grid gap-6 xl:grid-cols-[1.5fr_1fr]"
      >
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glass">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
                Overview
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Weekly schedule intelligence
              </h2>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-950/80 p-6 border border-slate-800">
              <p className="text-sm text-slate-400">Timetables generated</p>
              <p className="mt-3 text-3xl font-semibold text-white">12</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-6 border border-slate-800">
              <p className="text-sm text-slate-400">Active teachers</p>
              <p className="mt-3 text-3xl font-semibold text-white">24</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glass">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Insights
          </p>
          <div className="mt-8 space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-sm text-slate-400">
                Teacher conflict warnings
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                No conflicts detected
              </p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-sm text-slate-400">Optimization quality</p>
              <p className="mt-2 text-xl font-semibold text-white">High</p>
            </div>
          </div>
        </div>
      </motion.section>
    </AppLayout>
  );
}

export default Dashboard;
