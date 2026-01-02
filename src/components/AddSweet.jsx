import { useState, useEffect } from 'react';
import { Upload, Eye, Calendar, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const AddSweet = ({ sweetType = 'normal' }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    rate: '',
    unit: '',
    image: '',
    isFestival: sweetType === 'festival'
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedSweetId, setSelectedSweetId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Update isFestival when sweetType prop changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      isFestival: sweetType === 'festival'
    }));
  }, [sweetType]);

  // All products organized by category
  const allProducts = {
    'Sweet': ['Gulab Jamun', 'Rasgulla', 'Jalebi', 'Ladoo', 'Barfi', 'Kaju Katli', 'Rasmalai', 'Sandesh'],
    'Breakfast': ['Idli', 'Dosa', 'Paratha', 'Poha', 'Upma', 'Uttapam'],
    'Lunch': ['Dal Tadka', 'Paneer Butter Masala', 'Chole Bhature', 'Biryani', 'Rajma Chawal'],
    'Dinner': ['Roti', 'Naan', 'Dal Makhani', 'Kadai Paneer'],
    'Snacks': ['Samosa', 'Pakora', 'Vada Pav', 'Kachori', 'Dhokla'],
    'Beverage': ['Masala Chai', 'Lassi', 'Coffee', 'Buttermilk'],
    'Dessert': ['Kheer', 'Halwa', 'Kulfi', 'Phirni'],
    'Other': ['Papad', 'Pickle', 'Chutney']
  };

  // Get products for selected category
  const getProductsForCategory = () => {
    if (!selectedCategory) return [];
    return allProducts[selectedCategory] || [];
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB');
        setTimeout(() => setError(null), 3000);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData(prev => ({
          ...prev,
          image: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      // If user types a custom name, clear existing product selection
      setSelectedSweetId(null);
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);
    if (!formData.name || !formData.category || !formData.rate || !formData.unit || !formData.image) {
      setError('Please fill all required fields');
      setIsSubmitting(false);
      return;
    }

    if (parseFloat(formData.rate) <= 0) {
      setError('Rate must be a positive number');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('📤 Sending sweet data:', {
        name: formData.name,
        category: formData.category,
        rate: formData.rate,
        unit: formData.unit,
        imageLength: formData.image.length,
        imageStart: formData.image.substring(0, 50)
      });

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADD_SWEET}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Backend error:', errorData);
        throw new Error(errorData.error || 'Failed to add sweet');
      }

      const result = await response.json();
      console.log('✅ Sweet added successfully:', result);

      setSuccess(true);
      setFormData({
        name: '',
        category: '',
        rate: '',
        unit: '',
        image: ''
      });
      setSelectedSweetId(null);
      setSelectedCategory('');
      setImagePreview(null);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err.message || 'Failed to add sweet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        className="mb-6 sm:mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          {sweetType === 'festival' ? (
            <PartyPopper className="h-8 w-8 text-[#E91E63]" />
          ) : (
            <Calendar className="h-8 w-8 text-[#FFD700]" />
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-500">
            {sweetType === 'festival' ? 'Add Festival Special' : 'Add Normal Day Sweet'}
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          {sweetType === 'festival' 
            ? 'Fill in the details for your festival special item' 
            : 'Fill in the details below to add a new sweet to your collection'}
        </p>
      </motion.div>

      <motion.form 
        onSubmit={handleSubmit} 
        className="bg-gray-50 rounded-xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 border border-gray-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column - Form Inputs */}
          <div className="space-y-4 sm:space-y-5">
            {/* Category Dropdown (First) */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-yellow-600 mb-1.5 sm:mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedCategory(value);
                  setFormData(prev => ({ ...prev, category: value }));
                }}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              >
                <option value="" disabled>Select a category</option>
                <option value="Sweet">Sweet</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverage">Beverage</option>
                <option value="Dessert">Dessert</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Existing Products Dropdown */}
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <label className="block text-xs sm:text-sm font-semibold text-yellow-600 mb-1.5 sm:mb-2">
                Select Existing Product
              </label>
              <select
                name="existingProduct"
                value={selectedSweetId ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    setFormData(prev => ({ 
                      ...prev, 
                      name: value
                    }));
                    setSelectedSweetId(value);
                  } else {
                    setFormData(prev => ({ ...prev, name: '' }));
                    setSelectedSweetId(null);
                  }
                }}
                disabled={!selectedCategory}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  !selectedCategory ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300 text-gray-800'
                }`}
              >
                {!selectedCategory ? (
                  <option value="">Select a category first</option>
                ) : (
                  <>
                    <option value="">Select a product (optional)</option>
                    {getProductsForCategory().map((product) => (
                      <option key={product} value={product}>
                        {product}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </motion.div>

            {/* Sweet Name */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-yellow-600 mb-1.5 sm:mb-2">
                Sweet Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter sweet name"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-yellow-600 mb-1.5 sm:mb-2">
                Rate (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter rate"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-yellow-600 mb-1.5 sm:mb-2">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select unit</option>
                <option value="piece">Per Piece</option>
                <option value="kg">Per Kg</option>
              </select>
            </div>

            

            {error && (
              <motion.div 
                className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-red-600 text-xs sm:text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                className="p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl text-green-600 text-xs sm:text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Sweet added successfully!
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Adding Sweet...
                </div>
              ) : (
                'Add Sweet'
              )}
            </motion.button>
          </div>

          {/* Right Column - Image Upload */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-yellow-600 mb-1.5 sm:mb-2">
                Sweet Image
              </label>
              <div className="border-2 border-dashed border-yellow-400 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-yellow-500 transition-colors relative bg-white">
                {imagePreview ? (
                  <div className="space-y-3 sm:space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-96 object-contain rounded-lg mx-auto"
                    />
                    <div className="flex items-center justify-center text-yellow-600 text-sm sm:text-base">
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Image Preview
                    </div>
                    <label className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg cursor-pointer hover:shadow-lg transition-all">
                      <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <div className="space-y-3 sm:space-y-4">
                      <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500 mx-auto" />
                      <div>
                        <p className="text-gray-700 text-sm sm:text-base">Click to upload image</p>
                        <p className="text-xs sm:text-sm text-gray-500">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default AddSweet;
