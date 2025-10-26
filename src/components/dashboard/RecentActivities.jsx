import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  FileText, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  XCircle,
  MessageCircle,
  Upload
} from "lucide-react";

const actionIcons = {
  "Criado": FileText,
  "Atribuído": UserCheck,
  "Status Alterado": Clock,
  "Aprovado": CheckCircle,
  "Rejeitado": XCircle,
  "Comentário Adicionado": MessageCircle,
  "Documento Adicionado": Upload,
  "Revisado": Clock
};

const actionColors = {
  "Criado": "bg-blue-100 text-blue-800",
  "Atribuído": "bg-purple-100 text-purple-800", 
  "Status Alterado": "bg-amber-100 text-amber-800",
  "Aprovado": "bg-green-100 text-green-800",
  "Rejeitado": "bg-red-100 text-red-800",
  "Comentário Adicionado": "bg-gray-100 text-gray-800",
  "Documento Adicionado": "bg-indigo-100 text-indigo-800",
  "Revisado": "bg-orange-100 text-orange-800"
};

export default function RecentActivities({ atividades }) {
  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {atividades.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma atividade recente</p>
            </div>
          ) : (
            atividades.map((atividade, index) => {
              const IconComponent = actionIcons[atividade.acao] || FileText;
              return (
                <div key={atividade.id || index} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="secondary"
                        className={`${actionColors[atividade.acao]} border-0 text-xs`}
                      >
                        {atividade.acao}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {atividade.created_date
                          ? format(new Date(atividade.created_date), "dd/MM 'às' HH:mm", { locale: ptBR })
                          : 'Agora'
                        }
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {atividade.comentario || `${atividade.acao} no pedido`}
                    </p>
                    {atividade.status_anterior && atividade.status_novo && (
                      <p className="text-xs text-gray-500 mt-1">
                        {atividade.status_anterior} → {atividade.status_novo}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}