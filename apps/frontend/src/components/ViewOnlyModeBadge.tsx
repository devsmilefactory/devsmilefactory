import { AlertCircle } from "lucide-react";

export default function ViewOnlyModeBadge() {
  return (
    <div className="fixed top-1 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-600 text-white rounded-full font-semibold text-xs shadow-lg border-0 hover:bg-red-700 transition-colors">
        <AlertCircle className="h-3 w-3" />
        V7: features disabled VIEW ONLY mode
      </div>
    </div>
  );
}

