/**
 * Domain-Specific React 18 Application Generators
 * Generates rich, fully interactive applications tailored specifically to user domains:
 * - E-Commerce: Shopping cart, category filters, quick view, checkout flow, promo codes
 * - Restaurant: Dynamic menu categories, dietary tags, table reservation booking modal
 * - Portfolio: Case studies, project filter tabs, live demo modals, inquiry form with budget
 * - Fitness: Day-by-day class schedule booking, interactive BMI calculator, coach showcase
 * - SaaS: Live KPI analytics dashboard, time range switcher, feature tabs, billing toggle
 */

const generateEcommerceAppJsx = ({ brand, tagline, subline, primary, secondary, accentGradient }) => {
  return `import React, { useState, useMemo } from 'react';

export default function App() {
  const accentGradient = '${accentGradient}';

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [wishlist, setWishlist] = useState([]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const categories = ['All', 'Footwear', 'Apparel', 'Accessories', 'Audio & Tech'];

  const products = [
    {
      id: 1,
      name: 'Vanguard Runner Pro X',
      category: 'Footwear',
      price: 189,
      originalPrice: 229,
      rating: 4.9,
      reviews: 142,
      badge: 'Best Seller',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      description: 'Ultralight carbon-infused midsole engineered for explosive energy return and marathon-grade endurance.'
    },
    {
      id: 2,
      name: 'AeroShell Rain Shell Jacket',
      category: 'Apparel',
      price: 245,
      originalPrice: 295,
      rating: 4.8,
      reviews: 98,
      badge: 'Weatherproof',
      image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80',
      description: 'Three-layer waterproof breathable membrane with taped seams and minimalist Japanese silhouette.'
    },
    {
      id: 3,
      name: 'SonicCraft Studio ANC Headphones',
      category: 'Audio & Tech',
      price: 320,
      originalPrice: 380,
      rating: 5.0,
      reviews: 215,
      badge: 'Editor Choice',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      description: 'Custom 45mm beryllium drivers with hybrid active noise cancellation and 40-hour battery reserve.'
    },
    {
      id: 4,
      name: 'Nomad Modular Daypack 28L',
      category: 'Accessories',
      price: 165,
      originalPrice: 195,
      rating: 4.7,
      reviews: 84,
      badge: 'Trending',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      description: 'Cordura ballistic nylon construction with weatherproof YKK zippers and magnetic quick-access latch.'
    },
    {
      id: 5,
      name: 'Chronos Titanium Chronograph',
      category: 'Accessories',
      price: 450,
      originalPrice: 520,
      rating: 4.9,
      reviews: 164,
      badge: 'Limited Drop',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      description: 'Grade 5 aerospace titanium chassis with sapphire crystal glass and Japanese automatic movement.'
    },
    {
      id: 6,
      name: 'Stealth Knit Merino Hoodie',
      category: 'Apparel',
      price: 135,
      originalPrice: 160,
      rating: 4.8,
      reviews: 112,
      badge: 'Eco-Crafted',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      description: '100% superfine Australian merino wool. Naturally odor-resistant, thermo-regulating, and tailored fit.'
    },
    {
      id: 7,
      name: 'Apex Mechanical Studio Keyboard',
      category: 'Audio & Tech',
      price: 195,
      originalPrice: 225,
      rating: 4.9,
      reviews: 73,
      badge: 'Hot Drop',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      description: 'Gasket-mounted hot-swappable switches with CNC anodized aluminum frame and PBT doubleshot keycaps.'
    },
    {
      id: 8,
      name: 'Solace Leather Minimalist Cardholder',
      category: 'Accessories',
      price: 55,
      originalPrice: 70,
      rating: 4.6,
      reviews: 95,
      badge: 'Handcrafted',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      description: 'Full-grain vegetable tanned Italian leather with RFID protection sleeve and hand-waxed edges.'
    }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    triggerToast(\`Added \${product.name} to your cart\`);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    triggerToast('Removed item from cart');
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(item => item !== id) : [...prev, id];
      triggerToast(exists ? 'Removed from favorites' : 'Saved to favorites');
      return next;
    });
  };

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SAVE20') {
      setDiscountPercent(20);
      triggerToast('Promo applied! 20% discount activated');
    } else if (promoCode.trim().toUpperCase() === 'WELCOME10') {
      setDiscountPercent(10);
      triggerToast('Promo applied! 10% discount activated');
    } else {
      triggerToast('Invalid promo code. Try SAVE20');
    }
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const rawSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * (discountPercent / 100));
  const shippingFee = rawSubtotal > 150 || rawSubtotal === 0 ? 0 : 15;
  const grandTotal = rawSubtotal - discountAmount + shippingFee;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600/95 backdrop-blur-md text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-indigo-400/30 flex items-center gap-2 animate-bounce">
          <span>🛍️</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-indigo-900/60 border-b border-indigo-500/20 text-center py-2 px-4 text-[11px] font-medium text-indigo-200">
        <span>✨ Seasonal Drop Active: Free Worldwide Express Shipping on orders over $150 • Use code <span className="font-bold underline text-white">SAVE20</span></span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#07090e]/85 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr ${accentGradient} flex items-center justify-center font-extrabold text-white text-base shadow-lg shadow-indigo-500/25">
              ${brand.charAt(0)}
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block leading-tight">${brand}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Flagship Store</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
            <input
              type="text"
              placeholder="Search premium goods, footwear, apparel..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-2 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white">
                ✕
              </button>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerToast(\`Wishlist has \${wishlist.length} saved items\`)}
              className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
            >
              <span>❤️</span>
              <span className="hidden sm:inline font-medium">Saved</span>
              {wishlist.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 px-4 rounded-xl bg-gradient-to-r ${accentGradient} hover:opacity-95 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all"
            >
              <span>🛒</span>
              <span>Cart</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                {totalItemsCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative py-20 px-6 overflow-hidden border-b border-white/[0.06] bg-gradient-to-b from-[#0b0e17] to-[#07090e]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-6">
              <span>🔥 New Season Collection Drop</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
              Elevated Essentials.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r ${accentGradient}">Engineered for Motion.</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
              ${subline}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => { setActiveCategory('All'); triggerToast('Browsing entire catalog'); }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r ${accentGradient} text-white font-semibold text-xs shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
              >
                Explore Catalog (8 Items)
              </button>
              <button
                onClick={() => { setActiveCategory('Footwear'); triggerToast('Filtered by Footwear'); }}
                className="px-6 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white font-semibold text-xs transition-all"
              >
                Shop Footwear
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr ${accentGradient} opacity-20 blur-[100px] rounded-full" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/[0.02]">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
                alt="Featured Sneaker"
                className="w-full h-[380px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#07090e]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Spotlight Drop</span>
                  <h4 className="text-sm font-bold text-white">Vanguard Runner Pro X</h4>
                  <span className="text-xs text-slate-300 font-semibold">$189 <span className="line-through text-slate-500 ml-1">$229</span></span>
                </div>
                <button
                  onClick={() => addToCart(products[0])}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
                >
                  Quick Add +
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Search Bar */}
      <section className="py-8 px-6 border-b border-white/[0.06] bg-[#090c14] sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={\`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 \${activeCategory === cat ? 'bg-gradient-to-r ' + accentGradient + ' text-white shadow-md shadow-indigo-500/20' : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'}\`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Showing <span className="text-white font-bold">{filteredProducts.length}</span> curated items
          </div>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex-1 w-full">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.02] border border-white/5 rounded-2xl">
            <span className="text-4xl mb-4 block">🔍</span>
            <h3 className="text-lg font-bold text-white mb-2">No matching items found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">Try searching for footwear, jacket, headphones, keyboard, or switch categories.</p>
            <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const isFav = wishlist.includes(product.id);
              return (
                <div key={product.id} className="group relative rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-indigo-500/40 p-3 flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
                  <div className="relative rounded-xl overflow-hidden mb-4 bg-slate-900 aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-[#07090e]/80 backdrop-blur-md text-white border border-white/10">
                      {product.badge}
                    </span>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={\`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center text-xs transition-all \${isFav ? 'bg-rose-500 text-white' : 'bg-[#07090e]/80 text-slate-300 hover:text-white'}\`}
                    >
                      {isFav ? '❤️' : '🤍'}
                    </button>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="absolute inset-x-3 bottom-3 py-2 rounded-lg bg-[#07090e]/90 backdrop-blur-md text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-center border border-white/10 shadow-lg"
                    >
                      Quick View 👁️
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>{product.category}</span>
                      <span className="text-amber-400 font-bold">★ {product.rating} <span className="text-slate-500">({product.reviews})</span></span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-white">\${product.price}</span>
                        <span className="text-xs text-slate-500 line-through ml-1.5">\${product.originalPrice}</span>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
                      >
                        Add to Cart +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Trust Badges */}
      <section className="border-t border-white/[0.06] bg-[#090b12] py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-2xl mb-2 block">✈️</span>
            <h4 className="text-xs font-bold text-white mb-1">Global Free Shipping</h4>
            <p className="text-[11px] text-slate-400">On all orders over $150</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-2xl mb-2 block">🔄</span>
            <h4 className="text-xs font-bold text-white mb-1">30-Day Free Returns</h4>
            <p className="text-[11px] text-slate-400">Hassle-free exchange policy</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-2xl mb-2 block">🛡️</span>
            <h4 className="text-xs font-bold text-white mb-1">2-Year Official Warranty</h4>
            <p className="text-[11px] text-slate-400">Master-grade craftsmanship</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-2xl mb-2 block">🔒</span>
            <h4 className="text-xs font-bold text-white mb-1">256-Bit Encrypted Pay</h4>
            <p className="text-[11px] text-slate-400">Stripe & Apple Pay Certified</p>
          </div>
        </div>
      </section>

      {/* Slide-over Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#0a0d17] border-l border-white/10 p-6 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛒</span>
                  <h2 className="text-base font-bold text-white">Your Shopping Bag ({totalItemsCount})</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white p-1">
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <span className="text-4xl mb-3">🛍️</span>
                  <h3 className="text-sm font-bold text-white mb-1">Your bag is currently empty</h3>
                  <p className="text-xs text-slate-400 mb-6">Explore our curated collections and add your favorite gear.</p>
                  <button onClick={() => setIsCartOpen(false)} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto py-4 space-y-4 divide-y divide-white/[0.06]">
                    {cart.map(item => (
                      <div key={item.id} className="pt-4 flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-slate-800 shrink-0 border border-white/10" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          <span className="text-xs font-semibold text-indigo-300">\${item.price} each</span>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs">
                              -
                            </button>
                            <span className="text-xs font-bold text-white px-2">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs">
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-white block">\${item.price * item.quantity}</span>
                          <button onClick={() => removeFromCart(item.id)} className="text-[11px] text-rose-400 hover:text-rose-300 mt-2">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Box */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Enter Promo (e.g. SAVE20)"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                      <button onClick={applyPromo} className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors">
                        Apply
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>\${rawSubtotal}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-semibold">
                          <span>Discount ({discountPercent}%)</span>
                          <span>-\${discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{shippingFee === 0 ? <span className="text-emerald-400">FREE</span> : \`\$\${shippingFee}\`}</span>
                      </div>
                      <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                        <span>Total Due</span>
                        <span>\${grandTotal}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r ${accentGradient} text-white font-bold text-xs shadow-xl shadow-indigo-500/25 hover:opacity-95 transition-all text-center"
                    >
                      Proceed to Checkout (\${grandTotal}) →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#0c101d] border border-white/15 rounded-2xl p-6 shadow-2xl overflow-hidden">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">
              ✕
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-64 md:h-full object-cover rounded-xl border border-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-1">{selectedProduct.category}</span>
                <h3 className="text-xl font-bold text-white mb-2">{selectedProduct.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-amber-400 text-xs font-bold">★ {selectedProduct.rating}</span>
                  <span className="text-slate-400 text-xs">({selectedProduct.reviews} verified reviews)</span>
                </div>
                <div className="mb-4">
                  <span className="text-2xl font-extrabold text-white">\${selectedProduct.price}</span>
                  <span className="text-xs text-slate-500 line-through ml-2">\${selectedProduct.originalPrice}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">{selectedProduct.description}</p>
                <div className="mt-auto space-y-3">
                  <button
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r ${accentGradient} text-white font-bold text-xs shadow-lg shadow-indigo-500/25"
                  >
                    Add to Cart Now +
                  </button>
                  <button
                    onClick={() => { toggleWishlist(selectedProduct.id); }}
                    className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold"
                  >
                    {wishlist.includes(selectedProduct.id) ? 'Saved in Wishlist ❤️' : 'Save to Wishlist 🤍'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0c101d] border border-white/15 rounded-2xl p-6 shadow-2xl">
            {orderPlaced ? (
              <div className="text-center py-8">
                <span className="text-5xl mb-4 block animate-bounce">🎉</span>
                <h3 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h3>
                <p className="text-xs text-slate-300 mb-4">Your order <span className="font-mono text-indigo-400 font-bold">#ORD-94821</span> has been placed successfully.</p>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-400 mb-6">
                  Confirmation email and live tracking updates dispatched to your address.
                </div>
                <button
                  onClick={() => { setOrderPlaced(false); setIsCheckoutOpen(false); setCart([]); setDiscountPercent(0); }}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Return to Store
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>💳</span> Express Checkout
                  </h3>
                  <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-3 mb-6 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Full Name</label>
                    <input type="text" defaultValue="Alex Mercer" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Shipping Address</label>
                    <input type="text" defaultValue="742 Evergreen Terrace, Suite 400" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Card Number</label>
                      <input type="text" defaultValue="•••• •••• •••• 4242" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white font-mono" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Expiry & CVC</label>
                      <input type="text" defaultValue="12/28 • 888" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white font-mono" />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 mb-6 flex justify-between items-center text-xs">
                  <span className="text-slate-300">Total Charged</span>
                  <span className="text-base font-extrabold text-white">\${grandTotal}</span>
                </div>

                <button
                  onClick={() => setOrderPlaced(true)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r ${accentGradient} text-white font-bold text-xs shadow-xl shadow-indigo-500/25"
                >
                  Pay \${grandTotal} & Place Order ✨
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#05070a] py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">${brand}</span>
            <span>—</span>
            <span>${tagline}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Shipping & Returns</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="text-emerald-400">● 100% Secure Checkout</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
`;
};

