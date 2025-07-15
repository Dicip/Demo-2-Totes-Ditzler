
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const totes = [
    { id: 'TOTE-001', status: 'En Almacén', client: 'Cliente A' },
    { id: 'TOTE-002', status: 'En Tránsito', client: 'Cliente B' },
    { id: 'TOTE-003', status: 'Entregado', client: 'Cliente C' },
    { id: 'TOTE-004', status: 'En Almacén', client: 'Cliente A' },
];

export default function TotesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Totes</CardTitle>
            <CardDescription>
              Administra los totes del sistema.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ingresar Tote
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Cliente Asignado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totes.map((tote) => (
              <TableRow key={tote.id}>
                <TableCell className="font-medium">{tote.id}</TableCell>
                <TableCell>
                   <Badge variant="outline">{tote.status}</Badge>
                </TableCell>
                <TableCell>{tote.client}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
