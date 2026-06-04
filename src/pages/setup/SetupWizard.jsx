import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import {
  setInstitute,
  setTeachers,
  setSubjects,
  setSections,
  setRooms,
  setLabs,
  setConstraints,
  setSchedule,
} from "../../store/scheduleSlice";
import { generateAdvancedTimetable } from "../../services/scheduler/advancedTimetableEngine";
import storageUtils from "../../utils/storage";
import {
  constraintsSchema,
  instituteSchema,
  sectionSchema,
  subjectSchema,
  teacherSchema,
} from "../../utils/validators";
import AddRoomLabWizardModal from "../../components/modals/AddRoomLabWizardModal";

const steps = [
  { id: 1, title: "Institute Info" },
  { id: 2, title: "Teachers" },
  { id: 3, title: "Subjects" },
  { id: 4, title: "Sections" },
  { id: 5, title: "Rooms & Labs" },
  { id: 6, title: "Constraints" },
  { id: 7, title: "Generate" },
];

const workingDaysOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function SetupWizard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scheduleState = useSelector((state) => state.schedule);
  const [activeStep, setActiveStep] = useState(1);

  // Load from localStorage or Redux
  const storedData = storageUtils.getAllData();
  const [teachers, setTeachersState] = useState(
    scheduleState.teachers?.length > 0
      ? scheduleState.teachers
      : storedData.teachers || [],
  );
  const [subjects, setSubjectsState] = useState(
    scheduleState.subjects?.length > 0
      ? scheduleState.subjects
      : storedData.subjects || [],
  );
  const [sections, setSectionsState] = useState(
    scheduleState.sections?.length > 0
      ? scheduleState.sections
      : storedData.sections || [],
  );
  const [rooms, setRoomsState] = useState(
    scheduleState.rooms?.length > 0 ? scheduleState.rooms : [],
  );
  const [labs, setLabsState] = useState(
    scheduleState.labs?.length > 0 ? scheduleState.labs : [],
  );
  const [isRoomLabModalOpen, setIsRoomLabModalOpen] = useState(false);

  const instituteForm = useForm({
    resolver: zodResolver(instituteSchema),
    defaultValues: scheduleState.institute ||
      storedData.institute || {
        name: "",
        startTime: "08:00",
        endTime: "16:00",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        lectureDuration: 60,
        breakDuration: 0,
      },
  });

  const teacherForm = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      subjects: "",
      maxPerDay: 5,
      minPerDay: 1,
      availability: "",
    },
  });

  const subjectForm = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
      weeklyLectures: 2,
      duration: 50,
      type: "Theory",
      teachingEnvironment: "Classroom",
    },
  });

  const sectionForm = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: "",
      semester: "",
      studentCount: 1,
    },
  });

  const constraintsForm = useForm({
    resolver: zodResolver(constraintsSchema),
    defaultValues: scheduleState.constraints ||
      storedData.constraints || {
        breakAfterLectures: 2,
        noClassesAfter: "17:00",
        maxContinuousLectures: 3,
        teacherUnavailableSlots: "",
      },
  });

  const handleInstituteSubmit = (data) => {
    const userId = localStorage.getItem("userId");
    const nextInstitute = {
      ...data,
      userId,
    };

    dispatch(setInstitute(nextInstitute));
    storageUtils.saveInstitute(nextInstitute);
    toast.success("Institute setup saved.");
    setActiveStep(2);
  };

  const handleAddTeacher = (data) => {
    const userId = localStorage.getItem("userId");
    const next = [
      ...teachers,
      {
        id: `teacher-${Date.now()}`,
        name: data.name,
        subjects: data.subjects
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        maxPerDay: data.maxPerDay,
        minPerDay: data.minPerDay,
        availability: data.availability
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        instituteId: userId,
        userId,
        createdAt: new Date().toISOString(),
      },
    ];
    setTeachersState(next);
    dispatch(setTeachers(next));
    storageUtils.saveTeachers(next);
    teacherForm.reset();
    toast.success("Teacher added.");
  };

  const handleAddSubject = (data) => {
    const userId = localStorage.getItem("userId");
    const next = [
      ...subjects,
      {
        id: `subject-${Date.now()}`,
        name: data.name,
        weeklyLectures: data.weeklyLectures,
        duration: data.duration,
        type: data.type,
        teachingEnvironment: data.teachingEnvironment,
        instituteId: userId,
        userId,
        createdAt: new Date().toISOString(),
      },
    ];
    setSubjectsState(next);
    dispatch(setSubjects(next));
    storageUtils.saveSubjects(next);
    subjectForm.reset();
    toast.success("Subject added.");
  };

  const handleAddSection = (data) => {
    const userId = localStorage.getItem("userId");
    const next = [
      ...sections,
      {
        id: `section-${Date.now()}`,
        name: data.name,
        semester: data.semester,
        studentCount: data.studentCount,
        instituteId: userId,
        userId,
        createdAt: new Date().toISOString(),
      },
    ];
    setSectionsState(next);
    dispatch(setSections(next));
    storageUtils.saveSections(next);
    sectionForm.reset();
    toast.success("Section added.");
  };

  const handleAddResourceToWizard = (resource) => {
    const userId = localStorage.getItem("userId");
    const resourceWithUserId = {
      ...resource,
      userId,
    };

    if (resource.type === "Lab") {
      const next = [...labs, resourceWithUserId];
      setLabsState(next);
      dispatch(setLabs(next));
      toast.success("Lab added to wizard.");
    } else {
      const next = [...rooms, resourceWithUserId];
      setRoomsState(next);
      dispatch(setRooms(next));
      toast.success("Room added to wizard.");
    }
  };

  const handleRemoveRoom = (id) => {
    setRoomsState((prev) => prev.filter((r) => r.id !== id));
    toast.success("Room removed.");
  };

  const handleRemoveLab = (id) => {
    setLabsState((prev) => prev.filter((l) => l.id !== id));
    toast.success("Lab removed.");
  };

  const handleConstraintsSubmit = (data) => {
    try {
      dispatch(setConstraints(data));
      storageUtils.saveConstraints(data);

      // Get the most recent data from state
      const instituteData = scheduleState.institute;
      const subjectsData = subjects;
      const teachersData = teachers;
      const sectionsData = sections;
      const roomsData = rooms;
      const labsData = labs;

      // Validate we have subjects to schedule
      if (!subjectsData || subjectsData.length === 0) {
        toast.error(
          "Please add at least one subject before generating timetable.",
        );
        return;
      }

      if (!roomsData || roomsData.length === 0) {
        toast.error(
          "Please add at least one room before generating timetable.",
        );
        return;
      }

      console.log("Generating timetable with data:", {
        subjects: subjectsData,
        teachers: teachersData,
        sections: sectionsData,
        rooms: roomsData,
        labs: labsData,
        constraints: data,
        institute: instituteData,
      });

      // Generate the timetable with the collected data
      const generatedSchedule = generateAdvancedTimetable({
        subjects: subjectsData,
        teachers: teachersData,
        sections: sectionsData,
        rooms: roomsData,
        labs: labsData,
        constraints: data,
        institute: instituteData,
      });

      console.log("Generated schedule:", generatedSchedule);

      if (!generatedSchedule) {
        throw new Error("Timetable generation returned null/undefined");
      }

      const hasLectures = Object.values(generatedSchedule).some(
        (day) => day && day.length > 0,
      );

      if (!hasLectures) {
        toast.error(
          "Timetable generated but contains no lectures. Please check your subjects, teachers, and constraints.",
        );
        console.warn("Warning: Generated timetable has no lectures", {
          subjects: subjectsData,
          teachers: teachersData,
          sections: sectionsData,
        });
      }

      dispatch(setSchedule(generatedSchedule));
      dispatch(setRooms(rooms));
      dispatch(setLabs(labs));
      storageUtils.saveSchedule(generatedSchedule);
      toast.success("Timetable generated successfully!");
      navigate("/timetable");
    } catch (error) {
      console.error("Error generating timetable:", error);
      toast.error(`Timetable generation failed: ${error.message}`);
    }
  };

  return (
    <AppLayout title="Setup Wizard">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glass">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-slate-400">
          {steps.map((step) => (
            <span
              key={step.id}
              className={`rounded-full px-4 py-2 ${
                step.id === activeStep
                  ? "bg-brand-500 text-slate-950"
                  : "border border-slate-700"
              }`}
            >
              {step.title}
            </span>
          ))}
        </div>

        <div className="space-y-8">
          {activeStep === 1 && (
            <form
              onSubmit={instituteForm.handleSubmit(handleInstituteSubmit)}
              className="space-y-6"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-200">
                  <span>Institute name</span>
                  <input
                    {...instituteForm.register("name")}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                  />
                  {instituteForm.formState.errors.name && (
                    <span className="text-xs text-rose-400">
                      {instituteForm.formState.errors.name.message}
                    </span>
                  )}
                </label>
                <label className="space-y-2 text-sm text-slate-200">
                  <span>Start time</span>
                  <input
                    type="time"
                    {...instituteForm.register("startTime")}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                  />
                  {instituteForm.formState.errors.startTime && (
                    <span className="text-xs text-rose-400">
                      {instituteForm.formState.errors.startTime.message}
                    </span>
                  )}
                </label>
                <label className="space-y-2 text-sm text-slate-200">
                  <span>End time</span>
                  <input
                    type="time"
                    {...instituteForm.register("endTime")}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                  />
                  {instituteForm.formState.errors.endTime && (
                    <span className="text-xs text-rose-400">
                      {instituteForm.formState.errors.endTime.message}
                    </span>
                  )}
                </label>
                <label className="space-y-2 text-sm text-slate-200">
                  <span>Lecture duration</span>
                  <input
                    type="number"
                    {...instituteForm.register("lectureDuration", {
                      valueAsNumber: true,
                    })}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                    placeholder="60"
                  />
                  {instituteForm.formState.errors.lectureDuration && (
                    <span className="text-xs text-rose-400">
                      {instituteForm.formState.errors.lectureDuration.message}
                    </span>
                  )}
                </label>
                <label className="space-y-2 text-sm text-slate-200">
                  <span>Break duration (minutes)</span>
                  <input
                    type="number"
                    {...instituteForm.register("breakDuration", {
                      valueAsNumber: true,
                    })}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                    placeholder="10"
                  />
                  {instituteForm.formState.errors.breakDuration && (
                    <span className="text-xs text-rose-400">
                      {instituteForm.formState.errors.breakDuration.message}
                    </span>
                  )}
                </label>
              </div>

              <fieldset className="rounded-3xl border border-slate-700 bg-slate-950/80 p-5">
                <legend className="text-sm font-semibold text-slate-100">
                  Working days
                </legend>
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {workingDaysOptions.map((day) => (
                    <label
                      key={day}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200"
                    >
                      <input
                        type="checkbox"
                        value={day}
                        {...instituteForm.register("workingDays")}
                        className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-brand-500"
                      />
                      {day}
                    </label>
                  ))}
                </div>
                {instituteForm.formState.errors.workingDays && (
                  <p className="mt-3 text-xs text-rose-400">
                    {instituteForm.formState.errors.workingDays.message}
                  </p>
                )}
              </fieldset>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-400"
                >
                  Save institute and continue
                </button>
              </div>
            </form>
          )}

          {activeStep === 2 && (
            <div className="space-y-6">
              <form
                onSubmit={teacherForm.handleSubmit(handleAddTeacher)}
                className="space-y-6"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Teacher name</span>
                    <input
                      {...teacherForm.register("name")}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                    />
                    {teacherForm.formState.errors.name && (
                      <span className="text-xs text-rose-400">
                        {teacherForm.formState.errors.name.message}
                      </span>
                    )}
                  </label>
                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Subjects assigned</span>
                    <input
                      {...teacherForm.register("subjects")}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                      placeholder="Math, Physics"
                    />
                    {teacherForm.formState.errors.subjects && (
                      <span className="text-xs text-rose-400">
                        {teacherForm.formState.errors.subjects.message}
                      </span>
                    )}
                  </label>
                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Max lectures / day</span>
                    <input
                      type="number"
                      {...teacherForm.register("maxPerDay", {
                        valueAsNumber: true,
                      })}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                    />
                    {teacherForm.formState.errors.maxPerDay && (
                      <span className="text-xs text-rose-400">
                        {teacherForm.formState.errors.maxPerDay.message}
                      </span>
                    )}
                  </label>
                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Min lectures / day</span>
                    <input
                      type="number"
                      {...teacherForm.register("minPerDay", {
                        valueAsNumber: true,
                      })}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                    />
                    {teacherForm.formState.errors.minPerDay && (
                      <span className="text-xs text-rose-400">
                        {teacherForm.formState.errors.minPerDay.message}
                      </span>
                    )}
                  </label>
                </div>

                <label className="space-y-2 text-sm text-slate-200">
                  <span>Availability slots</span>
                  <input
                    {...teacherForm.register("availability")}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                    placeholder="08:00-10:00, 12:00-14:00"
                  />
                </label>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    className="rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-400"
                  >
                    Add teacher
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="rounded-2xl border border-slate-700 px-6 py-3 text-sm text-slate-300 hover:border-slate-500"
                  >
                    Continue to subjects
                  </button>
                </div>
              </form>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <h3 className="text-lg font-semibold text-white">
                  Added teachers
                </h3>
                <div className="mt-4 space-y-3">
                  {teachers.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      No teachers added yet.
                    </p>
                  ) : (
                    teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="rounded-3xl border border-slate-800 bg-slate-900 p-4"
                      >
                        <p className="font-semibold text-white">
                          {teacher.name}
                        </p>
                        <p className="text-sm text-slate-400">
                          Subjects: {teacher.subjects.join(", ")}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6">
              <form
                onSubmit={subjectForm.handleSubmit(handleAddSubject)}
                className="space-y-6"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Subject name</span>
                    <input
                      {...subjectForm.register("name")}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                    />
                    {subjectForm.formState.errors.name && (
                      <span className="text-xs text-rose-400">
                        {subjectForm.formState.errors.name.message}
                      </span>
                    )}
                  </label>
                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Weekly lectures required</span>
                    <input
                      type="number"
                      {...subjectForm.register("weeklyLectures", {
                        valueAsNumber: true,
                      })}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                    />
                    {subjectForm.formState.errors.weeklyLectures && (
                      <span className="text-xs text-rose-400">
                        {subjectForm.formState.errors.weeklyLectures.message}
                      </span>
                    )}
                  </label>
                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Lecture duration</span>
                    <input
                      type="number"
                      {...subjectForm.register("duration", {
                        valueAsNumber: true,
                      })}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                    />
                    {subjectForm.formState.errors.duration && (
                      <span className="text-xs text-rose-400">
                        {subjectForm.formState.errors.duration.message}
                      </span>
                    )}
                  </label>
                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Type</span>
                    <select
                      {...subjectForm.register("type")}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                    >
                      <option value="Theory">Theory</option>
                      <option value="Lab">Lab</option>
                    </select>
                    {subjectForm.formState.errors.type && (
                      <span className="text-xs text-rose-400">
                        {subjectForm.formState.errors.type.message}
                      </span>
                    )}
                  </label>
                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Teaching Environment</span>
                    <select
                      {...subjectForm.register("teachingEnvironment")}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                    >
                      <option value="Classroom">Classroom</option>
                      <option value="Laboratory">Laboratory</option>
                    </select>
                    {subjectForm.formState.errors.teachingEnvironment && (
                      <span className="text-xs text-rose-400">
                        {
                          subjectForm.formState.errors.teachingEnvironment
                            .message
                        }
                      </span>
                    )}
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    className="rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-400"
                  >
                    Add subject
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(4)}
                    className="rounded-2xl border border-slate-700 px-6 py-3 text-sm text-slate-300 hover:border-slate-500"
                  >
                    Continue to sections
                  </button>
                </div>
              </form>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <h3 className="text-lg font-semibold text-white">
                  Added subjects
                </h3>
                <div className="mt-4 space-y-3">
                  {subjects.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      No subjects added yet.
                    </p>
                  ) : (
                    subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="rounded-3xl border border-slate-800 bg-slate-900 p-4"
                      >
                        <p className="font-semibold text-white">
                          {subject.name}
                        </p>
                        <p className="text-sm text-slate-400">
                          {subject.weeklyLectures} lectures • {subject.type} •{" "}
                          {subject.teachingEnvironment}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-6">
              <form
                onSubmit={sectionForm.handleSubmit(handleAddSection)}
                className="space-y-6"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Section name</span>
                    <input
                      {...sectionForm.register("name")}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                    />
                    {sectionForm.formState.errors.name && (
                      <span className="text-xs text-rose-400">
                        {sectionForm.formState.errors.name.message}
                      </span>
                    )}
                  </label>
                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Semester / class</span>
                    <input
                      {...sectionForm.register("semester")}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                    />
                    {sectionForm.formState.errors.semester && (
                      <span className="text-xs text-rose-400">
                        {sectionForm.formState.errors.semester.message}
                      </span>
                    )}
                  </label>
                  <label className="space-y-2 text-sm text-slate-200">
                    <span>Student count</span>
                    <input
                      type="number"
                      {...sectionForm.register("studentCount", {
                        valueAsNumber: true,
                      })}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                    />
                    {sectionForm.formState.errors.studentCount && (
                      <span className="text-xs text-rose-400">
                        {sectionForm.formState.errors.studentCount.message}
                      </span>
                    )}
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    className="rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-400"
                  >
                    Add section
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(5)}
                    className="rounded-2xl border border-slate-700 px-6 py-3 text-sm text-slate-300 hover:border-slate-500"
                  >
                    Continue to rooms & labs
                  </button>
                </div>
              </form>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <h3 className="text-lg font-semibold text-white">
                  Added sections
                </h3>
                <div className="mt-4 space-y-3">
                  {sections.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      No sections added yet.
                    </p>
                  ) : (
                    sections.map((section) => (
                      <div
                        key={section.id}
                        className="rounded-3xl border border-slate-800 bg-slate-900 p-4"
                      >
                        <p className="font-semibold text-white">
                          {section.name}
                        </p>
                        <p className="text-sm text-slate-400">
                          {section.semester}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Manage Rooms & Laboratories
                    </h2>
                    <p className="mt-2 text-slate-300">
                      Add classrooms and laboratories where subjects will be
                      taught.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsRoomLabModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition font-medium"
                  >
                    <Plus className="h-5 w-5" />
                    Add Room/Lab
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Classrooms
                    </h3>
                    {rooms.length === 0 ? (
                      <p className="text-sm text-slate-400">
                        No classrooms added yet.
                      </p>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {rooms.map((room) => (
                          <div
                            key={room.id}
                            className="rounded-2xl border border-slate-700 bg-slate-900 p-4 flex items-start justify-between"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-white">
                                {room.name}
                              </p>
                              <p className="text-sm text-slate-400">
                                Capacity: {room.capacity} students
                              </p>
                              {(room.building || room.floor) && (
                                <p className="text-xs text-slate-500 mt-1">
                                  {room.building && `Building ${room.building}`}
                                  {room.building && room.floor && " • "}
                                  {room.floor && `Floor ${room.floor}`}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveRoom(room.id)}
                              className="text-red-400 hover:text-red-300 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {labs.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Laboratories
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {labs.map((lab) => (
                          <div
                            key={lab.id}
                            className="rounded-2xl border border-slate-700 bg-slate-900 p-4 flex items-start justify-between"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-white">
                                {lab.name}
                              </p>
                              <p className="text-sm text-slate-400">
                                {lab.labType} • Capacity: {lab.capacity}
                              </p>
                              {(lab.building || lab.floor) && (
                                <p className="text-xs text-slate-500 mt-1">
                                  {lab.building && `Building ${lab.building}`}
                                  {lab.building && lab.floor && " • "}
                                  {lab.floor && `Floor ${lab.floor}`}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveLab(lab.id)}
                              className="text-red-400 hover:text-red-300 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-8">
                  <button
                    onClick={() => setActiveStep(6)}
                    disabled={rooms.length === 0}
                    className="rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to constraints
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(4)}
                    className="rounded-2xl border border-slate-700 px-6 py-3 text-sm text-slate-300 hover:border-slate-500"
                  >
                    Back to sections
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeStep === 6 && (
            <form
              onSubmit={constraintsForm.handleSubmit(handleConstraintsSubmit)}
              className="space-y-6"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-200">
                  <span>Break after lectures</span>
                  <input
                    type="number"
                    {...constraintsForm.register("breakAfterLectures", {
                      valueAsNumber: true,
                    })}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                  />
                  {constraintsForm.formState.errors.breakAfterLectures && (
                    <span className="text-xs text-rose-400">
                      {
                        constraintsForm.formState.errors.breakAfterLectures
                          .message
                      }
                    </span>
                  )}
                </label>
                <label className="space-y-2 text-sm text-slate-200">
                  <span>No classes after</span>
                  <input
                    type="time"
                    {...constraintsForm.register("noClassesAfter")}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-200">
                  <span>Max continuous lectures</span>
                  <input
                    type="number"
                    {...constraintsForm.register("maxContinuousLectures", {
                      valueAsNumber: true,
                    })}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                  />
                  {constraintsForm.formState.errors.maxContinuousLectures && (
                    <span className="text-xs text-rose-400">
                      {
                        constraintsForm.formState.errors.maxContinuousLectures
                          .message
                      }
                    </span>
                  )}
                </label>
              </div>
              <label className="space-y-2 text-sm text-slate-200">
                <span>Teacher unavailable slots</span>
                <input
                  {...constraintsForm.register("teacherUnavailableSlots")}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                  placeholder="Teacher A: 10:00-11:00, Teacher B: 14:00-15:00"
                />
              </label>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="rounded-2xl border border-slate-700 px-6 py-3 text-sm text-slate-300 hover:border-slate-500"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-400"
                >
                  Complete setup
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <AddRoomLabWizardModal
        isOpen={isRoomLabModalOpen}
        onClose={() => setIsRoomLabModalOpen(false)}
        onResourceAdded={handleAddResourceToWizard}
      />
    </AppLayout>
  );
}

export default SetupWizard;