const generateRestaurantAppJsx = ({ brand, tagline, subline, primary, secondary, accentGradient }) => {
  return `import React, { useState } from 'react';

export default function App() {
  const accentGradient = '${accentGradient}';

  const [activeCategory, setActiveCategory] = useState('Chef Specials');
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [reservationConfirmed, setReservationConfirmed] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedDish, setSelectedDish] = useState(null);

  const [resData, setResData] = useState({
    date: 'Today, 7:30 PM',
    guests: '2 Guests',
    seating: 'Main Dining Room',
    name: 'Sarah Jenkins',
    phone: '+1 (555) 234-5678',
    special: 'Anniversary celebration'
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const categories = ['Chef Specials', 'Artisanal Starters', 'Handmade Pasta & Mains', 'Wood-Fired Pizza', 'Dolci & Fine Wines'];

  const menuItems = [
    {
      id: 1,
      name: 'Truffle Tagliolini al Burro',
      category: 'Chef Specials',
      price: '$38',
      tags: ['Chef Signature', 'Vegetarian'],
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
      description: 'Hand-rolled egg pasta ribboned with Normandy cultured butter and freshly shaved Norcia black truffles.'
    },
    {
      id: 2,
      name: 'Pan-Seared Mediterranean Sea Bass',
      category: 'Chef Specials',
      price: '$44',
      tags: ['Gluten-Free', 'Wild Caught'],
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
      description: 'Crispy skin branzino resting over saffron fennel purée, blistered heirloom tomatoes, and caper emulsion.'
    },
    {
      id: 3,
      name: 'Burrata Pugliese & Prosciutto',
      category: 'Artisanal Starters',
      price: '$24',
      tags: ['Artisanal', 'Cold Cut'],
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d69109854?auto=format&fit=crop&w=800&q=80',
      description: 'Creamy burrata heart with 24-month aged Prosciutto di Parma, grilled sourdough, and organic fig balsamic glaze.'
    },
    {
      id: 4,
      name: 'Charred Spanish Octopus',
      category: 'Artisanal Starters',
      price: '$26',
      tags: ['Gluten-Free', 'Wood Fired'],
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      description: 'Tender braised octopus finished over charcoal with fingerling potatoes, smoked paprika aioli, and pickled shallots.'
    },
    {
      id: 5,
      name: 'Slow-Braised Prime Short Rib',
      category: 'Handmade Pasta & Mains',
      price: '$46',
      tags: ['Grass Fed', 'Hearty'],
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      description: '12-hour Barolo reduction with creamy mascarpone polenta, glazed baby carrots, and gremolata.'
    },
    {
      id: 6,
      name: 'Margherita Verace D.O.P.',
      category: 'Wood-Fired Pizza',
      price: '$22',
      tags: ['Classic', 'Vegetarian'],
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
      description: '72-hour fermented dough, San Marzano tomato pulp, Buffalo mozzarella, hand-torn basil, and extra virgin olive oil.'
    },
    {
      id: 7,
      name: 'Tartufo & Wild Funghi Pizza',
      category: 'Wood-Fired Pizza',
      price: '$27',
      tags: ['White Sauce', 'Specialty'],
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      description: 'Fontina, roasted cremini and chanterelles, white truffle crema, fresh thyme, and smoked sea salt.'
    },
    {
      id: 8,
      name: 'Classic Espresso Tiramisù',
      category: 'Dolci & Fine Wines',
      price: '$16',
      tags: ['House Made', 'Dessert'],
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
      description: 'Savoiardi sponge soaked in single-origin espresso and dark rum with light zabaglione mascarpone foam.'
    }
  ];

  const filteredItems = menuItems.filter(item => activeCategory === 'All' || item.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0d0b09] text-[#fefce8] flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-600 text-black font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <span>🍽️</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0d0b09]/90 backdrop-blur-xl border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center font-serif text-black font-extrabold text-lg shadow-lg shadow-amber-500/20">
              ${brand.charAt(0)}
            </div>
            <div>
              <span className="font-serif text-xl tracking-tight text-amber-100 font-bold block leading-tight">${brand}</span>
              <span className="text-[10px] text-amber-400/80 uppercase tracking-widest font-semibold">Artisanal Kitchen & Wine Bar</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-amber-200/70">
            <a href="#menu" className="hover:text-amber-400 transition-colors">Menu</a>
            <a href="#story" className="hover:text-amber-400 transition-colors">Our Philosophy</a>
            <a href="#wine" className="hover:text-amber-400 transition-colors">Cellar List</a>
            <a href="#hours" className="hover:text-amber-400 transition-colors">Hours & Location</a>
          </nav>

          <button
            onClick={() => setReservationModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
          >
            Book a Table 🍷
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-28 px-6 text-center border-b border-amber-900/20 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/40 via-[#0d0b09] to-[#0d0b09]">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            ★ Michelin Guide Selected 2026
          </span>
          <h1 className="font-serif text-4xl sm:text-7xl font-bold tracking-tight text-amber-50 mb-6 leading-[1.1]">
            ${tagline}
          </h1>
          <p className="text-amber-200/70 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            ${subline}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={() => setReservationModalOpen(true)}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs shadow-xl shadow-amber-500/25 hover:scale-105 transition-all"
            >
              Reserve an Evening
            </button>
            <a
              href="#menu"
              className="px-6 py-3.5 rounded-xl bg-white/[0.04] border border-amber-500/20 text-amber-200 font-semibold text-xs hover:bg-white/[0.08] transition-all"
            >
              Explore Seasonal Menu
            </a>
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section id="menu" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Curated Offerings</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-amber-100 mt-2">Autumn Tasting Menu</h2>
        </div>

        <div className="flex justify-center items-center gap-2 overflow-x-auto pb-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={\`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 \${activeCategory === cat ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/[0.03] text-amber-200/60 hover:text-white border border-amber-500/10'}\`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedDish(item)}
              className="group p-4 rounded-2xl bg-white/[0.02] border border-amber-500/15 hover:border-amber-500/40 flex gap-5 cursor-pointer transition-all duration-300 hover:bg-white/[0.04]"
            >
              <img src={item.image} alt={item.name} className="w-28 h-28 rounded-xl object-cover shrink-0 border border-amber-500/20 group-hover:scale-105 transition-transform" />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif text-lg font-bold text-amber-100 group-hover:text-amber-400 transition-colors">{item.name}</h3>
                    <span className="font-mono text-base font-bold text-amber-400">{item.price}</span>
                  </div>
                  <p className="text-xs text-amber-200/60 leading-relaxed mb-3">{item.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reservation Modal */}
      {reservationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#14100c] border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
            {reservationConfirmed ? (
              <div className="text-center py-8">
                <span className="text-5xl mb-4 block">🥂</span>
                <h3 className="font-serif text-2xl font-bold text-amber-100 mb-2">Table Confirmed</h3>
                <p className="text-xs text-amber-200/70 mb-4">We look forward to welcoming you for <span className="text-amber-400 font-bold">{resData.guests}</span> on <span className="text-amber-400 font-bold">{resData.date}</span>.</p>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-amber-500/20 text-xs text-amber-200/80 mb-6 font-mono">
                  Reservation Reference: #TBL-7729
                </div>
                <button
                  onClick={() => { setReservationConfirmed(false); setReservationModalOpen(false); }}
                  className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-xs"
                >
                  Close & Return
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-4">
                  <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
                    <span>🍷</span> Table Reservation
                  </h3>
                  <button onClick={() => setReservationModalOpen(false)} className="text-amber-400/60 hover:text-white">✕</button>
                </div>

                <div className="space-y-3 mb-6 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-amber-300/80 mb-1">Guests</label>
                      <select
                        value={resData.guests}
                        onChange={e => setResData({ ...resData, guests: e.target.value })}
                        className="w-full bg-white/[0.04] border border-amber-500/20 rounded-xl px-3 py-2 text-amber-100"
                      >
                        <option value="2 Guests">2 Guests (Intimate)</option>
                        <option value="4 Guests">4 Guests</option>
                        <option value="6 Guests">6 Guests</option>
                        <option value="8+ Private Dining">8+ Private Dining</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-amber-300/80 mb-1">Seating Area</label>
                      <select
                        value={resData.seating}
                        onChange={e => setResData({ ...resData, seating: e.target.value })}
                        className="w-full bg-white/[0.04] border border-amber-500/20 rounded-xl px-3 py-2 text-amber-100"
                      >
                        <option value="Main Dining Room">Main Dining Room</option>
                        <option value="Candlelit Courtyard">Candlelit Courtyard</option>
                        <option value="Chef Counter">Chef's Tasting Counter</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-amber-300/80 mb-1">Date & Preferred Time</label>
                    <input
                      type="text"
                      value={resData.date}
                      onChange={e => setResData({ ...resData, date: e.target.value })}
                      className="w-full bg-white/[0.04] border border-amber-500/20 rounded-xl px-3 py-2 text-amber-100"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-300/80 mb-1">Contact Name & Phone</label>
                    <input
                      type="text"
                      value={resData.name}
                      onChange={e => setResData({ ...resData, name: e.target.value })}
                      className="w-full bg-white/[0.04] border border-amber-500/20 rounded-xl px-3 py-2 text-amber-100"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setReservationConfirmed(true)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Confirm Table Reservation 🥂
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer id="hours" className="border-t border-amber-900/30 bg-[#090705] py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-amber-200/60">
          <div>
            <span className="font-serif font-bold text-amber-200 text-sm block">${brand}</span>
            <span>42 Via Condotti, Culinary District • Valet Available</span>
          </div>
          <div className="text-center md:text-right">
            <span>Dinner Service: Tue - Sun, 5:30 PM - 11:00 PM</span>
            <span className="block text-amber-400 font-semibold mt-1">Reservations: (555) 948-2940</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
`;
};

