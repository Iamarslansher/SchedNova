import { addMinutes, format, parse, isWithinInterval } from "date-fns";

/**
 * Advanced Timetable Generation Engine
 * Implements constraint-aware scheduling with teacher, room, and lab validation
 */

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
        isLab: subject.type === "Lab" || subject.type === "Practical",
      });
    }
    return lectures;
  });
};

/**
 * Check if a teacher is available during a specific time slot
 */
const isTeacherAvailable = (teacher, dayName, timeSlot) => {
  if (!teacher.availability || teacher.availability.length === 0) {
    return true; // If no availability specified, assume always available
  }

  return teacher.availability.some(
    (day) => day.toLowerCase() === dayName.toLowerCase(),
  );
};

/**
 * Check if teacher already has a lecture at this time
 */
const hasTeacherConflict = (teacher, dayName, timeSlot, schedule) => {
  const teacherLectures = Object.values(schedule)
    .flat()
    .filter((lecture) => lecture.teacher === teacher.name);

  return teacherLectures.some(
    (lecture) =>
      lecture.day === dayName &&
      !(lecture.endTime <= timeSlot.start || lecture.startTime >= timeSlot.end),
  );
};

/**
 * Check teacher's daily lecture limit
 */
const canTeacherTeachMore = (teacher, dayName, schedule) => {
  const dailyLectures = Object.values(schedule)
    .flat()
    .filter((lec) => lec.teacher === teacher.name && lec.day === dayName);

  const maxPerDay = teacher.maxPerDay || 5;
  return dailyLectures.length < maxPerDay;
};

/**
 * Check teacher's weekly lecture limit
 */
const canTeacherTeachMoreThisWeek = (teacher, schedule) => {
  const weeklyLectures = Object.values(schedule)
    .flat()
    .filter((lec) => lec.teacher === teacher.name);

  const maxPerWeek = (teacher.maxPerDay || 5) * 5; // Approximate weekly limit
  return weeklyLectures.length < maxPerWeek;
};

/**
 * Find the best teacher for a subject with all constraints checked
 */
const findBestTeacher = (task, teachers, dayName, timeSlot, schedule) => {
  if (!teachers || teachers.length === 0) return null;

  // Filter teachers who teach this subject
  const qualifiedTeachers = teachers.filter(
    (teacher) => teacher.subjects && teacher.subjects.includes(task.title),
  );

  if (qualifiedTeachers.length === 0) return null;

  // Filter by availability, conflicts, and limits
  const availableTeachers = qualifiedTeachers.filter(
    (teacher) =>
      isTeacherAvailable(teacher, dayName, timeSlot) &&
      !hasTeacherConflict(teacher, dayName, timeSlot, schedule) &&
      canTeacherTeachMore(teacher, dayName, schedule) &&
      canTeacherTeachMoreThisWeek(teacher, schedule),
  );

  if (availableTeachers.length === 0) {
    // Return first qualified teacher as fallback
    return qualifiedTeachers[0] || null;
  }

  // Return a random available teacher
  return availableTeachers[
    Math.floor(Math.random() * availableTeachers.length)
  ];
};

/**
 * Check if a room is available for a slot
 */
const isRoomAvailable = (room, dayName, timeSlot, schedule) => {
  const roomBookings = Object.values(schedule)
    .flat()
    .filter((lec) => lec.room === room.name && lec.day === dayName);

  return !roomBookings.some(
    (booking) =>
      !(booking.endTime <= timeSlot.start || booking.startTime >= timeSlot.end),
  );
};

/**
 * Find best room for a subject
 */
const findBestRoom = (task, rooms, dayName, timeSlot, sectionCapacity) => {
  if (!rooms || rooms.length === 0) return null;

  // Theory subjects go to rooms, practical/labs go to labs
  const isLabSubject = task.isLab;

  const suitableRooms = rooms.filter(
    (room) =>
      room.capacity >= sectionCapacity &&
      ((isLabSubject && room.type === "Lab") ||
        (!isLabSubject && room.type === "Room")) &&
      (!room.supportedSubjects || room.supportedSubjects.includes(task.title)),
  );

  if (suitableRooms.length === 0) return null;

  const availableRooms = suitableRooms.filter((room) =>
    isRoomAvailable(room, dayName, timeSlot, schedule),
  );

  return availableRooms.length > 0
    ? availableRooms[0]
    : suitableRooms[0] || null;
};

