import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { RankingPage } from "@/pages/RankingPage";
import { BrokerProfilePage } from "@/pages/BrokerProfilePage";
import { Route, Switch, useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { useState, useEffect, useCallback } from "react";
import { ROTATION_INTERVAL } from "@/lib/constants";

// Componente para rotação automática de páginas
function AutoRotation() {
  const [, setLocation] = useLocation();
  const [currentPage, setCurrentPage] = useState(0);
  const [topBrokerIds, setTopBrokerIds] = useState<number[]>([]);
  const [progress, setProgress] = useState(0); // Estado para controlar o progresso

  // Carregar os IDs dos principais corretores
  useEffect(() => {
    async function fetchTopBrokers() {
      try {
        const data = await import("@/lib/supabase").then((m) =>
          m.getBrokerRankings(),
        );

        // Pegar os IDs dos 3 principais corretores
        if (data) {
          setTopBrokerIds(data.map((broker) => broker.id));
        }
      } catch (error) {
        console.error("Erro ao buscar corretores:", error);
      }
    }

    fetchTopBrokers();
  }, []);

  // Calcular número total de páginas (ranking + perfis dos 3 principais corretores)
  const totalPages = 1 + (topBrokerIds?.length || 0);

  // Função para navegar para a próxima página
  const goToNextPage = useCallback(() => {
    const nextPage = (currentPage + 1) % totalPages;
    setCurrentPage(nextPage);

    if (nextPage === 0) {
      // Voltar para a página de ranking
      setLocation("/");
    } else {
      // Ir para o perfil de um corretor específico
      const brokerId = topBrokerIds[nextPage - 1];
      if (brokerId) {
        setLocation(`/broker/${brokerId}`);
      }
    }
  }, [currentPage, totalPages, topBrokerIds, setLocation]);

  // Atualizar o progresso e realizar a rotação
  useEffect(() => {
    if (totalPages <= 1) return; // Não rotar se só tiver uma página

    const interval = 100; // Intervalo de atualização do progresso em milissegundos
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      currentProgress += 100 / (ROTATION_INTERVAL / interval);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        goToNextPage();
        currentProgress = 0;
        setProgress(0);
      }
    }, interval);

    // Limpar intervalo ao desmontar ou ao trocar de página
    return () => clearInterval(progressInterval);
  }, [goToNextPage, totalPages]);

  return null; // Este componente não renderiza nada, apenas gerencia a navegação
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div
      className="progress-bar"
      style={{
        width: `${progress}%`,
        transition: "width 0.1s linear", // Suaviza a transição de progressão
      }}
    />
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [location] = useLocation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 10000);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <ProgressBar progress={progress} />
      <div
        className={`page-transition ${isTransitioning ? "opacity-50" : "opacity-100"}`}
      >
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
            <AutoRotation />
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
