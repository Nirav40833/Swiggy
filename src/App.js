import { useState } from "react";
import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import CategoryFilter from "./components/CategoryFilter";
import RestaurantGrid from "./components/RestaurantGrid";
import RestaurantDetail from "./components/RestaurantDetail";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import { restaurants } from "./restaurants";

export default function App() {
  const [page, setPage] = useState("home"); // home | restaurant | cart
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [address, setAddress] = useState("Ahmedabad, Gujarat");
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const addToCart = (item, restaurant) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        showNotification(`${item.name} quantity updated!`);
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      showNotification(`${item.name} added to cart!`);
      return [...prev, { ...item, qty: 1, restaurantName: restaurant.name }];
    });

    
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing?.qty === 1) return prev.filter((i) => i.id !== itemId);
      return prev.map((i) =>
        i.id === itemId ? { ...i, qty: i.qty - 1 } : i
      );
    });
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const filteredRestaurants = restaurants.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      activeCategory === "All" || r.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "'Poppins', sans-serif" }}>
      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: "fixed", top: 80, right: 20, zIndex: 9999,
          background: "#FC8019", color: "white", padding: "12px 20px",
          borderRadius: 12, fontWeight: 600, fontSize: 14,
          boxShadow: "0 4px 20px rgba(252,128,25,0.4)",
          animation: "slideIn 0.3s ease"
        }}>
          🛒 {notification}
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(100px); opacity:0; } to { transform: translateX(0); opacity:1; } }
        @keyframes fadeUp { from { transform: translateY(20px); opacity:0; } to { transform: translateY(0); opacity:1; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #FC8019; border-radius: 3px; }
      `}</style>

      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => { setPage("home"); setSelectedRestaurant(null); }}
        address={address}
        setAddress={setAddress}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {page === "home" && (
        <>
          {/* <HeroBanner /> */}
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
            <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            <RestaurantGrid
              restaurants={filteredRestaurants}
              onSelect={(r) => { setSelectedRestaurant(r); setPage("restaurant"); }}
            />
          </div>
        </>
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
      />

      <Footer />
    </div>
  );
}
