
'use client';

import { AlertTriangle, Package, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { readDb } from '@/lib/db';
import React, { useState, useEffect, useMemo } from 'react';

// Tipos de datos para el dashboard
interface DashboardData {
  toteStatusData: { name: string; value: number; color: string }[];
  totesWithClients: { name: string; totes: number }[];
  overdueTotes: { name: string; totes: number }[];
  totalTotes: number;
  totalUsers: number;
  totesWithClientsCount: number;
  overdueTotesCount: number;
}

// Colores para los estados de totes
const STATUS_COLORS = {
  'Con Cliente': '#3B82F6', // Blue
  'Disponible': '#14A38B', // Teal
  'En Lavado': '#6B7280',  // Gray
  'En Mantenimiento': '#F97316', // Orange
  'En Uso': '#84CC16', // Lime
  'Baja': '#DC2626', // Red
};

// Constantes
const OVERDUE_DAYS = 30;

/**
 * Obtiene los datos para el dashboard
 */
async function getDashboardData(): Promise<DashboardData> {
    try {
        const { totes, clients, users } = await readDb();

        // Calcular datos de estado de totes
        const toteStatusCounts = totes.reduce((acc, tote) => {
            acc[tote.status] = (acc[tote.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const toteStatusData = Object.entries(toteStatusCounts).map(([name, value]) => ({
            name,
            value,
            color: STATUS_COLORS[name] || '#000000',
        }));

        // Crear mapa de clientes para búsqueda eficiente
        const clientMap = new Map(clients.map(client => [client.id, client]));

        // Calcular totes con clientes
        const totesWithClientsMap = new Map<string, number>();
        const totesWithClientsList = [];
        
        for (const tote of totes) {
            if (tote.clientId) {
                const client = clientMap.get(tote.clientId);
                if (client) {
                    const count = (totesWithClientsMap.get(client.name) || 0) + 1;
                    totesWithClientsMap.set(client.name, count);
                }
            }
        }
        
        const totesWithClients = Array.from(totesWithClientsMap.entries())
            .map(([name, totes]) => ({ name, totes }))
            .sort((a, b) => b.totes - a.totes); // Ordenar por cantidad descendente
            
        const totesWithClientsCount = totes.filter(t => t.clientId !== null).length;

        // Calcular totes fuera de plazo (más de 30 días)
        const overdueTotesMap = new Map<string, number>();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - OVERDUE_DAYS);

        for (const tote of totes) {
            if (tote.clientId && tote.lastDispatch) {
                const dispatchDate = new Date(tote.lastDispatch);
                if (dispatchDate < thirtyDaysAgo) {
                    const client = clientMap.get(tote.clientId);
                    if (client) {
                        const count = (overdueTotesMap.get(client.name) || 0) + 1;
                        overdueTotesMap.set(client.name, count);
                    }
                }
            }
        }
        
        const overdueTotes = Array.from(overdueTotesMap.entries())
            .map(([name, totes]) => ({ name, totes }))
            .sort((a, b) => b.totes - a.totes); // Ordenar por cantidad descendente
            
        const overdueTotesCount = overdueTotes.reduce((sum, client) => sum + client.totes, 0);

        // Calcular totales
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
    } catch (error) {
        console.error('Error al obtener datos del dashboard:', error);
        throw error;
    }
}


/**
 * Componente de la página de Dashboard
 */
export default function DashboardPage() {
    // Estado para almacenar los datos del dashboard
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar datos al montar el componente
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const dashboardData = await getDashboardData();
                setData(dashboardData);
                setError(null);
            } catch (err) {
                console.error('Error cargando datos del dashboard:', err);
                setError('Error al cargar los datos. Intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Mostrar estado de carga
    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-muted-foreground">Cargando datos del dashboard...</p>
                </div>
            </div>
        );
    }

    // Mostrar error si ocurrió alguno
    if (error) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
                    <p className="text-destructive">{error}</p>
                    <button 
                        className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // Si no hay datos, mostrar mensaje
    if (!data) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <p className="text-muted-foreground">No hay datos disponibles</p>
            </div>
        );
    }

    // Extraer datos para el dashboard
    const {
        toteStatusData,
        totesWithClients,
        overdueTotes,
        totalTotes,
        totalUsers,
        totesWithClientsCount,
        overdueTotesCount
    } = data;

    // Componente para la leyenda del gráfico de estado
    const StatusLegend = () => (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {toteStatusData.map((entry) => (
                <div key={entry.name} className="flex items-center">
                    <span 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="ml-2 text-muted-foreground">
                        {entry.name} ({entry.value})
                    </span>
                </div>
            ))}
        </div>
    );

    // Componente para la lista de clientes
    const ClientList = ({ clients, limit = 5, isOverdue = false }) => (
        <div className="space-y-2">
            {clients.slice(0, limit).map((client) => (
                <div key={client.name} className="flex justify-between">
                    <span className="text-muted-foreground truncate pr-2" title={client.name}>
                        {client.name}
                    </span>
                    <span className={isOverdue ? "font-medium text-destructive" : ""}>
                        {client.totes} tote{client.totes > 1 ? 's' : ''}
                    </span>
                </div>
            ))}
            {clients.length > limit && (
                <div className="text-xs text-muted-foreground text-right pt-1">
                    +{clients.length - limit} más
                </div>
            )}
        </div>
    );

    return (
        <div className="flex-1 space-y-6 p-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Gráfico de estado de totes */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Estado de Totes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-60 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={toteStatusData} 
                                        dataKey="value" 
                                        nameKey="name" 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={60} 
                                        outerRadius={80} 
                                        paddingAngle={2}
                                    >
                                        {toteStatusData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.color} 
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                        <StatusLegend />
                    </CardContent>
                </Card>

                {/* Totes con clientes */}
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
                        <ClientList clients={totesWithClients} />
                    </CardContent>
                </Card>

                {/* Totes fuera de plazo */}
                <Card>
                    <CardHeader>
                        <CardTitle>Totes Fuera de Plazo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                            <div>
                                <p className="text-3xl font-bold">{overdueTotesCount}</p>
                                <p className="text-xs text-muted-foreground">
                                    Unidades con despacho &gt; {OVERDUE_DAYS} días
                                </p>
                            </div>
                        </div>
                        <ClientList clients={overdueTotes} isOverdue={true} />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Total de totes */}
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

                {/* Usuarios activos */}
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
