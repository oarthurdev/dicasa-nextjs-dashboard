
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { RankingPage } from "@/pages/RankingPage";
import { BrokerProfilePage } from "@/pages/BrokerProfilePage";
import { Route, Switch, useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";

function ProgressBar({ isAnimating }: { isAnimating: boolean }) {
  return (
    <div
      className="progress-bar"
      style={{
        width: isAnimating ? "100%" : "0%",
        opacity: isAnimating ? 1 : 0,
      }}
    />
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <ProgressBar isAnimating={isTransitioning} />
      <div className={`page-transition ${isTransitioning ? "opacity-50" : "opacity-100"}`}>
        {children}
      </div>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="bg-background min-h-screen">
          <PageTransition>
            <Switch>
              <Route path="/" component={RankingPage} />
              <Route path="/broker/:id" component={BrokerProfilePage} />
              <Route component={NotFound} />
            </Switch>
          </PageTransition>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
