
    import React, { useContext } from 'react';
    import { Bell, MessageCircle, UserCircle, Menu, Search, ChevronDown, UserCog, User } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { UserRoleContext } from '@/App';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu.jsx";
    import { useNavigate } from 'react-router-dom';

    const Header = ({ onToggleSidebar }) => {
      const { userRole, setUserRole } = useContext(UserRoleContext);
      const navigate = useNavigate();

      const handleRoleChange = (role) => {
        setUserRole(role);
        if (role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/my-loans');
        }
      };

      return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 shadow-sm backdrop-blur-md sm:px-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={onToggleSidebar}>
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold text-primary hidden sm:block">CREDIT APP</h1>
             <div className="relative ml-4 hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  {userRole === 'admin' ? <UserCog className="h-6 w-6 text-primary" /> : <User className="h-6 w-6 text-primary" />}
                  <span className="text-sm font-medium hidden sm:inline capitalize">{userRole}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => handleRoleChange('user')} disabled={userRole === 'user'}>
                  <User className="mr-2 h-4 w-4" />
                  <span>User</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleRoleChange('admin')} disabled={userRole === 'admin'}>
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Admin</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>
      );
    };

    export default Header;
  