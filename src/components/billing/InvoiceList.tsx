import React from 'react';
import {
  Card,
  Title,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  Badge,
  Button,
  Text,
} from '@tremor/react';
import { format } from 'date-fns';
import { Download} from 'lucide-react';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  date: Date;
  dueDate?: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  items?: InvoiceItem[];
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'emerald';
    case 'pending':
      return 'yellow';
    case 'overdue':
      return 'red';
    default:
      return 'gray';
  }
};

const InvoiceList: React.FC<{ 
  invoices: Invoice[]; 
  onDownload: (invoice: Invoice) => void;
}> = ({ 
  invoices, 
  onDownload 
}) => {
  return (
    <Card>
      <div className="mb-6">
        <Title>Invoices</Title>
        <Text className="mt-2">View and download your billing history</Text>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableHeaderCell className="font-semibold">Invoice</TableHeaderCell>
              <TableHeaderCell className="font-semibold">Date</TableHeaderCell>
              <TableHeaderCell className="font-semibold">Due Date</TableHeaderCell>
              <TableHeaderCell className="font-semibold text-right">Amount</TableHeaderCell>
              <TableHeaderCell className="font-semibold">Status</TableHeaderCell>
              <TableHeaderCell className="font-semibold text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Text className="text-gray-500">No invoices found</Text>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow 
                  key={invoice.id} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900">
                    {invoice.id}
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {invoice.dueDate && format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${invoice.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      color={getStatusColor(invoice.status)}
                      size="sm"
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="xs"
                        variant="secondary"
                        icon={Download}
                        onClick={() => onDownload(invoice)}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default InvoiceList;