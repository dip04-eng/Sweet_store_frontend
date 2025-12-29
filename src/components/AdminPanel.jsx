import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash, Eye, BarChart3, LogOut, Settings } from 'lucide-react';
import AddSweet from './AddSweet';
import RemoveSweet from './RemoveSweet';
import ViewOrders from './ViewOrders';
import DailySummary from './DailySummary';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [showManageSweets, setShowManageSweets] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    navigate('/admin-login');
  };

  const mainTabs = [
    { id: 'orders', label: 'View Orders', icon: Eye, component: ViewOrders },
    { id: 'summary', label: 'Daily Summary', icon: BarChart3, component: DailySummary }
  ];

  const manageTabs = [
    { id: 'add', label: 'Add Sweet', icon: Plus, component: AddSweet },
    { id: 'remove', label: 'Remove Sweet', icon: Trash, component: RemoveSweet }
  ];

  const ActiveComponent = [...mainTabs, ...manageTabs].find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center flex-wrap gap-2">
              <Link
                to="/"
                className="flex items-center text-purple-600 hover:text-purple-800 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Store</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <h1 className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xs sm:text-sm text-gray-600 hidden md:block">
                Sweet Store Management
              </div>
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
                  onClick={() => setActiveTab(tab.id)}
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
              onClick={() => setShowManageSweets(!showManageSweets)}
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
              onClick={() => setShowManageSweets(false)}
            />
            
            {/* Popup Content */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Manage Sweets</h3>
                <div className="space-y-3">
                  {manageTabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setShowManageSweets(false);
                        }}
                        className="w-full flex items-center px-6 py-4 rounded-xl font-semibold transition-all duration-300 text-sm bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-500 hover:to-pink-500 hover:text-white hover:shadow-lg transform hover:scale-105"
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setShowManageSweets(false)}
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
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;