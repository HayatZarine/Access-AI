import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileProps {
  name: string;
  description: string;
  features: string[];
  isActive: boolean;
  onActivate: () => void;
}

export const AccessibilityProfile = ({ 
  name, 
  description, 
  features, 
  isActive, 
  onActivate 
}: ProfileProps) => {
  return (
    <Card className={`p-6 transition-all duration-300 ${
      isActive 
        ? 'bg-gradient-primary/10 border-primary shadow-glow' 
        : 'bg-gradient-card border-border hover:border-accent/30'
    }`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          {isActive && (
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              Active
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {features.map((feature, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
        
        <Button 
          variant={isActive ? "secondary" : "accessibility"}
          onClick={onActivate}
          className="w-full"
          disabled={isActive}
        >
          {isActive ? "Currently Active" : "Activate Profile"}
        </Button>
      </div>
    </Card>
  );
};