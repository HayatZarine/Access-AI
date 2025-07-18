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

  // Simplified icons with emojis for cognitive accessibility
  const getSimplifiedIcon = (id: string) => {
    switch (id) {
      case 'captioning': return '🎧';
      case 'screen-reader': return '👁️';
      case 'voice-control': return '🎤';
      case 'simplification': return '🧹';
      case 'scam-shield': return '🛡️';
      default: return '⚙️';
    }
  };

  const getSimplifiedTitle = (id: string) => {
    switch (id) {
      case 'captioning': return '🎧 Audio Captions';
      case 'screen-reader': return '👁️ Screen Reader';
      case 'voice-control': return '🎤 Voice Control';
      case 'simplification': return '🧹 Simplify UI';
      case 'scam-shield': return '🛡️ Scam Protection';
      default: return title;
    }
  };

  return (
    <Card className="feature-card p-6 bg-gradient-card border-border hover:border-accent/30 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className={`feature-icon p-3 rounded-lg transition-all duration-300 ${
          isActive 
            ? 'bg-primary text-primary-foreground shadow-glow' 
            : 'bg-muted text-muted-foreground group-hover:bg-accent/20'
        }`}>
          <Icon className="h-6 w-6" />
          <div className="simplified-icon text-4xl text-center mt-2" style={{ display: 'none' }}>
            {getSimplifiedIcon(id)}
          </div>
        </div>
        
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-foreground">
                <span className="regular-title">{title}</span>
                <span className="simplified-title" style={{ display: 'none' }}>
                  {getSimplifiedTitle(id)}
                </span>
              </h3>
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
            <p className="text-muted-foreground regular-description">{description}</p>
            <p className="simplified-description text-lg" style={{ display: 'none' }}>
              {id === 'captioning' && 'Shows text for what you hear'}
              {id === 'screen-reader' && 'Reads the screen out loud for you'}
              {id === 'voice-control' && 'Control with your voice'}
              {id === 'simplification' && 'Makes the page easier to read'}
              {id === 'scam-shield' && 'Protects you from scams and bad websites'}
            </p>
          </div>
          
          {/* Status indicator for simplified UI */}
          <div className={`status-indicator ${isActive ? 'status-active' : 'status-inactive'}`} style={{ display: 'none' }}>
            {isActive ? '✅ ON' : '🔘 OFF'}
          </div>
          
          <ul className="feature-list space-y-2">
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
            className={`w-full mt-4 btn-simplified ${isActive ? 'active' : 'inactive'}`}
            disabled={!isSupported}
            aria-label={`${isActive ? 'Deactivate' : 'Activate'} ${title}`}
            aria-describedby={`${id}-description`}
          >
            <span className="regular-btn-text">
              {!isSupported ? "Not Available" : isActive ? "Deactivate" : "Activate"}
            </span>
            <span className="simplified-btn-text" style={{ display: 'none' }}>
              {!isSupported ? "❌ Can't Use" : isActive ? "🔴 Turn OFF" : "🟢 Turn ON"}
            </span>
          </Button>
        </div>
      </div>
      <div id={`${id}-description`} className="sr-only">
        {description}
      </div>
    </Card>
  );
};