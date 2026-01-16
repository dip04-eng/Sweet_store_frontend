import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Package, IndianRupee, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

// Get tomorrow's date as default (for delivery date)
const getTomorrowDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 1); // Add 1 day to get tomorrow
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const tomorrowDate = `${year}-${month}-${day}`;
  console.log('Tomorrow date calculated:', tomorrowDate);
  return tomorrowDate;
};

const TotalSold = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = getTomorrowDate();
    console.log('Initial selectedDate:', date);
    return date;
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      fetchOrdersByDate();
    }
  }, [selectedDate]);

  const fetchOrdersByDate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_ORDERS}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      
      // Filter orders by delivery date AND exclude cancelled orders
      const filteredOrders = data.filter(order => {
        const deliveryDate = order.deliveryDate ? order.deliveryDate.split('T')[0] : '';
        const isCancelled = order.status === 'Cancelled';
        return deliveryDate === selectedDate && !isCancelled;
      });
      
      setOrders(filteredOrders);
      calculateSalesData(filteredOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSalesData = (filteredOrders) => {
    const sweetsSold = {};
    let totalRevenue = 0;
    let totalOrders = filteredOrders.length;

    filteredOrders.forEach(order => {
      totalRevenue += order.total || 0;
      
      order.items.forEach(item => {
        const sweetName = item.sweetName;
        const quantity = item.quantity || 0;
        const price = item.price || 0;
        const itemTotal = quantity * price;

        if (sweetsSold[sweetName]) {
          sweetsSold[sweetName].quantity += quantity;
          sweetsSold[sweetName].total += itemTotal;
        } else {
          sweetsSold[sweetName] = {
            quantity: quantity,
            price: price,
            total: itemTotal,
            unit: item.unit || 'kg'
          };
        }
      });
    });

    setSalesData({
      sweetsSold,
      totalRevenue,
      totalOrders,
      totalItems: Object.keys(sweetsSold).length
    });
  };

  return (
    <div>
      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 text-gray-900 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Sales Report</h2>
        </div>
        <div className="flex items-center w-full sm:w-auto">
          <Calendar className="h-5 w-5 text-gray-900 mr-2" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1 sm:flex-none"
            placeholder="Select date"
          />
        </div>
      </motion.div>

      {!selectedDate ? (
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Date</h3>
          <p className="text-gray-600">Choose a date to view sales details for that day</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sales data...</p>
        </div>
      ) : salesData ? (
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div 
              className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-2xl font-semibold opacity-80">₹</span>

              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-3xl font-bold">₹{salesData.totalRevenue.toFixed(2)}</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Package className="h-8 w-8 mb-2 opacity-80" />
              <p className="text-sm opacity-90">Number of People</p>
              <p className="text-3xl font-bold">{salesData.totalOrders}</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <TrendingUp className="h-8 w-8 mb-2 opacity-80" />
              <p className="text-sm opacity-90">Items Sold</p>
              <p className="text-3xl font-bold">{salesData.totalItems}</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-2xl font-semibold opacity-80">₹</span>
              <p className="text-sm opacity-90">Avg. Order Value</p>
              <p className="text-3xl font-bold">
                ₹{salesData.totalOrders > 0 ? (salesData.totalRevenue / salesData.totalOrders).toFixed(2) : '0.00'}
              </p>
            </motion.div>
          </div>

          {/* Sweets Sold Details */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Sweets Sold Breakdown</h3>
            </div>
            
            {Object.keys(salesData.sweetsSold).length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No sales recorded for this date</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-300 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-lg font-semibold text-gray-700">Sweet Name</th>
                      <th className="px-6 py-4 text-center text-lg font-semibold text-gray-700">Quantity</th>
                      <th className="px-6 py-4 text-center text-lg font-semibold text-gray-700">Rate</th>
                      <th className="px-6 py-4 text-right text-lg font-semibold text-gray-700">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(salesData.sweetsSold)
                      .sort((a, b) => b[1].total - a[1].total)
                      .map(([sweetName, data], index) => (
                        <motion.tr 
                          key={sweetName}
                          className="hover:bg-purple-50 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                        >
                          <td className="px-6 py-4 text-gray-900 font-medium">{sweetName}</td>
                          <td className="px-6 py-4 text-center text-gray-700">
                            {data.quantity} {data.unit}
                          </td>
                          <td className="px-6 py-4 text-center text-gray-700">
                            ₹{data.price.toFixed(2)} / {data.unit}
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-purple-600">
                            ₹{data.total.toFixed(2)}
                          </td>
                        </motion.tr>
                      ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-purple-500">
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-right text-lg font-bold text-gray-900">
                        Grand Total:
                      </td>
                      <td className="px-6 py-4 text-right text-lg font-bold text-purple-600">
                        ₹{salesData.totalRevenue.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      ) : null}
    </div>
  );
};

export default TotalSold;
