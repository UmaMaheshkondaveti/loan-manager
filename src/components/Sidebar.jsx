
    import React, { useContext } from 'react';
    import { NavLink } from 'react-router-dom';
    import { Home, Briefcase, TrendingUp, Users, FileText, Settings, LogOut, DollarSign, CreditCard, PiggyBank, Landmark, ShieldCheck } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { UserRoleContext } from '@/App';

    const commonNavItems = [
      { icon: DollarSign, label: 'Apply for Loan', path: '/apply' },
      { icon: CreditCard, label: 'Payments', path: '/payments' },
      { icon: PiggyBank, label: 'Savings', path: '/savings' },
      { icon: Landmark, label: 'Accounts', path: '/accounts' },
    ];
    
    const adminNavItems = [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: Briefcase, label: 'All Loans', path: '/loans' },
      { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
      { icon: Users, label: 'Borrowers', path: '/borrowers' },
      { icon: FileText, label: 'Loan Portfolio', path: '/portfolio' },
      ...commonNavItems,
    ];

    const userNavItems = [
      { icon: ShieldCheck, label: 'My Loans', path: '/my-loans' },
      ...commonNavItems,
    ];

    const settingsNavItems = [
       { icon: Settings, label: 'Settings', path: '/settings' },
       { icon: LogOut, label: 'Sign Out', path: '/logout' },
    ];

    const SidebarNavItem = ({ item }) => (
      <motion.li
        whileHover={{ x: 5, backgroundColor: 'hsl(var(--primary) / 0.1)' }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `flex items-center space-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors
            ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary'}`
          }
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </NavLink>
      </motion.li>
    );


    const Sidebar = ({ isOpen }) => {
      const { userRole } = useContext(UserRoleContext);
      const navItems = userRole === 'admin' ? adminNavItems : userNavItems;

      return (
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: isOpen ? '0%' : '-100%' }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background p-4 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:border-r ${
            isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
          } lg:shadow-none`}
        >
          <div className="mb-6 flex items-center space-x-2 px-2">
            <PiggyBank className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Loan Manager</span>
          </div>
          
          <nav className="flex-grow">
            <p className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground/70">Menu</p>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <SidebarNavItem key={item.path} item={item} />
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-4 border-t border-border">
             <p className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground/70">System</p>
            <ul className="space-y-1">
                {settingsNavItems.map((item) => (
                    <SidebarNavItem key={item.path} item={item} />
                ))}
            </ul>
          </div>
        </motion.aside>
      );
    };

    export default Sidebar;
  