const generatePortfolioAppJsx = ({ brand, tagline, subline, primary, secondary, accentGradient }) => {
  return `import React, { useState } from 'react';

export default function App() {
  const accentGradient = '${accentGradient}';

  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const categories = ['All', 'Full-Stack Apps', 'Mobile UX', 'AI Systems', 'Design Systems'];

  const projects = [
    {
      id: 1,
      title: 'NeuralFlow — AI Canvas & Inference Engine',
      category: 'AI Systems',
      role: 'Lead Architect',
      metric: '+340% Latency Reduction',
      tags: ['React 18', 'WebAssembly', 'Python', 'WebSockets'],
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      description: 'Zero-latency visual canvas for orchestrating multi-agent AI pipelines with real-time memory state propagation.'
    },
    {
      id: 2,
      title: 'Aura Financial — Cross-Border Treasury Protocol',
      category: 'Full-Stack Apps',
      role: 'Staff Frontend Engineer',
      metric: '$4.2B Volume Processed',
      tags: ['TypeScript', 'Next.js', 'Tailwind', 'Go'],
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
      description: 'Institutional-grade asset management interface with automated yield optimization and multi-signature security.'
    },
    {
      id: 3,
      title: 'Pulse Athletics — Bio-Metric Sensor Suite',
      category: 'Mobile UX',
      role: 'Principal Designer',
      metric: '4.9★ App Store (80k+)',
      tags: ['React Native', 'Swift', 'Micro-Interactions'],
      image: 'https://images.unsplash.com/photo-1510519138161-584462329710?auto=format&fit=crop&w=800&q=80',
      description: 'Continuous biometric tracking companion with predictive recovery analytics and adaptive workout guidance.'
    },
    {
      id: 4,
      title: 'Vanguard Design System & Core Token Engine',
      category: 'Design Systems',
      role: 'System Architect',
      metric: 'Adopted by 40+ Teams',
      tags: ['Tailwind', 'Storybook', 'Figma API', 'Accessible'],
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      description: 'Cross-platform design token pipeline delivering automated contrast validation and fluid typography scales.'
    }
  ];

  const filteredProjects = projects.filter(p => activeFilter === 'All' || p.category === activeFilter);

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <span>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#060810]/85 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr ${accentGradient} flex items-center justify-center font-extrabold text-white text-base shadow-lg shadow-cyan-500/20">
              ${brand.charAt(0)}
            </div>
            <div>
              <span className="font-bold text-lg text-white block leading-tight">${brand}</span>
              <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Creative Technologist</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available for Q4 Projects
            </span>
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r ${accentGradient} text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-6 border-b border-white/[0.06] bg-gradient-to-b from-[#090e1a] to-[#060810]">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-cyan-300 font-mono mb-6">
            <span>🚀 Engineering High-Impact Web Applications</span>
          </div>
          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            ${tagline}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mb-10 leading-relaxed">
            ${subline}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#work" className="px-6 py-3.5 rounded-xl bg-gradient-to-r ${accentGradient} text-white font-bold text-xs shadow-xl shadow-cyan-500/20">
              View Case Studies (4 Shipped)
            </a>
            <button onClick={() => triggerToast('Email copied to clipboard: alex@studio.dev')} className="px-6 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-semibold text-xs hover:bg-white/[0.08]">
              Copy Email Address
            </button>
          </div>
        </div>
      </section>

      {/* Work Grid */}
      <section id="work" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">Selected Projects</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Featured Architecture & Work</h2>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={\`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all \${activeFilter === cat ? 'bg-gradient-to-r ' + accentGradient + ' text-white shadow-md' : 'bg-white/[0.04] text-slate-400 hover:text-white'}\`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map(proj => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="group rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/40 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 left-4 text-[10px] font-bold font-mono px-2.5 py-1 rounded-md bg-[#060810]/80 backdrop-blur-md text-cyan-300 border border-white/10">
                  {proj.metric}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">{proj.category} • {proj.role}</span>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{proj.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{proj.description}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                  {proj.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Study Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0c1222] border border-white/15 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">{selectedProject.category}</span>
                <h3 className="text-xl font-bold text-white">{selectedProject.title}</h3>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-56 object-cover rounded-xl mb-4 border border-white/10" />
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{selectedProject.description}</p>
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200 font-mono mb-6">
              Verified Production Impact: {selectedProject.metric}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setSelectedProject(null)} className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold">
                Close
              </button>
              <button onClick={() => triggerToast('Launching live sandbox demonstration...')} className="px-5 py-2 rounded-xl bg-gradient-to-r ${accentGradient} text-white text-xs font-bold shadow-md">
                Launch Live Demo ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form */}
      <section id="contact" className="py-20 px-6 border-t border-white/[0.06] bg-[#080c16]">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">Let's Collaborate</span>
          <h2 className="text-3xl font-extrabold text-white mt-1 mb-8">Ready to Build Something Incredible?</h2>
          {inquirySent ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-3xl mb-2 block">📬</span>
              <h4 className="text-base font-bold text-white mb-1">Message Dispatched!</h4>
              <p className="text-xs text-slate-300">Thanks for reaching out. I typically reply within 12 business hours.</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setInquirySent(true); triggerToast('Inquiry received!'); }} className="space-y-4 text-left text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Your Name</label>
                <input type="text" required placeholder="Alex Rivera" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input type="email" required placeholder="alex@company.com" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Project Details</label>
                <textarea rows={3} required placeholder="Describe your product, timeline, and goals..." className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-white resize-none" />
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r ${accentGradient} text-white font-bold text-xs shadow-xl shadow-cyan-500/20">
                Send Project Inquiry →
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#04060b] py-8 px-6 mt-auto text-xs text-slate-500 text-center">
        <span>© 2026 ${brand} — Engineered with React 18 & Precision Design Systems.</span>
      </footer>
    </div>
  );
}
`;
};

