import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import AddSubjectModal from "../../components/modals/AddSubjectModal";
import { queryDocuments } from "../../services/firebase/firestoreService";

function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const data = await queryDocuments("subjects");
      const userSubjects = data.filter(
        (subject) => subject.instituteId === userId,
      );
      setSubjects(userSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectAdded = (newSubject) => {
    setSubjects((prev) => [newSubject, ...prev]);
  };

  return (
    <AppLayout title="Subject Management">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glass">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Subject catalog
            </p>
            <p className="mt-2 text-slate-300">
              Total: {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Subject
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-400">Loading subjects...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 p-8 text-center">
            <p className="text-slate-400 mb-4">No subjects added yet</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Your First Subject
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">
                      {subject.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {subject.code}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-4 text-xs text-slate-400">
                  {subject.credits !== undefined && (
                    <span>Credits: {subject.credits}</span>
                  )}
                  {subject.hoursPerWeek !== undefined && (
                    <span>{subject.hoursPerWeek}h/week</span>
                  )}
                </div>
                {subject.description && (
                  <p className="mt-3 text-sm text-slate-500">
                    {subject.description}
                  </p>
                )}
                {!subject.description && (
                  <p className="mt-3 text-sm text-slate-500">
                    Weekly lectures, duration, and type can be defined here.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AddSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubjectAdded={handleSubjectAdded}
      />
    </AppLayout>
  );
}

export default SubjectManagement;
