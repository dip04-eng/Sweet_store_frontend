import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Trash, Edit, Eye, BarChart3, LogOut, Settings, TrendingUp, Calendar, PartyPopper, ShoppingCart } from 'lucide-react';
import AddSweet from './AddSweet';
import EditSweet from './EditSweet';
import RemoveSweet from './RemoveSweet';
import ViewOrders from './ViewOrders';
import DailySummary from './DailySummary';
import TotalSold from './TotalSold';
import AddOrder from './AddOrder';

const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get state from URL hash
  const getStateFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['orders', 'summary', 'totalsold', 'add', 'remove', 'addorder'];
    const validPopups = ['manage-sweets', 'add-options', 'remove-options'];
    
    if (validPopups.includes(hash)) {
      return { tab: 'totalsold', popup: hash };
    } else if (validTabs.includes(hash)) {
      return { tab: hash, popup: null };
    }
    return { tab: 'totalsold', popup: null };
  };

  const initialState = getStateFromHash();
  const [activeTab, setActiveTab] = useState(initialState.tab);
  const [showManageSweets, setShowManageSweets] = useState(initialState.popup === 'manage-sweets');
  const [showAddSweetOptions, setShowAddSweetOptions] = useState(initialState.popup === 'add-options');
  const [showRemoveSweetOptions, setShowRemoveSweetOptions] = useState(initialState.popup === 'remove-options');
  const [sweetType, setSweetType] = useState('normal'); // 'normal' or 'festival'

  // Listen for browser back/forward button
  useEffect(() => {
    const handlePopState = () => {
      const state = getStateFromHash();
      setActiveTab(state.tab);
      setShowManageSweets(state.popup === 'manage-sweets');
      setShowAddSweetOptions(state.popup === 'add-options');
      setShowRemoveSweetOptions(state.popup === 'remove-options');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Custom function to change tab and update URL hash
  const changeTab = (newTab) => {
    if (newTab !== activeTab) {
      window.history.pushState({ tab: newTab }, '', `#${newTab}`);
      setActiveTab(newTab);
      setShowManageSweets(false);
      setShowAddSweetOptions(false);
      setShowRemoveSweetOptions(false);
    }
  };

  // Open Manage Sweets popup with history
  const openManageSweets = () => {
    window.history.pushState({ popup: 'manage-sweets' }, '', '#manage-sweets');
    setShowManageSweets(true);
  };

  // Close Manage Sweets popup
  const closeManageSweets = () => {
    window.history.back();
  };

  // Open Add Sweet Options popup with history
  const openAddSweetOptions = () => {
    window.history.pushState({ popup: 'add-options' }, '', '#add-options');
    setShowManageSweets(false);
    setShowAddSweetOptions(true);
  };

  // Close Add Sweet Options popup
  const closeAddSweetOptions = () => {
    window.history.back();
  };

  // Open Remove Sweet Options popup with history
  const openRemoveSweetOptions = () => {
    window.history.pushState({ popup: 'remove-options' }, '', '#remove-options');
    setShowManageSweets(false);
    setShowRemoveSweetOptions(true);
  };

  // Close Remove Sweet Options popup
  const closeRemoveSweetOptions = () => {
    window.history.back();
  };

  // Handle back button in header
  const handleBack = () => {
    // Always navigate to home page
    navigate('/');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    navigate('/admin-login');
  };

  const mainTabs = [
    { id: 'totalsold', label: 'Sales Report', icon: TrendingUp, component: TotalSold },
    { id: 'orders', label: 'View Orders', icon: Eye, component: ViewOrders },
    { id: 'addorder', label: 'Add Order', icon: ShoppingCart, component: AddOrder },
    { id: 'summary', label: 'Daily Summary', icon: BarChart3, component: DailySummary }
  ];

  const manageTabs = [
    { id: 'add', label: 'Add Sweet', icon: Plus, component: AddSweet },
    { id: 'edit', label: 'Edit Sweet', icon: Edit, component: EditSweet },
    { id: 'remove', label: 'Remove Sweet', icon: Trash, component: RemoveSweet }
  ];

  const ActiveComponent = [...mainTabs, ...manageTabs].find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 xs:h-16 sm:h-16 min-h-[64px]">
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={handleBack}
                className="flex items-center text-purple-600 hover:text-purple-800 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Store</span>
              </button>
              <h1 className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* <div className="text-xs sm:text-sm text-gray-600 hidden md:block">
                Sweet Store Management
              </div> */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-1 sm:p-2 mb-4 sm:mb-6 md:mb-8 overflow-x-auto">
          <nav className="flex space-x-1 min-w-max sm:min-w-0">
            {mainTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => changeTab(tab.id)}
                  className={`flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm md:text-base whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-purple-600'
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
            
            {/* Manage Sweets Button */}
            <button
              onClick={openManageSweets}
              className={`flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm md:text-base whitespace-nowrap ${
                manageTabs.some(tab => tab.id === activeTab)
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-purple-600'
              }`}
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Manage Sweets</span>
              <span className="sm:hidden">Manage</span>
            </button>
          </nav>
        </div>

        {/* Popup Modal for Manage Sweets */}
        {showManageSweets && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeManageSweets}
            />
            
            {/* Popup Content */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Manage Sweets</h3>
                <div className="grid grid-cols-3 gap-3">
                  {manageTabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          if (tab.id === 'add') {
                            openAddSweetOptions();
                          } else {
                            changeTab(tab.id);
                          }
                        }}
                        className="flex flex-col items-center justify-center aspect-square p-4 rounded-xl font-semibold transition-all duration-300 text-sm bg-gradient-to-br from-[#FFD700] to-[#D2691E] text-[#0D0D0D] hover:shadow-lg hover:shadow-[#FFD700]/30 transform hover:scale-105"
                      >
                        <Icon className="h-8 w-8 mb-2" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={closeManageSweets}
                  className="w-full mt-4 px-6 py-3 rounded-xl font-semibold text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {/* Popup Modal for Add Sweet Options */}
        {showAddSweetOptions && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeAddSweetOptions}
            />
            
            {/* Popup Content */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Add Sweet</h3>
                <p className="text-gray-600 text-sm mb-4">Choose the type of sweet you want to add</p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Normal Days Option */}
                  <button
                    onClick={() => {
                      setSweetType('normal');
                      changeTab('add');
                    }}
                    className="flex flex-col items-center justify-center aspect-square p-4 rounded-xl font-semibold transition-all duration-300 text-sm bg-gradient-to-br from-[#FFD700] to-[#D2691E] text-[#0D0D0D] hover:shadow-lg hover:shadow-[#FFD700]/30 transform hover:scale-105"
                  >
                    <Calendar className="h-10 w-10 mb-2" />
                    <span className="font-bold">Normal Days</span>
                    <span className="text-xs opacity-70 mt-1">Regular menu</span>
                  </button>

                  {/* Festival Special Option */}
                  <button
                    onClick={() => {
                      setSweetType('festival');
                      changeTab('add');
                    }}
                    className="flex flex-col items-center justify-center aspect-square p-4 rounded-xl font-semibold transition-all duration-300 text-sm bg-gradient-to-br from-[#E91E63] to-[#9C27B0] text-white hover:shadow-lg hover:shadow-[#E91E63]/30 transform hover:scale-105"
                  >
                    <PartyPopper className="h-10 w-10 mb-2" />
                    <span className="font-bold">Festival Special</span>
                    <span className="text-xs opacity-70 mt-1">Special occasions</span>
                  </button>
                </div>
                <button
                  onClick={closeAddSweetOptions}
                  className="w-full mt-4 px-6 py-3 rounded-xl font-semibold text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {/* Popup Modal for Remove Sweet Options */}
        {showRemoveSweetOptions && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeRemoveSweetOptions}
            />
            
            {/* Popup Content */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Remove Sweet</h3>
                <p className="text-gray-600 text-sm mb-4">Choose the type of sweets to remove</p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Normal Days Option */}
                  <button
                    onClick={() => {
                      setSweetType('normal');
                      changeTab('remove');
                    }}
                    className="flex flex-col items-center justify-center aspect-square p-4 rounded-xl font-semibold transition-all duration-300 text-sm bg-gradient-to-br from-[#FFD700] to-[#D2691E] text-[#0D0D0D] hover:shadow-lg hover:shadow-[#FFD700]/30 transform hover:scale-105"
                  >
                    <Calendar className="h-10 w-10 mb-2" />
                    <span className="font-bold">Normal Days</span>
                    <span className="text-xs opacity-70 mt-1">Regular menu</span>
                  </button>

                  {/* Festival Special Option */}
                  <button
                    onClick={() => {
                      setSweetType('festival');
                      changeTab('remove');
                    }}
                    className="flex flex-col items-center justify-center aspect-square p-4 rounded-xl font-semibold transition-all duration-300 text-sm bg-gradient-to-br from-[#E91E63] to-[#9C27B0] text-white hover:shadow-lg hover:shadow-[#E91E63]/30 transform hover:scale-105"
                  >
                    <PartyPopper className="h-10 w-10 mb-2" />
                    <span className="font-bold">Festival Special</span>
                    <span className="text-xs opacity-70 mt-1">Special occasions</span>
                  </button>
                </div>
                <button
                  onClick={closeRemoveSweetOptions}
                  className="w-full mt-4 px-6 py-3 rounded-xl font-semibold text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {/* Active Tab Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
          {activeTab === 'add' ? (
            <AddSweet sweetType={sweetType} />
          ) : (
            ActiveComponent && <ActiveComponent />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;