const generateFitnessAppJsx = ({ brand, tagline, subline, primary, secondary, accentGradient }) => {
  return `import React, { useState } from 'react';

export default function App() {
  const accentGradient = '${accentGradient}';

  const [activeDay, setActiveDay] = useState('Monday');
  const [bookedClasses, setBookedClasses] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [billing, setBilling] = useState('monthly');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const classList = [
    { id: 1, day: 'Monday', name: 'Metabolic Conditioning (HIIT)', time: '06:30 AM', trainer: 'Coach Marcus', spots: 4, level: 'All Levels', cal: '650 kcal' },
    { id: 2, day: 'Monday', name: 'Olympic Barbell & Strength', time: '05:30 PM', trainer: 'Coach Elena', spots: 2, level: 'Advanced', cal: '520 kcal' },
    { id: 3, day: 'Tuesday', name: 'Endurance Row & Kettlebell Flow', time: '07:00 AM', trainer: 'Coach Liam', spots: 6, level: 'Intermediate', cal: '700 kcal' },
    { id: 4, day: 'Wednesday', name: 'CrossFit WOD: Murph Prep', time: '06:00 PM', trainer: 'Coach Marcus', spots: 3, level: 'Advanced', cal: '800 kcal' },
    { id: 5, day: 'Thursday', name: 'Athletic Mobility & Core Power', time: '07:30 AM', trainer: 'Coach Elena', spots: 8, level: 'All Levels', cal: '400 kcal' },
    { id: 6, day: 'Friday', name: 'Friday Night Fight & Boxing', time: '06:30 PM', trainer: 'Coach Liam', spots: 5, level: 'All Levels', cal: '750 kcal' },
    { id: 7, day: 'Saturday', name: 'Saturday Community Team Hero WOD', time: '09:00 AM', trainer: 'Coaches Elena & Marcus', spots: 12, level: 'All Levels', cal: '900 kcal' }
  ];

  const currentClasses = classList.filter(c => c.day === activeDay);

  const toggleBookClass = (id, name) => {
    setBookedClasses(prev => {
      const isBooked = prev.includes(id);
      if (isBooked) {
        triggerToast(\`Cancelled reservation for \${name}\`);
        return prev.filter(cId => cId !== id);
      } else {
        triggerToast(\`Reserved your spot for \${name}!\`);
        return [...prev, id];
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <span>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center font-extrabold text-white text-base shadow-lg shadow-rose-500/25">
              ${brand.charAt(0)}
            </div>
            <div>
              <span className="font-extrabold text-lg text-white block leading-tight tracking-tight">${brand}</span>
              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">High-Performance Training</span>
            </div>
          </div>

          <button
            onClick={() => triggerToast('7-Day VIP Guest Pass added to your account!')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-extrabold text-xs shadow-lg shadow-rose-500/25"
          >
            Claim 7-Day Pass 🔥
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-24 px-6 text-center border-b border-white/[0.06] bg-gradient-to-b from-[#120e10] to-[#09090b]">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-xs font-extrabold tracking-widest uppercase text-rose-400 mb-4 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
            ★ Elite Strength & Conditioning Facility
          </span>
          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.05]">
            ${tagline}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            ${subline}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#schedule" className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-extrabold text-xs shadow-xl shadow-rose-500/25">
              View Live Class Schedule
            </a>
            <a href="#pricing" className="px-6 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold text-xs hover:bg-white/[0.08]">
              Membership Passes
            </a>
          </div>
        </div>
      </section>

      {/* Class Schedule */}
      <section id="schedule" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Reserve Your Workout</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">Daily Training Schedule</h2>
        </div>

        <div className="flex justify-center items-center gap-2 overflow-x-auto pb-4 mb-8">
          {days.map(d => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 \${activeDay === d ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25' : 'bg-white/[0.03] text-slate-400 hover:text-white'}\`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {currentClasses.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              No classes scheduled on this day. Open gym hours: 06:00 AM - 10:00 PM.
            </div>
          ) : (
            currentClasses.map(c => {
              const booked = bookedClasses.includes(c.id);
              return (
                <div key={c.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-rose-400">{c.time}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/[0.05] text-slate-300">{c.level}</span>
                      <span className="text-[10px] text-amber-400 font-semibold">{c.cal}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{c.name}</h3>
                    <span className="text-xs text-slate-400">{c.trainer} • {c.spots} spots remaining</span>
                  </div>
                  <button
                    onClick={() => toggleBookClass(c.id, c.name)}
                    className={\`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 \${booked ? 'bg-emerald-600 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'}\`}
                  >
                    {booked ? 'Booked ✓' : 'Reserve Spot'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 border-t border-white/[0.06] bg-[#0c0c10]">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Transparent Memberships</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Simple Athletic Plans</h2>
          <div className="flex justify-center items-center gap-3 mt-6">
            <span className={\`text-xs \${billing === 'monthly' ? 'text-white font-bold' : 'text-slate-500'}\`}>Monthly</span>
            <button
              onClick={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 rounded-full bg-white/10 p-1 flex items-center transition-colors"
            >
              <div className={\`w-4 h-4 rounded-full bg-rose-500 transition-transform \${billing === 'annual' ? 'translate-x-6' : ''}\`} />
            </button>
            <span className={\`text-xs \${billing === 'annual' ? 'text-white font-bold' : 'text-slate-500'}\`}>Annual (Save 20%)</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col">
            <h3 className="text-lg font-bold text-white mb-1">Standard Athlete</h3>
            <span className="text-xs text-slate-400 mb-6">Full open gym access and recovery suite</span>
            <div className="text-3xl font-extrabold text-white mb-6">
              \${billing === 'monthly' ? '89' : '69'} <span className="text-xs text-slate-400">/ mo</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 mb-8 flex-1">
              <li>✓ Unlimited Open Facility Access</li>
              <li>✓ Locker Room & Sauna Access</li>
              <li>✓ 2 Free Guest Passes / Month</li>
            </ul>
            <button onClick={() => triggerToast('Selected Standard Athlete plan')} className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
              Choose Standard
            </button>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-b from-rose-950/30 to-white/[0.02] border border-rose-500/40 flex flex-col relative shadow-xl">
            <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-rose-500 text-white">
              Most Popular
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Unlimited Elite</h3>
            <span className="text-xs text-slate-400 mb-6">All coached classes, biometric testing, and recovery</span>
            <div className="text-3xl font-extrabold text-white mb-6">
              \${billing === 'monthly' ? '149' : '119'} <span className="text-xs text-slate-400">/ mo</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 mb-8 flex-1">
              <li>✓ Unlimited HIIT, CrossFit & Lifting Classes</li>
              <li>✓ Monthly InBody Bio-Metric Composition Scans</li>
              <li>✓ Cold Plunge & Infrared Sauna Suite</li>
              <li>✓ 24/7 Mobile App Reservation Access</li>
            </ul>
            <button onClick={() => triggerToast('Selected Unlimited Elite plan')} className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25">
              Start Unlimited Elite
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#050507] py-8 px-6 mt-auto text-xs text-slate-500 text-center">
        <span>© 2026 ${brand} — Relentless Strength & Performance.</span>
      </footer>
    </div>
  );
}
`;
};

