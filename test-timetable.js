// Standalone test for timetable generation algorithm
const { addMinutes, format } = require('date-fns');

// Copy of the algorithm functions from timetableEngine.js
const buildTimeSlots = ({
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
      start: format(current, 'HH:mm'),
      end: format(endSlot, 'HH:mm'),
      id: `${format(current, 'HH:mm')}-${format(endSlot, 'HH:mm')}`,
    });

    current = addMinutes(endSlot, breakDuration);
  }

  return slots;
};

const createLectureTasks = ({ subjects }) => {
  return subjects.flatMap((subject) => {
    const lectures = [];
    for (let index = 0; index < subject.weeklyLectures; index += 1) {
      lectures.push({
        id: `${subject.name}-${index}`,
        title: subject.name,
        type: subject.type || 'Theory',
        duration: subject.duration || 60,
        subjectId: subject.id || subject.name,
      });
    }
    return lectures;
  });
};

const generateTimetable = ({
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
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  const schedule = {};
  workingDays.forEach((day) => {
    schedule[day] = [];
  });

  let slotIndex = 0;
  let dayIndex = 0;

  for (const task of tasks) {
    let placed = false;

    for (let attempt = 0; attempt < workingDays.length; attempt++) {
      const dayName = workingDays[dayIndex % workingDays.length];
      const availableSlots = slots.filter((slot) => {
        return !schedule[dayName].some(
          (lecture) => lecture.start === slot.start,
        );
      });

      if (availableSlots.length > 0) {
        const slotToUse = availableSlots[0];

        schedule[dayName].push({
          id: task.id,
          title: task.title,
          type: task.type,
          start: slotToUse.start,
          end: slotToUse.end,
          teacher: 'Not Assigned',
          section: 'All',
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

// TEST: 4 subjects with specific lecture counts
const subjects = [
  { name: 'Math', weeklyLectures: 3, duration: 60, type: 'Theory', id: 'math' },
  { name: 'Physics', weeklyLectures: 2, duration: 60, type: 'Theory', id: 'physics' },
  { name: 'Chemistry', weeklyLectures: 3, duration: 60, type: 'Theory', id: 'chemistry' },
  { name: 'Biology', weeklyLectures: 2, duration: 60, type: 'Theory', id: 'biology' },
];

const institute = {
  startTime: '08:00',
  endTime: '16:00',
  lectureDuration: 60,
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
};

const constraints = {
  breakDuration: 10,
};

console.log('=== TIMETABLE GENERATION TEST ===\n');
console.log('Test Configuration:');
console.log('- Subjects: Math (3), Physics (2), Chemistry (3), Biology (2) = 10 total lectures');
console.log('- Working Days: Monday to Friday');
console.log('- Lecture Duration: 60 minutes');
console.log('- Break Duration: 10 minutes');
console.log('- Operating Hours: 08:00 - 16:00 (8am - 4pm)');
console.log('');

// Generate timetable
const schedule = generateTimetable({
  subjects,
  teachers: [],
  sections: [],
  constraints,
  institute,
});

// Calculate statistics
let totalScheduled = 0;
const lecturesByDay = {};
const lecturesBySubject = {};

Object.keys(schedule).forEach((day) => {
  lecturesByDay[day] = schedule[day].length;
  totalScheduled += schedule[day].length;
  
  schedule[day].forEach((lecture) => {
    if (!lecturesBySubject[lecture.title]) {
      lecturesBySubject[lecture.title] = 0;
    }
    lecturesBySubject[lecture.title]++;
  });
});

console.log('=== SCHEDULE RESULTS ===\n');
console.log('Lectures per Day:');
Object.keys(schedule).forEach((day) => {
  console.log(`  ${day}: ${lecturesByDay[day]} lectures`);
});

console.log('\nLectures per Subject:');
subjects.forEach((subject) => {
  const scheduled = lecturesBySubject[subject.name] || 0;
  console.log(`  ${subject.name}: ${scheduled}/${subject.weeklyLectures} lectures`);
});

console.log(`\n?? Total Lectures Scheduled: ${totalScheduled} / 10`);
console.log(`? Success: ${totalScheduled === 10 ? 'ALL lectures scheduled!' : 'INCOMPLETE - some lectures not scheduled'}`);

console.log('\n=== DETAILED SCHEDULE ===\n');
Object.keys(schedule).forEach((day) => {
  console.log(`${day}:`);
  if (schedule[day].length === 0) {
    console.log('  (No lectures)');
  } else {
    schedule[day].forEach((lecture) => {
      console.log(`  ${lecture.start}-${lecture.end}: ${lecture.title}`);
    });
  }
  console.log('');
});
