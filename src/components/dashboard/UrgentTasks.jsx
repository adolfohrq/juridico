import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  AlertTriangle, 
  Clock,
  ArrowRight,
  Calendar
} from "lucide-react";

const priorityColors = {
  "Baixa": "bg-gray-100 text-gray-800",
  "Média": "bg-blue-100 text-blue-800", 
  "Alta": "bg-amber-100 text-amber-800",
  "Urgente": "bg-red-100 text-red-800"
};

export default function UrgentTasks({ pedidos }) {
  const hoje = new Date();
  
  // Pedidos urgentes ou com prazo vencido
  const urgentTasks = pedidos
    .filter(p => {
      const isUrgent = p.prioridade === "Urgente";
      const hasExpiredDeadline = p.prazo_conclusao && 
        new Date(p.prazo_conclusao) < hoje && 
        !["Aprovado", "Rejeitado"].includes(p.status);
      
      return (isUrgent || hasExpiredDeadline) && 
             !["Aprovado", "Rejeitado"].includes(p.status);
    })
    .slice(0, 5); // Mostrar apenas os 5 mais urgentes

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-red-600">
          <AlertTriangle className="w-5 h-5" />
          Tarefas Urgentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {urgentTasks.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">Nenhuma tarefa urgente</p>
            <p className="text-sm">Parabéns! Tudo em dia.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {urgentTasks.map((pedido) => {
              const isExpired = pedido.prazo_conclusao && 
                new Date(pedido.prazo_conclusao) < hoje;
              
              return (
                <div key={pedido.id} className="p-4 border border-red-200 rounded-lg bg-red-50/50 hover:bg-red-50 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight">
                        {pedido.titulo}
                      </h4>
                      <Badge className={priorityColors[pedido.prioridade]} variant="secondary">
                        {pedido.prioridade}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {pedido.prazo_conclusao ? 
                          format(new Date(pedido.prazo_conclusao), "dd/MM/yyyy", { locale: ptBR }) :
                          "Sem prazo definido"
                        }
                      </span>
                      {isExpired && (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          Vencido
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {pedido.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs text-blue-600 hover:text-blue-700"
                      >
                        Ver detalhes
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {urgentTasks.length > 0 && (
              <Button variant="outline" className="w-full mt-4" size="sm">
                Ver todas as tarefas urgentes
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}