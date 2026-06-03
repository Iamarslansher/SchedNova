import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, CalendarDays } from "lucide-react";

function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-200">
              <Sparkles className="h-4 w-4" /> AI-powered timetable automation
            </p>
            <div className="space-y-6">
              <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Generate smart timetables automatically with{" "}
                <span className="text-brand-300">SchedNova</span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">
                Build optimized schedules for universities, schools, academies,
                and personal productivity with a modern SaaS workflow.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-brand-400"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-700 px-6 py-3 text-base text-slate-200 transition hover:border-slate-500 hover:text-white"
              >
                View Demo
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-10 shadow-glass backdrop-blur-xl">
            <div className="grid gap-6">
              {[
                {
                  title: "Setup wizard",
                  description:
                    "Define institute rules, subjects, teachers, and classrooms with a guided multi-step flow.",
                  icon: ShieldCheck,
                },
                {
                  title: "Smart scheduling engine",
                  description:
                    "Generate conflict-free timetables using constraints, availability, and optimization logic.",
                  icon: CalendarDays,
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex gap-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5"
                >
                  <feature.icon className="h-6 w-6 text-brand-300" />
                  <div>
                    <h3 className="font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
