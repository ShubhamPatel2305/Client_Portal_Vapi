import React, { useState } from 'react';
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Title,
  Badge,
  Button,
  TextInput,
  Select,
  SelectItem,
  Flex,
  Grid,
} from '@tremor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Download, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { CallData } from '../../types/CallData';

interface Props {
  data: CallData[];
}

const CallDetailsReport = ({ data }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<string>('startedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Filter and sort data
  const filteredData = data
    .filter(call => {
      const matchesSearch = 
        call.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.messages?.some(msg => msg.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
        false;
      const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof CallData];
      const bValue = b[sortField as keyof CallData];
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction * aValue.localeCompare(bValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction * (aValue - bValue);
      }
      return 0;
    });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleRowExpansion = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  // Export functions
  const exportToCSV = () => {
    const csvData = filteredData.map(call => ({
      ID: call.id,
      'Start Time': format(new Date(call.startedAt), 'yyyy-MM-dd HH:mm:ss'),
      'End Time': call.endedAt ? format(new Date(call.endedAt), 'yyyy-MM-dd HH:mm:ss') : '',
      Status: call.status,
      Cost: call.cost.toFixed(4),
      'Message Count': call.messages?.length || 0,
      'Conversation': call.messages?.map(m => `${m.role}: ${m.message}`).join('\n') || '',
    }));

    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Calls');
    const csvBuffer = XLSX.write(wb, { bookType: 'csv', type: 'array' });
    const blob = new Blob([csvBuffer], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `call_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Call Details Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`, 14, 32);

    // Add summary
    const summary = [
      ['Total Calls', filteredData.length.toString()],
      ['Completed Calls', filteredData.filter(c => c.status === 'completed').length.toString()],
      ['Total Cost', `$${filteredData.reduce((sum, c) => sum + c.cost, 0).toFixed(4)}`],
    ];

    doc.autoTable({
      startY: 40,
      head: [['Metric', 'Value']],
      body: summary,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
    });

    // Add call details
    const tableData = filteredData.map(call => [
      call.id,
      format(new Date(call.startedAt), 'yyyy-MM-dd HH:mm:ss'),
      call.status,
      `$${call.cost.toFixed(4)}`,
      call.messages?.length.toString() || '0',
    ]);

    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [['ID', 'Start Time', 'Status', 'Cost', 'Messages']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`call_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Card>
        <div className="space-y-6">
          <Flex justifyContent="between" alignItems="center">
            <Title>Call Details</Title>
            <div className="space-x-2">
              <Button
                size="sm"
                variant="secondary"
                icon={Download}
                onClick={exportToCSV}
              >
                Export CSV
              </Button>
              <Button
                size="sm"
                variant="secondary"
                icon={Download}
                onClick={exportToPDF}
              >
                Export PDF
              </Button>
            </div>
          </Flex>

          <Flex justifyContent="between" alignItems="center" className="space-x-4">
            <div className="flex-1">
              <TextInput
                icon={Search}
                placeholder="Search calls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="w-40"
              icon={Filter}
            >
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
            </Select>
          </Flex>

          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell className="w-0"></TableHeaderCell>
                <TableHeaderCell
                  className="cursor-pointer"
                  onClick={() => toggleSort('id')}
                >
                  <Flex alignItems="center" className="space-x-1">
                    <span>Call ID</span>
                    {sortField === 'id' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </Flex>
                </TableHeaderCell>
                <TableHeaderCell
                  className="cursor-pointer"
                  onClick={() => toggleSort('startedAt')}
                >
                  <Flex alignItems="center" className="space-x-1">
                    <span>Start Time</span>
                    {sortField === 'startedAt' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </Flex>
                </TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell
                  className="cursor-pointer"
                  onClick={() => toggleSort('cost')}
                >
                  <Flex alignItems="center" className="space-x-1">
                    <span>Cost</span>
                    {sortField === 'cost' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </Flex>
                </TableHeaderCell>
                <TableHeaderCell>Messages</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((call) => (
                <React.Fragment key={call.id}>
                  <TableRow 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleRowExpansion(call.id)}
                  >
                    <TableCell>
                      {expandedRows.has(call.id) ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </TableCell>
                    <TableCell>
                      <Text>{call.id}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{format(new Date(call.startedAt), 'yyyy-MM-dd HH:mm:ss')}</Text>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        color={
                          call.status === 'completed' ? 'emerald' :
                          call.status === 'failed' ? 'red' :
                          'yellow'
                        }
                      >
                        {call.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Text>${call.cost.toFixed(4)}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{call.messages?.length || 0}</Text>
                    </TableCell>
                  </TableRow>
                  <AnimatePresence>
                    {expandedRows.has(call.id) && call.messages && call.messages.length > 0 && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <TableCell colSpan={6} className="bg-gray-50">
                          <div className="p-6">
                            <Grid numItems={1} numItemsSm={2} className="gap-6">
                              <Card className="bg-white shadow-sm">
                                <Title className="mb-2">Call Information</Title>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <Text className="text-gray-500">Duration</Text>
                                    <Text className="font-medium">
                                      {call.endedAt ? (
                                        `${Math.round((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000)} seconds`
                                      ) : 'In Progress'}
                                    </Text>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <Text className="text-gray-500">Start Time</Text>
                                    <Text className="font-medium">
                                      {format(new Date(call.startedAt), 'PPpp')}
                                    </Text>
                                  </div>
                                  {call.endedAt && (
                                    <div className="flex justify-between items-center">
                                      <Text className="text-gray-500">End Time</Text>
                                      <Text className="font-medium">
                                        {format(new Date(call.endedAt), 'PPpp')}
                                      </Text>
                                    </div>
                                  )}
                                  <div className="flex justify-between items-center">
                                    <Text className="text-gray-500">Total Cost</Text>
                                    <Text className="font-medium">${call.cost.toFixed(4)}</Text>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <Text className="text-gray-500">Messages</Text>
                                    <Text className="font-medium">{call.messages.length}</Text>
                                  </div>
                                </div>
                              </Card>
                              <Card className="bg-white shadow-sm">
                                <Title className="mb-2">Latest Messages</Title>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                  {call.messages.slice(-3).map((msg, idx) => (
                                    <div
                                      key={idx}
                                      className={`p-3 rounded-lg ${
                                        msg.role === 'user' ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <Text className="font-medium capitalize">
                                          {msg.role}
                                        </Text>
                                        <Text className="text-xs text-gray-500">
                                          {format(new Date(msg.time), 'HH:mm:ss')}
                                        </Text>
                                      </div>
                                      <Text className="text-sm">{msg.message}</Text>
                                    </div>
                                  ))}
                                </div>
                              </Card>
                            </Grid>
                          </div>
                        </TableCell>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </motion.div>
  );
};

export default CallDetailsReport;
