import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ScamDetectionResult {
  isScam: boolean;
  confidence: number;
  reason: string;
  type: 'phishing' | 'popup' | 'form' | 'language';
}

export const useScamDetection = () => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [detectionResults, setDetectionResults] = useState<ScamDetectionResult[]>([]);

  // Suspicious domains and patterns
  const suspiciousDomains = [
    'g00gle.com', 'amaz0n.com', 'paypaI.com', 'microsft.com',
    'facebok.com', 'twiter.com', 'banksafe.com', 'secure-bank.net'
  ];

  const scamPhrases = [
    "you've won", "urgent: your account", "click here now", "limited time offer",
    "congratulations winner", "your account will be suspended", "verify your account immediately",
    "act now", "expires today", "free iphone", "you have been selected"
  ];

  const dangerousInputs = ['password', 'credit-card', 'ssn', 'social-security'];

  // Detect suspicious links
  const analyzeLink = useCallback((url: string): ScamDetectionResult => {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      
      // Check against known suspicious domains
      if (suspiciousDomains.some(sus => domain.includes(sus))) {
        return {
          isScam: true,
          confidence: 0.9,
          reason: `Suspicious domain detected: ${domain}`,
          type: 'phishing'
        };
      }

      // Check for URL shorteners (potential hidden destinations)
      const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl'];
      if (shorteners.some(short => domain.includes(short))) {
        return {
          isScam: true,
          confidence: 0.6,
          reason: 'Shortened URL detected - destination hidden',
          type: 'phishing'
        };
      }

      // Check for misspelled domains
      const commonDomains = ['google', 'amazon', 'paypal', 'microsoft', 'facebook', 'twitter'];
      for (const common of commonDomains) {
        if (domain.includes(common) && !domain.includes(`${common}.com`)) {
          return {
            isScam: true,
            confidence: 0.8,
            reason: `Possible misspelled domain: ${domain}`,
            type: 'phishing'
          };
        }
      }

      return {
        isScam: false,
        confidence: 0.1,
        reason: 'Link appears safe',
        type: 'phishing'
      };
    } catch {
      return {
        isScam: true,
        confidence: 0.7,
        reason: 'Invalid URL format',
        type: 'phishing'
      };
    }
  }, []);

  // Detect scam language in text content
  const analyzeTextContent = useCallback((text: string): ScamDetectionResult => {
    const lowerText = text.toLowerCase();
    
    const foundPhrases = scamPhrases.filter(phrase => lowerText.includes(phrase));
    
    if (foundPhrases.length > 0) {
      return {
        isScam: true,
        confidence: Math.min(0.9, foundPhrases.length * 0.3),
        reason: `Suspicious language detected: "${foundPhrases[0]}"`,
        type: 'language'
      };
    }

    return {
      isScam: false,
      confidence: 0.1,
      reason: 'Text appears safe',
      type: 'language'
    };
  }, []);

  // Monitor page for suspicious content
  const scanPage = useCallback(() => {
    if (!isActive) return;

    const results: ScamDetectionResult[] = [];

    // Scan all links
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('http')) {
        const result = analyzeLink(href);
        if (result.isScam) {
          results.push(result);
          // Add warning styling to suspicious links
          link.classList.add('scam-warning-link');
        }
      }
    });

    // Scan for suspicious text content
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
    textElements.forEach(element => {
      const text = element.textContent || '';
      if (text.length > 10) {
        const result = analyzeTextContent(text);
        if (result.isScam) {
          results.push(result);
          element.classList.add('scam-warning-text');
        }
      }
    });

    // Check for dangerous form inputs
    const inputs = document.querySelectorAll('input[type="password"], input[type="text"], input[type="email"]');
    inputs.forEach(input => {
      const inputElement = input as HTMLInputElement;
      const isHTTPS = window.location.protocol === 'https:';
      const fieldName = inputElement.name?.toLowerCase() || inputElement.placeholder?.toLowerCase() || '';
      
      if (!isHTTPS && dangerousInputs.some(danger => fieldName.includes(danger))) {
        results.push({
          isScam: true,
          confidence: 0.8,
          reason: 'Requesting sensitive data without HTTPS security',
          type: 'form'
        });
        inputElement.classList.add('scam-warning-input');
      }
    });

    setDetectionResults(results);

    // Show warning if scams detected
    if (results.length > 0 && results.some(r => r.confidence > 0.7)) {
      showScamWarning(results);
    }
  }, [isActive, analyzeLink, analyzeTextContent]);

  const showScamWarning = (results: ScamDetectionResult[]) => {
    const highRiskResults = results.filter(r => r.confidence > 0.7);
    
    if (highRiskResults.length > 0) {
      toast({
        title: "🚨 Scam Warning",
        description: `This site may try to scam you. ${highRiskResults[0].reason}`,
        variant: "destructive",
      });

      // Create warning banner
      createWarningBanner(highRiskResults[0]);
    }
  };

  const createWarningBanner = (result: ScamDetectionResult) => {
    // Remove existing banner
    const existing = document.querySelector('.scam-warning-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.className = 'scam-warning-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10000;
        background: #dc2626;
        color: white;
        padding: 12px;
        text-align: center;
        font-weight: bold;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        🚨 SCAM WARNING: ${result.reason} - Proceed with caution
        <button onclick="this.parentElement.parentElement.remove()" style="
          float: right;
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 0 8px;
        ">×</button>
      </div>
    `;
    
    document.body.appendChild(banner);
  };

  const toggleScamDetection = useCallback((activate: boolean) => {
    setIsActive(activate);
    
    if (activate) {
      toast({
        title: "🛡️ ScamShield Activated",
        description: "Monitoring for suspicious links, content, and forms",
      });
      
      // Initial page scan
      setTimeout(scanPage, 1000);
      
      // Set up periodic scanning
      const interval = setInterval(scanPage, 5000);
      return () => clearInterval(interval);
    } else {
      toast({
        title: "ScamShield Deactivated",
        description: "No longer monitoring for scams",
      });
      
      // Remove warning styling
      document.querySelectorAll('.scam-warning-link, .scam-warning-text, .scam-warning-input').forEach(el => {
        el.classList.remove('scam-warning-link', 'scam-warning-text', 'scam-warning-input');
      });
      
      // Remove warning banner
      const banner = document.querySelector('.scam-warning-banner');
      if (banner) banner.remove();
      
      setDetectionResults([]);
    }
  }, [scanPage, toast]);

  // Monitor for pop-ups
  useEffect(() => {
    if (!isActive) return;

    const handlePopup = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'DIV') {
        const text = target.textContent?.toLowerCase() || '';
        const result = analyzeTextContent(text);
        
        if (result.isScam && (text.includes('won') || text.includes('virus') || text.includes('urgent'))) {
          e.preventDefault();
          e.stopPropagation();
          
          toast({
            title: "🚨 Blocked Suspicious Pop-up",
            description: "Prevented potentially harmful pop-up from displaying",
            variant: "destructive",
          });
        }
      }
    };

    document.addEventListener('DOMNodeInserted', handlePopup);
    return () => document.removeEventListener('DOMNodeInserted', handlePopup);
  }, [isActive, analyzeTextContent, toast]);

  return {
    isActive,
    detectionResults,
    toggleScamDetection,
    analyzeLink,
    analyzeTextContent,
    scanPage
  };
};