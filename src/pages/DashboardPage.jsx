
    import React, { useEffect, useState } from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { DollarSign, Users, Briefcase, CheckCircle, TrendingUp, Landmark, Wallet, BarChart3, PieChart } from 'lucide-react';
    import useLocalStorage from '@/hooks/useLocalStorage';
    import { motion } from 'framer-motion';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Badge } from '@/components/ui/badge'; 
    import SimpleBarChart from '@/components/SimpleBarChart';

    const StatCard = ({ title, value, icon, description, color = "text-primary" }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            {React.createElement(icon, { className: `h-5 w-5 ${color}` })}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </CardContent>
        </Card>
      </motion.div>
    );
    
    const DashboardPage = () => {
      const [applications] = useLocalStorage('loanApplications', []);
      const [stats, setStats] = useState({
        totalApplications: 0,
        totalBorrowers: 0,
        totalLoanAmount: 0,
        averageLoanAmount: 0,
        approvedApplications: 0,
        successRate: 0,
        repaidLoans: 0,
        cashDisbursed: 0,
        cashReceived: 0,
      });
      const [monthlyApplicationData, setMonthlyApplicationData] = useState([]);
      const [statusDistributionData, setStatusDistributionData] = useState([]);


      useEffect(() => {
        if (applications && applications.length > 0) {
          const totalApps = applications.length;
          const borrowers = new Set(applications.map(app => app.fullName)).size;
          const totalAmount = applications.reduce((sum, app) => sum + parseFloat(app.loanAmount || 0), 0);
          const avgAmount = totalApps > 0 ? totalAmount / totalApps : 0;
          const approvedApps = applications.filter(app => app.status === 'Approved').length;
          const successRt = totalApps > 0 ? (approvedApps / totalApps) * 100 : 0;
          const repaid = applications.filter(app => app.status === 'Repaid').length;
          const disbursed = applications
            .filter(app => app.status === 'Approved' || app.status === 'Repaid')
            .reduce((sum, app) => sum + parseFloat(app.loanAmount || 0), 0);
          
          setStats({
            totalApplications: totalApps,
            totalBorrowers: borrowers,
            totalLoanAmount: totalAmount,
            averageLoanAmount: avgAmount,
            approvedApplications: approvedApps,
            successRate: successRt,
            repaidLoans: repaid,
            cashDisbursed: disbursed,
            cashReceived: 0, 
          });

          const monthlyData = applications.reduce((acc, app) => {
            const month = new Date(app.submissionDate).toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          }, {});
          setMonthlyApplicationData(Object.entries(monthlyData).map(([label, value]) => ({ label, value })).slice(-6));

          const statusData = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
          }, {});
          setStatusDistributionData(Object.entries(statusData).map(([label, value]) => ({label, value})));

        } else {
           setStats({
            totalApplications: 0,
            totalBorrowers: 0,
            totalLoanAmount: 0,
            averageLoanAmount: 0,
            approvedApplications: 0,
            successRate: 0,
            repaidLoans: 0,
            cashDisbursed: 0,
            cashReceived: 0,
          });
          setMonthlyApplicationData([]);
          setStatusDistributionData([]);
        }
      }, [applications]);

      const recentLoans = applications.slice(-5).reverse();

      return (
        <div className="space-y-6">
          <motion.h1 
            className="text-3xl font-bold tracking-tight text-gray-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Admin Dashboard Overview
          </motion.h1>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <StatCard title="Total Applications" value={stats.totalApplications} icon={Briefcase} description="All submitted loan requests" />
            <StatCard title="Active Users / Borrowers" value={stats.totalBorrowers} icon={Users} description="Unique individuals applying" color="text-green-600"/>
            <StatCard title="Total Loan Value" value={`₦${stats.totalLoanAmount.toLocaleString()}`} icon={DollarSign} description="Sum of all requested amounts" />
            <StatCard title="Average Loan Amount" value={`₦${stats.averageLoanAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} icon={TrendingUp} description="Mean value of loan requests" color="text-blue-600"/>
            <StatCard title="Approved Applications" value={stats.approvedApplications} icon={CheckCircle} description="Loans that met criteria" color="text-green-500"/>
            <StatCard title="Application Success Rate" value={`${stats.successRate.toFixed(1)}%`} icon={TrendingUp} description="Percentage of approved loans" color="text-purple-600" />
            <StatCard title="Repaid Loans" value={stats.repaidLoans} icon={Wallet} description="Successfully closed loans" color="text-teal-500" />
            <StatCard title="Total Cash Disbursed" value={`₦${stats.cashDisbursed.toLocaleString()}`} icon={Landmark} description="Funds paid out for loans" color="text-orange-500"/>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <Card className="shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="text-xl">Recent Loan Applications</CardTitle>
                  <CardDescription>Latest 5 applications submitted.</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentLoans.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentLoans.map((loan, index) => (
                          <TableRow key={loan.id || index}>
                            <TableCell className="font-medium">{loan.fullName}</TableCell>
                            <TableCell>₦{parseFloat(loan.loanAmount || 0).toLocaleString()}</TableCell>
                            <TableCell>{new Date(loan.submissionDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={
                                loan.status === 'Approved' ? 'default' :
                                loan.status === 'Pending' ? 'secondary' :
                                loan.status === 'Rejected' ? 'destructive' : 'outline'
                              } className={
                                loan.status === 'Approved' ? 'bg-green-500 text-white' :
                                loan.status === 'Pending' ? 'bg-yellow-400 text-black' :
                                loan.status === 'Rejected' ? 'bg-red-500 text-white' : ''
                              }>
                                {loan.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No recent loan applications.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            <div className="lg:col-span-2 grid grid-rows-2 gap-6">
               <SimpleBarChart 
                  title="Loan Status Distribution" 
                  icon={PieChart} 
                  data={statusDistributionData}
                  description="Count of loans by status"
                  chartColor="bg-purple-500"
                />
               <SimpleBarChart 
                  title="Monthly Application Trends" 
                  icon={BarChart3} 
                  data={monthlyApplicationData}
                  description="Applications over recent months"
                  chartColor="bg-blue-500"
                />
            </div>
          </div>

          <div className="mt-8 p-4 border border-dashed border-primary/50 rounded-lg bg-primary/5">
            <h2 className="text-lg font-semibold text-primary mb-2">Data Persistence Note:</h2>
            <p className="text-sm text-muted-foreground">
              Currently, all loan application data is stored in your browser's local storage. This is great for quick prototyping and testing.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              For a production-ready application with secure and persistent data storage, we recommend migrating to a cloud-based database solution like Supabase. You are not currently authenticated with Supabase. Please complete the Supabase integration steps if you wish to use it.
            </p>
          </div>

        </div>
      );
    };

    export default DashboardPage;
  