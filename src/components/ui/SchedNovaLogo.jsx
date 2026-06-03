import { Calendar, Clock, Users, Zap } from "lucide-react";

function SchedNovaLogo({ className = "h-8 w-8" }) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <Calendar className="h-full w-full text-blue-500" />
    </div>
  );
}

export default SchedNovaLogo;
