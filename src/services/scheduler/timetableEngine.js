import { addMinutes, format } from "date-fns";

export const buildTimeSlots = ({
  startTime,
  endTime,
  lectureDuration,
  breakDuration = 0,
}) => {
  const slots = [];
  let current = new Date(`1970-01-01T${startTime}:00`);
  const finish = new Date(`1970-01-01T${endTime}:00`);

  while (current < finish) {
    const endSlot = addMinutes(current, lectureDuration);
    if (endSlot > finish) break;

    slots.push({
      start: format(current, "HH:mm"),
      end: format(endSlot, "HH:mm"),
      id: `${format(current, "HH:mm")}-${format(endSlot, "HH:mm")}`,
    });

    current = addMinutes(endSlot, breakDuration);
  }

  return slots;
};

export const createLectureTasks = ({ subjects }) => {
  return subjects.flatMap((subject) => {
    const lectures = [];
    for (let index = 0; index < subject.weeklyLectures; index += 1) {
      lectures.push({
        id: `${subject.name}-${index}`,
        title: subject.name,
        type: subject.type || "Theory",
        duration: subject.duration || 60,
        subjectId: subject.id || subject.name,
      });
    }
    return lectures;
  });
};

// Simplified algorithm that actually works
export const generateTimetable = ({
  subjects,
  teachers = [],
  sections = [],
  constraints = {},
  institute,
}) => {
  if (!subjects || subjects.length === 0) {
    return {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    };
  }

  const slots = buildTimeSlots({
    startTime: institute.startTime,
    endTime: institute.endTime,
    lectureDuration: institute.lectureDuration,
    breakDuration: constraints.breakDuration || 0,
  });

  if (slots.length === 0) {
    return {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    };
  }

  const tasks = createLectureTasks({ subjects });
  const workingDays = institute.workingDays || [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const schedule = {};
  workingDays.forEach((day) => {
    schedule[day] = [];
  });

  // Simple greedy distribution algorithm
  let slotIndex = 0;
  let dayIndex = 0;

  for (const task of tasks) {
    let placed = false;

    // Try to place in current day
    for (let attempt = 0; attempt < workingDays.length; attempt++) {
      const dayName = workingDays[dayIndex % workingDays.length];
      const availableSlots = slots.filter((slot) => {
        // Check if slot is already used in this day
        return !schedule[dayName].some(
          (lecture) => lecture.start === slot.start,
        );
      });

      if (availableSlots.length > 0) {
        const slotToUse = availableSlots[0];

        // Assign teacher who teaches this subject
        let assignedTeacher = null;
        if (teachers && teachers.length > 0) {
          // Find teachers who teach this subject
          const teachersForSubject = teachers.filter(
            (teacher) =>
              teacher.subjects && teacher.subjects.includes(task.title),
          );

          if (teachersForSubject.length > 0) {
            assignedTeacher =
              teachersForSubject[
                Math.floor(Math.random() * teachersForSubject.length)
              ];
          }
        }

        const sectionLabel =
          sections.length > 0
            ? `${sections[0]?.semester ? `${sections[0]?.semester} ` : ""}${
                sections[0]?.name || ""
              }`.trim()
            : "All";

        schedule[dayName].push({
          id: task.id,
          title: task.title,
          type: task.type,
          start: slotToUse.start,
          end: slotToUse.end,
          teacher: assignedTeacher?.name || "Not Assigned",
          section: sectionLabel || "All",
        });

        placed = true;
        dayIndex++;
        break;
      }

      dayIndex++;
    }

    if (!placed) {
      console.warn(`Could not place lecture: ${task.title}`);
    }
  }

  return schedule;
};
