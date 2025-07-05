import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { useAccessibilityFeatures } from "@/hooks/useAccessibilityFeatures";

interface FeatureCardProps {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

export const FeatureCard = ({ 
  id,
  icon: Icon, 
  title, 
  description, 
  features
}: FeatureCardProps) => {
  const { features: accessibilityFeatures, toggleFeature } = useAccessibilityFeatures();
  const feature = accessibilityFeatures.find(f => f.id === id);
  const isActive = feature?.isActive || false;
  const isSupported = feature?.isSupported ?? true;

  return (
    <Card className="p-6 bg-gradient-card border-border hover:border-accent/30 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg transition-all duration-300 ${
          isActive 
            ? 'bg-primary text-primary-foreground shadow-glow' 
            : 'bg-muted text-muted-foreground group-hover:bg-accent/20'
        }`}>
          <Icon className="h-6 w-6" />
        </div>
        
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
              {!isSupported && (
                <Badge variant="destructive" className="text-xs">
                  Not Supported
                </Badge>
              )}
              {isActive && (
                <Badge variant="default" className="text-xs bg-primary text-primary-foreground">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{description}</p>
          </div>
          
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button 
            variant={isActive ? "accessibility" : "feature"}
            onClick={() => toggleFeature(id)}
            className="w-full mt-4"
            disabled={!isSupported}
          >
            {!isSupported ? "Not Available" : isActive ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>
    </Card>
  );
};