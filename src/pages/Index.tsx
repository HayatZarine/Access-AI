import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthGuard } from "@/components/AuthGuard";
import { UserMenu } from "@/components/UserMenu";
import { FeatureCard } from "@/components/FeatureCard";
import { AccessibilityProfile } from "@/components/AccessibilityProfile";
import { AccessibilityTestPanel } from "@/components/AccessibilityTestPanel";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Headphones, 
  Eye, 
  Monitor, 
  Users, 
  Mic, 
  Volume, 
  Camera,
  Search,
  Shield,
  ChevronRight,
  LogIn
} from "lucide-react";
import heroImage from "@/assets/hero-accessibility.jpg";

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeFeatures, setActiveFeatures] = useState<Set<string>>(new Set());
  const [activeProfile, setActiveProfile] = useState<string>("");

  const toggleFeature = (featureId: string) => {
    const newActiveFeatures = new Set(activeFeatures);
    if (newActiveFeatures.has(featureId)) {
      newActiveFeatures.delete(featureId);
      toast({
        title: "Feature Deactivated",
        description: "Accessibility feature has been turned off",
      });
    } else {
      newActiveFeatures.add(featureId);
      toast({
        title: "Feature Activated", 
        description: "Accessibility feature is now active",
      });
    }
    setActiveFeatures(newActiveFeatures);
  };

  const setProfile = (profileId: string) => {
    setActiveProfile(profileId);
    toast({
      title: "Profile Activated",
      description: `${profileId} accessibility profile is now active`,
    });
  };

  const features = [
    {
      id: "captioning",
      icon: Headphones,
      title: "Real-Time AI Captioning",
      description: "Live transcription of audio from any application with emotion detection",
      features: [
        "Multi-language support",
        "Emotion recognition from voice",
        "Customizable caption styling",
        "Sound event notifications"
      ]
    },
    {
      id: "screen-reader", 
      icon: Eye,
      title: "AI-Powered Screen Reader",
      description: "Context-aware screen reading with scene description capabilities",
      features: [
        "Smart content summarization",
        "Object detection and highlighting", 
        "Gesture-based navigation",
        "Braille display support"
      ]
    },
    {
      id: "voice-control",
      icon: Mic,
      title: "Voice + Eye Tracking Control",
      description: "Full device control using voice commands or eye movements",
      features: [
        "Natural language commands",
        "Eye tracking navigation",
        "Custom gesture shortcuts",
        "Hands-free typing"
      ]
    },
    {
      id: "simplification",
      icon: Monitor,
      title: "Smart UI Simplification",
      description: "AI-generated simplified interfaces for any website or application",
      features: [
        "Complexity reduction",
        "Language simplification",
        "Distraction removal",
        "Customizable layouts"
      ]
    },
    {
      id: "scam-shield",
      icon: Shield,
      title: "ScamShield Protection",
      description: "AI-powered protection from phishing, scams, and deceptive websites",
      features: [
        "Suspicious link detection",
        "Pop-up scam blocker", 
        "Form safety advisor",
        "Real-time threat alerts"
      ]
    }
  ];

  const profiles = [
    {
      id: "hearing",
      name: "Hearing Support Profile",
      description: "Enhanced visual feedback and captioning for users with hearing impairments",
      features: ["Live Captions", "Visual Alerts", "Sign Language", "Sound Visualization"]
    },
    {
      id: "vision",
      name: "Vision Support Profile", 
      description: "Screen reading, high contrast, and navigation assistance for users with visual impairments",
      features: ["Screen Reader", "High Contrast", "Voice Navigation", "Magnification"]
    },
    {
      id: "cognitive",
      name: "Cognitive Support Profile",
      description: "Simplified interfaces and reminder systems for users with cognitive disabilities",
      features: ["Simplified UI", "Task Reminders", "Language Simplifier", "Focus Mode"]
    },
    {
      id: "mobility",
      name: "Mobility Support Profile",
      description: "Alternative input methods for users with mobility limitations",
      features: ["Voice Control", "Eye Tracking", "Switch Control", "Gesture Input"]
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero text-foreground">
        {/* Navigation */}
        <nav className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">Access+</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-sm">
                  Beta v1.0
                </Badge>
                <Link to="/auth">
                  <Button variant="accessibility" size="sm" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section for unauthenticated users */}
        <div className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img 
              src={heroImage} 
              alt="Accessibility tools and features" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Universal <span className="text-primary">Accessibility</span> Platform
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Comprehensive accessibility features that adapt to your needs. 
              Screen readers, voice control, audio captioning, and simplified interfaces - all in one platform.
            </p>
            <Link to="/auth">
              <Button variant="hero" size="xl" className="mb-8">
                Get Started <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-hero text-foreground">
        {/* Navigation */}
        <nav className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">Access+</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-sm">
                  Beta v1.0
                </Badge>
                <UserMenu />
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt="Accessibility technology illustration" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-hero/80"></div>
          </div>
        
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Access+
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Unified accessibility enhancement powered by AI. Making digital interaction intuitive, inclusive, and empowering for everyone.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl">
                <Users className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button variant="feature" size="xl">
                <Search className="mr-2 h-5 w-5" />
                Explore Features
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-12">
              <Card className="p-4 bg-gradient-card/50 border-border/50 text-center">
                <Headphones className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Hearing</p>
              </Card>
              <Card className="p-4 bg-gradient-card/50 border-border/50 text-center">
                <Eye className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Vision</p>
              </Card>
              <Card className="p-4 bg-gradient-card/50 border-border/50 text-center">
                <Monitor className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Cognitive</p>
              </Card>
              <Card className="p-4 bg-gradient-card/50 border-border/50 text-center">
                <Mic className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Mobility</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              AI-Powered Accessibility Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced assistive technologies that adapt to your unique needs and preferences
            </p>
          </div>
          
          <div className="features-grid grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                id={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                features={feature.features}
              />
            ))}
          </div>
          
          {/* Testing Panel */}
          <div className="mt-12">
            <AccessibilityTestPanel />
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section className="py-24 bg-gradient-card/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Accessibility Profiles
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pre-configured profiles tailored for different accessibility needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {profiles.map((profile) => (
              <AccessibilityProfile
                key={profile.id}
                name={profile.name}
                description={profile.description}
                features={profile.features}
                isActive={activeProfile === profile.id}
                onActivate={() => setProfile(profile.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary/10 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Transform Your Digital Experience?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of users who have made their digital lives more accessible and inclusive with Access+
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl">
                <Camera className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
              <Button variant="feature" size="xl">
                <Volume className="mr-2 h-5 w-5" />
                Schedule Demo
              </Button>
            </div>
          </div>
          </div>
        </section>
      </div>
    </AuthGuard>
  );
};

export default Index;