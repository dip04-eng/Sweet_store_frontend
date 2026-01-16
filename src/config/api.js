// API Configuration
export const API_BASE_URL = 'https://server.uemcseaiml.org/store';
//export const API_BASE_URL = 'http://127.0.0.1:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // User endpoints
  GET_SWEETS: '/sweets',
  GET_SERVER_DATE: '/server-date',
  PLACE_ORDER: '/place_order',
  
  // Admin endpoints
  ADD_SWEET: '/admin/add_sweet',
  UPDATE_SWEET: '/admin/update_sweet',
  UPDATE_SWEET_STOCK: '/admin/update_stock',
  REMOVE_SWEET: '/admin/remove_sweet',
  GET_ORDERS: '/admin/orders',
  GET_DAILY_SUMMARY: '/admin/daily_summary',
  UPDATE_ORDER_STATUS: '/admin/update_order_status',
  EDIT_ORDER: '/admin/edit_order',
  DOWNLOAD_STATEMENT: '/admin/download_statement',
  DOWNLOAD_SALES_REPORT: '/admin/download_sales_report',
  
  // Contact endpoint
  SUBMIT_CONTACT: '/contact'
};
6