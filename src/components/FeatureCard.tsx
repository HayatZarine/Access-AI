import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  onActivate: () => void;
  isActive?: boolean;
}

export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  features, 
  onActivate, 
  isActive = false 
}: FeatureCardProps) => {
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
            <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
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
            onClick={onActivate}
            className="w-full mt-4"
          >
            {isActive ? "Active" : "Activate"}
          </Button>
        </div>
      </div>
    </Card>
  );
};