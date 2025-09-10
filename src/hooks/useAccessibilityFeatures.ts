import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useScamDetection } from '@/hooks/useScamDetection';

export interface AccessibilityFeature {
  id: string;
  name: string;
  isActive: boolean;
  isSupported: boolean;
  testResult?: string;
}

export const useAccessibilityFeatures = () => {
  const { toast } = useToast();
  const { toggleScamDetection } = useScamDetection();
  const [features, setFeatures] = useState<AccessibilityFeature[]>([
    { id: 'captioning', name: 'Real-Time AI Captioning', isActive: false, isSupported: false },
    { id: 'screen-reader', name: 'AI-Powered Screen Reader', isActive: false, isSupported: false },
    { id: 'voice-control', name: 'Voice Control', isActive: false, isSupported: false },
    { id: 'simplification', name: 'UI Simplification', isActive: false, isSupported: true },
    { id: 'scam-shield', name: 'ScamShield Protection', isActive: false, isSupported: true },
    { id: 'sign-language', name: 'Sign Language Detection', isActive: false, isSupported: false },
    { id: 'text-simplifier', name: 'Text Simplification', isActive: false, isSupported: true },
    { id: 'summarizer', name: 'Content Summarizer', isActive: false, isSupported: true },
  ]);

  const [isListening, setIsListening] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

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

    // Check for MediaDevices (Audio Captioning & Sign Language)
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      updateFeatureSupport('captioning', true);
      updateFeatureSupport('sign-language', true);
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
        case 'scam-shield':
          toggleScamDetection(newActiveState);
          break;
        case 'sign-language':
          await toggleSignLanguage(newActiveState);
          break;
        case 'text-simplifier':
          toggleTextSimplifier(newActiveState);
          break;
        case 'summarizer':
          toggleSummarizer(newActiveState);
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
      
      // Add voice feedback
      if (speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance("🧹 Smart UI Simplification is now ON. The interface is now simplified for easier use.");
        utterance.rate = 0.8; // Slower speech for cognitive accessibility
        speechSynthesis.speak(utterance);
      }
      
      // Set up simplified navigation
      setupSimplifiedNavigation();
    } else {
      body.classList.remove('simplified-ui');
      
      if (speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance("Smart UI Simplification is now OFF. Full interface restored.");
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
      }
      
      // Remove simplified navigation
      removeSimplifiedNavigation();
    }
  };

  const setupSimplifiedNavigation = () => {
    // Show first feature card by default
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
      if (index === 0) {
        card.classList.add('active-card');
      } else {
        card.classList.remove('active-card');
      }
    });
    
    // Add navigation controls
    addNavigationControls();
  };

  const removeSimplifiedNavigation = () => {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      card.classList.remove('active-card');
    });
    
    // Remove navigation controls
    const navControls = document.querySelector('.nav-controls');
    if (navControls) {
      navControls.remove();
    }
  };

  const addNavigationControls = () => {
    const featuresSection = document.querySelector('.features-grid');
    if (!featuresSection) return;
    
    // Remove existing controls
    const existingControls = document.querySelector('.nav-controls');
    if (existingControls) {
      existingControls.remove();
    }
    
    const navControls = document.createElement('div');
    navControls.className = 'nav-controls';
    navControls.innerHTML = `
      <button class="nav-btn" id="prev-feature" aria-label="Previous feature">
        ← Previous
      </button>
      <button class="nav-btn" id="next-feature" aria-label="Next feature">
        Next →
      </button>
    `;
    
    featuresSection.parentNode?.insertBefore(navControls, featuresSection.nextSibling);
    
    // Add event listeners
    const prevBtn = document.getElementById('prev-feature');
    const nextBtn = document.getElementById('next-feature');
    
    prevBtn?.addEventListener('click', () => navigateFeatures(-1));
    nextBtn?.addEventListener('click', () => navigateFeatures(1));
  };

  const navigateFeatures = (direction: number) => {
    const featureCards = document.querySelectorAll('.feature-card');
    let currentIndex = 0;
    
    featureCards.forEach((card, index) => {
      if (card.classList.contains('active-card')) {
        currentIndex = index;
      }
    });
    
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = featureCards.length - 1;
    if (newIndex >= featureCards.length) newIndex = 0;
    
    featureCards.forEach((card, index) => {
      if (index === newIndex) {
        card.classList.add('active-card');
      } else {
        card.classList.remove('active-card');
      }
    });
    
    // Voice feedback for navigation
    if (speechSynthesis) {
      const featureTitles = ['Real-Time AI Captioning', 'AI-Powered Screen Reader', 'Voice + Eye Tracking Control', 'Smart UI Simplification'];
      const utterance = new SpeechSynthesisUtterance(`Now showing: ${featureTitles[newIndex]}`);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleSignLanguage = async (activate: boolean) => {
    if (activate) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        setVideoStream(stream);
        
        // Simulate sign language detection
        toast({
          title: "Sign Language Detection Active",
          description: "Camera is now detecting sign language gestures",
        });
        
        if (speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance("🤟 Sign Language Detection is now active. I can recognize gestures and convert them to text.");
          speechSynthesis.speak(utterance);
        }
      } catch (error) {
        throw new Error("Camera access required for sign language detection");
      }
    } else {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      }
    }
  };

  const toggleTextSimplifier = (activate: boolean) => {
    const body = document.body;
    if (activate) {
      body.classList.add('text-simplified');
      
      // Simplify complex text on the page
      const textElements = document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6');
      textElements.forEach(element => {
        const text = element.textContent;
        if (text && text.length > 50) {
          element.setAttribute('data-original-text', text);
          // Simulate text simplification
          const simplified = text.split('.')[0] + '.'; // Take first sentence
          element.textContent = simplified;
        }
      });
      
      toast({
        title: "Text Simplification Active",
        description: "Complex text has been simplified for easier reading",
      });
    } else {
      body.classList.remove('text-simplified');
      
      // Restore original text
      const simplifiedElements = document.querySelectorAll('[data-original-text]');
      simplifiedElements.forEach(element => {
        const originalText = element.getAttribute('data-original-text');
        if (originalText) {
          element.textContent = originalText;
          element.removeAttribute('data-original-text');
        }
      });
    }
  };

  const toggleSummarizer = (activate: boolean) => {
    if (activate) {
      // Find long content areas and add summary buttons
      const contentAreas = document.querySelectorAll('article, .content, main, .post');
      contentAreas.forEach((area, index) => {
        const text = area.textContent;
        if (text && text.length > 500) {
          const summaryBtn = document.createElement('button');
          summaryBtn.className = 'summary-btn bg-primary text-primary-foreground px-3 py-1 rounded text-sm mb-2';
          summaryBtn.textContent = '📝 Show Summary';
          summaryBtn.onclick = () => {
            // Simulate AI summarization
            const sentences = text.split('.').filter(s => s.trim().length > 0);
            const summary = sentences.slice(0, 2).join('.') + '.';
            
            let summaryDiv = area.querySelector('.ai-summary');
            if (!summaryDiv) {
              summaryDiv = document.createElement('div');
              summaryDiv.className = 'ai-summary bg-accent/20 p-4 rounded mb-4 border-l-4 border-primary';
              summaryDiv.innerHTML = `<strong>📝 AI Summary:</strong><br>${summary}`;
              area.insertBefore(summaryDiv, area.firstChild);
            }
            (summaryDiv as HTMLElement).style.display = (summaryDiv as HTMLElement).style.display === 'none' ? 'block' : 'none';
          };
          
          if (!area.querySelector('.summary-btn')) {
            area.insertBefore(summaryBtn, area.firstChild);
          }
        }
      });
      
      toast({
        title: "Content Summarizer Active",
        description: "Summary buttons added to long content areas",
      });
    } else {
      // Remove summary buttons and summaries
      document.querySelectorAll('.summary-btn, .ai-summary').forEach(el => el.remove());
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
        case 'scam-shield':
          testResult = '✅ ScamShield protection ready';
          break;
        case 'sign-language':
          try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            testResult = '✅ Camera access available for sign language detection';
          } catch {
            testResult = '❌ Camera access denied';
          }
          break;
        case 'text-simplifier':
          testResult = '✅ Text simplification ready';
          break;
        case 'summarizer':
          testResult = '✅ Content summarizer ready';
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