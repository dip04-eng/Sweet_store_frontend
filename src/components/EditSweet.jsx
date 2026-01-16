import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Search, Save, X } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const EditSweet = () => {
  const [sweets, setSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    unit: 'kg',
    category: 'normal',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_SWEETS}`);
      if (response.ok) {
        const data = await response.json();
        setSweets(data);
      }
    } catch (error) {
      setError('Failed to fetch sweets');
    } finally {
      setLoading(false);
    }
  };

  const handleSweetSelect = (sweet) => {
    console.log('Selected sweet (full object):', JSON.stringify(sweet, null, 2)); // Detailed debug log
    setSelectedSweet(sweet);
    setEditForm({
      name: sweet.name || '',
      price: sweet.price !== undefined && sweet.price !== null ? String(sweet.price) : '',
      unit: sweet.unit || 'kg',
      category: sweet.category || 'normal',
      image: sweet.image || ''
    });
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSweet) return;

    try {
      setLoading(true);
      setError('');
      
      const updateData = {
        sweetId: selectedSweet._id,
        ...editForm,
        price: parseFloat(editForm.price)
      };

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPDATE_SWEET}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        setSuccess('Sweet updated successfully!');
        setSelectedSweet(null);
        setEditForm({ name: '', price: '', unit: 'kg', category: 'normal', image: '' });
        await fetchSweets();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update sweet');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setSelectedSweet(null);
    setEditForm({ name: '', price: '', unit: 'kg', category: 'normal', image: '' });
    setError('');
    setSuccess('');
  };

  const filteredSweets = sweets.filter(sweet =>
    sweet.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedSweet) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Edit3 className="h-6 w-6 mr-2 text-blue-600" />
            Edit Sweet: {selectedSweet.name}
          </h2>
          <button
            onClick={cancelEdit}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sweet Name
              </label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter sweet name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={editForm.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                name="unit"
                value={editForm.unit}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="gm">Gram (gm)</option>
                <option value="piece">Piece</option>
                <option value="box">Box</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={editForm.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="normal">Normal</option>
                <option value="festival">Festival</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sweet Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {editForm.image && (
              <div className="mt-2">
                <img
                  src={editForm.image}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700">
              {success}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Updating...' : 'Update Sweet'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center">
        <Edit3 className="h-6 w-6 mr-2 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Edit Sweet</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Sweets
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for sweet to edit..."
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading sweets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
            {filteredSweets.map((sweet) => (
              <motion.div
                key={sweet._id}
                whileHover={{ scale: 1.02 }}
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all"
                onClick={() => handleSweetSelect(sweet)}
              >
                {sweet.image && (
                  <img
                    src={sweet.image}
                    alt={sweet.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="font-semibold text-gray-900 mb-2">{sweet.name}</h3>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-blue-600">
                    Current Price: ₹{sweet.price !== undefined && sweet.price !== null ? sweet.price : 'Not Set'}/{sweet.unit || 'kg'}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">Category: {sweet.category || 'normal'}</p>
                  <p className="text-xs text-gray-400">Click to edit</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredSweets.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No sweets found matching your search.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EditSweet;