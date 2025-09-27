import React, { useMemo, memo, useState } from "react";
import Watch1 from '../assets/Watche/stylish-golden-watch-white-surface.jpg';
import Image from "next/image";
import { FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaPlus, FaMinus } from "react-icons/fa";

// Memoized product data to prevent unnecessary re-renders
const productsData = [
  { id: 1, name: "Hermès Kelly Red Watch 20mm", price: "4000.0 AED", info: "MOQ: 100 Pieces", image: Watch1, rating: 4.5, reviews: 24 },
  { id: 2, name: "Hermès Kelly Gold Watch 22mm", price: "4500.0 AED", info: "MOQ: 35 Pieces", image: Watch1, rating: 4.2, reviews: 18 },
  { id: 3, name: "Hermès Silver Classic Watch", price: "3800.0 AED", info: "MOQ: 80 Pieces", image: Watch1, rating: 4.8, reviews: 32 },
  { id: 4, name: "Hermès Black Leather Watch", price: "4200.0 AED", info: "MOQ: 50 Pieces", image: Watch1, rating: 4.3, reviews: 15 },
  { id: 5, name: "Hermès Blue Sapphire Watch", price: "4800.0 AED", info: "Sell: 120 Pieces", image: Watch1, rating: 4.7, reviews: 28 },
  { id: 6, name: "Hermès Rose Gold Elegant", price: "4600.0 AED", info: "Sell: 95 Pieces", image: Watch1, rating: 4.1, reviews: 22 },
  { id: 7, name: "Hermès Chronograph Sports", price: "3900.0 AED", info: "Sell: 75 Pieces", image: Watch1, rating: 4.6, reviews: 19 },
  { id: 8, name: "Hermès Limited Edition", price: "5200.0 AED", info: "Sell: 60 Pieces", image: Watch1, rating: 4.9, reviews: 35 },
  { id: 9, name: "Hermès Classic Brown Watch", price: "4100.0 AED", info: "Sell: 110 Pieces", image: Watch1, rating: 4.4, reviews: 26 },
  { id: 10, name: "Hermès White Ceramic Watch", price: "4400.0 AED", info: "Sell: 85 Pieces", image: Watch1, rating: 4.0, reviews: 14 },
  { id: 11, name: "Hermès Diamond Bezel Watch", price: "5800.0 AED", info: "Sell: 45 Pieces", image: Watch1, rating: 4.8, reviews: 30 },
  { id: 12, name: "Hermès Vintage Collection", price: "4700.0 AED", info: "Sell: 70 Pieces", image: Watch1, rating: 4.2, reviews: 17 },
];

// Star rating component
const StarRating = memo(({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-xs xs:text-sm" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-xs xs:text-sm" />);
    } else {
      stars.push(<FaStar key={i} className="text-gray-300 text-xs xs:text-sm" />);
    }
  }

  return <div className="flex space-x-0.5">{stars}</div>;
});

StarRating.displayName = 'StarRating';

// Quantity Selector Component
const QuantitySelector = memo(({ quantity, onQuantityChange, min = 1, max = 100 }) => {
  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1 border border-gray-200">
      <button
        onClick={handleDecrement}
        disabled={quantity <= min}
        className="w-6 h-6 xs:w-7 xs:h-7 flex items-center justify-center rounded-md bg-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        aria-label="Decrease quantity"
      >
        <FaMinus className="text-gray-600 text-xs" />
      </button>
      
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="w-8 xs:w-10 text-center bg-transparent border-none text-xs xs:text-sm font-semibold text-gray-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      
      <button
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="w-6 h-6 xs:w-7 xs:h-7 flex items-center justify-center rounded-md bg-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        aria-label="Increase quantity"
      >
        <FaPlus className="text-gray-600 text-xs" />
      </button>
    </div>
  );
});

QuantitySelector.displayName = 'QuantitySelector';

