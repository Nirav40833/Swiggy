import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import CategoryFilter from "./components/CategoryFilter";
import RestaurantGrid from "./components/RestaurantGrid";
import RestaurantDetail from "./components/RestaurantDetail";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import ProfileModal from "./components/ProfileModal";
import { restaurants } from "./restaurants";
import { authAPI, orderAPI, cartAPI, userAPI } from "./services/api";

export default function App() {
  const [page, setPage]                     = useState("home");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cartItems, setCartItems]           = useState([]);
  const [searchQuery, setSearchQuery]       = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCartOpen, setIsCartOpen]         = useState(false);
  const [address, setAddress]               = useState("Ahmedabad, Gujarat");
  const [notification, setNotification]     = useState(null);
  const [user, setUser]                     = useState(null);
  const [orders, setOrders]                 = useState([]);
  const [showProfile, setShowProfile]       = useState(false);
  const [showOrders, setShowOrders]         = useState(false);
  const [loading, setLoading]               = useState(false);

  // Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem("swiggy_token");
    const savedUser = localStorage.getItem("swiggy_user");
    if (token && savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      loadUserData();
    }
  }, []);

  // Load cart + orders from MySQL
  const loadUserData = async () => {
    try {
      const cartData = await cartAPI.get();
      if (cartData?.length) {
        setCartItems(cartData.map(c => ({
          id: c.item_id || c.id,
          name: c.item_name,
          price: c.price,
          qty: c.quantity,
          restaurantName: c.restaurant_name,
          veg: c.is_veg === 1,
          colorKey: c.color_key || "biryani",
        })));
      }
      const ordersData = await orderAPI.getAll();
      if (ordersData?.length) setOrders(ordersData);
    } catch (err) {
      console.log("Load error:", err.message);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // LOGIN - user data MySQL ma save
  const handleLogin = async (u) => {
    setUser(u);
    localStorage.setItem("swiggy_user", JSON.stringify(u));
    showNotification(`Welcome, ${u.name}! 👋`);
    await loadUserData();
  };

  // LOGOUT
  const handleLogout = async () => {
    try { await cartAPI.save(cartItems); } catch {}
    authAPI.logout();
    localStorage.removeItem("swiggy_user");
    setUser(null);
    setCartItems([]);
    setOrders([]);
    showNotification("Signed out!");
  };

  // ADD TO CART + MySQL save

  
  const addToCart = (item, restaurant) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const newItems = existing
        ? prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...item, qty: 1, restaurantName: restaurant.name }];
      if (user) cartAPI.save(newItems).catch(() => {});
      return newItems;
    });
    showNotification(`${item.name} added to cart!`);
  };

  // REMOVE FROM CART
  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      const newItems = existing?.qty === 1
        ? prev.filter((i) => i.id !== itemId)
        : prev.map((i) => i.id === itemId ? { ...i, qty: i.qty - 1 } : i);
      if (user) cartAPI.save(newItems).catch(() => {});
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) cartAPI.clear().catch(() => {});
  };

  // PLACE ORDER → MySQL orders table
  const handlePlaceOrder = async (orderData) => {
    if (!user) return showNotification("Please sign in!");
    try {
      setLoading(true);
      const result = await orderAPI.place({
        items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, veg: i.veg })),
        total_amount:    orderData.total || cartTotal + 40,
        delivery_fee:    orderData.deliveryFee || 40,
        tax_amount:      orderData.tax || 0,
        discount_amount: orderData.discount || 0,
        promo_code:      orderData.promoCode || null,
        restaurant_name: cartItems[0]?.restaurantName || "",
        delivery_address: address,
        payment_method:  "COD",
      });
      showNotification(`Order placed! ${result.order_number} 🎉`);
      const fresh = await orderAPI.getAll();
      setOrders(fresh || []);
      clearCart();
    } catch (err) {
      showNotification("Order failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE PROFILE → MySQL users table
  const handleUpdateProfile = async (updated) => {
    try {
      await userAPI.updateProfile({ name: updated.name, phone: updated.phone, dob: updated.dob, city: updated.city });
      setUser(updated);
      localStorage.setItem("swiggy_user", JSON.stringify(updated));
      showNotification("Profile updated! ✅");
    } catch (err) {
      showNotification("Failed: " + err.message);
    }
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const filteredRestaurants = restaurants.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = activeCategory === "All" || r.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "'Poppins', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes slideIn { from { transform: translateX(100px); opacity:0; } to { transform: translateX(0); opacity:1; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #FC8019; border-radius: 3px; }
      `}</style>

      {notification && (
        <div style={{ position: "fixed", top: 80, right: 20, zIndex: 9999, background: "#FC8019", color: "white", padding: "12px 20px", borderRadius: 12, fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(252,128,25,0.4)", animation: "slideIn 0.3s ease" }}>
          🛒 {notification}
        </div>
      )}

      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => { setPage("home"); setSelectedRestaurant(null); }}
        address={address}
        setAddress={setAddress}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onProfileClick={() => { setShowOrders(false); setShowProfile(true); }}
        onOrdersClick={() => { setShowOrders(true); setShowProfile(true); }}
      />

      {page === "home" && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          <RestaurantGrid
            restaurants={filteredRestaurants}
            onSelect={(r) => { setSelectedRestaurant(r); setPage("restaurant"); }}
          />
        </div>
      )}

      {page === "restaurant" && selectedRestaurant && (
        <RestaurantDetail
          restaurant={selectedRestaurant}
          cartItems={cartItems}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onBack={() => { setPage("home"); setSelectedRestaurant(null); }}
          onCartClick={() => setIsCartOpen(true)}
        />
      )}

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onClear={clearCart}
        total={cartTotal}
        user={user}
        onPlaceOrder={handlePlaceOrder}
        loading={loading}
      />

      {showProfile && user && (
        <ProfileModal
          user={user}
          orders={orders}
          defaultTab={showOrders ? "orders" : "profile"}
          onClose={() => { setShowProfile(false); setShowOrders(false); }}
          onUpdate={handleUpdateProfile}
        />
      )}

      <Footer />
    </div>
  );
}
