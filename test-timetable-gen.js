import { generateAdvancedTimetable } from "./src/services/scheduler/advancedTimetableEngine.js";

// Test data
const testData = {
  institute: {
    name: "Test Institute",
    startTime: "08:00",
    endTime: "16:00",
    lectureDuration: 60,
    breakDuration: 0,
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  subjects: [
    {
      id: "subj-1",
      name: "Mathematics",
      weeklyLectures: 3,
      duration: 60,
      type: "Theory",
      teachingEnvironment: "Classroom",
    },
    {
      id: "subj-2",
      name: "Programming Lab",
      weeklyLectures: 2,
      duration: 60,
      type: "Practical",
      teachingEnvironment: "Laboratory",
    },
  ],
  teachers: [
    {
      id: "teacher-1",
      name: "Dr. Ahmed",
      subjects: ["Mathematics", "Programming Lab"],
      maxPerDay: 5,
      minPerDay: 1,
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  ],
  sections: [
    {
      id: "sec-1",
      name: "BSCS-A",
      semester: "1st",
      studentCount: 40,
    },
  ],
  rooms: [
    {
      id: "room-1",
      name: "Classroom 101",
      type: "Room",
      capacity: 50,
      building: "A",
      floor: "1",
      supportedSubjects: ["Mathematics", "Physics"],
    },
  ],
  labs: [
    {
      id: "lab-1",
      name: "Computer Lab 1",
      type: "Lab",
      labType: "Computer Lab",
      capacity: 40,
      building: "B",
      floor: "2",
      supportedSubjects: ["Programming Lab", "Database Systems"],
    },
  ],
  constraints: {
    breakAfterLectures: 2,
    noClassesAfter: "17:00",
    maxContinuousLectures: 3,
  },
};

console.log("Testing timetable generation...\n");

try {
  const schedule = generateAdvancedTimetable(testData);

  console.log("\n✅ Generation successful!");
  console.log("\nGenerated Schedule:");

  Object.entries(schedule).forEach(([day, lectures]) => {
    console.log(`\n${day}: ${lectures.length} lectures`);
    lectures.forEach((lecture) => {
      console.log(
        `  - ${lecture.startTime}-${lecture.endTime}: ${lecture.subject} (${lecture.locationType}) in ${lecture.roomOrLab} with ${lecture.teacher}`,
      );
    });
  });

  // Check for empty schedule
  const totalLectures = Object.values(schedule).reduce(
    (sum, day) => sum + day.length,
    0,
  );
  console.log(`\n📊 Total lectures scheduled: ${totalLectures}`);

  if (totalLectures === 0) {
    console.warn("⚠️ WARNING: Schedule is empty!");
  }
} catch (error) {
  console.error("❌ Generation failed:", error);
  console.error(error.stack);
}
