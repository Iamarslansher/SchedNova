import { useState } from "react";
import { X } from "lucide-react";
import { saveRoom } from "../../services/firebase/firestoreService";

function AddRoomModal({ isOpen, onClose, onRoomAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "Room",
    capacity: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Room name is required");
      return;
    }

    if (!formData.capacity) {
      setError("Room capacity is required");
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");

      const roomData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        supportedSubjects: formData.supportedSubjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        instituteId: userId,
        userId,
        createdAt: new Date().toISOString(),
      };

      const roomId = await saveRoom(null, roomData);

      onRoomAdded({
        id: roomId,
        ...roomData,
      });

      setFormData({
        name: "",
        type: "Room",
        capacity: "",
        building: "",
        floor: "",
        supportedSubjects: "",
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add room");
      console.error("Error adding room:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Add New Room</h2>
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
              Room Name *
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
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-slate-500 focus:outline-none"
            >
              <option value="Room">Room</option>
              <option value="Lab">Lab</option>
            </select>
          </div>

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
              placeholder="e.g., Computer Science, Programming, AI"
              rows="2"
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
              {loading ? "Adding..." : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRoomModal;
