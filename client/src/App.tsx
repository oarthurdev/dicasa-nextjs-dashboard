import { QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { NotFound } from '@/pages/not-found';
import { RankingPage } from '@/pages/RankingPage';
import { BrokerProfilePage } from '@/pages/BrokerProfilePage';
import { Route, Switch } from 'wouter';
import { queryClient } from '@/lib/queryClient';

function Router() {
  return (
    <Switch>
      <Route path="/" component={RankingPage} />
      <Route path="/broker/:id" component={BrokerProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="bg-background min-h-screen">
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}