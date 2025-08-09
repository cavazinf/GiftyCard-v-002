import { useQuery } from "@tanstack/react-query";

interface StatsData {
  totalCards: number;
  totalValue: number;
  merchants: number;
  avgTime: string;
}

export default function StatsSection() {
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ["/api/analytics/stats"],
  });

  if (isLoading) {
    return (
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{stats?.totalCards?.toLocaleString() || "0"}</div>
            <div className="text-sm text-gray-600">Gift Cards Emitidos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">
              R$ {stats?.totalValue?.toLocaleString() || "0"}
            </div>
            <div className="text-sm text-gray-600">Valor Total Gerenciado</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">{stats?.merchants || "0"}</div>
            <div className="text-sm text-gray-600">Comerciantes Ativos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{stats?.avgTime || "—"}</div>
            <div className="text-sm text-gray-600">Tempo Médio de Resgate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
