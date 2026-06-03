import { useState } from "react";
import { X } from "lucide-react";
import { saveTeacher } from "../../services/firebase/firestoreService";

function AddTeacherModal({ isOpen, onClose, onTeacherAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
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
      setError("Teacher name is required");
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem("userId"); // Get current user ID

      const teacherData = {
        ...formData,
        instituteId: userId, // Link to current institute
        createdAt: new Date().toISOString(),
      };

      const teacherId = await saveTeacher(null, teacherData);

      onTeacherAdded({
        id: teacherId,
        ...teacherData,
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: "",
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add teacher");
      console.error("Error adding teacher:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Add New Teacher</h2>
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
              Teacher Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter teacher name"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="teacher@example.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Specialization
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g., Mathematics"
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
              {loading ? "Adding..." : "Add Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTeacherModal;
