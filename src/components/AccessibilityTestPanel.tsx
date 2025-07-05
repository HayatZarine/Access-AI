import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAccessibilityFeatures } from "@/hooks/useAccessibilityFeatures";
import { TestTube, Play, Volume2, Mic } from "lucide-react";

export const AccessibilityTestPanel = () => {
  const { features, testFeature, isListening } = useAccessibilityFeatures();

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <TestTube className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Feature Testing Panel</h3>
      </div>
      
      <div className="space-y-4">
        {features.map((feature) => (
          <div key={feature.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">{feature.name}</span>
                <Badge variant={feature.isSupported ? "secondary" : "destructive"} className="text-xs">
                  {feature.isSupported ? "Supported" : "Not Supported"}
                </Badge>
                {feature.isActive && (
                  <Badge variant="default" className="text-xs bg-primary text-primary-foreground">
                    Active
                  </Badge>
                )}
                {feature.id === 'voice-control' && isListening && (
                  <div className="flex items-center gap-1">
                    <Mic className="h-3 w-3 text-destructive animate-pulse" />
                    <span className="text-xs text-destructive">Listening</span>
                  </div>
                )}
              </div>
              {feature.testResult && (
                <p className="text-xs text-muted-foreground">{feature.testResult}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => testFeature(feature.id)}
              disabled={!feature.isSupported}
            >
              <Play className="h-3 w-3 mr-1" />
              Test
            </Button>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-semibold text-foreground mb-2">Testing Instructions:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Click "Test" to verify each feature works</li>
          <li>• Screen Reader: Will speak a test message</li>
          <li>• Voice Control: Try "scroll down", "scroll up", "go back"</li>
          <li>• Captioning: Requests microphone permission</li>
          <li>• UI Simplification: Toggles simplified layout</li>
        </ul>
      </div>
    </Card>
  );
};