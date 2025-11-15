import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MultipleProfilesNotificationProps {
  onDismiss?: () => void;
}

const MultipleProfilesNotification = ({ onDismiss }: MultipleProfilesNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed this notification
    const dismissed = localStorage.getItem('multipleProfilesNotificationDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Show notification after a short delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('multipleProfilesNotificationDismissed', 'true');
    onDismiss?.();
  };

  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform transition-transform duration-300 ease-in-out"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Badge 
              variant="secondary" 
              className="bg-white text-red-600 font-bold px-3 py-1 text-xs uppercase tracking-wide"
            >
              New Feature
            </Badge>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <h3 className="font-bold text-sm sm:text-base">Multiple Profiles</h3>
              <span className="hidden sm:inline text-white/80">•</span>
              <p className="text-xs sm:text-sm text-white/90">
                You can now create and manage multiple profiles for different roles in the ecosystem
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-8 w-8 text-white hover:bg-white/20 flex-shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultipleProfilesNotification;

