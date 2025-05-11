
    import React, { useState } from 'react';
    import { Outlet, useLocation } from 'react-router-dom';
    import Sidebar from '@/components/Sidebar';
    import Header from '@/components/Header';
    import { Toaster } from '@/components/ui/toaster';
    import { motion, AnimatePresence } from 'framer-motion';

    const Layout = () => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const location = useLocation();

      const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };

      return (
        <div className="flex h-screen bg-muted/40">
          <Sidebar isOpen={isSidebarOpen} />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header onToggleSidebar={toggleSidebar} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
          <Toaster />
           {isSidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/30 lg:hidden"
              onClick={toggleSidebar}
            />
          )}
        </div>
      );
    };

    export default Layout;
  