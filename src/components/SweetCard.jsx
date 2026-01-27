import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

const SweetCard = ({ sweet, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState('1');
  const [weightUnit, setWeightUnit] = useState('Kg');
  const isKgItem = sweet.unit && sweet.unit.toLowerCase() === 'kg';

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleWeightChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,3}$/.test(value)) {
      setWeight(value);
    }
  };

  const handleWeightUnitChange = (e) => {
    setWeightUnit(e.target.value);
  };

  const getWeightInKg = () => {
    const numWeight = parseFloat(weight) || 0;
    const weightInKg = weightUnit === 'Kg' ? numWeight : numWeight / 1000;
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-lg overflow-hidden group w-full border border-gray-100"
    >
      {/* Image Container - More compact */}
      <div className="relative overflow-hidden bg-gray-50">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          src={sweet.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23FFD700" width="400" height="300"/%3E%3Ctext fill="%230D0D0D" font-size="24" font-weight="bold" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E🍬 Sweet%3C/text%3E%3C/svg%3E'}
          alt={sweet.name}
          loading="lazy"
          className="w-full h-32 xs:h-36 sm:h-40 md:h-44 object-cover"
          onError={(e) => {
            e.target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" style="bacKground:%23FFD700"%3E%3Crect fill="%23FFD700" width="400" height="300"/%3E%3Ctext fill="%23C41E3A" font-size="20" font-weight="bold" x="50%25" y="40%25" text-anchor="middle" dominant-baseline="middle"%3E🍬%3C/text%3E%3Ctext fill="%23C41E3A" font-size="16" font-weight="bold" x="50%25" y="60%25" text-anchor="middle" dominant-baseline="middle"%3E${encodeURIComponent(sweet.name || 'Sweet')}%3C/text%3E%3C/svg%3E`;
          }}
        />
      </div>

      {/* Content - Compact */}
      <div className="p-3 xs:p-4">
        {/* Title & Price Row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm xs:text-base font-bold text-[#C41E3A] truncate flex-1">
            {sweet.name}
          </h3>
          <div className="text-right flex-shrink-0">
            <span className="text-base xs:text-lg font-bold text-gray-900">₹{sweet.rate}</span>
            <span className="text-xs text-gray-500">/{sweet.unit === 'piece' ? 'pc' : 'Kg'}</span>
          </div>
        </div>

        {/* Quantity/Weight Selector - Compact */}
        {isKgItem ? (
          // Weight input for Kg items - Compact horizontal layout
          <div className="bg-gradient-to-r from-[#C41E3A] to-[#a01828] rounded-lg p-2.5 mb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-1">
                <input
                  type="text"
                  value={weight}
                  onChange={handleWeightChange}
                  placeholder="1"
                  className="w-14 bg-white text-gray-900 text-center rounded px-1.5 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                />
                <select
                  value={weightUnit}
                  onChange={handleWeightUnitChange}
                  className="bg-[#FFD700] text-[#8B0000] rounded px-2 py-1.5 font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option value="Kg">Kg</option>
                  <option value="grams">gm</option>
                </select>
              </div>
              <div className="text-right">
                <span className="text-[#FFD700] font-bold text-sm">
                  = ₹{weight === '' ? '0' : (sweet.rate * getWeightInKg()).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Quantity selector for piece items - Compact
          <div className="flex items-center justify-between bg-gradient-to-r from-[#C41E3A] to-[#a01828] rounded-lg px-3 py-2 mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className={`w-6 h-6 flex items-center justify-center rounded-full transition-all ${quantity <= 1
                    ? 'bg-white/20 text-white/40 cursor-not-allowed'
                    : 'bg-[#FFD700] text-[#8B0000] hover:bg-[#FFC107]'
                  }`}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-[#FFD700] font-bold text-base min-w-[24px] text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FFD700] text-[#8B0000] hover:bg-[#FFC107] transition-all"
              >
                <Plus className="h-3 w-3" />
              </button>
              <span className="text-white/80 text-xs ml-1">pcs</span>
            </div>
            <span className="text-[#FFD700] font-bold text-sm">= ₹{(sweet.rate * quantity).toFixed(0)}</span>
          </div>
        )}

        {/* Add to Cart Button - Compact */}
        <motion.button
          onClick={handleAddToCart}
          disabled={isAdding}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center justify-center py-2.5 rounded-lg font-semibold transition-all text-sm ${isAdding
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-[#8B0000] hover:shadow-lg'
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
              <ShoppingCart className="h-4 w-4 mr-1.5" />
              Add to Cart
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SweetCard;