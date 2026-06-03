import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../layouts/AppLayout";
import { generateTimetable } from "../../services/scheduler/timetableEngine";
import storageUtils from "../../utils/storage";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function TimetablePreview() {
  const navigate = useNavigate();
  const scheduleRef = useRef(null);
  const [schedule, setSchedule] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  });

  const reduxState = useSelector((state) => state.schedule);

  // Load from storage and Redux on mount
  useEffect(() => {
    let dataToUse = null;

    // First, try to use Redux data
    if (
      reduxState &&
      reduxState.schedule &&
      Object.keys(reduxState.schedule).length > 0
    ) {
      dataToUse = reduxState.schedule;
    } else {
      // Fallback to localStorage
      const storedSchedule = storageUtils.getSchedule();
      if (storedSchedule) {
        dataToUse = storedSchedule;
      } else {
        // Generate from stored data if no schedule exists
        const institute = storageUtils.getInstitute();
        const subjects = storageUtils.getSubjects();
        const teachers = storageUtils.getTeachers();
        const sections = storageUtils.getSections();
        const constraints = storageUtils.getConstraints();

        if (institute && subjects && subjects.length > 0) {
          const generated = generateTimetable({
            subjects,
            teachers,
            sections,
            constraints,
            institute,
          });
          storageUtils.saveSchedule(generated);
          dataToUse = generated;
        }
      }
    }

    if (dataToUse) {
      setSchedule(dataToUse);
    }
  }, [reduxState]);

  const institute = reduxState?.institute || storageUtils.getInstitute();
  const subjects = reduxState?.subjects || storageUtils.getSubjects();
  const teachers = reduxState?.teachers || storageUtils.getTeachers();
  const sections = reduxState?.sections || storageUtils.getSections();

  const exportPdf = async () => {
    if (!scheduleRef.current) return;
    const canvas = await html2canvas(scheduleRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("schednova-timetable.pdf");
  };

  const exportImage = async () => {
    if (!scheduleRef.current) return;
    const canvas = await html2canvas(scheduleRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "schednova-timetable.png";
    link.click();
  };

  return (
    <AppLayout title="Timetable Preview">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glass">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Weekly timetable
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Review generated timetable blocks, then export to PDF or image.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportPdf}
              className="rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-400"
              disabled={!institute || !subjects || subjects.length === 0}
            >
              Export PDF
            </button>
            <button
              onClick={exportImage}
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm text-slate-200 hover:border-slate-500"
              disabled={!institute || !subjects || subjects.length === 0}
            >
              Export Image
            </button>
          </div>
        </div>

        {!institute || !subjects || subjects.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-950/80 p-8 text-center">
            <p className="text-slate-300">No timetable generated yet.</p>
            <p className="mt-2 text-sm text-slate-400">
              Complete the setup wizard to generate a timetable.
            </p>
            <button
              onClick={() => navigate("/setup")}
              className="mt-4 rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-400"
            >
              Go to Setup Wizard
            </button>
          </div>
        ) : (
          <div ref={scheduleRef} className="mt-8 space-y-6">
            <div className="grid gap-6 xl:grid-cols-2">
              {Object.entries(schedule).map(([day, slots]) => (
                <div
                  key={day}
                  className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{day}</h3>
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                      {slots.length} lectures
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {slots.length === 0 ? (
                      <p className="text-sm text-slate-400">
                        No classes assigned.
                      </p>
                    ) : (
                      slots.map((lecture, index) => (
                        <div
                          key={`${day}-${index}`}
                          className="rounded-3xl border border-slate-800 bg-slate-900 p-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                              {lecture.type}
                            </p>
                            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                              {lecture.start} - {lecture.end}
                            </span>
                          </div>
                          <p className="mt-2 font-semibold text-white">
                            {lecture.title}
                          </p>
                          <div className="mt-2 flex flex-col gap-1 text-xs text-slate-400">
                            <p>Teacher: {lecture.teacher || "Not Assigned"}</p>
                            <p>Class / Section: {lecture.section || "All"}</p>
                            {lecture.room && <p>Room/Lab: {lecture.room}</p>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default TimetablePreview;
