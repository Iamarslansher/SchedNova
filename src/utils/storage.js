/**
 * LocalStorage utility for persisting timetable data
 */

const STORAGE_KEYS = {
  INSTITUTE: "schednova_institute",
  TEACHERS: "schednova_teachers",
  SUBJECTS: "schednova_subjects",
  SECTIONS: "schednova_sections",
  CONSTRAINTS: "schednova_constraints",
  SCHEDULE: "schednova_schedule",
};

export const storageUtils = {
  // Save individual data
  saveInstitute: (data) => {
    try {
      localStorage.setItem(STORAGE_KEYS.INSTITUTE, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error saving institute:", error);
      return false;
    }
  },

  saveTeachers: (data) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error saving teachers:", error);
      return false;
    }
  },

  saveSubjects: (data) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error saving subjects:", error);
      return false;
    }
  },

  saveSections: (data) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error saving sections:", error);
      return false;
    }
  },

  saveConstraints: (data) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONSTRAINTS, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error saving constraints:", error);
      return false;
    }
  },

  saveSchedule: (data) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error saving schedule:", error);
      return false;
    }
  },

  // Retrieve individual data
  getInstitute: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INSTITUTE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error retrieving institute:", error);
      return null;
    }
  },

  getTeachers: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error retrieving teachers:", error);
      return [];
    }
  },

  getSubjects: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error retrieving subjects:", error);
      return [];
    }
  },

  getSections: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SECTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error retrieving sections:", error);
      return [];
    }
  },

  getConstraints: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONSTRAINTS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Error retrieving constraints:", error);
      return {};
    }
  },

  getSchedule: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error retrieving schedule:", error);
      return null;
    }
  },

  // Get all data
  getAllData: () => {
    return {
      institute: storageUtils.getInstitute(),
      teachers: storageUtils.getTeachers(),
      subjects: storageUtils.getSubjects(),
      sections: storageUtils.getSections(),
      constraints: storageUtils.getConstraints(),
      schedule: storageUtils.getSchedule(),
    };
  },

  // Save all data
  saveAllData: (data) => {
    storageUtils.saveInstitute(data.institute);
    storageUtils.saveTeachers(data.teachers);
    storageUtils.saveSubjects(data.subjects);
    storageUtils.saveSections(data.sections);
    storageUtils.saveConstraints(data.constraints);
    storageUtils.saveSchedule(data.schedule);
  },

  // Clear all data
  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error("Error clearing storage:", error);
      return false;
    }
  },
};

export default storageUtils;
