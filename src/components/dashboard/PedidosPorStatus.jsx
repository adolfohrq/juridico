import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  RefreshCcw
} from "lucide-react";

const statusConfig = {
  pendentes: {
    label: "Pendentes",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    description: "Aguardando ação"
  },
  emExecucao: {
    label: "Em Execução", 
    icon: RefreshCcw,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Em andamento"
  },
  emRevisao: {
    label: "Em Revisão",
    icon: Eye,
    color: "text-purple-600", 
    bgColor: "bg-purple-100",
    description: "Sendo revisado"
  },
  aprovados: {
    label: "Aprovados",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100", 
    description: "Finalizados"
  },
  rejeitados: {
    label: "Rejeitados",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "Rejeitados"
  },
  prazoVencido: {
    label: "Prazo Vencido",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "Requer atenção"
  }
};

export default function PedidosPorStatus({ stats }) {
  const total = stats.total || 0;
  
  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Distribuição por Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(statusConfig).map(([key, config]) => {
            const value = stats[key] || 0;
            const percentage = total > 0 ? (value / total) * 100 : 0;
            const IconComponent = config.icon;
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.bgColor}`}>
                      <IconComponent className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{config.label}</p>
                      <p className="text-xs text-gray-500">{config.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg text-gray-900">{value}</span>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2"
                  style={{
                    '--progress-background': config.bgColor.replace('bg-', '').replace('-100', '-200')
                  }}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}