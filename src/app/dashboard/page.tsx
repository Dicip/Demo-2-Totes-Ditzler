
'use client';

import { AlertTriangle, Package, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const toteStatusData = [
  { name: 'Con Cliente', value: 400, color: '#3B82F6' }, // Blue
  { name: 'Disponible', value: 300, color: '#14A38B' }, // Teal
  { name: 'En Lavado', value: 150, color: '#6B7280' },  // Gray
  { name: 'En Mantenimiento', value: 100, color: '#F97316' }, // Orange
  { name: 'En Uso', value: 50, color: '#84CC16' }, // Lime
];

const totesWithClients = [
    { name: 'Del Valle', totes: 2 },
    { name: 'Sol Radiante', totes: 2 },
    { name: 'Los Andes', totes: 2 },
    { name: 'del Pacifico', totes: 2 },
    { name: 'Del Maipo', totes: 1 },
];

const overdueTotes = [
    { name: 'Sol Radiante', totes: 2 },
    { name: 'Del Maipo', totes: 1 },
    { name: 'Del Valle', totes: 1 },
    { name: 'Los Andes', totes: 1 },
];


export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Estado de Totes</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={toteStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={2}>
                        {toteStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                  </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {toteStatusData.map((entry) => (
                    <div key={entry.name} className="flex items-center">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                        <span className="ml-2 text-muted-foreground">{entry.name}</span>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Totes con Clientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center gap-4">
                <Package className="h-8 w-8 text-primary" />
                <div>
                    <p className="text-3xl font-bold">9</p>
                    <p className="text-xs text-muted-foreground">Unidades actualmente con clientes</p>
                </div>
            </div>
            <div className="space-y-2">
                {totesWithClients.map((client) => (
                    <div key={client.name} className="flex justify-between">
                        <span className="text-muted-foreground">{client.name}</span>
                        <span>{client.totes} totes</span>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Totes Fuera de Plazo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center gap-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                    <p className="text-3xl font-bold">5</p>
                    <p className="text-xs text-muted-foreground">Unidades vencidas o con despacho &gt; 30 días</p>
                </div>
            </div>
            <div className="space-y-2">
                {overdueTotes.map((client) => (
                    <div key={client.name} className="flex justify-between">
                        <span className="text-muted-foreground">{client.name}</span>
                        <span className="font-medium text-destructive">{client.totes} tote{client.totes > 1 ? 's' : ''}</span>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total de Totes en Sistema</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-4">
                <Package className="h-10 w-10 text-muted-foreground" />
                <div>
                    <p className="text-4xl font-bold">22</p>
                    <p className="text-sm text-muted-foreground">Unidades totales (sin contar bajas)</p>
                </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Activos</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-4">
                <Users className="h-10 w-10 text-muted-foreground" />
                <div>
                    <p className="text-4xl font-bold">5</p>
                    <p className="text-sm text-muted-foreground">Usuarios con acceso al sistema</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
