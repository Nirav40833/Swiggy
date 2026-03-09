import { useState, useEffect } from "react";

// ========== DATA ==========
const categories = [
  { id: "All", label: "All", icon: "🍽️" },
  { id: "Biryani", label: "Biryani", icon: "🍛" },
  { id: "Pizza", label: "Pizza", icon: "🍕" },
  { id: "Burger", label: "Burger", icon: "🍔" },
  { id: "Chinese", label: "Chinese", icon: "🥡" },
  { id: "South Indian", label: "South Indian", icon: "🥘" },
  { id: "Desserts", label: "Desserts", icon: "🍰" },
  { id: "Healthy", label: "Healthy", icon: "🥗" },
];

const restaurants = [
  {
    id: 1, name: "Biryani Blues", cuisine: "Biryani, Mughlai", category: "Biryani",
    rating: 4.5, deliveryTime: "30-40 min", deliveryFee: 40, minOrder: 149,
    discount: "50% OFF up to ₹100", isVeg: false, isPro: true, tags: ["Trending", "Fast Delivery"],
    image: "",
    menu: [
      { id: 101, name: "Chicken Dum Biryani", price: 249, veg: false, rating: 4.6, desc: "Aromatic basmati rice slow-cooked with tender chicken", image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=200&h=150&fit=crop", category: "Biryani" },
      { id: 102, name: "Mutton Biryani", price: 329, veg: false, rating: 4.7, desc: "Rich mutton cooked in authentic dum style", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&h=150&fit=crop", category: "Biryani" },
      { id: 103, name: "Veg Biryani", price: 179, veg: true, rating: 4.3, desc: "Fragrant rice with fresh garden vegetables", image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=200&h=150&fit=crop", category: "Biryani" },
      { id: 104, name: "Raita", price: 49, veg: true, rating: 4.2, desc: "Creamy yogurt with spices", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=150&fit=crop", category: "Sides" },
    ]
  },
  {
    id: 2, name: "Pizza Paradise", cuisine: "Pizza, Italian", category: "Pizza",
    rating: 4.3, deliveryTime: "25-35 min", deliveryFee: 30, minOrder: 199,
    discount: "Buy 1 Get 1 Free", isVeg: false, isPro: false, tags: ["BOGO", "Best Seller"],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop",
    menu: [
      { id: 201, name: "Margherita Pizza", price: 199, veg: true, rating: 4.4, desc: "Classic tomato sauce with fresh mozzarella", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=150&fit=crop", category: "Pizza" },
      { id: 202, name: "Pepperoni Blast", price: 299, veg: false, rating: 4.6, desc: "Loaded with crispy pepperoni and cheese", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=150&fit=crop", category: "Pizza" },
      { id: 203, name: "BBQ Chicken Pizza", price: 329, veg: false, rating: 4.5, desc: "Smoky BBQ chicken with onions and peppers", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=150&fit=crop", category: "Pizza" },
      { id: 204, name: "Garlic Bread", price: 99, veg: true, rating: 4.3, desc: "Toasted garlic butter bread", image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=200&h=150&fit=crop", category: "Sides" },
    ]
  },
  {
    id: 3, name: "Burger Factory", cuisine: "Burgers, American", category: "Burger",
    rating: 4.4, deliveryTime: "20-30 min", deliveryFee: 25, minOrder: 99,
    discount: "₹75 OFF above ₹299", isVeg: false, isPro: true, tags: ["Quick Delivery", "Popular"],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=250&fit=crop",
    menu: [
      { id: 301, name: "Classic Chicken Burger", price: 149, veg: false, rating: 4.5, desc: "Juicy chicken patty with fresh veggies", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=150&fit=crop", category: "Burgers" },
      { id: 302, name: "Double Smash Burger", price: 229, veg: false, rating: 4.7, desc: "Two smashed beef patties with special sauce", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200&h=150&fit=crop", category: "Burgers" },
      { id: 303, name: "Veggie Supreme", price: 129, veg: true, rating: 4.2, desc: "Crispy veggie patty with cheese and sauce", image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=200&h=150&fit=crop", category: "Burgers" },
      { id: 304, name: "Loaded Fries", price: 99, veg: true, rating: 4.4, desc: "Crispy fries with cheese sauce and toppings", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=150&fit=crop", category: "Sides" },
    ]
  },
  {
    id: 4, name: "Dragon House", cuisine: "Chinese, Thai", category: "Chinese",
    rating: 4.2, deliveryTime: "35-45 min", deliveryFee: 35, minOrder: 149,
    discount: "20% OFF on orders above ₹399", isVeg: false, isPro: false, tags: ["New", "Spicy"],
    image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=250&fit=crop",
    menu: [
      { id: 401, name: "Chicken Fried Rice", price: 199, veg: false, rating: 4.3, desc: "Wok-tossed rice with chicken and vegetables", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&h=150&fit=crop", category: "Rice" },
      { id: 402, name: "Kung Pao Chicken", price: 249, veg: false, rating: 4.5, desc: "Spicy stir-fried chicken with peanuts", image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=200&h=150&fit=crop", category: "Mains" },
      { id: 403, name: "Veg Hakka Noodles", price: 169, veg: true, rating: 4.1, desc: "Classic hakka noodles with fresh veggies", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&h=150&fit=crop", category: "Noodles" },
      { id: 404, name: "Spring Rolls (6 pcs)", price: 149, veg: true, rating: 4.3, desc: "Crispy rolls with vegetable filling", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=150&fit=crop", category: "Starters" },
    ]
  },
  {
    id: 5, name: "South Spice", cuisine: "South Indian, Dosa", category: "South Indian",
    rating: 4.6, deliveryTime: "30-40 min", deliveryFee: 20, minOrder: 99,
    discount: "Free delivery above ₹199", isVeg: true, isPro: true, tags: ["Pure Veg", "Top Rated"],
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=250&fit=crop",
    menu: [
      { id: 501, name: "Masala Dosa", price: 99, veg: true, rating: 4.7, desc: "Crispy dosa with spiced potato filling", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&h=150&fit=crop", category: "Dosa" },
      { id: 502, name: "Idli Sambar (4 pcs)", price: 79, veg: true, rating: 4.5, desc: "Soft steamed idlis with sambar and chutney", image: "https://images.unsplash.com/photo-1630409346824-4f0e7b090629?w=200&h=150&fit=crop", category: "Tiffin" },
      { id: 503, name: "Uttapam", price: 89, veg: true, rating: 4.4, desc: "Thick pancake with onion and tomato topping", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&h=150&fit=crop", category: "Tiffin" },
      { id: 504, name: "Filter Coffee", price: 49, veg: true, rating: 4.8, desc: "Authentic South Indian filter coffee", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=150&fit=crop", category: "Drinks" },
    ]
  },
  {
    id: 6, name: "Sweet Cravings", cuisine: "Desserts, Ice Cream", category: "Desserts",
    rating: 4.5, deliveryTime: "20-30 min", deliveryFee: 30, minOrder: 149,
    discount: "₹50 OFF on first order", isVeg: true, isPro: false, tags: ["Sweet Tooth", "Bestseller"],
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=250&fit=crop",
    menu: [
      { id: 601, name: "Chocolate Lava Cake", price: 149, veg: true, rating: 4.6, desc: "Warm chocolate cake with molten center", image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=200&h=150&fit=crop", category: "Cakes" },
      { id: 602, name: "Gulab Jamun (6 pcs)", price: 99, veg: true, rating: 4.7, desc: "Soft milk dumplings in sugar syrup", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop", category: "Indian Sweets" },
      { id: 603, name: "Ice Cream Sundae", price: 129, veg: true, rating: 4.5, desc: "3 scoops with hot fudge and whipped cream", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=150&fit=crop", category: "Ice Cream" },
      { id: 604, name: "Brownie with Ice Cream", price: 159, veg: true, rating: 4.8, desc: "Fudgy brownie with vanilla ice cream scoop", image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=200&h=150&fit=crop", category: "Cakes" },
    ]
  },
  {
    id: 7, name: "Green Bowl", cuisine: "Healthy, Salads", category: "Healthy",
    rating: 4.3, deliveryTime: "25-35 min", deliveryFee: 35, minOrder: 199,
    discount: "10% OFF on orders above ₹499", isVeg: false, isPro: true, tags: ["Healthy", "Calorie Counted"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop",
    menu: [
      { id: 701, name: "Grilled Chicken Salad", price: 249, veg: false, rating: 4.4, desc: "Grilled chicken on mixed greens with vinaigrette", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop", category: "Salads" },
      { id: 702, name: "Quinoa Buddha Bowl", price: 299, veg: true, rating: 4.5, desc: "Nutritious quinoa with roasted veggies and hummus", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop", category: "Bowls" },
      { id: 703, name: "Green Smoothie", price: 149, veg: true, rating: 4.2, desc: "Spinach, banana, almond milk blend", image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=200&h=150&fit=crop", category: "Drinks" },
      { id: 704, name: "Avocado Toast", price: 199, veg: true, rating: 4.3, desc: "Multigrain toast with smashed avocado", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=200&h=150&fit=crop", category: "Breakfast" },
    ]
  },
  {
    id: 8, name: "The Pasta House", cuisine: "Italian, Pasta", category: "Pizza",
    rating: 4.4, deliveryTime: "30-40 min", deliveryFee: 40, minOrder: 199,
    discount: "Flat ₹100 OFF above ₹599", isVeg: false, isPro: false, tags: ["Italian", "Gourmet"],
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=250&fit=crop",
    menu: [
      { id: 801, name: "Spaghetti Carbonara", price: 279, veg: false, rating: 4.6, desc: "Classic Roman pasta with egg, cheese and pancetta", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=150&fit=crop", category: "Pasta" },
      { id: 802, name: "Penne Arrabbiata", price: 229, veg: true, rating: 4.3, desc: "Penne in spicy tomato sauce", image: "https://images.unsplash.com/photo-1551183053-bf91798d9d31?w=200&h=150&fit=crop", category: "Pasta" },
      { id: 803, name: "Chicken Alfredo", price: 299, veg: false, rating: 4.7, desc: "Fettuccine in creamy parmesan sauce with chicken", image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=200&h=150&fit=crop", category: "Pasta" },
      { id: 804, name: "Tiramisu", price: 179, veg: true, rating: 4.8, desc: "Classic Italian coffee-flavored dessert", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&h=150&fit=crop", category: "Desserts" },
    ]
  }
];

// ========== NAVBAR ==========
function Navbar({ cartCount, cartTotal, onCartClick, onHomeClick, address, setAddress, searchQuery, setSearchQuery }) {
  const [editingAddress, setEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 1000, background: "white",
      boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: "0 24px"
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", alignItems: "center",
        height: 70, gap: 20
      }}>
        <div onClick={onHomeClick} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #FC8019, #ff5722)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
          }}>🍜</div>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#FC8019" }}>swiggy</span>
        </div>

        <div onClick={() => { setTempAddress(address); setEditingAddress(true); }} style={{
          display: "flex", alignItems: "center", gap: 6,
          cursor: "pointer", padding: "6px 10px", borderRadius: 8,
          transition: "background 0.2s"
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#fff3e8"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <span>📍</span>
          <div>
            <div style={{ fontSize: 10, color: "#888", fontWeight: 500 }}>Delivering to</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#3d4152", display: "flex", alignItems: "center", gap: 3 }}>
              {address.split(",")[0]} <span style={{ color: "#FC8019" }}>▼</span>
            </div>
          </div>
        </div>

        {editingAddress && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
            <div style={{ background: "white", borderRadius: 16, padding: 28, width: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
              <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 700 }}>📍 Delivery Address</h3>
              <input value={tempAddress} onChange={e => setTempAddress(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "2px solid #FC8019", outline: "none", fontSize: 14, marginBottom: 16, fontFamily: "inherit" }}
                placeholder="Enter delivery address..." />
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setAddress(tempAddress); setEditingAddress(false); }}
                  style={{ flex: 1, padding: 12, background: "#FC8019", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
                  Save
                </button>
                <button onClick={() => setEditingAddress(false)}
                  style={{ flex: 1, padding: 12, background: "#f5f5f5", color: "#333", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{
          flex: 1, maxWidth: 440,
          display: "flex", alignItems: "center",
          background: "#f5f5f5", borderRadius: 10, padding: "9px 14px", gap: 8
        }}>
          <span style={{ color: "#888" }}>🔍</span>
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search restaurants, cuisines..."
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, fontFamily: "inherit", color: "#3d4152" }} />
          {searchQuery && <span onClick={() => setSearchQuery("")} style={{ cursor: "pointer", color: "#888" }}>✕</span>}
        </div>

        <div style={{ flex: 1 }} />

        <button onClick={onHomeClick} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, fontWeight: 600, color: "#3d4152", fontFamily: "inherit",
          padding: "6px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 4
        }}>🏠 Home</button>

        <button onClick={onCartClick} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: cartCount > 0 ? "linear-gradient(135deg, #FC8019, #ff5722)" : "#f5f5f5",
          color: cartCount > 0 ? "white" : "#3d4152",
          border: "none", borderRadius: 10, padding: "10px 16px",
          cursor: "pointer", fontWeight: 700, fontSize: 13,
          fontFamily: "inherit", transition: "all 0.3s",
          boxShadow: cartCount > 0 ? "0 4px 16px rgba(252,128,25,0.4)" : "none"
        }}>
          🛒 {cartCount > 0 ? `${cartCount} • ₹${cartTotal + 40}` : "Cart"}
        </button>
      </div>
    </nav>
  );
}

// ========== HERO BANNER ==========
const banners = [
  { bg: "linear-gradient(135deg, #FF6B35, #F7931E)", emoji: "🍔", title: "Order Anytime, Anywhere", sub: "100+ restaurants at your door", tag: "🔥 Trending Now" },
  { bg: "linear-gradient(135deg, #667eea, #764ba2)", emoji: "🍕", title: "50% OFF Your First Order!", sub: "Use code WELCOME50 at checkout", tag: "🎉 Special Offer" },
  { bg: "linear-gradient(135deg, #11998e, #38ef7d)", emoji: "🥗", title: "Healthy Food Delivered", sub: "Fresh salads & bowls delivered fresh", tag: "💚 Healthy Picks" },
];

function HeroBanner() {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCur(p => (p + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);
  const b = banners[cur];
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          background: b.bg, borderRadius: 20, padding: "36px 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          minHeight: 170, position: "relative", overflow: "hidden",
          transition: "background 0.8s", boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
        }}>
          <div style={{ position: "absolute", right: -50, top: -50, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", padding: "5px 14px", borderRadius: 20, color: "white", fontSize: 11, fontWeight: 700, marginBottom: 10 }}>{b.tag}</div>
            <h1 style={{ color: "white", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{b.title}</h1>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, marginBottom: 16 }}>{b.sub}</p>
            <button style={{
              background: "white", color: "#FC8019", border: "none",
              padding: "10px 24px", borderRadius: 10, fontWeight: 700, fontSize: 13,
              cursor: "pointer", fontFamily: "inherit"
            }}>Order Now →</button>
          </div>
          <div style={{ fontSize: 90, position: "relative", zIndex: 1, animation: "bop 2s infinite" }}>{b.emoji}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCur(i)} style={{
              width: i === cur ? 24 : 7, height: 7, borderRadius: 4, border: "none",
              background: i === cur ? "#FC8019" : "#ddd", cursor: "pointer", transition: "all 0.3s"
            }} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginTop: 20 }}>
          {[["🍽️","100+","Restaurants"],["⚡","30 min","Avg. Delivery"],["⭐","4.5","Avg. Rating"],["🎯","24/7","Always Open"]].map(([icon,val,label]) => (
            <div key={label} style={{ background: "white", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ width: 40, height: 40, background: "#fff3e8", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#3d4152" }}>{val}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========== CATEGORY FILTER ==========
function CategoryFilter({ active, setActive }) {
  return (
    <div style={{ paddingBottom: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#3d4152", marginBottom: 16 }}>What's on your mind?</h2>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActive(cat.id)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            padding: "12px 18px", borderRadius: 14,
            border: active === cat.id ? "2px solid #FC8019" : "2px solid transparent",
            background: active === cat.id ? "#fff3e8" : "white",
            cursor: "pointer", minWidth: 82, flexShrink: 0,
            boxShadow: active === cat.id ? "0 4px 16px rgba(252,128,25,0.2)" : "0 2px 8px rgba(0,0,0,0.05)",
            transform: active === cat.id ? "scale(1.05)" : "scale(1)",
            transition: "all 0.2s", fontFamily: "inherit"
          }}>
            <span style={{ fontSize: 28 }}>{cat.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: active === cat.id ? "#FC8019" : "#3d4152", whiteSpace: "nowrap" }}>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ========== RESTAURANT CARD ==========
function RestaurantCard({ r, onClick }) {
  const [liked, setLiked] = useState(false);
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: "white", borderRadius: 18, overflow: "hidden", cursor: "pointer",
      transition: "all 0.3s",
      boxShadow: hov ? "0 12px 40px rgba(0,0,0,0.14)" : "0 2px 12px rgba(0,0,0,0.06)",
      transform: hov ? "translateY(-3px)" : "translateY(0)"
    }}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src={r.image} alt={r.name} style={{ width: "100%", height: 170, objectFit: "cover", transition: "transform 0.4s", transform: hov ? "scale(1.06)" : "scale(1)" }} />
        {r.discount && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72), transparent)", padding: "18px 12px 8px", color: "white", fontSize: 11, fontWeight: 700 }}>
            🏷️ {r.discount}
          </div>
        )}
        {r.isPro && <div style={{ position: "absolute", top: 10, left: 10, background: "linear-gradient(135deg, #5B4CDB, #7C3AED)", color: "white", padding: "3px 8px", borderRadius: 5, fontSize: 10, fontWeight: 700 }}>⚡ PRO</div>}
        <div style={{ position: "absolute", top: 10, right: 38, background: "white", borderRadius: 5, padding: "3px 7px", fontSize: 10, fontWeight: 700, color: r.isVeg ? "#4CAF50" : "#f44336", border: `1.5px solid ${r.isVeg ? "#4CAF50" : "#f44336"}` }}>
          {r.isVeg ? "🟢 VEG" : "🔴 NON"}
        </div>
        <button onClick={e => { e.stopPropagation(); setLiked(!liked); }} style={{
          position: "absolute", top: 10, right: 10, background: "white", border: "none",
          borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", fontSize: 15, boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}>{liked ? "❤️" : "🤍"}</button>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#3d4152", margin: 0 }}>{r.name}</h3>
          <div style={{ background: r.rating >= 4.5 ? "#48c774" : "#FC8019", color: "white", padding: "3px 7px", borderRadius: 5, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>⭐ {r.rating}</div>
        </div>
        <p style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>{r.cuisine}</p>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #f5f5f5" }}>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#3d4152" }}>🕐 {r.deliveryTime}</div><div style={{ fontSize: 10, color: "#888" }}>Delivery</div></div>
          <div style={{ width: 1, background: "#f0f0f0" }} />
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#3d4152" }}>{r.deliveryFee === 0 ? "🆓 Free" : `₹${r.deliveryFee}`}</div><div style={{ fontSize: 10, color: "#888" }}>Fee</div></div>
          <div style={{ width: 1, background: "#f0f0f0" }} />
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#3d4152" }}>₹{r.minOrder}</div><div style={{ fontSize: 10, color: "#888" }}>Min.</div></div>
        </div>
        {r.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>
            {r.tags.map(t => <span key={t} style={{ background: "#fff3e8", color: "#FC8019", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600 }}>{t}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== RESTAURANT GRID ==========
function RestaurantGrid({ list, onSelect }) {
  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#3d4152" }}>
          Restaurants Near You <span style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>({list.length})</span>
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["Rating", "Delivery", "Price"].map(f => (
            <button key={f} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #ddd", background: "white", fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#3d4152", fontFamily: "inherit" }}>{f} ↓</button>
          ))}
        </div>
      </div>
      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", background: "white", borderRadius: 16 }}>
          <div style={{ fontSize: 56 }}>🔍</div>
          <h3 style={{ marginTop: 12, fontSize: 18, fontWeight: 700 }}>No restaurants found</h3>
          <p style={{ color: "#888", fontSize: 13 }}>Try a different search or category</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 18 }}>
          {list.map(r => <RestaurantCard key={r.id} r={r} onClick={() => onSelect(r)} />)}
        </div>
      )}
    </div>
  );
}

// ========== MENU ITEM ==========
function MenuItem({ item, qty, onAdd, onRemove }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: "white", borderRadius: 14, padding: "14px 18px",
      display: "flex", gap: 14, alignItems: "center",
      boxShadow: hov ? "0 4px 20px rgba(0,0,0,0.09)" : "0 2px 8px rgba(0,0,0,0.04)",
      border: qty > 0 ? "2px solid #FC8019" : "2px solid transparent", transition: "all 0.2s"
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
          <div style={{ width: 13, height: 13, borderRadius: 3, border: `2px solid ${item.veg ? "#4CAF50" : "#f44336"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.veg ? "#4CAF50" : "#f44336" }} />
          </div>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: "#3d4152", margin: 0 }}>{item.name}</h4>
          {item.rating && <span style={{ background: "#f5f5f5", color: "#666", padding: "2px 6px", borderRadius: 8, fontSize: 10, fontWeight: 600 }}>⭐ {item.rating}</span>}
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#3d4152", marginBottom: 3 }}>₹{item.price}</div>
        <p style={{ fontSize: 11, color: "#93959f", lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
      </div>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <img src={item.image} alt={item.name} style={{ width: 100, height: 76, objectFit: "cover", borderRadius: 10, transition: "transform 0.3s", transform: hov ? "scale(1.05)" : "scale(1)" }} />
        <div style={{ position: "absolute", bottom: -11, left: "50%", transform: "translateX(-50%)" }}>
          {qty === 0 ? (
            <button onClick={onAdd} style={{
              background: "white", color: "#FC8019", border: "2px solid #FC8019",
              padding: "4px 18px", borderRadius: 7, fontWeight: 800, fontSize: 12,
              cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(252,128,25,0.25)", whiteSpace: "nowrap"
            }}>+ ADD</button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", background: "#FC8019", borderRadius: 7, overflow: "hidden", boxShadow: "0 2px 8px rgba(252,128,25,0.35)" }}>
              <button onClick={onRemove} style={{ background: "none", border: "none", color: "white", padding: "4px 10px", cursor: "pointer", fontWeight: 800, fontSize: 15, fontFamily: "inherit" }}>−</button>
              <span style={{ color: "white", fontWeight: 800, fontSize: 13, padding: "4px 4px", minWidth: 20, textAlign: "center" }}>{qty}</span>
              <button onClick={onAdd} style={{ background: "none", border: "none", color: "white", padding: "4px 10px", cursor: "pointer", fontWeight: 800, fontSize: 15, fontFamily: "inherit" }}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========== RESTAURANT DETAIL ==========
function RestaurantDetail({ r, cartItems, onAdd, onRemove, onBack, onCartClick }) {
  const [menuCat, setMenuCat] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [search, setSearch] = useState("");
  const cats = ["All", ...new Set(r.menu.map(i => i.category))];
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const filtered = r.menu.filter(item =>
    (menuCat === "All" || item.category === menuCat) &&
    (!vegOnly || item.veg) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 24px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#FC8019", fontFamily: "inherit", marginBottom: 18, padding: 0, display: "flex", alignItems: "center", gap: 6 }}>← Back to Restaurants</button>
      <div style={{ background: "white", borderRadius: 20, overflow: "hidden", marginBottom: 18, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ position: "relative" }}>
          <img src={r.image} alt={r.name} style={{ width: "100%", height: 200, objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", bottom: 18, left: 22 }}>
            <h1 style={{ color: "white", fontSize: 26, fontWeight: 800, margin: 0 }}>{r.name}</h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, margin: "4px 0 0" }}>{r.cuisine}</p>
          </div>
        </div>
        <div style={{ padding: "14px 22px", display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 0 }}>
          {[["⭐", r.rating,"Rating"],["🕐",r.deliveryTime,"Delivery"],["🚚",r.deliveryFee===0?"Free":`₹${r.deliveryFee}`,"Fee"],["💰",`₹${r.minOrder}`,"Min.Order"],[r.isVeg?"🟢":"🔴",r.isVeg?"Pure Veg":"Non-Veg","Type"]].map(([ic,val,label],i,a) => (
            <div key={label} style={{ textAlign: "center", padding: "6px 0", borderRight: i<a.length-1?"1px solid #f0f0f0":"none" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#3d4152" }}>{ic} {val}</div>
              <div style={{ fontSize: 10, color: "#888" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg,#fff3e8,#ffe8d6)", borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16, border: "1px dashed #FC8019" }}>
        <span style={{ fontSize: 22 }}>🏷️</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#FC8019" }}>{r.discount}</div>
          <div style={{ fontSize: 11, color: "#888" }}>Limited time offer</div>
        </div>
      </div>
      <div style={{ background: "white", borderRadius: 14, padding: "14px 18px", marginBottom: 14, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 180, display: "flex", alignItems: "center", background: "#f5f5f5", borderRadius: 9, padding: "8px 12px", gap: 7 }}>
            <span>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search menu..." style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 12, fontFamily: "inherit" }} />
          </div>
          <button onClick={() => setVegOnly(!vegOnly)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, border: `2px solid ${vegOnly ? "#4CAF50" : "#ddd"}`, background: vegOnly ? "#e8f5e9" : "white", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "inherit", color: vegOnly ? "#4CAF50" : "#888" }}>🟢 Veg Only</button>
        </div>
        <div style={{ display: "flex", gap: 7, marginTop: 10, overflowX: "auto", paddingBottom: 3 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setMenuCat(c)} style={{ padding: "6px 14px", borderRadius: 18, border: "none", background: menuCat === c ? "#FC8019" : "#f5f5f5", color: menuCat === c ? "white" : "#555", fontWeight: 700, fontSize: 11, cursor: "pointer", flexShrink: 0, fontFamily: "inherit", transition: "all 0.2s" }}>{c}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: cartCount > 0 ? 72 : 0 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 36, background: "white", borderRadius: 14 }}><div style={{ fontSize: 44 }}>😕</div><p style={{ color: "#888", marginTop: 10 }}>No items found</p></div>
        ) : filtered.map(item => (
          <MenuItem key={item.id} item={item} qty={cartItems.find(i => i.id === item.id)?.qty || 0} onAdd={() => onAdd(item, r)} onRemove={() => onRemove(item.id)} />
        ))}
      </div>
      {cartCount > 0 && (
        <div onClick={onCartClick} style={{
          position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #FC8019, #ff5722)", color: "white",
          borderRadius: 14, padding: "14px 28px", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          width: "calc(100% - 80px)", maxWidth: 600,
          boxShadow: "0 8px 32px rgba(252,128,25,0.45)", zIndex: 100, cursor: "pointer"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 7, padding: "3px 10px", fontWeight: 800 }}>{cartCount}</div>
            <span style={{ fontWeight: 700, fontSize: 13 }}>{cartCount} item{cartCount>1?"s":""} added</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 14 }}>View Cart • ₹{cartTotal} →</span>
        </div>
      )}
    </div>
  );
}

// ========== CART ==========
function Cart({ isOpen, onClose, items, onAdd, onRemove, onClear, total }) {
  const [ordered, setOrdered] = useState(false);
  const [promo, setPromo] = useState("");
  const [disc, setDisc] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");
  const deliveryFee = total > 299 ? 0 : 40;
  const taxes = Math.round(total * 0.05);
  const grand = total + deliveryFee + taxes - disc;

  const applyPromo = () => {
    const map = { SAVE50: 50, FIRST100: 100, SWIGGY20: Math.round(total * 0.2) };
    const val = map[promo.toUpperCase()];
    if (val) { setDisc(val); setPromoMsg(`✅ ₹${val} discount applied!`); }
    else { setPromoMsg("❌ Invalid code"); setDisc(0); }
  };

  const placeOrder = () => {
    setOrdered(true);
    setTimeout(() => { setOrdered(false); onClear(); onClose(); setDisc(0); setPromo(""); setPromoMsg(""); }, 4000);
  };

  return (
    <>
      {isOpen && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, backdropFilter: "blur(4px)" }} />}
      <div style={{
        position: "fixed", top: 0, right: 0, width: 390, height: "100vh",
        background: "white", boxShadow: "-4px 0 40px rgba(0,0,0,0.14)",
        zIndex: 1001, transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column"
      }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg,#FC8019,#ff5722)" }}>
          <div>
            <h2 style={{ color: "white", margin: 0, fontSize: 19, fontWeight: 800 }}>🛒 Your Cart</h2>
            <p style={{ color: "rgba(255,255,255,0.85)", margin: 0, fontSize: 11 }}>{items.length > 0 ? `${items.reduce((s,i)=>s+i.qty,0)} items` : "Add items to get started"}</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {ordered && (
          <div style={{ position: "absolute", inset: 0, background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, gap: 14 }}>
            <div style={{ fontSize: 72 }}>🎉</div>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Order Placed!</h2>
            <p style={{ color: "#888", textAlign: "center", maxWidth: 250 }}>Your food is being prepared. Estimated delivery: 30-45 mins</p>
            <div style={{ background: "#e8f5e9", color: "#4CAF50", padding: "10px 22px", borderRadius: 10, fontWeight: 700, fontSize: 13 }}>✅ Confirmed • ₹{grand}</div>
          </div>
        )}

        {items.length === 0 && !ordered && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, gap: 10 }}>
            <div style={{ fontSize: 70 }}>🛒</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#3d4152" }}>Cart is empty</h3>
            <p style={{ color: "#888", textAlign: "center", fontSize: 13 }}>Add items from a restaurant</p>
            <button onClick={onClose} style={{ background: "#FC8019", color: "white", border: "none", padding: "11px 26px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Browse</button>
          </div>
        )}

        {items.length > 0 && !ordered && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px" }}>
              {items[0]?.restaurantName && (
                <div style={{ background: "#fff3e8", borderRadius: 9, padding: "7px 12px", marginBottom: 12, fontSize: 11, fontWeight: 700, color: "#FC8019" }}>🍽️ {items[0].restaurantName}</div>
              )}
              {items.map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ width: 11, height: 11, borderRadius: 2, border: `1.5px solid ${item.veg?"#4CAF50":"#f44336"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: item.veg?"#4CAF50":"#f44336" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#3d4152" }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>₹{item.price} each</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", background: "#FC8019", borderRadius: 7, overflow: "hidden" }}>
                    <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", color: "white", padding: "3px 9px", cursor: "pointer", fontWeight: 800, fontSize: 15 }}>−</button>
                    <span style={{ color: "white", fontWeight: 800, fontSize: 12, padding: "3px 4px", minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => onAdd(item, { name: item.restaurantName })} style={{ background: "none", border: "none", color: "white", padding: "3px 9px", cursor: "pointer", fontWeight: 800, fontSize: 15 }}>+</button>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#3d4152", minWidth: 44, textAlign: "right" }}>₹{item.price*item.qty}</div>
                </div>
              ))}
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                  <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Promo code (SAVE50)" style={{ flex: 1, padding: "9px 12px", borderRadius: 9, border: "2px solid #f0f0f0", outline: "none", fontSize: 12, fontFamily: "inherit" }} />
                  <button onClick={applyPromo} style={{ background: "#FC8019", color: "white", border: "none", borderRadius: 9, padding: "9px 14px", fontWeight: 700, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>Apply</button>
                </div>
                {promoMsg && <div style={{ fontSize: 11, fontWeight: 600, color: promoMsg.startsWith("✅") ? "#4CAF50" : "#f44336" }}>{promoMsg}</div>}
              </div>
              <div style={{ background: "#fafafa", borderRadius: 12, padding: 14, marginTop: 12 }}>
                <h4 style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, color: "#3d4152" }}>Bill Details</h4>
                {[["Item Total",`₹${total}`],["Delivery Fee",deliveryFee===0?"FREE 🎉":`₹${deliveryFee}`],["GST & Charges",`₹${taxes}`]].map(([l,v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6, color: "#666" }}><span>{l}</span><span>{v}</span></div>
                ))}
                {disc > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6, color: "#4CAF50", fontWeight: 700 }}><span>Promo Discount</span><span>-₹{disc}</span></div>}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, color: "#3d4152", paddingTop: 8, borderTop: "1px dashed #ddd", marginTop: 4 }}><span>To Pay</span><span>₹{grand}</span></div>
              </div>
            </div>
            <div style={{ padding: "14px 18px", borderTop: "1px solid #f0f0f0" }}>
              <button onClick={placeOrder} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#FC8019,#ff5722)", color: "white", border: "none", borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(252,128,25,0.4)", transition: "transform 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.02)"}
                onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
                Place Order • ₹{grand}
              </button>
              <p style={{ textAlign: "center", fontSize: 10, color: "#aaa", marginTop: 6 }}>🔒 Secure payment • Free cancellation</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ========== FOOTER ==========
function Footer() {
  return (
    <footer style={{ background: "#3d4152", color: "white", padding: "40px 24px 22px", marginTop: 40 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 36, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#FC8019,#ff5722)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🍜</div>
              <span style={{ fontSize: 24, fontWeight: 800, color: "#FC8019" }}>swiggy</span>
            </div>
            <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.7, maxWidth: 240 }}>Delivering happiness to your doorstep. Order from the best restaurants near you.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              {["📘","🐦","📸","▶️"].map((icon,i) => (
                <div key={i} style={{ width: 34, height: 34, background: "rgba(255,255,255,0.1)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>{icon}</div>
              ))}
            </div>
          </div>
          {[
            { title: "Company", links: ["About Us","Careers","Blog","Press"] },
            { title: "For Restaurants", links: ["Partner with us","Apps for you","Register"] },
            { title: "Learn More", links: ["Privacy","Terms","Help Center","Sitemap"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ marginBottom: 14, fontWeight: 700, fontSize: 13, color: "#ddd" }}>{col.title}</h4>
              {col.links.map(l => <div key={l} style={{ color: "#aaa", fontSize: 12, marginBottom: 9, cursor: "pointer" }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ color: "#888", fontSize: 11 }}>© 2025 Swiggy Clone • Made with ❤️ in React JS</p>
          <div style={{ display: "flex", gap: 18 }}>
            {["Privacy Policy","Terms","Cookie Policy"].map(t => <span key={t} style={{ color: "#888", fontSize: 11, cursor: "pointer" }}>{t}</span>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ========== MAIN APP ==========
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedR, setSelectedR] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [address, setAddress] = useState("Ahmedabad, Gujarat");
  const [notif, setNotif] = useState(null);

  const showNotif = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 2200);
  };

  const addToCart = (item, restaurant) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) { showNotif(`${item.name} updated!`); return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i); }
      showNotif(`${item.name} added!`);
      return [...prev, { ...item, qty: 1, restaurantName: restaurant.name }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === itemId);
      if (ex?.qty === 1) return prev.filter(i => i.id !== itemId);
      return prev.map(i => i.id === itemId ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const filtered = restaurants.filter(r => {
    const ms = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const mc = activeCategory === "All" || r.category === activeCategory;
    return ms && mc;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9", fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes bop { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes slideIn { from{transform:translateX(80px);opacity:0} to{transform:translateX(0);opacity:1} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: #FC8019; border-radius: 3px; }
        img { display: block; }
      `}</style>

      {notif && (
        <div style={{ position: "fixed", top: 76, right: 18, zIndex: 9999, background: "#FC8019", color: "white", padding: "10px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13, boxShadow: "0 4px 20px rgba(252,128,25,0.4)", animation: "slideIn 0.3s ease" }}>
          🛒 {notif}
        </div>
      )}

      <Navbar
        cartCount={cartCount} cartTotal={cartTotal}
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => { setPage("home"); setSelectedR(null); }}
        address={address} setAddress={setAddress}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
      />

      {page === "home" && (
        <>
          <HeroBanner />
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            <CategoryFilter active={activeCategory} setActive={setActiveCategory} />
            <RestaurantGrid list={filtered} onSelect={r => { setSelectedR(r); setPage("restaurant"); }} />
          </div>
        </>
      )}

      {page === "restaurant" && selectedR && (
        <RestaurantDetail
          r={selectedR} cartItems={cartItems}
          onAdd={addToCart} onRemove={removeFromCart}
          onBack={() => { setPage("home"); setSelectedR(null); }}
          onCartClick={() => setIsCartOpen(true)}
        />
      )}

      <Cart
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}
        items={cartItems} onAdd={addToCart} onRemove={removeFromCart}
        onClear={() => setCartItems([])} total={cartTotal}
      />

      <Footer />
    </div>
  );
}
