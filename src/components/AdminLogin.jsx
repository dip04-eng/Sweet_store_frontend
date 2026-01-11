import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import { GiCupcake } from 'react-icons/gi';
import SEO from './SEO';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user came from (or default to admin)
  const from = location.state?.from?.pathname || '/admin';

  // Redirect if already authenticated
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading for better UX
    setTimeout(() => {
      if (email === 'admin@gmail.com' && password === 'admin') {
        // Set authentication flag in sessionStorage
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        navigate(from, { replace: true }); // Go back to where user came from
      } else {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1a1a1a] to-[#0D0D0D] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <SEO 
        title="Admin Login"
        description="Admin login portal for Mansoor Hotel & Sweets management."
        noindex={true}
      />
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D2691E]/10 rounded-full blur-3xl"
        />
      </div>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center text-[#FFD700] hover:text-[#F5F5DC] transition-colors z-10"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-effect-dark border border-[#FFD700]/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FFD700] to-[#D2691E] px-8 py-10 text-center relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-4"
            >
              <div className="relative">
                <img src="/hotel_logo2-removebg-preview.png" alt="Mansoor Hotel & Sweets Logo" className="h-40 w-40 sm:h-44 sm:w-44 object-contain" />
                <ShieldCheck className="h-8 w-8 text-[#0D0D0D] absolute -bottom-1 -right-1 bg-[#FFD700] rounded-full p-1" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold text-[#0D0D0D] font-['Playfair_Display'] mb-2">
              Admin Portal
            </h2>
            <p className="text-[#0D0D0D]/80 text-sm">
              MANSOOR HOTEL & SWEETS
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-[#F5F5DC] text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#FFD700]/60" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    required
                    className="w-full bg-[#0D0D0D]/50 border border-[#FFD700]/30 rounded-xl pl-12 pr-4 py-3.5 text-[#F5F5DC] placeholder-[#F5F5DC]/40 focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[#F5F5DC] text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#FFD700]/60" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full bg-[#0D0D0D]/50 border border-[#FFD700]/30 rounded-xl pl-12 pr-12 py-3.5 text-[#F5F5DC] placeholder-[#F5F5DC]/40 focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#FFD700]/60 hover:text-[#FFD700] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-gradient-to-r from-[#FFD700] to-[#D2691E] text-[#0D0D0D] font-bold py-4 rounded-xl shadow-lg hover:shadow-[#FFD700]/50 transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 border-3 border-[#0D0D0D] border-t-transparent rounded-full"
                    />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    <span>Sign In</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer Info */}
            <div className="mt-8 text-center">
              <p className="text-[#F5F5DC]/60 text-xs">
                Authorized personnel only. All access is monitored and logged.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-6 text-center text-[#FFD700]/40 text-sm"
        >
          Secure Admin Access
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