const generateSaaSAppJsx = ({ brand, tagline, subline, primary, secondary, accentGradient }) => {
  return `import React, { useState } from 'react';

export default function App() {
  const accentGradient = '${accentGradient}';

  const [billing, setBilling] = useState('monthly');
  const [activeRange, setActiveRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeFaq, setActiveFaq] = useState(null);
  const [notification, setNotification] = useState('');

  const triggerToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const metricsByRange = {
    '24h': { arr: '$184,200', active: '12,480', latency: '12ms', ugrades: '+8.4%' },
    '7d': { arr: '$248,500', active: '48,920', latency: '14ms', ugrades: '+14.2%' },
    '30d': { arr: '$890,000', active: '142,800', latency: '13ms', ugrades: '+28.6%' },
    '1y': { arr: '$4.2M', active: '820,000', latency: '15ms', ugrades: '+140%' }
  };

  const currentMetrics = metricsByRange[activeRange];

  const features = [
    { title: 'Atomic State Engine', desc: 'Sub-millisecond data replication across 35 edge regions with zero conflict drift.', icon: '⚡' },
    { title: 'Neural Observability', desc: 'Predictive trace analytics and autonomous bottleneck remediation powered by LLM models.', icon: '📊' },
    { title: 'Hardware Key Encryption', desc: 'FIPS 140-3 Level 4 hardware encryption with automatic rotation and cryptographic verification.', icon: '🛡️' },
    { title: 'Zero-Downtime Pipeline', desc: 'Instant atomic rollbacks and canary deployments in under 1.2 seconds globally.', icon: '🚀' }
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-indigo-400/30 flex items-center gap-2">
          <span>✨</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#08090d]/85 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr ${accentGradient} flex items-center justify-center font-extrabold text-white text-sm shadow-lg shadow-indigo-500/20">
              ${brand.charAt(0)}
            </div>
            <span className="font-bold text-lg tracking-tight text-white">${brand}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">v2.4 Cloud</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
            <a href="#dashboard" className="hover:text-white transition-colors">Live Metrics</a>
            <a href="#features" className="hover:text-white transition-colors">Architecture</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <button onClick={() => triggerToast('Workspace demo provisioning...')} className="px-5 py-2.5 rounded-xl bg-gradient-to-r ${accentGradient} text-white font-bold text-xs shadow-lg shadow-indigo-500/25">
            Launch Sandbox →
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-6 text-center border-b border-white/[0.06] bg-gradient-to-b from-[#0e111d] to-[#08090d]">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-4 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            ★ Next-Generation Infrastructure
          </span>
          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.05]">
            ${tagline}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            ${subline}
          </p>
        </div>
      </section>

      {/* Live Dashboard Simulator */}
      <section id="dashboard" className="py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase font-bold">Interactive Telemetry</span>
              <h3 className="text-lg font-bold text-white">Live Cluster Performance</h3>
            </div>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10">
              {['24h', '7d', '30d', '1y'].map(range => (
                <button
                  key={range}
                  onClick={() => setActiveRange(range)}
                  className={\`px-3 py-1 rounded-lg text-xs font-bold transition-all \${activeRange === range ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}\`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-xs text-slate-400 block mb-1">Monthly Run-Rate</span>
              <span className="text-2xl font-extrabold text-white block">{currentMetrics.arr}</span>
              <span className="text-[11px] text-emerald-400 font-bold">{currentMetrics.ugrades} growth</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-xs text-slate-400 block mb-1">Active Cluster Nodes</span>
              <span className="text-2xl font-extrabold text-white block">{currentMetrics.active}</span>
              <span className="text-[11px] text-slate-400">99.999% SLA Uptime</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-xs text-slate-400 block mb-1">P99 Global Latency</span>
              <span className="text-2xl font-extrabold text-white block">{currentMetrics.latency}</span>
              <span className="text-[11px] text-emerald-400 font-bold">-4ms improvement</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-xs text-slate-400 block mb-1">Security Score</span>
              <span className="text-2xl font-extrabold text-white block">A+ 100/100</span>
              <span className="text-[11px] text-indigo-400 font-bold">SOC2 Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Core Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">Engineered for Massive Scale</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(f => (
            <div key={f.title} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-indigo-500/40 transition-colors">
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 border-t border-white/[0.06] bg-[#0a0c14]">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Transparent Plans</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Predictable Cloud Pricing</h2>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10">
            <h3 className="text-lg font-bold text-white mb-1">Pro Engineer</h3>
            <span className="text-xs text-slate-400 mb-6 block">For high-growth applications</span>
            <div className="text-3xl font-extrabold text-white mb-6">$49 <span className="text-xs text-slate-400">/ mo</span></div>
            <button onClick={() => triggerToast('Starting Pro Engineer sandbox')} className="w-full py-3 rounded-xl bg-white/10 text-white font-bold text-xs">
              Get Started Pro
            </button>
          </div>
          <div className="p-8 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-white/[0.02] border border-indigo-500/40 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-1">Enterprise Cluster</h3>
            <span className="text-xs text-slate-400 mb-6 block">Dedicated isolation and 24/7 SLA</span>
            <div className="text-3xl font-extrabold text-white mb-6">$149 <span className="text-xs text-slate-400">/ mo</span></div>
            <button onClick={() => triggerToast('Contacting Enterprise Solutions Architect')} className="w-full py-3 rounded-xl bg-gradient-to-r ${accentGradient} text-white font-bold text-xs">
              Deploy Enterprise
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#040508] py-8 px-6 mt-auto text-xs text-slate-500 text-center">
        <span>© 2026 ${brand} — The Intelligent Next-Gen Platform.</span>
      </footer>
    </div>
  );
}
`;
};

