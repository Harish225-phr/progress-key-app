import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
  Monitor, 
  Share, 
  Plus, 
  MoreVertical, 
  Download,
  CheckCircle2,
  ArrowLeft,
  Chrome,
  Apple
} from "lucide-react";
import { Link } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const iosSteps = [
    {
      step: 1,
      title: "Open in Safari",
      description: "Make sure you're viewing this page in Safari browser (not Chrome or other browsers)",
      icon: Apple
    },
    {
      step: 2,
      title: "Tap the Share button",
      description: "Tap the Share icon at the bottom of the screen (square with arrow pointing up)",
      icon: Share
    },
    {
      step: 3,
      title: "Scroll down and tap 'Add to Home Screen'",
      description: "Find the 'Add to Home Screen' option in the share menu",
      icon: Plus
    },
    {
      step: 4,
      title: "Tap 'Add'",
      description: "Confirm by tapping 'Add' in the top right corner",
      icon: CheckCircle2
    }
  ];

  const androidSteps = [
    {
      step: 1,
      title: "Open in Chrome",
      description: "Make sure you're viewing this page in Google Chrome browser",
      icon: Chrome
    },
    {
      step: 2,
      title: "Tap the menu (⋮)",
      description: "Tap the three dots menu in the top right corner of Chrome",
      icon: MoreVertical
    },
    {
      step: 3,
      title: "Tap 'Install app' or 'Add to Home screen'",
      description: "Select the install option from the menu",
      icon: Download
    },
    {
      step: 4,
      title: "Tap 'Install'",
      description: "Confirm the installation in the popup dialog",
      icon: CheckCircle2
    }
  ];

  const desktopSteps = [
    {
      step: 1,
      title: "Open in Chrome or Edge",
      description: "Make sure you're using Chrome, Edge, or another Chromium-based browser",
      icon: Chrome
    },
    {
      step: 2,
      title: "Look for the install icon",
      description: "Click the install icon in the address bar (⊕ or computer icon)",
      icon: Monitor
    },
    {
      step: 3,
      title: "Click 'Install'",
      description: "Confirm the installation in the popup dialog",
      icon: CheckCircle2
    }
  ];

  const StepCard = ({ step, title, description, icon: Icon }: { step: number; title: string; description: string; icon: React.ElementType }) => (
    <div className="flex gap-4 p-4 rounded-lg bg-muted/50">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
        {step}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Smartphone className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Install School Progress App</h1>
          <p className="text-muted-foreground">
            Install our app on your device for quick access and offline support
          </p>
        </div>

        {isInstalled ? (
          <Card className="mb-8 border-green-500/50 bg-green-500/10">
            <CardContent className="flex items-center gap-4 py-6">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <div>
                <h2 className="text-xl font-semibold text-green-700 dark:text-green-400">App Already Installed!</h2>
                <p className="text-muted-foreground">You can open the app from your home screen or app drawer.</p>
              </div>
            </CardContent>
          </Card>
        ) : deferredPrompt ? (
          <Card className="mb-8 border-primary/50 bg-primary/5">
            <CardContent className="py-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Quick Install Available!</h2>
                <p className="text-muted-foreground mb-4">Click the button below to install the app instantly.</p>
                <Button size="lg" onClick={handleInstall} className="gap-2">
                  <Download className="h-5 w-5" />
                  Install Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Installation Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ios" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="ios" className="gap-2">
                  <Apple className="h-4 w-4" />
                  iOS
                </TabsTrigger>
                <TabsTrigger value="android" className="gap-2">
                  <Smartphone className="h-4 w-4" />
                  Android
                </TabsTrigger>
                <TabsTrigger value="desktop" className="gap-2">
                  <Monitor className="h-4 w-4" />
                  Desktop
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ios" className="space-y-4">
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-4">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    <strong>Important:</strong> PWA installation on iOS only works in Safari browser.
                  </p>
                </div>
                {iosSteps.map((step) => (
                  <StepCard key={step.step} {...step} />
                ))}
              </TabsContent>

              <TabsContent value="android" className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-4">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    <strong>Tip:</strong> Chrome usually shows an "Add to Home Screen" banner automatically.
                  </p>
                </div>
                {androidSteps.map((step) => (
                  <StepCard key={step.step} {...step} />
                ))}
              </TabsContent>

              <TabsContent value="desktop" className="space-y-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 mb-4">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    <strong>Note:</strong> Desktop installation works best in Chrome, Edge, or Brave browsers.
                  </p>
                </div>
                {desktopSteps.map((step) => (
                  <StepCard key={step.step} {...step} />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Benefits of Installing</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Quick Access</strong> — Launch directly from your home screen</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Faster Loading</strong> — App loads instantly with cached assets</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Full Screen</strong> — No browser chrome for immersive experience</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Works Offline</strong> — Access basic features without internet</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Install;
