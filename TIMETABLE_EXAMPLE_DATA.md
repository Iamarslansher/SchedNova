# SchedNova - Example Data to Generate a Timetable

Follow these steps to create a working timetable:

## Step 1: Institute Info

Fill in the following details:

- **Institute name:** XYZ Institute
- **Start time:** 08:00
- **End time:** 16:00
- **Lecture duration:** 60 (minutes)
- **Break duration:** 10 (minutes)
- **Working days:** Monday, Tuesday, Wednesday, Thursday, Friday (select all)

## Step 2: Teachers

Add at least 2 teachers. Click "Add teacher" for each one:

### Teacher 1

- **Teacher name:** Dr. Smith
- **Subjects assigned:** Math, Physics
- **Max lectures / day:** 4
- **Min lectures / day:** 1
- **Availability slots:** (leave empty for no restrictions)

### Teacher 2

- **Teacher name:** Prof. Johnson
- **Subjects assigned:** Chemistry, Biology
- **Max lectures / day:** 4
- **Min lectures / day:** 1
- **Availability slots:** (leave empty)

_Note: You can add more teachers if needed. Teachers are optional but recommended._

## Step 3: Subjects

Add subjects by clicking "Add subject" for each one:

### Subject 1

- **Subject name:** Math
- **Weekly lectures required:** 3
- **Lecture duration:** 60
- **Type:** Theory

### Subject 2

- **Subject name:** Physics
- **Weekly lectures required:** 2
- **Lecture duration:** 60
- **Type:** Theory

### Subject 3

- **Subject name:** Chemistry
- **Weekly lectures required:** 3
- **Lecture duration:** 60
- **Type:** Lab

### Subject 4

- **Subject name:** Biology
- **Weekly lectures required:** 2
- **Lecture duration:** 60
- **Type:** Theory

_Note: You need at least 2-3 subjects to generate a meaningful timetable._

## Step 4: Sections

Add sections by clicking "Add section" for each one:

### Section 1

- **Section name:** Class A
- **Semester / class:** Semester 1
- **Student count:** 30

### Section 2

- **Section name:** Class B
- **Semester / class:** Semester 1
- **Student count:** 35

_Note: Sections are optional. You can skip this if not needed._

## Step 5: Constraints

Set the constraints:

- **Break after lectures:** 2
- **No classes after:** 17:00
- **Max continuous lectures:** 3
- **Teacher unavailable slots:** (leave empty if no restrictions)

Then click **"Generate Timetable"** button to create your timetable!

---

## What You'll See

After completing all steps, you'll be taken to the Timetable Preview page where you can:

- ✅ View your generated weekly timetable
- 📥 Export to PDF
- 📷 Export as PNG image

## Total Classes Generated

With the example data above:

- Math: 3 lectures/week
- Physics: 2 lectures/week
- Chemistry: 3 lectures/week
- Biology: 2 lectures/week
- **Total: 10 lectures spread across Monday-Friday**

## Troubleshooting

If you see "No timetable generated yet":

1. Make sure you added at least 2-3 subjects with lecture counts
2. Ensure the institute times allow enough slots for all lectures
3. Go back to the setup wizard and try again

## Tips for Best Results

1. **Keep it simple:** Start with 2-3 subjects and 2-3 days
2. **Balance lectures:** Don't request too many lectures for the available time
3. **Use standard times:** 08:00-16:00 with 60-minute lectures works best
4. **Minimize constraints:** Fewer restrictions = easier scheduling
