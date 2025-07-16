
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
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { readDb, Tote, Client } from '@/lib/db';
import React from 'react';

interface DashboardData {
  toteStatusData: { name: string; value: number; color: string }[];
  totesWithClients: { name: string; totes: number }[];
  overdueTotes: { name: string; totes: number }[];
  totalTotes: number;
  totalUsers: number;
  totesWithClientsCount: number;
  overdueTotesCount: number;
}

const statusColors: { [key: string]: string } = {
  'Con Cliente': '#3B82F6', // Blue
  'Disponible': '#14A38B', // Teal
  'En Lavado': '#6B7280',  // Gray
  'En Mantenimiento': '#F97316', // Orange
  'En Uso': '#84CC16', // Lime
};

async function getDashboardData(): Promise<DashboardData> {
    const { totes, clients, users } = await readDb();

    // Tote Status Data
    const toteStatusCounts = totes.reduce((acc, tote) => {
        acc[tote.status] = (acc[tote.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const toteStatusData = Object.entries(toteStatusCounts).map(([name, value]) => ({
        name,
        value,
        color: statusColors[name] || '#000000',
    }));

    // Totes with Clients
    const totesWithClientsMap = new Map<string, number>();
    totes.forEach(tote => {
        if (tote.clientId) {
            const client = clients.find(c => c.id === tote.clientId);
            if (client) {
                totesWithClientsMap.set(client.name, (totesWithClientsMap.get(client.name) || 0) + 1);
            }
        }
    });
    const totesWithClients = Array.from(totesWithClientsMap.entries()).map(([name, totes]) => ({ name, totes }));
    const totesWithClientsCount = totes.filter(t => t.clientId !== null).length;

    // Overdue Totes (older than 30 days)
    const overdueTotesMap = new Map<string, number>();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    totes.forEach(tote => {
        if (tote.clientId && tote.lastDispatch) {
            const dispatchDate = new Date(tote.lastDispatch);
            if (dispatchDate < thirtyDaysAgo) {
                const client = clients.find(c => c.id === tote.clientId);
                if (client) {
                    overdueTotesMap.set(client.name, (overdueTotesMap.get(client.name) || 0) + 1);
                }
            }
        }
    });
    const overdueTotes = Array.from(overdueTotesMap.entries()).map(([name, totes]) => ({ name, totes }));
    const overdueTotesCount = overdueTotes.reduce((sum, client) => sum + client.totes, 0);

    // Totals
    const totalTotes = totes.filter(t => t.status !== 'Baja').length;
    const totalUsers = users.length;

    return {
        toteStatusData,
        totesWithClients,
        overdueTotes,
        totalTotes,
        totalUsers,
        totesWithClientsCount,
        overdueTotesCount,
    };
}


export default function DashboardPage() {
    const [data, setData] = React.useState<DashboardData | null>(null);

    React.useEffect(() => {
        getDashboardData().then(setData);
    }, []);

    if (!data) {
        return <div>Cargando...</div>;
    }

    const {
        toteStatusData,
        totesWithClients,
        overdueTotes,
        totalTotes,
        totalUsers,
        totesWithClientsCount,
        overdueTotesCount
    } = data;

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
                    <p className="text-3xl font-bold">{totesWithClientsCount}</p>
                    <p className="text-xs text-muted-foreground">Unidades actualmente con clientes</p>
                </div>
            </div>
            <div className="space-y-2">
                {totesWithClients.slice(0, 5).map((client) => (
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
                    <p className="text-3xl font-bold">{overdueTotesCount}</p>
                    <p className="text-xs text-muted-foreground">Unidades vencidas o con despacho &gt; 30 días</p>
                </div>
            </div>
            <div className="space-y-2">
                {overdueTotes.slice(0, 5).map((client) => (
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
                    <p className="text-4xl font-bold">{totalTotes}</p>
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
                    <p className="text-4xl font-bold">{totalUsers}</p>
                    <p className="text-sm text-muted-foreground">Usuarios con acceso al sistema</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
