import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { TrendingUp, Clock, Users, Shield } from "lucide-react";

interface AnalyticsData {
  emissionCost: string;
  redemptionTime: string;
  uxSuccess: string;
  zkProofs: string;
}

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/stats"],
  });

  const metrics = [
    {
      title: "Custo de Emissão",
      value: analytics?.emissionCost || "0.3%",
      subtitle: "vs 4-7% tradicional",
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-100"
    },
    {
      title: "Tempo de Resgate",
      value: analytics?.redemptionTime || "< 45s",
      subtitle: "Média atual",
      icon: Clock,
      color: "from-green-500 to-green-600",
      textColor: "text-green-100"
    },
    {
      title: "UX Sem Carteira",
      value: analytics?.uxSuccess || "92%",
      subtitle: "Taxa de sucesso",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-100"
    },
    {
      title: "ZK Proofs",
      value: analytics?.zkProofs || "100%",
      subtitle: "Privacidade garantida",
      icon: Shield,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-100"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation user={{ name: "João Silva", email: "joao@exemplo.com" }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analíticos e Métricas</h1>
          <p className="text-gray-600">Acompanhe o desempenho da plataforma GIFTY</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className={`bg-gradient-to-r ${metric.color} p-6 rounded-lg text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${metric.textColor} text-sm`}>{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className={`${metric.textColor} text-xs`}>{metric.subtitle}</p>
                </div>
                <metric.icon className={`${metric.textColor.replace('text-', 'text-').replace('100', '200')} text-2xl`} size={32} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume de Transações</h3>
            <div className="bg-gray-50 p-6 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <TrendingUp size={48} className="mx-auto mb-2" />
                <p className="text-sm">Gráfico de volume de transações</p>
                <p className="text-xs">Integração com Chart.js em desenvolvimento</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Categoria</h3>
            <div className="bg-gray-50 p-6 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full"></div>
                <p className="text-sm">Gráfico de distribuição</p>
                <p className="text-xs">Integração com Chart.js em desenvolvimento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Indicadores de Performance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1,247</div>
              <div className="text-sm text-gray-600 mb-1">Gift Cards Emitidos</div>
              <div className="text-xs text-green-600">↑ 15% este mês</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">R$ 234.567</div>
              <div className="text-sm text-gray-600 mb-1">Volume Processado</div>
              <div className="text-xs text-green-600">↑ 22% este mês</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">89</div>
              <div className="text-sm text-gray-600 mb-1">Comerciantes Ativos</div>
              <div className="text-xs text-green-600">↑ 8% este mês</div>
            </div>
          </div>
        </div>

        {/* Technology Performance */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance da Tecnologia</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Blockchain Operations</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">NFT Minting Success Rate</span>
                  <span className="text-sm font-medium text-green-600">99.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">TBA Creation Time</span>
                  <span className="text-sm font-medium text-gray-900">&lt; 15s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Gas Cost Average</span>
                  <span className="text-sm font-medium text-gray-900">$0.05</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-4">User Experience</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Onboarding Success</span>
                  <span className="text-sm font-medium text-green-600">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">QR Code Scan Rate</span>
                  <span className="text-sm font-medium text-green-600">98.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mobile Compatibility</span>
                  <span className="text-sm font-medium text-green-600">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
