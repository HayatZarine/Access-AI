import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface AccessibilityFeature {
  id: string;
  name: string;
  isActive: boolean;
  isSupported: boolean;
  testResult?: string;
}

export const useAccessibilityFeatures = () => {
  const { toast } = useToast();
  const [features, setFeatures] = useState<AccessibilityFeature[]>([
    { id: 'captioning', name: 'Real-Time AI Captioning', isActive: false, isSupported: false },
    { id: 'screen-reader', name: 'AI-Powered Screen Reader', isActive: false, isSupported: false },
    { id: 'voice-control', name: 'Voice Control', isActive: false, isSupported: false },
    { id: 'simplification', name: 'UI Simplification', isActive: false, isSupported: true },
  ]);

  const [isListening, setIsListening] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);

  // Initialize browser APIs
  useEffect(() => {
    // Check for Speech Synthesis (Text-to-Speech)
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
      updateFeatureSupport('screen-reader', true);
    }

    // Check for Speech Recognition (Voice Control)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      setSpeechRecognition(recognition);
      updateFeatureSupport('voice-control', true);
    }

    // Check for MediaDevices (Audio Captioning)
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      updateFeatureSupport('captioning', true);
    }
  }, []);

  const updateFeatureSupport = (featureId: string, isSupported: boolean) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId ? { ...feature, isSupported } : feature
    ));
  };

  const toggleFeature = useCallback(async (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    if (!feature.isSupported) {
      toast({
        title: "Feature Not Supported",
        description: "This feature is not supported in your current browser",
        variant: "destructive"
      });
      return;
    }

    const newActiveState = !feature.isActive;
    
    try {
      switch (featureId) {
        case 'screen-reader':
          await toggleScreenReader(newActiveState);
          break;
        case 'voice-control':
          await toggleVoiceControl(newActiveState);
          break;
        case 'simplification':
          toggleUISimplification(newActiveState);
          break;
        case 'captioning':
          await toggleCaptioning(newActiveState);
          break;
      }

      setFeatures(prev => prev.map(f => 
        f.id === featureId ? { ...f, isActive: newActiveState } : f
      ));

      toast({
        title: newActiveState ? "Feature Activated" : "Feature Deactivated",
        description: `${feature.name} is now ${newActiveState ? 'active' : 'inactive'}`,
      });
    } catch (error) {
      toast({
        title: "Feature Error",
        description: `Failed to ${newActiveState ? 'activate' : 'deactivate'} ${feature.name}`,
        variant: "destructive"
      });
    }
  }, [features, toast]);

  const toggleScreenReader = async (activate: boolean) => {
    if (!speechSynthesis) return;

    if (activate) {
      // Test screen reader
      const utterance = new SpeechSynthesisUtterance("Screen reader activated. I can now read page content aloud.");
      speechSynthesis.speak(utterance);
    } else {
      speechSynthesis.cancel();
    }
  };

  const toggleVoiceControl = async (activate: boolean) => {
    if (!speechRecognition) return;

    if (activate) {
      speechRecognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      speechRecognition.start();
      setIsListening(true);
      
      toast({
        title: "Voice Control Active",
        description: "Try saying: 'scroll down', 'go back', or 'click button'",
      });
    } else {
      speechRecognition.stop();
      setIsListening(false);
    }
  };

  const handleVoiceCommand = (command: string) => {
    if (command.includes('scroll down')) {
      window.scrollBy(0, 300);
    } else if (command.includes('scroll up')) {
      window.scrollBy(0, -300);
    } else if (command.includes('go back')) {
      window.history.back();
    } else if (command.includes('click button')) {
      const button = document.querySelector('button');
      if (button) button.click();
    }
  };

  const toggleUISimplification = (activate: boolean) => {
    const body = document.body;
    if (activate) {
      body.classList.add('simplified-ui');
    } else {
      body.classList.remove('simplified-ui');
    }
  };

  const toggleCaptioning = async (activate: boolean) => {
    if (activate) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        toast({
          title: "Audio Captioning Ready",
          description: "Microphone access granted. Live captioning would appear here.",
        });
        // In a real implementation, you'd connect this to a speech-to-text service
        setTimeout(() => stream.getTracks().forEach(track => track.stop()), 3000);
      } catch (error) {
        throw new Error("Microphone access required for captioning");
      }
    }
  };

  const testFeature = async (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    let testResult = '';
    
    try {
      switch (featureId) {
        case 'screen-reader':
          if (speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance("Screen reader test successful");
            speechSynthesis.speak(utterance);
            testResult = '✅ Text-to-speech working';
          } else {
            testResult = '❌ Text-to-speech not supported';
          }
          break;
        case 'voice-control':
          testResult = speechRecognition ? '✅ Speech recognition available' : '❌ Speech recognition not supported';
          break;
        case 'simplification':
          testResult = '✅ UI simplification ready';
          break;
        case 'captioning':
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            testResult = '✅ Microphone access available';
          } catch {
            testResult = '❌ Microphone access denied';
          }
          break;
      }
    } catch (error) {
      testResult = `❌ Test failed: ${error}`;
    }

    setFeatures(prev => prev.map(f => 
      f.id === featureId ? { ...f, testResult } : f
    ));

    toast({
      title: "Feature Test Complete",
      description: testResult,
    });
  };

  return {
    features,
    toggleFeature,
    testFeature,
    isListening
  };
};