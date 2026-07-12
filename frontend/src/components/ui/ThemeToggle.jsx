import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center w-14 h-7 rounded-full p-1 transition-colors duration-300 cursor-pointer"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #875A7B, #714B67)'
          : 'linear-gradient(135deg, #f0edf4, #e8e4f0)',
        boxShadow: isDark
          ? '0 0 12px rgba(135,90,123,0.4)'
          : '0 1px 4px rgba(0,0,0,0.1)',
      }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      <motion.div
        className="w-5 h-5 rounded-full flex items-center justify-center"
        animate={{ x: isDark ? 28 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          background: isDark ? '#ffffff' : '#875A7B',
          boxShadow: isDark ? '0 2px 6px rgba(0,0,0,0.3)' : '0 2px 6px rgba(135,90,123,0.4)',
        }}
      >
        <motion.div
          animate={{ rotate: isDark ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Moon size={11} className="text-gray-800" />
          ) : (
            <Sun size={11} className="text-white" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
