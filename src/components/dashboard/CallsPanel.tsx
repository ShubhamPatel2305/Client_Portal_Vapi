import { useState } from 'react';
import {
  Card,
  Title,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  TextInput,
  Select,
  SelectItem,
} from '@tremor/react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface Call {
  id: string;
  phoneNumber: string;
  status: string;
  startTime: string;
  duration: number;
  cost: number;
  endedReason: string;
}

interface CallsPanelProps {
  calls: Call[];
}

const CallsPanel = ({ calls }: CallsPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || call.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-50 border border-gray-200 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Title>Recent Calls</Title>
          <div className="flex flex-wrap gap-2">
            <TextInput
              icon={Search}
              placeholder="Search calls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
              className="max-w-xs"
            >
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
            </Select>
          </div>
        </div>

        <Table className="mt-4">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Phone Number</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Start Time</TableHeaderCell>
              <TableHeaderCell>Duration (s)</TableHeaderCell>
              <TableHeaderCell>Cost</TableHeaderCell>
              <TableHeaderCell>Ended Reason</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCalls.map((call) => (
              <TableRow key={call.id} className="hover:bg-gray-50 cursor-pointer">
                <TableCell>{call.phoneNumber}</TableCell>
                <TableCell>
                  <Badge color={
                    call.status === 'completed' ? 'green' :
                    call.status === 'failed' ? 'red' : 'yellow'
                  }>
                    {call.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(call.startTime).toLocaleString()}</TableCell>
                <TableCell>{call.duration || '-'}</TableCell>
                <TableCell>${call.cost?.toFixed(2) || '-'}</TableCell>
                <TableCell>{call.endedReason || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </motion.div>
  );
};

export default CallsPanel;