// Single product card component to prevent re-renders
const ProductCard = memo(({ product, onAddToCart, onToggleWishlist, isInWishlist }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
    // Reset quantity after adding to cart
    setQuantity(1);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl p-3 xs:p-4 flex flex-col relative transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Wishlist Button (Top-right corner) */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-2 xs:top-3 right-2 xs:right-3 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 xs:p-2 shadow-md transition-all duration-200 hover:scale-110"
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isInWishlist ? (
          <FaHeart className="text-red-500 text-xs xs:text-sm" />
        ) : (
          <FaRegHeart className="text-gray-600 hover:text-red-500 text-xs xs:text-sm" />
        )}
      </button>

      {/* Product Image */}
      <div className="relative mb-3 xs:mb-4 rounded-lg overflow-hidden">
        {!imageLoaded && (
          <div className="w-full h-32 xs:h-36 sm:h-40 md:h-44 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
        )}
        <Image
          src={product.image}
          alt={product.name}
          className={`w-full h-32 xs:h-36 sm:h-40 md:h-44 object-contain transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Product Name */}
      <h3 className="text-xs xs:text-sm md:text-base text-gray-800 mb-1 font-semibold line-clamp-2 leading-tight min-h-[2.5rem]">
        {product.name}
      </h3>

      {/* Rating and Reviews */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-600 ml-1">({product.reviews})</span>
        </div>
      </div>

      {/* Product Price */}
      <p className="text-base xs:text-lg md:text-xl font-bold text-gray-900 mb-1">
        {product.price}
      </p>

      {/* Product Info */}
      <p className="text-xs xs:text-sm text-gray-600 mb-3 xs:mb-4 font-medium">{product.info}</p>

      {/* Quantity Selector and Add to Cart Button */}
      <div className="mt-auto space-y-2 xs:space-y-3">
        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
          <span className="text-xs xs:text-sm text-gray-600 font-medium">Quantity:</span>
          <QuantitySelector 
            quantity={quantity} 
            onQuantityChange={handleQuantityChange}
            min={1}
            max={100}
          />
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] hover:from-[#16487a] hover:to-[#005099] text-white py-2 xs:py-2.5 px-3 xs:px-4 rounded-xl font-semibold text-xs xs:text-sm transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center space-x-2"
          aria-label={`Add ${quantity} ${product.name} to cart`}
        >
          <FaShoppingCart className="text-xs xs:text-sm" />
          <span>Add to Cart ({quantity})</span>
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

const Watch = () => {
  // Memoize the products data
  const products = useMemo(() => productsData, []);
  
  // State for wishlist and cart
  const [wishlist, setWishlist] = useState(new Set());
  const [cart, setCart] = useState([]);

  // Handle add to cart with quantity
  const handleAddToCart = (product, quantity) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    
    // Show feedback (you can replace this with a toast notification)
    console.log(`Added ${quantity} ${product.name} to cart`);
  };

  // Handle toggle wishlist
  const handleToggleWishlist = (productId) => {
    setWishlist(prevWishlist => {
      const newWishlist = new Set(prevWishlist);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => wishlist.has(productId);

  // Calculate total items in cart
  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-6 xs:py-8 sm:py-12">
      {/* Section Title */}
      <div className="text-center mb-8 xs:mb-10 sm:mb-12">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] bg-clip-text text-transparent mb-2">
          Just For You
        </h2>
        <p className="text-gray-600 text-sm xs:text-base max-w-2xl mx-auto px-4">
          Discover our exclusive collection of premium watches crafted with precision and elegance
        </p>
      </div>

      {/* Product Grid - Two columns on mobile, responsive layout */}
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">
        <div className="grid gap-3 xs:gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isInWishlist={isInWishlist(product.id)}
            />
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      {totalItemsInCart > 0 && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 py-2 rounded-full shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <FaShoppingCart />
            <span className="text-sm font-semibold">
              {totalItemsInCart} {totalItemsInCart === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Watch);