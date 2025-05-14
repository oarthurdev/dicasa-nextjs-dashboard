import { useState, useEffect, useCallback } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RankingPage } from "@/pages/RankingPage";
import { BrokerProfilePage } from "@/pages/BrokerProfilePage";
import NotFound from "@/pages/not-found";
import { ROTATION_INTERVAL } from "@/lib/constants";

// Componente para rotação automática de páginas
function AutoRotation({ companyId }: { companyId: string }) {
  const [, setLocation] = useLocation();
  const [currentPage, setCurrentPage] = useState(0);
  const [topBrokerIds, setTopBrokerIds] = useState<number[]>([]);

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
  }, [companyId]); // Agora, busca é feita toda vez que o companyId muda

  // Calcular número total de páginas (ranking + perfis dos 3 principais corretores)
  const totalPages = 1 + (topBrokerIds?.length || 0);

  // Função para navegar para a próxima página
  const goToNextPage = useCallback(() => {
    const nextPage = (currentPage + 1) % totalPages;
    setCurrentPage(nextPage);

    if (nextPage === 0) {
      // Voltar para a página de ranking
      setLocation(`/${companyId}`);
    } else {
      // Ir para o perfil de um corretor específico
      const brokerId = topBrokerIds[nextPage - 1];
      if (brokerId) {
        setLocation(`/${companyId}/broker/${brokerId}`);
      }
    }
  }, [currentPage, totalPages, topBrokerIds, companyId, setLocation]);

  // Configurar o timer para rotação automática
  useEffect(() => {
    if (totalPages <= 1) return; // Não rotar se só tiver uma página

    const timer = setTimeout(() => {
      goToNextPage();
    }, ROTATION_INTERVAL);

    return () => clearTimeout(timer);
  }, [goToNextPage, totalPages]);

  return null; // Este componente não renderiza nada, apenas gerencia a navegação
}

function Router() {
  const location = useLocation();
  const pathSegments = location[0].split("/");

  // Extrair o companyId do caminho
  const companyId = pathSegments[1]; // Pega o primeiro segmento após a barra

  if (!companyId) {
    return <NotFound />;
  }

  return (
    <>
      <AutoRotation companyId={companyId} />
      <Switch>
        <Route path="/:companyId" component={RankingPage} />
        <Route path="/:companyId/broker/:id" component={BrokerProfilePage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
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

export default App;

