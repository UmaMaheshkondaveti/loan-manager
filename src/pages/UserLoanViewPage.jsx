
    import React, { useMemo, useContext, useState, useEffect } from 'react';
    import useLocalStorage from '@/hooks/useLocalStorage';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Badge } from '@/components/ui/badge';
    import { motion } from 'framer-motion';
    import { UserRoleContext } from '@/App';
    import { FileText, ShieldCheck, BarChart3, PieChart } from 'lucide-react';
    import SimpleBarChart from '@/components/SimpleBarChart';

    const UserLoanViewPage = () => {
      const [allApplications] = useLocalStorage('loanApplications', []);
      const { userRole } = useContext(UserRoleContext);
      const [monthlyLoanData, setMonthlyLoanData] = useState([]);
      const [loanStatusData, setLoanStatusData] = useState([]);

      const userApplications = useMemo(() => {
        if (userRole === 'user') {
          return allApplications.filter(app => app.userId === 'currentUser' || !app.userId); 
        }
        return []; 
      }, [allApplications, userRole]);

      useEffect(() => {
        if (userApplications.length > 0) {
          const monthlyData = userApplications.reduce((acc, app) => {
            const month = new Date(app.submissionDate).toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + parseFloat(app.loanAmount || 0);
            return acc;
          }, {});
          setMonthlyLoanData(Object.entries(monthlyData).map(([label, value]) => ({ label, value })).slice(-6));
          
          const statusData = userApplications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
          }, {});
          setLoanStatusData(Object.entries(statusData).map(([label,value]) => ({label,value})));
        } else {
          setMonthlyLoanData([]);
          setLoanStatusData([]);
        }
      }, [userApplications]);


      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800">My Loan Applications</CardTitle>
                  <CardDescription>View the status and details of your submitted loan applications.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {userApplications.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Amount (₦)</TableHead>
                        <TableHead>Tenure (Months)</TableHead>
                        <TableHead>Submission Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userApplications.map((loan) => (
                        <motion.tr
                          key={loan.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium text-xs">{loan.id}</TableCell>
                          <TableCell>₦{parseFloat(loan.loanAmount || 0).toLocaleString()}</TableCell>
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
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <img  class="mx-auto h-40 w-40 text-muted-foreground" alt="No applications illustration" src="https://images.unsplash.com/photo-1663124178716-2078c384c24a" />
                  <p className="mt-4 text-lg font-medium text-muted-foreground">No Loan Applications Found</p>
                  <p className="text-sm text-muted-foreground">
                    You haven't submitted any loan applications yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {userApplications.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <SimpleBarChart 
                title="My Loan Amounts by Month"
                description="Total loan amounts requested per month"
                icon={BarChart3}
                data={monthlyLoanData}
                chartColor="bg-green-500"
                valuePrefix="₦"
              />
              <SimpleBarChart
                title="My Application Statuses"
                description="Distribution of your loan application statuses"
                icon={PieChart}
                data={loanStatusData}
                chartColor="bg-indigo-500"
              />
            </div>
          )}
        </motion.div>
      );
    };

    export default UserLoanViewPage;
  