import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import AddTeacherModal from "../../components/modals/AddTeacherModal";
import { queryDocuments } from "../../services/firebase/firestoreService";

function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const data = await queryDocuments("teachers");
      const userTeachers = data.filter(
        (teacher) => teacher.instituteId === userId,
      );
      setTeachers(userTeachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherAdded = (newTeacher) => {
    setTeachers((prev) => [newTeacher, ...prev]);
  };

  return (
    <AppLayout title="Teacher Management">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glass">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Teacher roster
            </p>
            <p className="mt-2 text-slate-300">
              Total: {teachers.length} teacher{teachers.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Teacher
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-400">Loading teachers...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 p-8 text-center">
            <p className="text-slate-400 mb-4">No teachers added yet</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Your First Teacher
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 hover:border-slate-700 transition"
              >
                <p className="text-sm text-slate-400">Teacher</p>
                <h3 className="mt-3 text-xl font-semibold text-white">
                  {teacher.name}
                </h3>
                {teacher.specialization && (
                  <p className="mt-2 text-sm text-slate-400">
                    {teacher.specialization}
                  </p>
                )}
                {teacher.email && (
                  <p className="mt-1 text-xs text-slate-500">{teacher.email}</p>
                )}
                <p className="mt-3 text-sm text-slate-500">
                  Availability, loads, and subjects can be managed here.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddTeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTeacherAdded={handleTeacherAdded}
      />
    </AppLayout>
  );
}

export default TeacherManagement;
