import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePWA } from "@/hooks/usePWA";
import { useState } from "react";

export const InstallPrompt = () => {
  const { isInstallable, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-card border-primary/20 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-sm">Install Access+</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Install Access+ for quick access to accessibility features on any device.
        </p>
        <div className="flex gap-2">
          <Button
            onClick={installApp}
            size="sm"
            className="flex-1"
          >
            Install App
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDismissed(true)}
          >
            Not now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};