import { useState } from "react";
import { X } from "lucide-react";
import { saveSubject } from "../../services/firebase/firestoreService";

function AddSubjectModal({ isOpen, onClose, onSubjectAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    credits: "",
    hoursPerWeek: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Subject name is required");
      return;
    }

    if (!formData.code.trim()) {
      setError("Subject code is required");
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");

      const subjectData = {
        ...formData,
        credits: parseInt(formData.credits) || 0,
        hoursPerWeek: parseInt(formData.hoursPerWeek) || 0,
        instituteId: userId,
        userId,
        createdAt: new Date().toISOString(),
      };

      const subjectId = await saveSubject(null, subjectData);

      onSubjectAdded({
        id: subjectId,
        ...subjectData,
      });

      setFormData({
        name: "",
        code: "",
        credits: "",
        hoursPerWeek: "",
        description: "",
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add subject");
      console.error("Error adding subject:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Add New Subject</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Subject Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter subject name"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Subject Code *
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., MATH101"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Credits
              </label>
              <input
                type="number"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Hours/Week
              </label>
              <input
                type="number"
                name="hoursPerWeek"
                value={formData.hoursPerWeek}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the subject"
              rows="3"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-800 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSubjectModal;