/**
 * Check if a section already has a lecture at this time
 */
const hasSectionConflict = (section, dayName, timeSlot, schedule) => {
  const sectionLectures = Object.values(schedule)
    .flat()
    .filter((lec) => lec.section === section && lec.day === dayName);

  return sectionLectures.some(
    (lecture) =>
      !(lecture.endTime <= timeSlot.start || lecture.startTime >= timeSlot.end),
  );
};

/**
 * Main advanced timetable generation function
 */
export const generateAdvancedTimetable = ({
  subjects,
  teachers = [],
  sections = [],
  rooms = [],
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

  const sectionLabel =
    sections.length > 0
      ? `${sections[0]?.semester ? `${sections[0]?.semester} ` : ""}${
          sections[0]?.name || ""
        }`.trim()
      : "All";

  const sectionCapacity = sections[0]?.studentCount || 50;

  // Try to place each lecture
  let slotIndex = 0;
  let dayIndex = 0;

  for (const task of tasks) {
    let placed = false;

    // Try different days and slots
    for (let dayAttempt = 0; dayAttempt < workingDays.length; dayAttempt++) {
      for (let slotAttempt = 0; slotAttempt < slots.length; slotAttempt++) {
        const dayName =
          workingDays[(dayIndex + dayAttempt) % workingDays.length];
        const slot = slots[(slotIndex + slotAttempt) % slots.length];

        // Check if slot is already occupied in this day
        const slotOccupied = schedule[dayName].some(
          (lec) => lec.start === slot.start,
        );

        if (slotOccupied) continue;

        // Check section conflict
        if (hasSectionConflict(sectionLabel, dayName, slot, schedule)) {
          continue;
        }

        // Find best teacher
        const teacher = findBestTeacher(
          task,
          teachers,
          dayName,
          slot,
          schedule,
        );

        // Find best room
        const room = findBestRoom(task, rooms, dayName, slot, sectionCapacity);

        // Create lecture entry
        const lecture = {
          id: task.id,
          title: task.title,
          type: task.type,
          day: dayName,
          start: slot.start,
          end: slot.end,
          startTime: slot.start,
          endTime: slot.end,
          teacher: teacher ? teacher.name : "Not Assigned",
          room: room ? room.name : "TBA",
          section: sectionLabel,
          subject: task.title,
        };

        schedule[dayName].push(lecture);
        placed = true;
        dayIndex++;
        break;
      }

      if (placed) break;
    }

    if (!placed) {
      console.warn(
        `Could not place lecture: ${task.title} - checking final fallback`,
      );

      // Fallback: place in next available slot without all constraints
      for (let day of workingDays) {
        for (let slot of slots) {
          const slotOccupied = schedule[day].some(
            (lec) => lec.start === slot.start,
          );

          if (!slotOccupied) {
            const teacher = findBestTeacher(
              task,
              teachers,
              day,
              slot,
              schedule,
            );
            const room = findBestRoom(task, rooms, day, slot, sectionCapacity);

            schedule[day].push({
              id: task.id,
              title: task.title,
              type: task.type,
              day,
              start: slot.start,
              end: slot.end,
              startTime: slot.start,
              endTime: slot.end,
              teacher: teacher ? teacher.name : "Not Assigned",
              room: room ? room.name : "TBA",
              section: sectionLabel,
              subject: task.title,
            });

            placed = true;
            break;
          }
        }
        if (placed) break;
      }
    }

    if (!placed) {
      console.warn(
        `Failed to place lecture: ${task.title} - no available slot found`,
      );
    }
  }

  return schedule;
};

// Keep backward compatibility
export const generateTimetable = generateAdvancedTimetable;
