import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Sparkles, Plus, Minus } from 'lucide-react';

const SweetCard = ({ sweet, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState('500'); // Weight as string for better input handling
  const [weightUnit, setWeightUnit] = useState('grams'); // 'kg' or 'grams'
  const isKgItem = sweet.unit === 'kg';

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityInputChange = (e) => {
    const value = e.target.value;
    // Allow empty input and numeric values only
    if (value === '' || /^\d+$/.test(value)) {
      setQuantity(value === '' ? '' : parseInt(value));
    }
  };

  const handleWeightChange = (e) => {
    const value = e.target.value;
    // Allow empty input and numeric values only
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setWeight(value);
    }
  };

  const handleWeightUnitChange = (e) => {
    setWeightUnit(e.target.value);
  };

  // Convert weight to kg for calculation
  const getWeightInKg = () => {
    const numWeight = parseFloat(weight) || 0;
    return weightUnit === 'kg' ? numWeight : numWeight / 1000;
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    const finalWeight = isKgItem ? getWeightInKg() : quantity;
    onAddToCart(sweet, finalWeight);
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
      setWeight('500');
      setWeightUnit('grams');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card-premium overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          src={sweet.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23FFD700" width="400" height="300"/%3E%3Ctext fill="%230D0D0D" font-size="24" font-weight="bold" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E🍬 Sweet%3C/text%3E%3C/svg%3E'}
          alt={sweet.name}
          className="w-full h-48 sm:h-52 md:h-56 object-cover"
          onError={(e) => {
            console.error('❌ Image load error for:', sweet.name);
            console.error('Image data:', {
              hasImage: !!sweet.image,
              imageLength: sweet.image?.length,
              imageStart: sweet.image?.substring(0, 100),
              isBase64: sweet.image?.startsWith('data:image/')
            });
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23FFD700" width="400" height="300"/%3E%3Ctext fill="%230D0D0D" font-size="24" font-weight="bold" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E🍬 Sweet%3C/text%3E%3C/svg%3E';
          }}
          onLoad={() => {
            console.log('✅ Image loaded successfully for:', sweet.name);
          }}
        />
        
        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-[#FFD700] mb-2 truncate font-['Playfair_Display']">
          {sweet.name}
        </h3>
        
        {/* Description */}
        <p className="text-[#F5F5DC]/70 text-sm mb-4 line-clamp-2 leading-relaxed">
          {sweet.description}
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent mb-4"></div>
        
        {/* Price Display */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <div className="text-xs text-[#F5F5DC]/50">Price</div>
            <div className="text-xl font-bold text-gold-gradient">₹{sweet.rate}/{sweet.unit === 'piece' ? 'piece' : 'kg'}</div>
          </div>
        </div>

        {/* Quantity/Weight Selector */}
        <div className="flex items-center justify-center mb-4 -mx-4">
          {isKgItem ? (
            // Weight input for kg items
            <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-full px-8 py-3 justify-center min-w-full whitespace-nowrap overflow-hidden">
              <label className="text-xs text-[#F5F5DC]/70">Weight:</label>
              
              {/* Weight input field */}
              <input
                type="text"
                value={weight}
                onChange={handleWeightChange}
                placeholder="0"
                className="w-16 bg-[#2A2A2A] text-[#FFD700] text-center rounded px-2 py-1 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              />
              
              {/* Unit selector */}
              <select
                value={weightUnit}
                onChange={handleWeightUnitChange}
                className="bg-[#2A2A2A] text-[#FFD700] rounded px-2 py-1 font-bold focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-xs"
              >
                <option value="grams">grams</option>
                <option value="kg">kg</option>
              </select>
              
              <span className="text-xs text-[#F5F5DC]/50">
                ≈ ₹{weight === '' ? '0.00' : (sweet.rate * getWeightInKg()).toFixed(2)}
              </span>
            </div>
          ) : (
            // Quantity selector for piece items
            <div className="flex items-center justify-center gap-2 bg-[#1A1A1A] rounded-full px-4 py-2 w-full">
              <label className="text-sm text-[#F5F5DC]/70">Piece:</label>
              
              {/* Quantity input field */}
              <input
                type="text"
                value={quantity}
                onChange={handleQuantityInputChange}
                placeholder="0"
                className="w-16 bg-[#2A2A2A] text-[#FFD700] text-center rounded px-2 py-1 font-bold focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              />
              
              <span className="text-xs text-[#F5F5DC]/50">
                ≈ ₹{quantity === '' ? '0.00' : (sweet.rate * (quantity || 0)).toFixed(2)}
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
          className={`w-full btn-premium flex items-center justify-center py-3 px-6 rounded-full font-bold transition-all duration-300 shadow-lg text-sm sm:text-base ${
            isAdding
              ? 'bg-green-600 text-white'
              : 'bg-gradient-to-r from-[#FFD700] to-[#D2691E] text-[#0D0D0D] hover:shadow-[#FFD700]/50'
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
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#FFD700]/10 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  );
};

export default SweetCard;