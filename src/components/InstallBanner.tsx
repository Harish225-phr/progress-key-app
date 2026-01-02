import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface InstallBannerProps {
  storageKey: string;
}

const InstallBanner = ({ storageKey }: InstallBannerProps) => {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    
    if (!dismissed && !isStandalone) {
      setShowBanner(true);
    }
  }, [storageKey]);

  const dismissBanner = () => {
    localStorage.setItem(storageKey, "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <Download className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">Install Progress Key</p>
          <p className="text-sm text-primary-foreground/80">Get quick access from your home screen</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate("/install")}
          className="whitespace-nowrap"
        >
          Install Now
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={dismissBanner}
          className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default InstallBanner;
