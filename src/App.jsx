import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/ui/Footer";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="flex-1">
        <AppRoutes />
      </div>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