const generateRealEstateAppJsx = ({ brand, tagline, subline, primary, secondary, accentGradient }) => {
  return `import React, { useState, useMemo } from 'react';

export default function App() {
  const accentGradient = '${accentGradient}';

  const [activeCategory, setActiveCategory] = useState('All');
  const [priceMax, setPriceMax] = useState(12000000);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [tourConfirmed, setTourConfirmed] = useState(false);
  const [savedHomes, setSavedHomes] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // Mortgage Calculator state
  const [mortgagePrice, setMortgagePrice] = useState(4500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.2);
  const [loanTermYears, setLoanTermYears] = useState(30);

  const [tourForm, setTourForm] = useState({
    date: 'Thursday, Nov 5',
    time: '2:00 PM',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@luxury.com',
    phone: '+1 (555) 789-0123',
    vipChauffeur: true
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const categories = ['All', 'Modern Villas', 'Luxury Penthouses', 'Seaside Estates', 'Alpine Chalets'];

  const properties = [
    {
      id: 1,
      title: 'The Bel-Air Glass Pavilion',
      category: 'Modern Villas',
      price: 8950000,
      location: 'Bel Air, Los Angeles, CA',
      beds: 6,
      baths: 8,
      sqft: '8,400',
      badge: 'New Exclusive',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
      description: 'Cantilevered architectural masterpiece with zero-edge infinity pool overlooking the entire Los Angeles basin.'
    },
    {
      id: 2,
      title: 'TriBeCa Sky Penthouse & Terrace',
      category: 'Luxury Penthouses',
      price: 11500000,
      location: 'Franklin St, TriBeCa, New York',
      beds: 4,
      baths: 5,
      sqft: '6,200',
      badge: 'Private Elevator',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      description: 'Double-height great room with 360-degree skyline views, private wrap-around terrace, and custom Boffi kitchen.'
    },
    {
      id: 3,
      title: 'Villa Paradiso Oceanfront Oasis',
      category: 'Seaside Estates',
      price: 7800000,
      location: 'Ocean Blvd, Palm Beach, FL',
      beds: 5,
      baths: 7,
      sqft: '7,100',
      badge: 'Private Beach',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
      description: 'Direct deep-water ocean frontage with private dock, subtropical botanical gardens, and outdoor summer kitchen.'
    },
    {
      id: 4,
      title: 'The Aspen Cedar Timber Lodge',
      category: 'Alpine Chalets',
      price: 6400000,
      location: 'Red Mountain, Aspen, CO',
      beds: 5,
      baths: 6,
      sqft: '5,800',
      badge: 'Ski-In / Ski-Out',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
      description: 'Reclaimed Douglas fir timbers with heated stone terraces, indoor spa plunge pool, and panoramic mountain panoramas.'
    },
    {
      id: 5,
      title: 'The Beverly Ridge Manor',
      category: 'Modern Villas',
      price: 9800000,
      location: 'Beverly Hills, CA',
      beds: 7,
      baths: 9,
      sqft: '9,600',
      badge: 'Gated Security',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      description: 'French limestone facade with 12-seat Dolby Atmos screening room, 1,500-bottle wine gallery, and tennis court.'
    },
    {
      id: 6,
      title: 'Miami Marina Waterfront Residence',
      category: 'Seaside Estates',
      price: 5200000,
      location: 'Biscayne Bay, Miami, FL',
      beds: 4,
      baths: 5,
      sqft: '4,900',
      badge: 'Mega-Yacht Dock',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
      description: 'Lush tropical estate featuring automated smart glass, 100ft private seawall, and rooftop sunset lounge.'
    }
  ];

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchPrice = p.price <= priceMax;
      return matchCat && matchPrice;
    });
  }, [activeCategory, priceMax]);

  const toggleSaveHome = (id) => {
    setSavedHomes(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(i => i !== id) : [...prev, id];
      triggerToast(exists ? 'Removed from saved properties' : 'Saved property to your VIP portfolio');
      return next;
    });
  };

  // Monthly mortgage calculation
  const monthlyPayment = useMemo(() => {
    const principal = mortgagePrice * (1 - downPaymentPercent / 100);
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTermYears * 12;
    if (monthlyRate === 0) return Math.round(principal / numPayments);
    const monthly = (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    return Math.round(monthly);
  }, [mortgagePrice, downPaymentPercent, interestRate, loanTermYears]);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-black text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <span>🏛️</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-amber-900/60 to-amber-950/60 border-b border-amber-500/20 text-center py-2 px-4 text-[11px] font-medium text-amber-200">
        <span>👑 Private Client Advisory: Over $240M in Closed Architectural Transactions in 2026 • Confidential Representation</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#07090e]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr ${accentGradient} flex items-center justify-center font-serif text-black font-extrabold text-base shadow-lg shadow-amber-500/20">
              ${brand.charAt(0)}
            </div>
            <div>
              <span className="font-serif text-lg tracking-tight text-white font-bold block leading-tight">${brand}</span>
              <span className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">Private Estates & Architecture</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => triggerToast(\`You have \${savedHomes.length} saved properties in your portfolio\`)}
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
            >
              <span>⭐</span>
              <span className="hidden sm:inline font-medium">Saved</span>
              {savedHomes.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-[10px] font-bold text-black flex items-center justify-center">
                  {savedHomes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setSelectedProperty(properties[0]); setTourModalOpen(true); }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r ${accentGradient} text-black font-bold text-xs shadow-lg shadow-amber-500/25 hover:opacity-95 transition-all"
            >
              Schedule Private Tour 🗝️
            </button>
          </div>
        </div>
      </header>

      {/* Hero Showcase */}
      <section className="relative py-20 px-6 border-b border-white/[0.06] bg-gradient-to-b from-[#0e111a] to-[#07090e]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-400 mb-6">
              <span>✨ Exclusive Architectural Portfolio</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Uncompromising Luxury.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r ${accentGradient}">Architectural Legacy.</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
              ${subline}
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.08]">
              <div>
                <span className="text-2xl font-serif font-bold text-white block">$240M+</span>
                <span className="text-[11px] text-slate-400">Closed Volume</span>
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-white block">100%</span>
                <span className="text-[11px] text-slate-400">Discretion & Privacy</span>
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-white block">48 Hrs</span>
                <span className="text-[11px] text-slate-400">Private Showings</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/10 blur-[90px] rounded-full" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/[0.02]">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
                alt="Bel Air Estate"
                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#07090e]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Trophy Estate</span>
                  <h4 className="text-sm font-bold text-white">The Bel-Air Glass Pavilion</h4>
                  <span className="text-xs text-amber-300 font-semibold">$8,950,000 • 6 Beds • 8 Baths • 8,400 sq ft</span>
                </div>
                <button
                  onClick={() => { setSelectedProperty(properties[0]); setTourModalOpen(true); }}
                  className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md"
                >
                  Book Showing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-6 px-6 border-b border-white/[0.06] bg-[#0a0d17] sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={\`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 \${activeCategory === cat ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold' : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'}\`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto text-xs text-slate-300">
            <span>Max Price: <strong className="text-amber-400">\${(priceMax / 1000000).toFixed(1)}M</strong></span>
            <input
              type="range"
              min="5000000"
              max="15000000"
              step="500000"
              value={priceMax}
              onChange={e => setPriceMax(Number(e.target.value))}
              className="accent-amber-500 w-36 cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-white">Curated Private Listings</h2>
            <p className="text-xs text-slate-400 mt-1">Showing {filteredProperties.length} architectural residences available for private inspection</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map(prop => {
            const isSaved = savedHomes.includes(prop.id);
            return (
              <div key={prop.id} className="group rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-amber-500/40 p-3 flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10">
                <div className="relative rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-slate-900">
                  <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                    {prop.badge}
                  </span>
                  <button
                    onClick={() => toggleSaveHome(prop.id)}
                    className={\`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center text-xs transition-all \${isSaved ? 'bg-amber-500 text-black font-bold' : 'bg-black/70 text-slate-300 hover:text-white'}\`}
                  >
                    {isSaved ? '★' : '☆'}
                  </button>
                </div>

                <div className="flex-1 flex flex-col p-2">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xl font-serif font-extrabold text-white">\${(prop.price / 1000000).toFixed(2)}M</span>
                    <span className="text-[11px] text-amber-400 font-semibold">{prop.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-amber-300 transition-colors line-clamp-1">{prop.title}</h3>
                  <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                    <span>📍</span>
                    <span>{prop.location}</span>
                  </p>

                  <div className="flex items-center gap-4 py-2.5 border-y border-white/[0.06] text-xs text-slate-300 mb-4">
                    <span><strong>{prop.beds}</strong> Beds</span>
                    <span>•</span>
                    <span><strong>{prop.baths}</strong> Baths</span>
                    <span>•</span>
                    <span><strong>{prop.sqft}</strong> sq ft</span>
                  </div>

                  <div className="mt-auto flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProperty(prop)}
                      className="flex-1 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold transition-colors"
                    >
                      View Specs 👁️
                    </button>
                    <button
                      onClick={() => { setSelectedProperty(prop); setTourModalOpen(true); }}
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition-all"
                    >
                      Book Tour 🗝️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Interactive Mortgage Calculator */}
      <section className="py-16 px-6 border-t border-white/[0.06] bg-[#090b12]">
        <div className="max-w-4xl mx-auto rounded-2xl bg-white/[0.02] border border-white/10 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Financial Suite</span>
            <h3 className="text-2xl font-serif font-bold text-white mt-1">Private Wealth Mortgage Calculator</h3>
            <p className="text-xs text-slate-400 mt-1">Estimate bespoke monthly debt obligations on jumbo luxury loans</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1 text-slate-300">
                  <span>Target Home Value</span>
                  <span className="font-bold text-white">\${(mortgagePrice).toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="2000000"
                  max="15000000"
                  step="250000"
                  value={mortgagePrice}
                  onChange={e => setMortgagePrice(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-300">
                  <span>Down Payment ({downPaymentPercent}%)</span>
                  <span className="font-bold text-white">\${(mortgagePrice * (downPaymentPercent / 100)).toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={downPaymentPercent}
                  onChange={e => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={e => setInterestRate(Number(e.target.value))}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Loan Term</label>
                  <select
                    value={loanTermYears}
                    onChange={e => setLoanTermYears(Number(e.target.value))}
                    className="w-full bg-[#0e111a] border border-white/10 rounded-xl px-3 py-2 text-white"
                  >
                    <option value={15}>15 Years Fixed</option>
                    <option value={30}>30 Years Fixed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-6 text-center">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider block mb-1">Estimated Monthly Payment</span>
              <span className="text-4xl font-serif font-extrabold text-white block mb-2">\${monthlyPayment.toLocaleString()}</span>
              <span className="text-xs text-slate-400 block mb-4">Includes Principal & Interest on \${(mortgagePrice * (1 - downPaymentPercent / 100)).toLocaleString()} loan</span>
              <button
                onClick={() => triggerToast('Private banking lending advisory requested')}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-lg"
              >
                Inquire with Private Banker
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Tour Modal */}
      {tourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0e121d] border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
            {tourConfirmed ? (
              <div className="text-center py-8">
                <span className="text-5xl mb-4 block animate-bounce">🗝️</span>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Showing Confirmed</h3>
                <p className="text-xs text-slate-300 mb-4">Your private viewing pass <span className="font-mono text-amber-400 font-bold">#VIP-7749</span> has been scheduled.</p>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-400 mb-6 space-y-1 text-left">
                  <p><strong>Property:</strong> {selectedProperty?.title || 'Selected Residence'}</p>
                  <p><strong>Date & Time:</strong> {tourForm.date} at {tourForm.time}</p>
                  <p><strong>Client:</strong> {tourForm.name} ({tourForm.email})</p>
                  <p><strong>Chauffeur Service:</strong> {tourForm.vipChauffeur ? 'Included complimentary' : 'Self-arrival'}</p>
                </div>
                <button
                  onClick={() => { setTourConfirmed(false); setTourModalOpen(false); }}
                  className="px-6 py-3 rounded-xl bg-amber-500 text-black text-xs font-bold"
                >
                  Return to Portfolio
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                    <span>🗝️</span> Schedule Private VIP Inspection
                  </h3>
                  <button onClick={() => setTourModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-3 mb-6 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Selected Property</label>
                    <input type="text" readOnly value={selectedProperty?.title || 'Luxury Estate'} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-amber-300 font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Preferred Date</label>
                      <input type="text" value={tourForm.date} onChange={e => setTourForm({ ...tourForm, date: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Time Slot</label>
                      <input type="text" value={tourForm.time} onChange={e => setTourForm({ ...tourForm, time: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Client Full Name</label>
                    <input type="text" value={tourForm.name} onChange={e => setTourForm({ ...tourForm, name: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Direct Contact Phone</label>
                    <input type="text" value={tourForm.phone} onChange={e => setTourForm({ ...tourForm, phone: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white" />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="chauffeur"
                      checked={tourForm.vipChauffeur}
                      onChange={e => setTourForm({ ...tourForm, vipChauffeur: e.target.checked })}
                      className="accent-amber-500"
                    />
                    <label htmlFor="chauffeur" className="text-slate-300 cursor-pointer">Provide complimentary private Maybach chauffeur transfer</label>
                  </div>
                </div>

                <button
                  onClick={() => setTourConfirmed(true)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r ${accentGradient} text-black font-bold text-xs shadow-xl shadow-amber-500/25"
                >
                  Confirm Confidential Appointment ✨
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Property Specs Modal */}
      {selectedProperty && !tourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#0e121d] border border-white/15 rounded-2xl p-6 shadow-2xl overflow-hidden">
            <button onClick={() => setSelectedProperty(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">
              ✕
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img src={selectedProperty.image} alt={selectedProperty.title} className="w-full h-64 md:h-full object-cover rounded-xl border border-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider mb-1">{selectedProperty.category}</span>
                <h3 className="text-xl font-serif font-bold text-white mb-1">{selectedProperty.title}</h3>
                <p className="text-xs text-slate-400 mb-3">{selectedProperty.location}</p>
                <div className="text-2xl font-serif font-extrabold text-white mb-4">\${(selectedProperty.price / 1000000).toFixed(2)}M</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">{selectedProperty.description}</p>
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-center text-xs text-slate-300 mb-6">
                  <div><strong>{selectedProperty.beds}</strong> Beds</div>
                  <div><strong>{selectedProperty.baths}</strong> Baths</div>
                  <div><strong>{selectedProperty.sqft}</strong> sq ft</div>
                </div>
                <div className="mt-auto space-y-2">
                  <button
                    onClick={() => setTourModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg"
                  >
                    Schedule Private Viewing 🗝️
                  </button>
                  <button
                    onClick={() => toggleSaveHome(selectedProperty.id)}
                    className="w-full py-2.5 rounded-xl bg-white/[0.05] text-white text-xs font-semibold"
                  >
                    {savedHomes.includes(selectedProperty.id) ? 'Saved in Portfolio ★' : 'Save Property ☆'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#04060b] py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-300">${brand}</span>
            <span>—</span>
            <span>${tagline}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Private Wealth Advisory</span>
            <span className="hover:text-slate-300 cursor-pointer">Off-Market Directory</span>
            <span className="hover:text-slate-300 cursor-pointer">Confidentiality Guarantee</span>
            <span className="text-amber-400">● Global Licensed Brokerage</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
`;
};

