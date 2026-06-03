import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import AddRoomModal from "../../components/modals/AddRoomModal";
import { queryDocuments } from "../../services/firebase/firestoreService";

function RoomLabManagement() {
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const data = await queryDocuments("rooms");
      const userRooms = data.filter((room) => room.userId === userId);
      setRooms(userRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomAdded = (newRoom) => {
    setRooms((prev) => [newRoom, ...prev]);
  };

  return (
    <AppLayout title="Room & Lab Management">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-glass">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Facility Management
            </p>
            <p className="mt-2 text-slate-300">
              Total: {rooms.length} room{rooms.length !== 1 ? "s" : ""}/lab
              {rooms.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Room/Lab
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-400">Loading rooms and labs...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 p-8 text-center">
            <p className="text-slate-400 mb-4">No rooms or labs added yet</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Your First Room
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{room.type}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {room.name}
                    </h3>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                    Cap: {room.capacity}
                  </span>
                </div>

                {(room.building || room.floor) && (
                  <p className="mt-3 text-sm text-slate-400">
                    {room.building && `Building ${room.building}`}
                    {room.building && room.floor && " • "}
                    {room.floor && `Floor ${room.floor}`}
                  </p>
                )}

                {room.supportedSubjects &&
                  room.supportedSubjects.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs uppercase tracking-[0.1em] text-slate-500 mb-2">
                        Supported Subjects
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {room.supportedSubjects.map((subject, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-slate-800/50 px-2 py-1 text-xs text-slate-300"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AddRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRoomAdded={handleRoomAdded}
      />
    </AppLayout>
  );
}

export default RoomLabManagement;
