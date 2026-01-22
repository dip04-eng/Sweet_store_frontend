import { useState, useEffect } from 'react';
import { Trash, AlertTriangle, Search, Calendar, PartyPopper } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const RemoveSweet = () => {
  const [sweets, setSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sweetToDelete, setSweetToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedType, setSelectedType] = useState('normal'); // Default to 'normal'

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_SWEETS}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sweets');
      }
      const data = await response.json();
      // Normalize the data: map _id to id for consistency
      const normalizedData = data.map(sweet => ({
        ...sweet,
        id: sweet._id || sweet.id
      }));
      setSweets(normalizedData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching sweets:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSweets = sweets.filter(sweet => {
    if (!selectedType) return false; // Don't show any sweets until type is selected

    // First filter by sweet type (normal or festival)
    const isFestival = sweet.isFestival === true;
    const typeMatch = selectedType === 'festival' ? isFestival : !isFestival;

    // Then filter by search term
    const searchMatch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase());

    return typeMatch && searchMatch;
  });

  const handleDelete = (sweet) => {
    setSweetToDelete(sweet);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.REMOVE_SWEET}?name=${encodeURIComponent(sweetToDelete.name)}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove sweet');
      }

      // Store the deleted sweet info before clearing
      const deletedSweetName = sweetToDelete.name;
      const deletedSweetId = sweetToDelete.id;

      // Remove from local state using functional update to avoid stale state
      setSweets(prevSweets => prevSweets.filter(sweet => sweet.id !== deletedSweetId));
      setSweetToDelete(null);
      alert(`${deletedSweetName} has been removed from inventory.`);
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error('Error removing sweet:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setSweetToDelete(null);
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center">
          <Trash className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mr-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-yellow-500">Remove Items</h2>
        </div>
        {selectedType && (
          <div className="text-xs sm:text-sm text-gray-600">
            Total: {filteredSweets.length} sweets
          </div>
        )}
      </motion.div>

      {/* Type Selection Buttons */}
      <div className="flex gap-2 mb-4 sm:mb-6">
        <button
          onClick={() => setSelectedType('normal')}
          className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${selectedType === 'normal'
              ? 'bg-[#8B7355] text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
            }`}
        >
          Normal Days
        </button>

        <button
          onClick={() => setSelectedType('festival')}
          className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${selectedType === 'festival'
              ? 'bg-[#8B7355] text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
            }`}
        >
          Festival Special
        </button>
      </div>

      {/* Search Bar - Only show when type is selected */}
      {selectedType && (
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${selectedType === 'festival' ? 'festival special' : 'normal days'} sweets...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}

      {/* Show message if no type selected */}
      {!selectedType && !loading && (
        <div className="text-center py-12">
          <div className="text-4xl sm:text-6xl mb-4">👆</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Select a Category</h3>
          <p className="text-gray-600 text-sm sm:text-base">Choose Normal Days or Festival Special to view sweets</p>
        </div>
      )}

      {/* Sweets Grid - Only show when type is selected */}
      {selectedType && loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading sweets...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-4xl sm:text-6xl mb-4">😞</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Failed to load sweets</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">{error}</p>
          <button
            onClick={fetchSweets}
            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg text-sm sm:text-base font-semibold"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredSweets.map((sweet, index) => (
              <motion.div
                key={sweet.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={sweet.image}
                  alt={sweet.name}
                  className="w-full h-32 sm:h-40 object-cover"
                />
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-yellow-600 mb-2 truncate">{sweet.name}</h3>
                  <div className="space-y-1 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-semibold text-purple-600">₹{sweet.rate}/Kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stock:</span>
                      <span className="font-semibold text-purple-600">{sweet.stock} Kg</span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => handleDelete(sweet)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center py-1.5 sm:py-2 px-3 sm:px-4 text-sm sm:text-base bg-red-500 text-white rounded-lg sm:rounded-xl hover:bg-red-600 transition-colors font-semibold"
                  >
                    <Trash className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Remove
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredSweets.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl sm:text-6xl mb-4">🔍</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No sweets found</h3>
              <p className="text-gray-600 text-sm sm:text-base">Try adjusting your search terms.</p>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {sweetToDelete && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Confirm Deletion</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Are you sure you want to remove <strong className="text-yellow-600">{sweetToDelete.name}</strong> from inventory?
                  This action cannot be undone.
                </p>
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={cancelDelete}
                    disabled={isDeleting}
                    className="flex-1 py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex-1 py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base bg-red-500 text-white rounded-lg sm:rounded-xl hover:bg-red-600 transition-colors font-semibold disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RemoveSweet;
