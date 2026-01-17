import { useState, useEffect } from 'react';
import { BarChart3, Calendar, TrendingUp, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const DailySummary = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDailySummary();
  }, [selectedDate]);

  const fetchDailySummary = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}${API_ENDPOINTS.GET_DAILY_SUMMARY}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText || 'Failed to fetch daily summary'}`);
      }

      const data = await response.json();
      setSummaryData(data);
      setError(null);
    } catch (err) {
      // Check if it's a network error
      if (err.message.includes('fetch')) {
        setError('Cannot connect to server. Please ensure the backend is running on https://sweet-store-backend.onrender.com');
      } else {
        setError(err.message);
      }
      console.error('Error fetching daily summary:', err);
    } finally {
      setLoading(false);
    }
  };

  // Extract summary data from API response
  const totalOrders = summaryData?.total_orders || 0;
  const totalRevenue = summaryData?.total_revenue || 0;
  const totalItemsSold = summaryData?.total_items_sold || 0;
  const totalKgSold = summaryData?.total_Kg_sold || 0;
  const totalPiecesSold = summaryData?.total_pieces_sold || 0;
  const popularSweets = summaryData?.popular_sweets || [];
  const ordersList = summaryData?.orders || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div>
      <motion.div
        className="flex items-center justify-between mb-4 sm:mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center">
          <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mr-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-yellow-500">Daily Summary</h2>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading summary...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-4xl sm:text-6xl mb-4">⚠️</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Failed to load summary</h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 max-w-2xl mx-auto">
            <p className="text-red-600 mb-2 text-sm sm:text-base font-medium">{error}</p>
            <div className="text-left text-xs sm:text-sm text-gray-600 mt-3">
              <p className="font-semibold mb-1">Troubleshooting steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Make sure your backend server is running</li>
                <li>Check if the server is accessible at <code className="bg-gray-200 px-1 rounded">https://sweet-store-backend.onrender.com</code></li>
                <li>Verify the <code className="bg-gray-200 px-1 rounded">/admin/daily_summary</code> endpoint exists</li>
                <li>Check browser console for detailed errors</li>
              </ol>
            </div>
          </div>
          <button
            onClick={fetchDailySummary}
            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg text-sm sm:text-base font-semibold"
          >
            Try Again
          </button>
        </div>
      ) : totalOrders === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl sm:text-6xl mb-4">📊</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No orders today</h3>
          <p className="text-gray-600 text-sm sm:text-base">Daily summary will appear when orders are placed.</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Stats Cards */}
          <motion.div
            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Total Orders</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">{totalOrders}</p>
              </div>
              <Package className="h-8 w-8 sm:h-10 sm:w-10 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Total Amount</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">₹{totalRevenue}</p>
              </div>
              <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Items Sold</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {(totalKgSold > 0 || totalPiecesSold > 0) ? (
                    totalKgSold > 0 && totalPiecesSold > 0
                      ? `${totalKgSold} Kg + ${totalPiecesSold} pcs`
                      : totalKgSold > 0
                        ? `${totalKgSold} Kg`
                        : `${totalPiecesSold} pcs`
                  ) : (
                    totalItemsSold > 0 ? totalItemsSold : '0'
                  )}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Avg Order</p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-600">₹{totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0}</p>
              </div>
              <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-400" />
            </div>
          </motion.div>
        </motion.div>
      )}

      {!loading && !error && totalOrders > 0 && (
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Popular Sweets */}
          <motion.div
            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-yellow-600 mb-3 sm:mb-4">Popular Sweets</h3>
            <div className="space-y-2 sm:space-y-3">
              {popularSweets.length > 0 ? popularSweets.map((sweet, index) => (
                <motion.div
                  key={sweet.name}
                  className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold mr-2 sm:mr-3 text-xs sm:text-base flex-shrink-0 ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-purple-500'
                      }`}>
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base truncate">{sweet.name}</span>
                  </div>
                  <span className="text-purple-600 font-bold text-xs sm:text-sm md:text-base flex-shrink-0 ml-2">
                    {sweet.quantity} {sweet.unit || 'pcs'}
                  </span>
                </motion.div>
              )) : (
                <p className="text-gray-500 text-center py-4 text-sm">No popular sweets yet</p>
              )}
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-yellow-600 mb-3 sm:mb-4">Recent Orders</h3>
            <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto">
              {ordersList.length > 0 ? ordersList.slice(0, 10).map((order, index) => (
                <motion.div
                  key={order._id || order.id || index}
                  className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base truncate">{order.customerName}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{order.items?.length || 0} items</div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="font-bold text-purple-600 text-xs sm:text-sm md:text-base">₹{order.total}</div>

                  </div>
                </motion.div>
              )) : (
                <p className="text-gray-500 text-center py-4 text-sm">No orders yet</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DailySummary;
