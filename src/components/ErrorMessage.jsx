import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Wifi, RefreshCw, Server } from 'lucide-react';

const ErrorMessage = ({ 
  error, 
  onRetry, 
  type = 'api',
  className = ''
}) => {
  const getErrorDetails = () => {
    if (error.includes('timed out') || error.includes('timeout')) {
      return {
        icon: Wifi,
        title: 'Connection Timeout',
        message: 'The request took too long. Please check your internet connection.',
        color: 'text-orange-600'
      };
    }
    
    if (error.includes('Cannot connect') || error.includes('Failed to fetch')) {
      return {
        icon: Server,
        title: 'Server Unavailable',
        message: 'Cannot connect to the server. Please ensure the backend is running.',
        color: 'text-red-600'
      };
    }
    
    return {
      icon: AlertTriangle,
      title: 'Something went wrong',
      message: error,
      color: 'text-red-600'
    };
  };

  const { icon: Icon, title, message, color } = getErrorDetails();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white border-2 border-red-200 rounded-xl p-6 text-center shadow-lg ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4`}
      >
        <Icon className={`h-8 w-8 ${color}`} />
      </motion.div>
      
      <h3 className={`text-xl font-bold ${color} mb-2 font-['Playfair_Display']`}>
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        {message}
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-[#C41E3A] text-white font-semibold rounded-lg shadow-lg hover:bg-[#A01828] transition-colors space-x-2"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Try Again</span>
        </motion.button>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>💡 <strong>Tip:</strong> Make sure your internet connection is stable and the server is running.</p>
      </div>
    </motion.div>
  );
};

export default ErrorMessage;