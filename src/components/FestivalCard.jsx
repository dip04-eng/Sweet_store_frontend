import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

const FestivalCard = ({ sweet, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState('1'); // Weight as string for better input handling
  const [weightUnit, setWeightUnit] = useState('Kg'); // 'Kg' or 'grams'
  const isKgItem = sweet.unit && sweet.unit.toLowerCase() === 'kg';

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleWeightChange = (e) => {
    // Simply accept any input - no restrictions while typing
    setWeight(e.target.value);
  };

  const handleWeightUnitChange = (e) => {
    setWeightUnit(e.target.value);
  };

  // Convert weight to Kg for calculation
  const getWeightInKg = () => {
    const numWeight = parseFloat(weight) || 0;
    const weightInKg = weightUnit === 'Kg' ? numWeight : numWeight / 1000;
    // Round to 3 decimal places
    return Math.round(weightInKg * 1000) / 1000;
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    const finalWeight = isKgItem ? getWeightInKg() : quantity;
    onAddToCart(sweet, finalWeight);
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
      setWeight('1');
      setWeightUnit('Kg');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group w-full"
    >
      {/* Image Container with Arch/Dome shape */}
      <div className="relative">
        {/* Arch shaped container */}
        <div className="relative bg-[#e8d5d0] overflow-hidden" style={{ borderRadius: '50% 50% 0 0 / 35% 35% 0 0' }}>
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src={sweet.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e8d5d0" width="400" height="300"/%3E%3Ctext fill="%23999" font-size="24" font-weight="bold" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E🍬 Sweet%3C/text%3E%3C/svg%3E'}
            alt={sweet.name}
            loading="lazy"
            className="w-full h-48 xs:h-52 sm:h-60 object-cover"
            onError={(e) => {
              e.target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e8d5d0" width="400" height="300"/%3E%3Ctext fill="%23C41E3A" font-size="20" font-weight="bold" x="50%25" y="40%25" text-anchor="middle" dominant-baseline="middle"%3E🍬%3C/text%3E%3Ctext fill="%23C41E3A" font-size="14" x="50%25" y="60%25" text-anchor="middle"%3E${encodeURIComponent(sweet.name || 'Sweet')}%3C/text%3E%3C/svg%3E`;
            }}
          />
        </div>
        
        {/* Heart/Wishlist button */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
          <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-4 pt-8 text-center rounded-b-2xl shadow-lg">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 truncate">
          {sweet.name}
        </h3>
        
        {/* Price */}
        <p className="text-[#C41E3A] font-bold text-lg mb-4">
          ₹ {sweet.rate}.00
          <span className="text-gray-500 text-sm font-normal">/{sweet.unit === 'piece' ? 'pc' : 'Kg'}</span>
        </p>

        {/* Quantity/Weight Selector */}
        {isKgItem ? (
          <div className="flex items-center justify-center gap-2 mb-4">
            <input
              type="number"
              step="0.001"
              min="0"
              value={weight}
              onChange={handleWeightChange}
              placeholder="1"
              className="w-16 px-2 py-2 text-center bg-gray-50 text-gray-800 font-medium rounded-lg border border-gray-200 focus:outline-none focus:border-[#C41E3A] text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <select
              value={weightUnit}
              onChange={handleWeightUnitChange}
              className="px-3 py-2 bg-gray-50 text-gray-700 font-medium text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C41E3A] cursor-pointer"
            >
              <option value="Kg">Kg</option>
              <option value="grams">gm</option>
            </select>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all ${
                quantity <= 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-[#C41E3A] text-[#C41E3A] hover:bg-[#C41E3A] hover:text-white'
              }`}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-gray-800 font-bold text-lg min-w-[32px] text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#C41E3A] text-[#C41E3A] hover:bg-[#C41E3A] hover:text-white transition-all"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          disabled={isAdding}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center justify-center py-3 rounded-full font-semibold transition-all text-sm ${
            isAdding
              ? 'bg-green-500 text-white'
              : 'bg-[#C41E3A] text-white hover:bg-[#a01828]'
          }`}
        >
          {isAdding ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
              />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FestivalCard;