const generateCryptoFintechAppJsx = ({ brand, tagline, subline, primary, secondary, accentGradient }) => {
  return `import React, { useState } from 'react';

export default function App() {
  const accentGradient = '${accentGradient}';

  const [activeTab, setActiveTab] = useState('Trade');
  const [payAmount, setPayAmount] = useState('1000');
  const [payAsset, setPayAsset] = useState('USD');
  const [receiveAsset, setReceiveAsset] = useState('ETH');
  const [slippage, setSlippage] = useState('0.5%');
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);

  const rates = {
    ETH: 3840,
    BTC: 89420,
    SOL: 185,
    AVAX: 42
  };

  const receiveAmount = (Number(payAmount || 0) / (rates[receiveAsset] || 1)).toFixed(4);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const tickers = [
    { symbol: 'BTC', price: '$89,420.50', change: '+5.42%', up: true },
    { symbol: 'ETH', price: '$3,842.10', change: '+6.18%', up: true },
    { symbol: 'SOL', price: '$185.30', change: '+12.40%', up: true },
    { symbol: 'AVAX', price: '$42.15', change: '+3.10%', up: true }
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-black text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <span>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Real-Time Ticker Bar */}
      <div className="bg-[#03050a] border-b border-white/[0.08] py-2 px-6 flex items-center justify-between text-xs font-mono overflow-x-auto">
        <div className="flex items-center gap-6">
          <span className="text-slate-500 uppercase font-bold text-[10px] tracking-wider">Live Markets</span>
          {tickers.map(t => (
            <div key={t.symbol} className="flex items-center gap-2 shrink-0">
              <span className="text-white font-bold">{t.symbol}</span>
              <span className="text-slate-300">{t.price}</span>
              <span className="text-emerald-400 font-semibold">{t.change}</span>
            </div>
          ))}
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-400 text-[11px]">
          <span>Gas: <strong className="text-emerald-400">12 Gwei</strong></span>
          <span>•</span>
          <span>Block: <strong className="text-slate-200">#19482012</strong></span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#050811]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr ${accentGradient} flex items-center justify-center font-bold text-black text-lg shadow-lg shadow-emerald-500/25">
              ${brand.charAt(0)}
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block leading-tight">${brand}</span>
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold font-mono">DEX & Liquidity v3</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setWalletConnected(!walletConnected);
                triggerToast(walletConnected ? 'Wallet disconnected' : 'Connected to 0x71C...4b92 (Ethereum Mainnet)');
              }}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 \${walletConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/25'}\`}
            >
              <span>{walletConnected ? '🟢 0x71C...4b92' : 'Connect Web3 Wallet ⚡'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-16 px-6 text-center border-b border-white/[0.06] bg-gradient-to-b from-[#091122] to-[#050811]">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 mb-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            ⚡ Decentralized Capital Routing
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Institutional Liquidity.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r ${accentGradient}">Sub-Millisecond Execution.</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed mb-8">
            ${subline}
          </p>
        </div>
      </section>

      {/* Main Trading Terminal Arena */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Token Swap Box */}
        <div className="lg:col-span-1 rounded-2xl bg-white/[0.02] border border-white/10 p-6 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🔄</span> Instant Token Swap
            </h3>
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              {['0.1%', '0.5%', '1%'].map(s => (
                <button
                  key={s}
                  onClick={() => setSlippage(s)}
                  className={\`px-2 py-0.5 rounded \${slippage === s ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'hover:text-white'}\`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>You Pay</span>
                <span>Balance: $24,800 USD</span>
              </div>
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value)}
                  className="bg-transparent text-2xl font-mono font-bold text-white outline-none w-1/2"
                />
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-bold text-white">USD 💵</span>
              </div>
            </div>

            <div className="text-center">
              <span className="inline-block p-2 rounded-full bg-white/5 border border-white/10 text-xs text-emerald-400">↓</span>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>You Receive (Estimated)</span>
                <span>1 {receiveAsset} = \${rates[receiveAsset]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-mono font-bold text-emerald-400">{receiveAmount}</span>
                <select
                  value={receiveAsset}
                  onChange={e => setReceiveAsset(e.target.value)}
                  className="bg-[#0c1322] border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                >
                  <option value="ETH">ETH ⟠</option>
                  <option value="BTC">BTC ₿</option>
                  <option value="SOL">SOL ◎</option>
                  <option value="AVAX">AVAX 🔺</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 space-y-1 mb-6 font-mono">
            <div className="flex justify-between">
              <span>Network Routing Fee</span>
              <span className="text-emerald-400">0.001 ETH (~$3.84)</span>
            </div>
            <div className="flex justify-between">
              <span>Guaranteed Slippage</span>
              <span>{slippage}</span>
            </div>
            <div className="flex justify-between">
              <span>Price Impact</span>
              <span className="text-emerald-400">&lt; 0.01%</span>
            </div>
          </div>

          <button
            onClick={() => {
              setSwapModalOpen(true);
              triggerToast(\`Executing swap \${payAmount} USD → \${receiveAmount} \${receiveAsset}\`);
            }}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-xl shadow-emerald-500/25 transition-all"
          >
            Execute Swap ⚡
          </button>
        </div>

        {/* Portfolio & Analytics Arena */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
              <span className="text-xs text-slate-400 block mb-1">Portfolio Balance</span>
              <span className="text-2xl font-mono font-extrabold text-white block">$124,850.00</span>
              <span className="text-xs text-emerald-400 font-bold">+$6,240.20 (+5.2%) today</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
              <span className="text-xs text-slate-400 block mb-1">24h Volume Routed</span>
              <span className="text-2xl font-mono font-extrabold text-white block">$42.8M</span>
              <span className="text-xs text-slate-400">Zero Slippage Routing</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
              <span className="text-xs text-slate-400 block mb-1">Staking APY Yield</span>
              <span className="text-2xl font-mono font-extrabold text-emerald-400 block">14.8%</span>
              <span className="text-xs text-indigo-300 font-bold">Auto-Compounding</span>
            </div>
          </div>

          {/* Asset Allocation Breakdown */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h3 className="text-sm font-bold text-white mb-4">Asset Allocation Breakdown</h3>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Ethereum (ETH) — 45%</span>
                  <span className="text-white">$56,182.50</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Bitcoin (BTC) — 35%</span>
                  <span className="text-white">$43,697.50</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Solana (SOL) — 15%</span>
                  <span className="text-white">$18,727.50</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Ledger */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h3 className="text-sm font-bold text-white mb-4">Recent Verified Transactions</h3>
            <div className="space-y-2 text-xs font-mono">
              {[
                { type: 'SWAP', pair: 'USD → ETH', amount: '0.2604 ETH', status: 'Completed', hash: '0x8f2a...c491' },
                { type: 'STAKE', pair: 'SOL Yield Pool', amount: '24.5 SOL', status: 'Active', hash: '0x3d1e...a109' },
                { type: 'SWAP', pair: 'USD → BTC', amount: '0.0450 BTC', status: 'Completed', hash: '0x7b4a...991c' }
              ].map(tx => (
                <div key={tx.hash} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">{tx.type}</span>
                    <span className="text-white">{tx.pair}</span>
                  </div>
                  <span className="text-slate-300">{tx.amount}</span>
                  <span className="text-emerald-400 font-bold">{tx.status}</span>
                  <span className="text-slate-500">{tx.hash}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {swapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0a101d] border border-emerald-500/40 rounded-2xl p-6 shadow-2xl text-center">
            <span className="text-4xl mb-3 block animate-spin">⚡</span>
            <h3 className="text-xl font-bold text-white mb-2">Transaction Confirmed!</h3>
            <p className="text-xs text-slate-300 mb-4">
              Successfully swapped <strong className="text-white">\${payAmount} USD</strong> for <strong className="text-emerald-400">{receiveAmount} {receiveAsset}</strong>.
            </p>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-slate-400 mb-6">
              Tx Hash: <span className="text-emerald-300">0x9f8c4172a1e80429...</span>
            </div>
            <button
              onClick={() => setSwapModalOpen(false)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#03050a] py-8 px-6 text-center text-xs text-slate-500 mt-auto font-mono">
        <span>© 2026 ${brand} — Non-Custodial Smart Contract Protocol. CertiK Audited.</span>
      </footer>
    </div>
  );
}
`;
};

