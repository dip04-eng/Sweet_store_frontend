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
    const value = e.target.value;
    // Allow empty input and numeric values with up to 3 decimal places
    if (value === '' || /^\d*\.?\d{0,3}$/.test(value)) {
      setWeight(value);
    }
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
      className="card-premium overflow-hidden group w-full"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden border-b-2 border-[#C41E3A]/20 bg-white">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={sweet.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23FFD700" width="400" height="300"/%3E%3Ctext fill="%230D0D0D" font-size="24" font-weight="bold" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E🍬 Sweet%3C/text%3E%3C/svg%3E'}
          alt={sweet.name}
          loading="lazy"
          className="w-full h-40 xs:h-44 sm:h-48 md:h-52 lg:h-56 object-cover img-responsive"
          onError={(e) => {
            e.target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" style="bacKground:%23FFD700"%3E%3Crect fill="%23FFD700" width="400" height="300"/%3E%3Ctext fill="%23C41E3A" font-size="20" font-weight="bold" x="50%25" y="40%25" text-anchor="middle" dominant-baseline="middle"%3E🍬%3C/text%3E%3Ctext fill="%23C41E3A" font-size="16" font-weight="bold" x="50%25" y="60%25" text-anchor="middle" dominant-baseline="middle"%3E${encodeURIComponent(sweet.name || 'Sweet')}%3C/text%3E%3C/svg%3E`;
          }}
        />

        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-4 xs:p-5 sm:p-6 spacing-responsive">
        {/* Title */}
        <h3 className="text-base xs:text-lg sm:text-xl font-bold text-[#C41E3A] mb-2 truncate font-['Playfair_Display']">
          {sweet.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {sweet.description}
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#C41E3A]/20 to-transparent mb-4"></div>

        {/* Price Display */}
        <div className="flex items-center justify-between mb-4 p-3 border border-[#FFD700]/30 rounded-xl bg-gradient-to-br from-[#FFF8F0] to-[#FFFAE6]">
          <div className="text-left">
            <div className="text-xs text-gray-500">Price</div>
            <div className="text-xl font-bold text-[#C41E3A]">₹{sweet.rate}<span className="text-sm text-gray-600">/{sweet.unit === 'piece' ? 'piece' : 'Kg'}</span></div>
          </div>
        </div>

        {/* Quantity/Weight Selector */}
        <div className="flex items-center justify-center mb-4 -mx-4">
          {isKgItem ? (
            // Weight input for Kg items with dropdown first
            <div className="flex flex-col gap-2 bg-gradient-to-r from-[#C41E3A] to-[#8B0000] rounded-2xl px-4 py-3 min-w-full border-2 border-[#FFD700]/50">
              {/* Unit selector - First */}
              <div className="flex items-center justify-center gap-2">
                <label className="text-xs text-white/90 font-semibold">Select Unit:</label>
                <select
                  value={weightUnit}
                  onChange={handleWeightUnitChange}
                  className="flex-1 bg-[#FFD700] text-[#C41E3A] rounded-lg px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-white text-sm cursor-pointer"
                >
                  <option value="Kg" className="text-[#C41E3A]">Kilogram (Kg)</option>
                  <option value="grams" className="text-[#C41E3A]">Grams (gm)</option>
                </select>
              </div>

              {/* Weight input - Second */}
              <div className="flex items-center justify-center gap-2">
                <label className="text-xs text-white/90 font-semibold">Enter Value:</label>
                
                {/* Weight input field */}
                <input
                  type="text"
                  value={weight}
                  onChange={handleWeightChange}
                  placeholder="0.0"
                  className="w-20 bg-white text-[#C41E3A] text-center rounded-lg px-2 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                />

                <span className="text-xs text-white/90 font-semibold ml-1">
                  {weightUnit}
                </span>
              </div>

              {/* Price display */}
              <div className="text-center border-t border-white/20 pt-2">
                <span className="text-xs text-white/70">Total Price: </span>
                <span className="text-lg text-[#FFD700] font-bold">
                  ₹{weight === '' ? '0.00' : (sweet.rate * getWeightInKg()).toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            // Quantity selector for piece items
            <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#C41E3A] to-[#8B0000] rounded-full px-6 py-3 w-full border-2 border-[#FFD700]/50">
              <label className="text-sm text-white/90 font-semibold">Piece:</label>

              {/* Minus Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className={`p-2 rounded-full transition-all ${quantity <= 1
                    ? 'bg-white/20 text-white/30 cursor-not-allowed'
                    : 'bg-[#FFD700] text-[#C41E3A] hover:bg-[#FFC107]'
                  }`}
              >
                <Minus className="h-4 w-4" />
              </motion.button>

              {/* Quantity Display */}
              <div className="min-w-[60px] text-center">
                <div className="text-2xl font-bold text-[#FFD700]">{quantity}</div>
              </div>

              {/* Plus Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleQuantityChange(1)}
                className="p-2 rounded-full bg-[#FFD700] text-[#C41E3A] hover:bg-[#FFC107] transition-all"
              >
                <Plus className="h-4 w-4" />
              </motion.button>

              <span className="text-sm text-white/90 ml-2 font-semibold">
                ≈ ₹{(sweet.rate * quantity).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          disabled={isAdding}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full btn-premium flex items-center justify-center py-3 px-6 rounded-full font-bold transition-all duration-300 shadow-lg text-sm sm:text-base border-2 touch-manipulation min-h-[48px] ${isAdding
              ? 'bg-green-600 text-white border-green-700'
              : 'bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-[#8B0000] hover:shadow-[#FFD700]/50 border-[#C41E3A]/30'
            }`}
        >
          {isAdding ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
              ></motion.div>
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </>
          )}
        </motion.button>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#C41E3A]/10 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  );
};

export default FestivalCard;
