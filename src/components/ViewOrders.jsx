import { useState, useEffect } from 'react';
import { Eye, Calendar, Phone, MapPin, Package, Filter, CheckCircle2, Pencil, XCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(''); // Date filter for orders
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const [sortOrder, setSortOrder] = useState('orderDate-desc'); // Sort by order date descending by default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit modal state
  const [editOrder, setEditOrder] = useState(null);
  const [editForm, setEditForm] = useState({ customerName: '', mobile: '', total: '', advancePaid: '', status: 'pending' });
  const [additionalAdvance, setAdditionalAdvance] = useState(0);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'danger' }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_ORDERS}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const statusMatch = statusFilter === 'all' || order.status === statusFilter;
      
      // Date filter
      let dateMatch = true;
      if (dateFilter) {
        const deliveryDate = order.deliveryDate ? order.deliveryDate.split('T')[0] : '';
        dateMatch = deliveryDate === dateFilter;
      }
      
      // Search filter - search by name, phone, address
      let searchMatch = true;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const name = (order.customerName || '').toLowerCase();
        const phone = (order.mobile || '').toLowerCase();
        const address = (order.address || '').toLowerCase();
        searchMatch = name.includes(query) || phone.includes(query) || address.includes(query);
      }
      
      return statusMatch && dateMatch && searchMatch;
    })
    .sort((a, b) => {
      const [field, direction] = sortOrder.split('-');
      let comparison = 0;
      
      if (field === 'deliveryDate') {
        const dateA = new Date(a.deliveryDate || '9999-12-31');
        const dateB = new Date(b.deliveryDate || '9999-12-31');
        comparison = dateA - dateB;
      } else if (field === 'orderDate') {
        const dateA = new Date(a.orderDate || '9999-12-31');
        const dateB = new Date(b.orderDate || '9999-12-31');
        comparison = dateA - dateB;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const updateOrderStatus = async (order, status) => {
    try {
      setIsUpdating(true);
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPDATE_ORDER_STATUS}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order._id || order.id, status })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update status');
      }
      // Refresh list and close modal if open
      await fetchOrders();
      setSelectedOrder(null);
      setToast({ message: status === 'Delivered' ? 'Order marked as delivered!' : 'Order has been cancelled', type: status === 'Delivered' ? 'success' : 'danger' });
      setTimeout(() => setToast(null), 2500);
    } catch (e) {
      console.error(e);
      setToast({ message: e.message || 'Failed to update order status', type: 'danger' });
      setTimeout(() => setToast(null), 2500);
    } finally {
      setIsUpdating(false);
    }
  };

  

  const openEditModal = (order) => {
    setEditOrder(order);
    setAdditionalAdvance(0);
    setEditForm({
      customerName: order.customerName || '',
      mobile: order.mobile || '',
      total: order.total ?? '',
      advancePaid: order.advancePaid ?? 0,
      status: (order.status || 'pending')
    });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editOrder) return;
    try {
      setIsUpdating(true);
      const newAdvancePaid = Number(editForm.advancePaid || 0) + Number(additionalAdvance || 0);
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EDIT_ORDER}/${editOrder._id || editOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: editForm.customerName,
          mobile: editForm.mobile,
          total: Number(editForm.total),
          advancePaid: newAdvancePaid,
          status: editForm.status
        })
      });
      if (!res.ok) throw new Error('Failed to update order');
      setOrders(prev => prev.map(o => (o._id || o.id) === (editOrder._id || editOrder.id) ? {
        ...o,
        customerName: editForm.customerName,
        mobile: editForm.mobile,
        total: Number(editForm.total),
        advancePaid: newAdvancePaid,
        status: editForm.status
      } : o));
      setEditOrder(null);
      setToast({ message: 'Order updated successfully!', type: 'success' });
      setTimeout(() => setToast(null), 2500);
    } catch (e) {
      console.error(e);
      setToast({ message: e.message || 'Failed to update order', type: 'danger' });
      setTimeout(() => setToast(null), 2500);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center">
          <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900 mr-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">View Orders</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {/* Search Box */}
          <div className="flex items-center w-full sm:w-auto relative">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 absolute left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, address..."
              className="bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-1.5 sm:py-2 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Clear search"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex items-center w-full sm:w-auto">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900 mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1 sm:flex-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <div className="flex items-center w-full sm:w-auto">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900 mr-2" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1 sm:flex-none"
              placeholder="Filter by date"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="ml-1 text-gray-500 hover:text-red-500 transition-colors"
                title="Clear date filter"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center w-full sm:w-auto">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900 mr-2" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1 sm:flex-none"
            >
              <option value="deliveryDate-asc">Delivery: Earliest First</option>
              <option value="deliveryDate-desc">Delivery: Latest First</option>
              <option value="orderDate-asc">Order: Oldest First</option>
              <option value="orderDate-desc">Order: Newest First</option>
            </select>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            Total Orders: {filteredOrders.length}
          </div>
        </div>
      </motion.div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-4xl sm:text-6xl mb-4">😞</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Failed to load orders</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">{error}</p>
          <button 
            onClick={fetchOrders}
            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg text-sm sm:text-base font-semibold"
          >
            Try Again
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl sm:text-6xl mb-4">📦</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
          <p className="text-gray-600 text-sm sm:text-base">No orders match the selected filter.</p>
        </div>
      ) : (
        <>
          {/* Mobile Scroll Hint */}
          <div className="block sm:hidden text-center mb-3">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <span className="mr-1">�</span>
              View all order details below
            </p>
          </div>
          
          <div className="-mx-4 sm:mx-0 rounded-xl shadow-sm">
            <div className="min-w-full align-middle">
              <table className="w-full bg-white border border-gray-200">
                <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <tr>
                    <th className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">Customer</th>
                    <th className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">Contact</th>
                    <th className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">Order Date</th>
                    <th className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">Delivery Date</th>
                    <th className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">Amount</th>
                    <th className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">Due Payment</th>
                    <th className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">Status</th>
                    <th className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order, index) => (
                <motion.tr 
                  key={order._id}
                  className="bg-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4">
                    <div>
                      <div className="font-semibold text-yellow-600 text-xs sm:text-sm md:text-base whitespace-nowrap">{order.customerName}</div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4">
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      {order.mobile}
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4">
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span>{order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4">
                    <div className="flex items-center text-xs sm:text-sm text-purple-600 font-semibold whitespace-nowrap">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4">
                    <div className="font-semibold text-purple-600 text-xs sm:text-sm md:text-base whitespace-nowrap">₹{order.total}</div>
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4">
                    <div className="font-semibold text-red-600 text-xs sm:text-sm md:text-base whitespace-nowrap">₹{order.total - (order.advancePaid || 0)}</div>
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(order.status)}`}>
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4">
                    <div className="flex flex-nowrap items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-purple-600 border border-purple-200 hover:bg-purple-50 whitespace-nowrap"
                      >
                        <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span>View</span>
                      </button>

                      {/* Delivered button removed from table; available inside View modal */}

                      <button
                        onClick={() => openEditModal(order)}
                        className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 whitespace-nowrap"
                      >
                        <Pencil className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Edit
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl p-4 sm:p-6 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-yellow-600">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                {/* Customer Info */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <h4 className="font-semibold text-purple-700 mb-2 sm:mb-3 text-sm sm:text-base">Customer Information</h4>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                    <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                    <div><strong>Mobile:</strong> {selectedOrder.mobile}</div>
                    <div className="break-words"><strong>Address:</strong> {selectedOrder.address}</div>
                    {selectedOrder.preference && (
                      <div className="break-words"><strong>Preference:</strong> {selectedOrder.preference}</div>
                    )}
                  </div>
                </div>

                {/* Order Info */}
                <div className="bg-gray-50 border border-gray-200 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <h4 className="font-semibold text-yellow-600 mb-2 sm:mb-3 text-sm sm:text-base">Order Information</h4>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                    <div><strong>Order Date:</strong> {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</div>
                    <div><strong>Delivery Date:</strong> <span className="text-purple-600 font-semibold">{selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span></div>
                    {selectedOrder.createdAt && (
                      <div><strong>Order Time:</strong> {selectedOrder.createdAt}</div>
                    )}
                    <div><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status ? selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) : 'N/A'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-300">
                      <div className="mb-1"><strong>Total Amount:</strong> <span className="text-purple-600 font-bold">₹{selectedOrder.total}</span></div>
                      <div className="mb-1"><strong>Advance Paid:</strong> <span className="text-green-600 font-bold">₹{selectedOrder.advancePaid || 0}</span></div>
                      <div><strong>Due Amount:</strong> <span className="text-red-600 font-bold">₹{(selectedOrder.total || 0) - (selectedOrder.advancePaid || 0)}</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4 sm:mt-6">
                <h4 className="font-semibold text-yellow-600 mb-2 sm:mb-3 text-sm sm:text-base">Order Items</h4>
                <div className="space-y-2 sm:space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-2.5 sm:p-3 rounded-lg sm:rounded-xl">
                      <div className="flex-1">
                        <div className="font-semibold text-yellow-600 text-xs sm:text-sm md:text-base">{item.sweetName}</div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          ₹{item.price} × {item.quantity || 1}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600 text-sm sm:text-base">₹{item.price * (item.quantity || 1)}</div>
                        <div className="text-xs text-gray-500">Qty: {item.quantity || 1}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal footer actions */}
              <div className="mt-4 sm:mt-6 flex justify-end gap-2">
                {(() => {
                  const finalized = ['delivered', 'cancelled'].includes((selectedOrder.status || '').toLowerCase());
                  return (
                    <>
                      <button
                        onClick={() => updateOrderStatus(selectedOrder, 'Delivered')}
                        disabled={isUpdating || finalized}
                        className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-semibold text-white shadow ${finalized ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'}`}
                      >
                        Mark as Delivered
                      </button>
                      <button
                        onClick={() => updateOrderStatus(selectedOrder, 'Cancelled')}
                        disabled={isUpdating || finalized}
                        className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-semibold text-white shadow ${finalized ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600'}`}
                      >
                        Cancel Order
                      </button>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Order Modal */}
      <AnimatePresence>
        {editOrder && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-lg shadow-2xl"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-blue-600">Edit Order</h3>
                <button
                  onClick={() => setEditOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={submitEdit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-yellow-600 mb-1.5 sm:mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={editForm.customerName}
                    onChange={(e) => setEditForm(f => ({ ...f, customerName: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-yellow-600 mb-1.5 sm:mb-2">Contact</label>
                  <input
                    type="tel"
                    value={editForm.mobile}
                    onChange={(e) => setEditForm(f => ({ ...f, mobile: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-yellow-600 mb-1.5 sm:mb-2">Amount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.total}
                    onChange={(e) => setEditForm(f => ({ ...f, total: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-yellow-600 mb-1.5 sm:mb-2">Current Advance Paid: ₹{editForm.advancePaid || 0}</label>
                  <label className="block text-xs sm:text-sm font-semibold text-green-600 mb-1.5 sm:mb-2">Add Additional Advance Payment</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={additionalAdvance}
                    onChange={(e) => setAdditionalAdvance(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter additional amount"
                  />
                  <p className="text-xs text-gray-600 mt-1">Total Advance: ₹{((parseFloat(editForm.advancePaid) || 0) + (parseFloat(additionalAdvance) || 0)).toFixed(2)}</p>
                  <p className="text-xs text-red-600 mt-1 font-semibold">Remaining Due: ₹{((parseFloat(editForm.total) || 0) - ((parseFloat(editForm.advancePaid) || 0) + (parseFloat(additionalAdvance) || 0))).toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-yellow-600 mb-1.5 sm:mb-2">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditOrder(null)}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg text-white shadow-lg z-[60] ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewOrders;
