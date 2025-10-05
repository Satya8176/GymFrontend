import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Users, 
  Calendar, 
  Dumbbell, 
  Home,
  LogOut
} from 'lucide-react';
import { authApi } from '../mocks/mockApi.js';
import ThemeToggle from './ThemeToggle.jsx';
import { adminLogOut } from '../serviceFunctions/adminFun.js';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authApi.getCurrentUser();

  const handleLogout = () => {
    adminLogOut();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/upload-users', icon: Upload, label: 'Upload Users' },
    { path: '/members', icon: Users, label: 'View Members' },
    { path: '/create-routine', icon: Calendar, label: 'Create Routine' },
    { path: '/create-exercise', icon: Dumbbell, label: 'Create Exercise' },
  ];

  return (
    <motion.nav 
      className="bg-background shadow-sm border-b border-border transition-colors duration-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.div 
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Dumbbell className="h-8 w-8 text-primary mr-2" />
              </motion.div>
              <span className="text-xl font-bold text-foreground">
                FitnessPro Admin
              </span>
            </motion.div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-accent-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{currentUser?.name || 'Gym Owner'}</span>
            </div>
            <motion.button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;