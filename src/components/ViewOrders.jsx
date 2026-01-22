import { useState, useEffect } from 'react';
import { Eye, Calendar, Phone, MapPin, Package, Filter, CheckCircle2, Pencil, XCircle, Search, ArrowUp, ArrowDown, Download, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('default');
  const [dateFilter, setDateFilter] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }); // Date filter defaults to today
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const [deliverySort, setDeliverySort] = useState('asc'); // 'asc' or 'desc' or null
  const [orderSort, setOrderSort] = useState('asc'); // 'asc' or 'desc' or null
  const [activeSortColumn, setActiveSortColumn] = useState('order'); // 'order' or 'delivery' - which column is actively sorting
  const [showPendingPaymentOnly, setShowPendingPaymentOnly] = useState(false); // Filter for delivered with pending payment
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Download date range modal state
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadStartDate, setDownloadStartDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [downloadEndDate, setDownloadEndDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  // Edit modal state
  const [editOrder, setEditOrder] = useState(null);
  const [editForm, setEditForm] = useState({ customerName: '', mobile: '', total: '', advancePaid: '', status: 'pending' });
  const [additionalAdvance, setAdditionalAdvance] = useState(0);
  const [showAdvanceExceedWarning, setShowAdvanceExceedWarning] = useState(false); // Warning when trying to exceed due amount
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'danger' }

  // Add items functionality
  const [availableSweets, setAvailableSweets] = useState([]);
  const [editOrderItems, setEditOrderItems] = useState([]);
  const [originalOrderItems, setOriginalOrderItems] = useState([]); // Store original quantities
  const [selectedSweet, setSelectedSweet] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedWeightUnit, setSelectedWeightUnit] = useState('Kg');
  const [showAddItems, setShowAddItems] = useState(false);
  const [sweetSearch, setSweetSearch] = useState('');

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
      // Status filter logic
      let statusMatch = false;
      if (statusFilter === 'all') {
        statusMatch = true; // Show all statuses
      } else if (statusFilter === 'default') {
        // If pending payment filter is active, ignore default status filter
        if (showPendingPaymentOnly) {
          statusMatch = true;
        } else {
          // By default, show only pending and processing
          statusMatch = order.status === 'pending' || order.status === 'processing';
        }
      } else {
        statusMatch = (order.status || '').toLowerCase() === statusFilter.toLowerCase();
      }

      // Date filter - check only order date
      let dateMatch = true;
      if (dateFilter) {
        let orderDateStr = '';

        // Get order date
        if (order.orderDate) {
          orderDateStr = order.orderDate.split('T')[0];
        }

        // Match only if order date matches the filter
        dateMatch = orderDateStr === dateFilter;
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

      // Pending payment filter - only show delivered orders with remaining payment
      let pendingPaymentMatch = true;
      if (showPendingPaymentOnly) {
        const isDelivered = (order.status || '').toLowerCase() === 'delivered';
        const hasPendingPayment = (order.total - (order.advancePaid || 0)) > 0;
        pendingPaymentMatch = isDelivered && hasPendingPayment;
      }

      return statusMatch && dateMatch && searchMatch && pendingPaymentMatch;
    })
    .sort((a, b) => {
      // Sort based on which column is active
      if (activeSortColumn === 'order') {
        const dateA = new Date(a.orderDate || '9999-12-31');
        const dateB = new Date(b.orderDate || '9999-12-31');
        const comparison = dateA - dateB;
        return orderSort === 'asc' ? comparison : -comparison;
      } else {
        // Sort by delivery date
        const dateA = new Date(a.deliveryDate || '9999-12-31');
        const dateB = new Date(b.deliveryDate || '9999-12-31');
        const comparison = dateA - dateB;
        return deliverySort === 'asc' ? comparison : -comparison;
      }
    });

  const toggleDeliverySort = () => {
    setDeliverySort(deliverySort === 'asc' ? 'desc' : 'asc');
    setActiveSortColumn('delivery'); // Make delivery the active sort column
  };

  const toggleOrderSort = () => {
    setOrderSort(orderSort === 'asc' ? 'desc' : 'asc');
    setActiveSortColumn('order'); // Make order the active sort column
  };

  const openDownloadModal = () => {
    // Set default dates to today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    setDownloadStartDate(todayStr);
    setDownloadEndDate(todayStr);
    setShowDownloadModal(true);
  };

  const downloadStatement = async () => {
    // Filter orders by date range
    const ordersInRange = orders.filter(order => {
      const orderDate = order.orderDate ? order.orderDate.split('T')[0] : '';
      return orderDate >= downloadStartDate && orderDate <= downloadEndDate;
    });

    if (ordersInRange.length === 0) {
      setToast({ message: 'No orders found in selected date range', type: 'danger' });
      setTimeout(() => setToast(null), 2500);
      return;
    }

    try {
      setIsDownloading(true);
      setShowDownloadModal(false);

      // Prepare filter info for the PDF header
      const filters = {
        statusFilter: 'All',
        dateRange: `${downloadStartDate} to ${downloadEndDate}`,
        pendingPayment: false
      };

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DOWNLOAD_STATEMENT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orders: ordersInRange,
          filters: filters
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_statement_${downloadStartDate}_to_${downloadEndDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setToast({ message: 'Statement downloaded successfully!', type: 'success' });
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      console.error('Download error:', err);
      setToast({ message: 'Failed to download statement', type: 'danger' });
      setTimeout(() => setToast(null), 2500);
    } finally {
      setIsDownloading(false);
    }
  };

  const viewStatement = async () => {
    // Filter orders by date range
    const ordersInRange = orders.filter(order => {
      const orderDate = order.orderDate ? order.orderDate.split('T')[0] : '';
      return orderDate >= downloadStartDate && orderDate <= downloadEndDate;
    });

    if (ordersInRange.length === 0) {
      setToast({ message: 'No orders found in selected date range', type: 'danger' });
      setTimeout(() => setToast(null), 2500);
      return;
    }

    try {
      setIsDownloading(true);
      setShowDownloadModal(false);

      // Prepare filter info for the PDF header
      const filters = {
        statusFilter: 'All',
        dateRange: `${downloadStartDate} to ${downloadEndDate}`,
        pendingPayment: false
      };

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DOWNLOAD_STATEMENT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orders: ordersInRange,
          filters: filters
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Open in new tab for viewing (no download)
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

      // Clean up URL after a delay
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);

      setToast({ message: 'Statement opened in new tab!', type: 'success' });
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      console.error('View error:', err);
      setToast({ message: 'Failed to view statement', type: 'danger' });
      setTimeout(() => setToast(null), 2500);
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getApproverInfo = (order) => {
    // Check if order was placed by admin (preference field starts with [Admin Name])
    const preference = order.preference || '';
    const adminMatch = preference.match(/^\[([^\]]+)\]/);

    if (adminMatch && adminMatch[1]) {
      return {
        type: 'admin',
        name: adminMatch[1],
        display: `Approved by ${adminMatch[1]}`
      };
    }

    return {
      type: 'customer',
      name: 'Customer',
      display: 'Approved by Customer'
    };
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



  const openEditModal = async (order) => {
    setEditOrder(order);
    setAdditionalAdvance(0);
    // Deep copy items to prevent mutation issues
    setEditOrderItems(order.items.map(item => ({ ...item })));
    setOriginalOrderItems(order.items.map(item => ({ ...item }))); // Deep copy for restoration
    setShowAddItems(false);
    setSweetSearch('');
    setEditForm({
      customerName: order.customerName || '',
      mobile: order.mobile || '',
      total: order.total ?? '',
      advancePaid: order.advancePaid ?? 0,
      deliveryDate: order.deliveryDate ? order.deliveryDate.split('T')[0] : '',
      status: (order.status || 'pending')
    });

    // Fetch available sweets
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_SWEETS}`);
      if (response.ok) {
        const sweets = await response.json();
        setAvailableSweets(sweets);
      }
    } catch (error) {
      console.error('Error fetching sweets:', error);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editOrder) return;
    const currentTotal = Number(editForm.total || 0);
    const currentAdvance = Number(editForm.advancePaid || 0);
    const additionalAmount = Number(additionalAdvance || 0);
    const newAdvancePaid = currentAdvance + additionalAmount;

    if (newAdvancePaid > currentTotal) {
      setToast({ message: 'Advance payment cannot exceed total amount!', type: 'danger' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      setIsUpdating(true);
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EDIT_ORDER}/${editOrder._id || editOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: editForm.customerName,
          mobile: editForm.mobile,
          total: currentTotal,
          advancePaid: newAdvancePaid,
          deliveryDate: editForm.deliveryDate,
          status: editForm.status,
          items: editOrderItems
        })
      });
      if (!res.ok) throw new Error('Failed to update order');
      setOrders(prev => prev.map(o => (o._id || o.id) === (editOrder._id || editOrder.id) ? {
        ...o,
        customerName: editForm.customerName,
        mobile: editForm.mobile,
        total: Number(editForm.total),
        advancePaid: newAdvancePaid,
        deliveryDate: editForm.deliveryDate,
        status: editForm.status,
        items: editOrderItems
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
        className="flex flex-col items-start mb-4 sm:mb-6 gap-3 sm:gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center w-full">
          <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900 mr-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">View Orders</h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-3 w-full">
          {/* Search Box */}
          <div className="flex items-center w-full sm:w-auto sm:min-w-[200px] lg:min-w-[250px] relative">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 absolute left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, address..."
              className="bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-1.5 sm:py-2 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
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
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900 mr-2 flex-shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1 sm:flex-none"
            >
              <option value="default">Active Orders (Pending & Processing)</option>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center w-full sm:w-auto">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900 mr-2 flex-shrink-0" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1 sm:flex-none"
              placeholder="Filter by order date"
              title="Filter by order date"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="ml-1 text-gray-500 hover:text-red-500 transition-colors flex-shrink-0"
                title="Clear date filter"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center w-full sm:w-auto bg-white border border-gray-300 rounded-lg px-3 py-1.5 sm:py-2">
            <input
              type="checkbox"
              id="pendingPaymentFilter"
              checked={showPendingPaymentOnly}
              onChange={(e) => setShowPendingPaymentOnly(e.target.checked)}
              className="mr-2 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-500 cursor-pointer flex-shrink-0"
            />
            <label htmlFor="pendingPaymentFilter" className="text-xs sm:text-sm text-red-600 font-semibold cursor-pointer whitespace-nowrap">
              Delivered + Pending Payment
            </label>
          </div>
          {/* Total Orders Count */}
          <div className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm">
            <p className="text-sm font-semibold text-gray-700">
              Total Orders: <span className="text-purple-600">{filteredOrders.length}</span>
            </p>
          </div>
          {/* Download PDF Button */}
          <button
            onClick={openDownloadModal}
            disabled={isDownloading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${isDownloading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-md hover:scale-105'
              }`}
            title="Download statement as PDF"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>View Range</span>
              </>
            )}
          </button>
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

          <div className="-mx-4 sm:mx-0 rounded-xl shadow-sm overflow-hidden">
            <div className="min-w-full align-middle overflow-x-auto">
              <table className="w-full bg-white border border-gray-200 table-auto">
                <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <tr>
                    <th className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">Customer</th>
                    <th className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">Contact</th>
                    <th className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">
                      <button
                        onClick={toggleOrderSort}
                        className={`flex items-center gap-2 transition-colors ${activeSortColumn === 'order' ? 'text-yellow-300' : 'hover:text-yellow-300'}`}
                        title="Click to sort by order date (Up=Ascending, Down=Descending)"
                      >
                        <span>Order Date</span>
                        <div className="flex flex-col -space-y-1">
                          <ArrowUp className={`h-3 w-3 ${activeSortColumn === 'order' && orderSort === 'asc' ? 'text-yellow-300' : 'text-white/40'}`} />
                          <ArrowDown className={`h-3 w-3 ${activeSortColumn === 'order' && orderSort === 'desc' ? 'text-yellow-300' : 'text-white/40'}`} />
                        </div>
                      </button>
                    </th>
                    <th className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">
                      <button
                        onClick={toggleDeliverySort}
                        className={`flex items-center gap-2 transition-colors ${activeSortColumn === 'delivery' ? 'text-yellow-300' : 'hover:text-yellow-300'}`}
                        title="Click to sort by delivery date (Up=Ascending, Down=Descending)"
                      >
                        <span>Delivery Date</span>
                        <div className="flex flex-col -space-y-1">
                          <ArrowUp className={`h-3 w-3 ${activeSortColumn === 'delivery' && deliverySort === 'asc' ? 'text-yellow-300' : 'text-white/40'}`} />
                          <ArrowDown className={`h-3 w-3 ${activeSortColumn === 'delivery' && deliverySort === 'desc' ? 'text-yellow-300' : 'text-white/40'}`} />
                        </div>
                      </button>
                    </th>
                    <th className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">Amount</th>
                    <th className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">Due Payment</th>
                    <th className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">Approved By</th>
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
                        <div className="font-semibold text-red-600 text-xs sm:text-sm md:text-base whitespace-nowrap">
                          ₹{(order.status || '').toLowerCase() === 'cancelled' ? 0 : (order.total - (order.advancePaid || 0))}
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4">
                        {(() => {
                          const approver = getApproverInfo(order);
                          return (
                            <div className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${approver.type === 'admin' ? 'text-blue-600' : 'text-green-600'
                              }`}>
                              {approver.display}
                            </div>
                          );
                        })()}
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
                      <div><strong>Due Amount:</strong> <span className="text-red-600 font-bold">₹{(selectedOrder.status || '').toLowerCase() === 'cancelled' ? 0 : ((selectedOrder.total || 0) - (selectedOrder.advancePaid || 0))}</span></div>
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
                          ₹{item.price} × {Number(item.quantity || 1).toFixed(2).replace(/\.?0+$/, '')} {(item.unit === 'Kg' || item.unit === 'kg') ? 'Kg' : item.unit || 'piece'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600 text-sm sm:text-base">₹{(item.price * (item.quantity || 1)).toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          Qty: {Number(item.quantity || 1).toFixed(2).replace(/\.?0+$/, '')} {(item.unit === 'Kg' || item.unit === 'kg') ? 'Kg' : item.unit || 'piece'}
                        </div>
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
                        onClick={() => {
                          openEditModal(selectedOrder);
                          setSelectedOrder(null);
                        }}
                        className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-semibold text-white shadow bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      >
                        <Pencil className="h-4 w-4 inline mr-1" />
                        Edit
                      </button>
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
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
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
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-100 border border-gray-300 rounded-lg sm:rounded-xl text-gray-600 cursor-not-allowed"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-yellow-600 mb-1.5 sm:mb-2">Contact</label>
                  <input
                    type="tel"
                    value={editForm.mobile}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-100 border border-gray-300 rounded-lg sm:rounded-xl text-gray-600 cursor-not-allowed"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-yellow-600 mb-1.5 sm:mb-2">Total Amount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.total}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-100 border border-gray-300 rounded-lg sm:rounded-xl text-gray-600 cursor-not-allowed"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-yellow-600 mb-1.5 sm:mb-2">Delivery Date</label>
                  <input
                    type="date"
                    value={editForm.deliveryDate}
                    onChange={(e) => setEditForm(f => ({ ...f, deliveryDate: e.target.value }))}
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
                    step="1"
                    value={additionalAdvance}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const remaining = (parseFloat(editForm.total) || 0) - (parseFloat(editForm.advancePaid) || 0);

                      // Allow empty input
                      if (inputValue === '') {
                        setAdditionalAdvance('');
                        setShowAdvanceExceedWarning(false);
                        return;
                      }

                      const value = parseFloat(inputValue) || 0;

                      // Block if value exceeds remaining due amount
                      if (value > remaining) {
                        // Show warning and don't update the value
                        setShowAdvanceExceedWarning(true);
                        // Auto-hide warning after 10 seconds
                        setTimeout(() => setShowAdvanceExceedWarning(false), 10000);
                        return; // Block the input
                      }

                      // Value is valid, update it
                      setShowAdvanceExceedWarning(false);
                      setAdditionalAdvance(inputValue);
                    }}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white border rounded-lg sm:rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${showAdvanceExceedWarning
                      ? 'border-red-500 ring-2 ring-red-300'
                      : 'border-gray-300'
                      }`}
                    placeholder="Enter additional amount"
                  />
                  {showAdvanceExceedWarning && (
                    <p className="text-xs text-red-600 mt-1 font-semibold animate-pulse bg-red-50 px-2 py-1 rounded">⚠️ Amount more than: ₹{Math.max(0, (parseFloat(editForm.total) || 0) - (parseFloat(editForm.advancePaid) || 0)).toFixed(2)} Not allowed</p>
                  )}
                  {parseFloat(additionalAdvance) === ((parseFloat(editForm.total) || 0) - (parseFloat(editForm.advancePaid) || 0)) && parseFloat(additionalAdvance) > 0 && (
                    <p className="text-xs text-green-600 mt-1 font-semibold">✓ Full payment entered</p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">Total Advance: ₹{((parseFloat(editForm.advancePaid) || 0) + (parseFloat(additionalAdvance) || 0)).toFixed(2)}</p>
                  <p className="text-xs text-red-600 mt-1 font-semibold">Remaining Due: ₹{Math.max(0, ((parseFloat(editForm.total) || 0) - ((parseFloat(editForm.advancePaid) || 0) + (parseFloat(additionalAdvance) || 0)))).toFixed(2)}</p>

                </div>

                {/* Current Order Items */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-yellow-600 mb-2">Current Order Items</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3 max-h-40 overflow-y-auto">
                    {editOrderItems.length === 0 ? (
                      <p className="text-gray-500 text-xs">No items in order</p>
                    ) : (
                      editOrderItems.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-gray-200 last:border-0 gap-2">
                          <div className="flex-1 w-full sm:w-auto">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">{item.sweetName}</span>
                            <span className="text-xs text-gray-500">₹{item.price} per {item.unit || 'piece'}</span>
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
                            {/* Quantity Controls */}
                            {(item.unit !== 'Kg' && item.unit !== 'kg') && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [...editOrderItems];
                                  const isInGrams = item.weightUnit === 'grams';
                                  const minQty = item.unit === 'Kg' ? (isInGrams ? 1 : 0.01) : 1;
                                  const decrementBy = item.unit === 'Kg' ? (isInGrams ? 100 : 0.5) : 1;
                                  if (newItems[index].quantity > minQty) {
                                    newItems[index].quantity = Math.max(minQty, (parseFloat(newItems[index].quantity) - decrementBy));
                                    setEditOrderItems(newItems);
                                    const newTotal = newItems.reduce((sum, it) => {
                                      const qtyInKg = (it.weightUnit === 'grams') ? it.quantity / 1000 : it.quantity;
                                      return sum + (it.price * qtyInKg);
                                    }, 0);
                                    setEditForm(f => ({ ...f, total: newTotal }));
                                  }
                                }}
                                className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                            )}
                            <input
                              type="text"
                              value={item.quantity === '' ? '' : item.quantity}
                              onChange={(e) => {
                                const inputValue = e.target.value;

                                // Allow temporary empty value during editing
                                if (inputValue === '') {
                                  const newItems = [...editOrderItems];
                                  newItems[index].quantity = '';
                                  setEditOrderItems(newItems);
                                  return;
                                }

                                const isKgItem = item.unit === 'Kg';
                                const isGrams = item.weightUnit === 'grams';

                                // Validate input based on item type
                                if (isKgItem) {
                                  // For Kg items, allow decimals with up to 3 decimal places
                                  if (!/^\d*\.?\d{0,3}$/.test(inputValue)) {
                                    return;
                                  }
                                } else {
                                  // For piece items, only allow whole numbers
                                  if (!/^\d+$/.test(inputValue)) {
                                    return;
                                  }
                                }

                                const value = parseFloat(inputValue);
                                if (!isNaN(value)) {
                                  const newItems = [...editOrderItems];
                                  // Store value directly for kg items, round for piece items
                                  newItems[index].quantity = isKgItem ? value : Math.floor(value);
                                  setEditOrderItems(newItems);
                                  // Recalculate total
                                  const newTotal = newItems.reduce((sum, it) => {
                                    const qty = it.quantity === '' ? 0 : parseFloat(it.quantity) || 0;
                                    const qtyInKg = (it.weightUnit === 'grams') ? qty / 1000 : qty;
                                    return sum + (it.price * qtyInKg);
                                  }, 0);
                                  setEditForm(f => ({ ...f, total: newTotal }));
                                }
                              }}
                              onBlur={(e) => {
                                // If empty on blur, restore original quantity or set to minimum
                                if (e.target.value === '' || isNaN(parseFloat(e.target.value)) || parseFloat(e.target.value) <= 0) {
                                  // Find the original item by matching sweetId or sweetName
                                  const originalItem = originalOrderItems.find(
                                    orig => {
                                      // Try to match by sweetId first (most reliable)
                                      if (orig.sweetId && item.sweetId && orig.sweetId === item.sweetId) {
                                        return true;
                                      }
                                      // Fallback to sweetName matching
                                      return orig.sweetName === item.sweetName;
                                    }
                                  );

                                  let restoredQty;
                                  if (originalItem) {
                                    // Restore to original quantity
                                    restoredQty = originalItem.quantity;
                                  } else {
                                    // If not found in original (newly added item), use minimum value
                                    const isInGrams = item.weightUnit === 'grams';
                                    restoredQty = item.unit === 'Kg' ? (isInGrams ? 100 : 0.5) : 1;
                                  }

                                  // Create new array with new item objects to trigger re-render
                                  const newItems = editOrderItems.map((it, i) =>
                                    i === index ? { ...it, quantity: restoredQty } : { ...it }
                                  );

                                  setEditOrderItems(newItems);
                                  // Recalculate total
                                  const newTotal = newItems.reduce((sum, it) => {
                                    const qty = it.quantity === '' ? 0 : parseFloat(it.quantity) || 0;
                                    const qtyInKg = (it.weightUnit === 'grams') ? qty / 1000 : qty;
                                    return sum + (it.price * qtyInKg);
                                  }, 0);
                                  setEditForm(f => ({ ...f, total: newTotal }));
                                }
                              }}
                              className="w-16 text-center font-semibold text-sm border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            {(item.unit !== 'Kg' && item.unit !== 'kg') && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [...editOrderItems];
                                  const isInGrams = item.weightUnit === 'grams';
                                  const incrementBy = (item.unit === 'Kg' || item.unit === 'kg') ? (isInGrams ? 100 : 0.5) : 1;
                                  newItems[index].quantity = parseFloat(newItems[index].quantity) + incrementBy;
                                  setEditOrderItems(newItems);
                                  const newTotal = newItems.reduce((sum, it) => {
                                    const qtyInKg = (it.weightUnit === 'grams') ? it.quantity / 1000 : it.quantity;
                                    return sum + (it.price * qtyInKg);
                                  }, 0);
                                  setEditForm(f => ({ ...f, total: newTotal }));
                                }}
                                className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            )}
                            {(item.unit === 'Kg' || item.unit === 'kg') && (
                              <select
                                value={item.weightUnit || 'Kg'}
                                onChange={(e) => {
                                  const newItems = [...editOrderItems];
                                  const oldUnit = newItems[index].weightUnit || 'Kg';
                                  const newUnit = e.target.value;
                                  newItems[index].weightUnit = newUnit;

                                  // Convert quantity when switching units
                                  if (oldUnit === 'Kg' && newUnit === 'grams') {
                                    newItems[index].quantity = parseFloat(newItems[index].quantity) * 1000;
                                  } else if (oldUnit === 'grams' && newUnit === 'Kg') {
                                    newItems[index].quantity = parseFloat(newItems[index].quantity) / 1000;
                                  }

                                  setEditOrderItems(newItems);
                                  const newTotal = newItems.reduce((sum, it) => {
                                    const qtyInKg = (it.weightUnit === 'grams') ? it.quantity / 1000 : it.quantity;
                                    return sum + (it.price * qtyInKg);
                                  }, 0);
                                  setEditForm(f => ({ ...f, total: newTotal }));
                                }}
                                className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="Kg">Kg</option>
                                <option value="grams">grams</option>
                              </select>
                            )}
                            {(item.unit !== 'Kg' && item.unit !== 'kg') && (
                              <span className="text-xs text-gray-600 px-1">{item.unit || 'pcs'}</span>
                            )}
                            <span className="text-xs sm:text-sm font-semibold text-purple-600">₹{((item.weightUnit === 'grams' ? item.quantity / 1000 : item.quantity) * item.price).toFixed(2)}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = editOrderItems.filter((_, i) => i !== index);
                                setEditOrderItems(newItems);
                                const newTotal = newItems.reduce((sum, it) => {
                                  const qtyInKg = (it.weightUnit === 'grams') ? it.quantity / 1000 : it.quantity;
                                  return sum + (it.price * qtyInKg);
                                }, 0);
                                setEditForm(f => ({ ...f, total: newTotal }));
                              }}
                              className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddItems(!showAddItems)}
                    className="mt-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {showAddItems ? '− Hide Add Items' : '+ Add More Items'}
                  </button>
                </div>

                {/* Add Items Section */}
                {showAddItems && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                    <label className="block text-xs sm:text-sm font-semibold text-blue-600 mb-2">Add New Item</label>
                    <div className="space-y-2">
                      {/* Search box with custom dropdown */}
                      <div className="relative">
                        <input
                          type="text"
                          value={sweetSearch}
                          onChange={(e) => {
                            setSweetSearch(e.target.value);
                          }}
                          placeholder="Search Items..."
                          className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoComplete="off"
                        />
                        {/* Custom dropdown that opens downward */}
                        {sweetSearch.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {availableSweets
                              .filter(sweet => sweet.name.toLowerCase().includes(sweetSearch.toLowerCase()))
                              .map((sweet) => (
                                <div
                                  key={sweet._id}
                                  onClick={() => {
                                    setSelectedSweet(sweet._id);
                                    setSweetSearch(sweet.name);
                                  }}
                                  className={`px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 ${selectedSweet === sweet._id ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
                                >
                                  <span className="font-medium">{sweet.name}</span>
                                  <span className="text-gray-500 ml-2">- ₹{sweet.rate}/{sweet.unit}</span>
                                </div>
                              ))}
                            {availableSweets.filter(sweet => sweet.name.toLowerCase().includes(sweetSearch.toLowerCase())).length === 0 && (
                              <div className="px-3 py-2 text-xs sm:text-sm text-gray-500 italic">
                                No items found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {/* Traditional select dropdown - always visible */}
                      <select
                        value={selectedSweet}
                        onChange={(e) => {
                          setSelectedSweet(e.target.value);
                          const sweet = availableSweets.find(s => s._id === e.target.value);
                          if (sweet) {
                            setSweetSearch(sweet.name);
                          }
                          // Reset weight unit to Kg when changing sweet
                          setSelectedWeightUnit('Kg');
                          setSelectedQuantity(1);
                        }}
                        className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a sweet...</option>
                        {availableSweets
                          .filter(sweet => sweet.name.toLowerCase().includes(sweetSearch.toLowerCase()))
                          .map((sweet) => (
                            <option key={sweet._id} value={sweet._id}>
                              {sweet.name} - ₹{sweet.rate}/{sweet.unit}
                            </option>
                          ))}
                      </select>
                      <div className="flex gap-2">
                        {(() => {
                          const sweet = availableSweets.find(s => s._id === selectedSweet);
                          const isKgItem = sweet?.unit === 'Kg' || sweet?.unit === 'kg';
                          return (
                            <>
                              <input
                                type="text"
                                value={selectedQuantity}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (isKgItem) {
                                    // Allow decimals for Kg items with up to 3 decimal places
                                    if (value === '' || /^\d*\.?\d{0,3}$/.test(value)) {
                                      setSelectedQuantity(value === '' ? '' : value);
                                    }
                                  } else {
                                    // Only allow whole numbers for piece items
                                    if (value === '' || /^\d+$/.test(value)) {
                                      setSelectedQuantity(value === '' ? '' : parseInt(value));
                                    }
                                  }
                                }}
                                onBlur={(e) => {
                                  // Set to 1 if empty when losing focus
                                  if (e.target.value === '' || parseFloat(e.target.value) <= 0) {
                                    setSelectedQuantity(1);
                                  }
                                }}
                                className="w-20 sm:w-24 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={isKgItem ? "Qty" : "Pcs"}
                              />
                              {isKgItem && (
                                <select
                                  value={selectedWeightUnit}
                                  onChange={(e) => setSelectedWeightUnit(e.target.value)}
                                  className="px-2 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="Kg">Kg</option>
                                  <option value="grams">grams</option>
                                </select>
                              )}
                            </>
                          );
                        })()}
                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedSweet) {
                              setToast({ message: 'Please select a sweet', type: 'danger' });
                              setTimeout(() => setToast(null), 2000);
                              return;
                            }
                            const sweet = availableSweets.find(s => s._id === selectedSweet);
                            if (sweet) {
                              // Check if the sweet already exists in the order
                              const existingItemIndex = editOrderItems.findIndex(
                                item => item.sweetId === sweet._id || item.sweetName === sweet.name
                              );

                              let newItems;
                              if (existingItemIndex !== -1) {
                                // Sweet exists, update quantity
                                const existingItem = editOrderItems[existingItemIndex];
                                const existingQty = parseFloat(existingItem.quantity || 0);
                                const existingUnit = existingItem.weightUnit;
                                const newQty = parseFloat(selectedQuantity);
                                const newUnit = selectedWeightUnit;

                                // Convert to same unit and add
                                let combinedQty;
                                if (sweet.unit === 'Kg' || sweet.unit === 'kg') {
                                  // Convert both to Kg for comparison
                                  const existingInKg = existingUnit === 'grams' ? existingQty / 1000 : existingQty;
                                  const newInKg = newUnit === 'grams' ? newQty / 1000 : newQty;
                                  const totalKg = existingInKg + newInKg;

                                  // Keep in the same unit as existing item
                                  if (existingUnit === 'grams') {
                                    combinedQty = totalKg * 1000;
                                  } else {
                                    combinedQty = totalKg;
                                  }
                                } else {
                                  // For pieces, just add
                                  combinedQty = existingQty + newQty;
                                }

                                newItems = [...editOrderItems];
                                newItems[existingItemIndex] = {
                                  ...existingItem,
                                  quantity: combinedQty
                                };
                                setToast({ message: `Updated ${sweet.name} quantity!`, type: 'success' });
                              } else {
                                // Sweet doesn't exist, add as new item
                                const newItem = {
                                  sweetId: sweet._id,
                                  sweetName: sweet.name,
                                  quantity: selectedQuantity,
                                  price: sweet.rate,
                                  unit: sweet.unit,
                                  weightUnit: (sweet.unit === 'Kg' || sweet.unit === 'kg') ? selectedWeightUnit : undefined
                                };
                                newItems = [...editOrderItems, newItem];
                                setToast({ message: 'Item added!', type: 'success' });
                              }

                              setEditOrderItems(newItems);
                              setEditOrderItems(newItems);
                              const newTotal = newItems.reduce((sum, item) => {
                                const qty = item.quantity === '' ? 0 : item.quantity;
                                const qtyInKg = (item.weightUnit === 'grams') ? qty / 1000 : qty;
                                return sum + (item.price * qtyInKg);
                              }, 0);
                              setEditForm(f => ({ ...f, total: newTotal }));
                              setSelectedSweet('');
                              setSelectedQuantity(1);
                              setSelectedWeightUnit('Kg');
                              setSweetSearch('');
                              setShowAddItems(false); // Hide the Add Items section after adding
                              setTimeout(() => setToast(null), 2000);
                            }
                          }}
                          className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Add Item
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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

      {/* Download Date Range Modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDownloadModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                    Download Statement
                  </h3>
                  <button
                    onClick={() => setShowDownloadModal(false)}
                    className="text-white/80 hover:text-white transition-colors touch-manipulation"
                  >
                    <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <p className="text-gray-600 mb-4 text-sm">
                  Select the date range for the orders statement:
                </p>

                <div className="space-y-4">
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      From Date
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0" />
                      <input
                        type="date"
                        value={downloadStartDate}
                        onChange={(e) => setDownloadStartDate(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      To Date
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500 flex-shrink-0" />
                      <input
                        type="date"
                        value={downloadEndDate}
                        onChange={(e) => setDownloadEndDate(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                      />
                    </div>
                  </div>

                  {/* Quick Date Options */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const todayStr = today.toISOString().split('T')[0];
                        setDownloadStartDate(todayStr);
                        setDownloadEndDate(todayStr);
                      }}
                      className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const weekAgo = new Date(today);
                        weekAgo.setDate(today.getDate() - 7);
                        setDownloadStartDate(weekAgo.toISOString().split('T')[0]);
                        setDownloadEndDate(today.toISOString().split('T')[0]);
                      }}
                      className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                    >
                      Last 7 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const monthAgo = new Date(today);
                        monthAgo.setMonth(today.getMonth() - 1);
                        setDownloadStartDate(monthAgo.toISOString().split('T')[0]);
                        setDownloadEndDate(today.toISOString().split('T')[0]);
                      }}
                      className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                    >
                      Last 30 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const year = today.getFullYear();
                        const month = String(today.getMonth() + 1).padStart(2, '0');
                        const day = String(today.getDate()).padStart(2, '0');
                        const todayStr = `${year}-${month}-${day}`;
                        const firstDayStr = `${year}-${month}-01`;
                        setDownloadStartDate(firstDayStr);
                        setDownloadEndDate(todayStr);
                      }}
                      className="px-3 py-1 text-xs bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition-colors"
                    >
                      This Month
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={() => setShowDownloadModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors touch-manipulation min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={viewStatement}
                    disabled={!downloadStartDate || !downloadEndDate || downloadStartDate > downloadEndDate}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all touch-manipulation min-h-[44px] ${!downloadStartDate || !downloadEndDate || downloadStartDate > downloadEndDate
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                      }`}
                  >
                    <Eye className="h-4 w-4" />
                    View PDF
                  </button>
                  <button
                    onClick={downloadStatement}
                    disabled={!downloadStartDate || !downloadEndDate || downloadStartDate > downloadEndDate}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all touch-manipulation min-h-[44px] ${!downloadStartDate || !downloadEndDate || downloadStartDate > downloadEndDate
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                      }`}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>

                {downloadStartDate > downloadEndDate && (
                  <p className="text-red-500 text-xs mt-2 text-center">
                    End date must be after start date
                  </p>
                )}
              </div>
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