const generateHealthcareAppJsx = ({ brand, tagline, subline, primary, secondary, accentGradient }) => {
  return `import React, { useState } from 'react';

export default function App() {
  const accentGradient = '${accentGradient}';

  const [activeDept, setActiveDept] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [aptModalOpen, setAptModalOpen] = useState(false);
  const [aptConfirmed, setAptConfirmed] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [aptForm, setAptForm] = useState({
    date: 'Tomorrow, 10:00 AM',
    type: 'In-Clinic VIP Consultation',
    name: 'David Miller',
    phone: '+1 (555) 432-8765',
    reason: 'Routine cardiovascular screening'
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const departments = ['All', 'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics'];

  const doctors = [
    {
      id: 1,
      name: 'Dr. Evelyn Hayes, MD, FACC',
      dept: 'Cardiology',
      title: 'Chief of Interventional Cardiology',
      school: 'Johns Hopkins Medicine',
      rating: 4.9,
      reviews: 320,
      fee: '$250',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
      description: 'Specialist in preventative cardiovascular disease, advanced echocardiography, and minimally invasive coronary intervention.'
    },
    {
      id: 2,
      name: 'Dr. Marcus Vance, MD, FAAD',
      dept: 'Dermatology',
      title: 'Senior Clinical Dermatologist',
      school: 'Harvard Medical School',
      rating: 4.8,
      reviews: 215,
      fee: '$220',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
      description: 'Pioneer in surgical dermatology, laser aesthetics, and targeted biologic treatments for complex skin conditions.'
    },
    {
      id: 3,
      name: 'Dr. Sophia Chen, MD, PhD',
      dept: 'Neurology',
      title: 'Neuroscience Research Director',
      school: 'Stanford University Medical Center',
      rating: 5.0,
      reviews: 184,
      fee: '$280',
      image: 'https://images.unsplash.com/photo-1594824813629-65022a101b08?auto=format&fit=crop&w=800&q=80',
      description: 'Specializing in neuro-rehabilitation, migraine prevention, and advanced electroencephalography diagnostics.'
    },
    {
      id: 4,
      name: 'Dr. James Thorne, MD',
      dept: 'Orthopedics',
      title: 'Orthopedic Spine & Joint Specialist',
      school: 'Columbia University',
      rating: 4.9,
      reviews: 290,
      fee: '$240',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80',
      description: 'Expertise in sports medicine arthroscopy, cartilage restoration, and comprehensive spinal biomechanics.'
    }
  ];

  const filteredDoctors = doctors.filter(d => activeDept === 'All' || d.dept === activeDept);

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-500 text-black text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <span>🩺</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Emergency Hotline Header */}
      <div className="bg-gradient-to-r from-cyan-950 via-blue-950 to-cyan-950 border-b border-cyan-500/20 text-center py-2 px-4 text-[11px] font-medium text-cyan-200">
        <span>🚑 24/7 Telehealth & Urgent Care Triage Active • Call Priority Line: <strong className="text-white">+1 (800) 912-CARE</strong></span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#080d1a]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr ${accentGradient} flex items-center justify-center font-bold text-white text-base shadow-lg shadow-cyan-500/25">
              ${brand.charAt(0)}
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block leading-tight">${brand}</span>
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold">Specialty Medical Center</span>
            </div>
          </div>

          <button
            onClick={() => { setSelectedDoctor(doctors[0]); setAptModalOpen(true); }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r ${accentGradient} text-white font-bold text-xs shadow-lg shadow-cyan-500/25"
          >
            Book Consultation 🩺
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 border-b border-white/[0.06] bg-gradient-to-b from-[#0e172e] to-[#080d1a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-400 mb-6">
              <span>★ JCI & HIPAA Accredited Center</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
              Compassionate Care.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r ${accentGradient}">World-Class Medicine.</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
              ${subline}
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.08]">
              <div>
                <span className="text-2xl font-bold text-white block">15,000+</span>
                <span className="text-[11px] text-slate-400">Patients Healed</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-white block">4.9 / 5</span>
                <span className="text-[11px] text-slate-400">Clinical Rating</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-white block">98%</span>
                <span className="text-[11px] text-slate-400">Diagnostic Accuracy</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80"
              alt="Medical Center"
              className="rounded-2xl border border-white/10 shadow-2xl object-cover h-[380px] w-full"
            />
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-6 px-6 border-b border-white/[0.06] bg-[#0b1324] sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={\`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 \${activeDept === dept ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20' : 'bg-white/[0.04] text-slate-400 hover:text-white'}\`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor Directory */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex-1 w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Distinguished Medical Faculty</h2>
          <p className="text-xs text-slate-400 mt-1">Select a board-certified physician for in-person or telehealth consultation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDoctors.map(doc => (
            <div key={doc.id} className="rounded-2xl bg-white/[0.02] border border-white/10 p-5 flex flex-col sm:flex-row gap-5 hover:border-cyan-500/40 transition-colors">
              <img src={doc.image} alt={doc.name} className="w-28 h-28 rounded-xl object-cover bg-slate-800 shrink-0 border border-white/10" />
              <div className="flex-1 flex flex-col">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider mb-1">{doc.dept}</span>
                <h3 className="text-base font-bold text-white mb-1">{doc.name}</h3>
                <span className="text-xs text-slate-300 font-semibold mb-1">{doc.title}</span>
                <span className="text-[11px] text-slate-500 mb-2">🎓 {doc.school}</span>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">{doc.description}</p>
                <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Consultation Fee</span>
                    <span className="text-sm font-bold text-white block">{doc.fee}</span>
                  </div>
                  <button
                    onClick={() => { setSelectedDoctor(doc); setAptModalOpen(true); }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-md"
                  >
                    Book Appointment 🩺
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Appointment Modal */}
      {aptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0c1424] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
            {aptConfirmed ? (
              <div className="text-center py-8">
                <span className="text-5xl mb-4 block animate-bounce">🩺</span>
                <h3 className="text-2xl font-bold text-white mb-2">Consultation Confirmed!</h3>
                <p className="text-xs text-slate-300 mb-4">Your clinical pass <span className="font-mono text-cyan-400 font-bold">#APT-8392</span> is confirmed.</p>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-400 mb-6 text-left space-y-1">
                  <p><strong>Physician:</strong> {selectedDoctor?.name}</p>
                  <p><strong>Appointment:</strong> {aptForm.date}</p>
                  <p><strong>Consultation Type:</strong> {aptForm.type}</p>
                  <p><strong>Patient:</strong> {aptForm.name} ({aptForm.phone})</p>
                </div>
                <button
                  onClick={() => { setAptConfirmed(false); setAptModalOpen(false); }}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs"
                >
                  Return to Portal
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>🩺</span> Book Clinical Consultation
                  </h3>
                  <button onClick={() => setAptModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-3 mb-6 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Selected Physician</label>
                    <input type="text" readOnly value={selectedDoctor?.name} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-cyan-300 font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Preferred Time Slot</label>
                    <input type="text" value={aptForm.date} onChange={e => setAptForm({ ...aptForm, date: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Patient Full Name</label>
                    <input type="text" value={aptForm.name} onChange={e => setAptForm({ ...aptForm, name: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Contact Phone</label>
                    <input type="text" value={aptForm.phone} onChange={e => setAptForm({ ...aptForm, phone: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white" />
                  </div>
                </div>

                <button
                  onClick={() => setAptConfirmed(true)}
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-xl shadow-cyan-500/25"
                >
                  Confirm Appointment Pass ✨
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#050914] py-8 px-6 text-center text-xs text-slate-500 mt-auto">
        <span>© 2026 ${brand} — JCI Accredited Hospital & Health System.</span>
      </footer>
    </div>
  );
}
`;
};

module.exports = {
  generateEcommerceAppJsx,
  generateRestaurantAppJsx,
  generatePortfolioAppJsx,
  generateFitnessAppJsx,
  generateSaaSAppJsx,
  generateRealEstateAppJsx,
  generateCryptoFintechAppJsx,
  generateHealthcareAppJsx
};

