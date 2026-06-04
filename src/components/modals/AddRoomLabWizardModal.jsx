import { useState } from "react";
import { X } from "lucide-react";

function AddRoomLabWizardModal({ isOpen, onClose, onResourceAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "Room",
    capacity: "",
    labType: "Computer Lab",
    building: "",
    floor: "",
    supportedSubjects: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Resource name is required");
      return;
    }

    if (!formData.capacity) {
      setError("Capacity is required");
      return;
    }

    try {
      setLoading(true);
      const resourceData = {
        id: `${formData.type.toLowerCase()}-${Date.now()}`,
        ...formData,
        capacity: parseInt(formData.capacity),
        supportedSubjects: formData.supportedSubjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        createdAt: new Date().toISOString(),
      };

      onResourceAdded(resourceData);

      setFormData({
        name: "",
        type: "Room",
        capacity: "",
        labType: "Computer Lab",
        building: "",
        floor: "",
        supportedSubjects: "",
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add resource");
      console.error("Error adding resource:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isLab = formData.type === "Lab";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md max-h-[90vh] flex flex-col rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        <div className="mb-0 flex items-center justify-between p-8 border-b border-slate-800 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">Add Room or Lab</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-8 overflow-y-auto flex-1"
          id="room-lab-form"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Resource Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Room 101, Computer Lab 1"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-slate-500 focus:outline-none"
            >
              <option value="Room">Classroom</option>
              <option value="Lab">Laboratory</option>
            </select>
          </div>

          {isLab && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Lab Type *
              </label>
              <select
                name="labType"
                value={formData.labType}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-slate-500 focus:outline-none"
              >
                <option value="Computer Lab">Computer Lab</option>
                <option value="Physics Lab">Physics Lab</option>
                <option value="Chemistry Lab">Chemistry Lab</option>
                <option value="AI Lab">AI Lab</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Capacity *
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g., 40, 60"
              min="1"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Building
              </label>
              <input
                type="text"
                name="building"
                value={formData.building}
                onChange={handleChange}
                placeholder="e.g., A, B"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Floor
              </label>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="e.g., 1st, 2nd"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Supported Subjects (comma separated)
            </label>
            <textarea
              name="supportedSubjects"
              value={formData.supportedSubjects}
              onChange={handleChange}
              placeholder={
                isLab
                  ? "e.g., Programming Lab, Database Systems"
                  : "e.g., Mathematics, Physics"
              }
              rows="2"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </form>

        <div className="flex gap-3 pt-4 p-8 border-t border-slate-800 bg-slate-900 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-800 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="room-lab-form"
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Resource"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddRoomLabWizardModal;
