import { z } from "zod";

export const authSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const instituteSchema = z.object({
  name: z.string().min(1, "Institute name is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  workingDays: z
    .array(z.string())
    .min(1, "At least one working day is required"),
  lectureDuration: z
    .number()
    .min(30, "Lecture duration must be at least 30 minutes"),
  breakDuration: z
    .number()
    .min(0, "Break duration cannot be negative")
    .optional(),
});

export const teacherSchema = z.object({
  name: z.string().min(1, "Teacher name is required"),
  subjects: z.string().min(1, "At least one subject is required"),
  maxPerDay: z.number().min(1, "Maximum lectures per day must be at least 1"),
  minPerDay: z.number().min(0, "Minimum lectures per day cannot be negative"),
  availability: z.string().optional(),
});

export const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  weeklyLectures: z.number().min(1, "Weekly lectures must be at least 1"),
  duration: z.number().min(30, "Lecture duration must be at least 30 minutes"),
  type: z.enum(["Theory", "Lab"]),
  teachingEnvironment: z.enum(["Classroom", "Laboratory"]),
});

export const sectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  semester: z.string().min(1, "Semester or class is required"),
  studentCount: z.number().min(1, "Student count must be at least 1"),
});

export const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  type: z.enum(["Room", "Lab"]),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  building: z.string().optional(),
  floor: z.string().optional(),
  supportedSubjects: z.array(z.string()).optional(),
});

export const labSchema = z.object({
  name: z.string().min(1, "Lab name is required"),
  type: z.literal("Lab"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  labType: z.enum([
    "Computer Lab",
    "Physics Lab",
    "Chemistry Lab",
    "AI Lab",
    "Other",
  ]),
  building: z.string().optional(),
  floor: z.string().optional(),
  supportedSubjects: z.array(z.string()).optional(),
});

export const constraintsSchema = z.object({
  breakAfterLectures: z
    .number()
    .min(0, "Break after lectures cannot be negative"),
  noClassesAfter: z.string().optional(),
  maxContinuousLectures: z
    .number()
    .min(1, "Maximum continuous lectures must be at least 1"),
  teacherUnavailableSlots: z.string().optional(),
});
