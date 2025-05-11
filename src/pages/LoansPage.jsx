
    import React, { useState, useMemo } from 'react';
    import useLocalStorage from '@/hooks/useLocalStorage';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge'; 
    import { motion } from 'framer-motion';
    import { Filter, Search, Edit, Trash2, MoreVertical, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu.jsx";
    import { useToast } from "@/components/ui/use-toast";


    const LoansPage = () => {
      const [applications, setApplications] = useLocalStorage('loanApplications', []);
      const [searchTerm, setSearchTerm] = useState('');
      const [filterStatus, setFilterStatus] = useState('All');
      const { toast } = useToast();

      const filteredApplications = useMemo(() => {
        return applications
          .filter(app => {
            if (filterStatus === 'All') return true;
            return app.status === filterStatus;
          })
          .filter(app => 
            app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (app.id && app.id.toString().includes(searchTerm))
          );
      }, [applications, searchTerm, filterStatus]);
      
      const handleDelete = (id) => {
        setApplications(prev => prev.filter(app => app.id !== id));
        toast({
          title: "Loan Deleted",
          description: `Loan application ${id} has been removed.`,
          variant: "destructive"
        });
      };

      const handleStatusChange = (id, newStatus) => {
        setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
        toast({
          title: "Status Updated",
          description: `Loan ${id} status changed to ${newStatus}.`,
          className: "bg-blue-500 text-white"
        });
      };


      const statusOptions = ['All', 'Pending', 'Approved', 'Rejected', 'Repaid'];

      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800">Loan Applications Management</CardTitle>
                  <CardDescription>View, manage, and update loan application statuses.</CardDescription>
                </div>
                 <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Filter by Status ({filterStatus})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {statusOptions.map(status => (
                        <DropdownMenuItem key={status} onSelect={() => setFilterStatus(status)}>
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-1/2 lg:w-1/3"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredApplications.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Amount (₦)</TableHead>
                        <TableHead>Tenure (M)</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((loan) => (
                        <motion.tr 
                          key={loan.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium text-xs">{loan.id}</TableCell>
                          <TableCell>{loan.fullName}</TableCell>
                          <TableCell>{parseFloat(loan.loanAmount || 0).toLocaleString()}</TableCell>
                          <TableCell>{loan.loanTenure}</TableCell>
                          <TableCell>{new Date(loan.submissionDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={
                                loan.status === 'Approved' ? 'default' :
                                loan.status === 'Pending' ? 'secondary' :
                                loan.status === 'Rejected' ? 'destructive' : 'outline'
                              } className={`whitespace-nowrap ${
                                loan.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-300' :
                                loan.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                                loan.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-300' : 
                                loan.status === 'Repaid' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'border-gray-300'
                              }`}>
                                {loan.status}
                              </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={() => handleStatusChange(loan.id, 'Approved')} disabled={loan.status === 'Approved'}>
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleStatusChange(loan.id, 'Rejected')} disabled={loan.status === 'Rejected'}>
                                  <XCircle className="mr-2 h-4 w-4 text-red-500" /> Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleStatusChange(loan.id, 'Pending')} disabled={loan.status === 'Pending'}>
                                  <Clock className="mr-2 h-4 w-4 text-yellow-500" /> Mark as Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleStatusChange(loan.id, 'Repaid')} disabled={loan.status === 'Repaid'}>
                                  <TrendingUp className="mr-2 h-4 w-4 text-blue-500" /> Mark as Repaid
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => alert(`Editing loan ${loan.id} (not implemented)`)} >
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleDelete(loan.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <img  alt="No data illustration" class="mx-auto h-40 w-40 text-muted-foreground" src="https://images.unsplash.com/photo-1676799909994-e3f26590eaf5" />
                  <p className="mt-4 text-lg font-medium text-muted-foreground">No Applications Found</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter, or add new loan applications.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      );
    };
        
    export default LoansPage;
  