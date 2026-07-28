import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Element } from "@/pages/Element";
import { Analyzing } from "@/pages/Analyzing";
import { Candidates } from "@/pages/Candidates";
import { Results } from "@/pages/Results";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Element} />
      <Route path="/analyzing" component={Analyzing} />
      <Route path="/candidates" component={Candidates} />
      <Route path="/results" component={Results} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
