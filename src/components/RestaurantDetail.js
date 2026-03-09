import { useState } from "react";
import MenuItem from "./MenuItem";

export default function RestaurantDetail({ restaurant: r, cartItems, onAdd, onRemove, onBack, onCartClick }) {
  const [activeMenuCat, setActiveMenuCat] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [searchMenu, setSearchMenu] = useState("");

  const menuCategories = ["All", ...new Set(r.menu.map(i => i.category))];
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const filteredMenu = r.menu.filter(item => {
    const matchCat = activeMenuCat === "All" || item.category === activeMenuCat;
    const matchVeg = !vegOnly || item.veg;
    const matchSearch = item.name.toLowerCase().includes(searchMenu.toLowerCase());
    return matchCat && matchVeg && matchSearch;
  });

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px" }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "none", border: "none", cursor: "pointer",
          fontSize: 14, fontWeight: 700, color: "#FC8019",
          fontFamily: "inherit", marginBottom: 20, padding: 0
        }}
      >
        ← Back to Restaurants
      </button>

      {/* Restaurant Header */}
      <div style={{
        background: "white", borderRadius: 20,
        overflow: "hidden", marginBottom: 20,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
      }}>
        <div style={{ position: "relative" }}>
          <img
            src={r.image}
            alt={r.name}
            style={{ width: "100%", height: 220, objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)"
          }} />
          <div style={{ position: "absolute", bottom: 20, left: 24 }}>
            <h1 style={{ color: "white", fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{r.name}</h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>{r.cuisine}</p>
          </div>
        </div>

        <div style={{
          padding: "16px 24px",
          display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0
        }}>
          {[
            { icon: "⭐", val: r.rating, label: "Rating" },
            { icon: "🕐", val: r.deliveryTime, label: "Delivery" },
            { icon: "🚚", val: r.deliveryFee === 0 ? "Free" : `₹${r.deliveryFee}`, label: "Delivery Fee" },
            { icon: "💰", val: `₹${r.minOrder}`, label: "Min. Order" },
            { icon: r.isVeg ? "🟢" : "🔴", val: r.isVeg ? "Pure Veg" : "Non-Veg", label: "Type" },
          ].map((s, i, arr) => (
            <div key={s.label} style={{
              textAlign: "center", padding: "8px 0",
              borderRight: i < arr.length - 1 ? "1px solid #f0f0f0" : "none"
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#3d4152" }}>{s.icon} {s.val}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Offers Row */}
      <div style={{
        background: "linear-gradient(135deg, #fff3e8, #ffe8d6)",
        borderRadius: 14, padding: "14px 20px",
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: 20, border: "1px dashed #FC8019"
      }}>
        <span style={{ fontSize: 24 }}>🏷️</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#FC8019" }}>{r.discount}</div>
          <div style={{ fontSize: 12, color: "#888" }}>Limited time offer</div>
        </div>
      </div>

      {/* Menu Search & Filter */}
      <div style={{
        background: "white", borderRadius: 16, padding: "16px 20px",
        marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{
            flex: 1, minWidth: 200,
            display: "flex", alignItems: "center",
            background: "#f5f5f5", borderRadius: 10, padding: "10px 14px", gap: 8
          }}>
            <span>🔍</span>
            <input
              value={searchMenu}
              onChange={e => setSearchMenu(e.target.value)}
              placeholder="Search menu items..."
              style={{
                flex: 1, border: "none", outline: "none",
                background: "transparent", fontSize: 13,
                fontFamily: "inherit"
              }}
            />
          </div>
          {/* Veg Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 16px", borderRadius: 10,
              border: `2px solid ${vegOnly ? "#4CAF50" : "#ddd"}`,
              background: vegOnly ? "#e8f5e9" : "white",
              cursor: "pointer", fontWeight: 700, fontSize: 13,
              fontFamily: "inherit", transition: "all 0.2s",
              color: vegOnly ? "#4CAF50" : "#888"
            }}
          >
            🟢 Veg Only
          </button>
        </div>

        {/* Category Tabs */}
        <div style={{
          display: "flex", gap: 8, marginTop: 12,
          overflowX: "auto", paddingBottom: 4
        }}>
          {menuCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveMenuCat(cat)}
              style={{
                padding: "7px 16px", borderRadius: 20,
                border: "none",
                background: activeMenuCat === cat ? "#FC8019" : "#f5f5f5",
                color: activeMenuCat === cat ? "white" : "#555",
                fontWeight: 700, fontSize: 12,
                cursor: "pointer", flexShrink: 0,
                fontFamily: "inherit", transition: "all 0.2s"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: cartCount > 0 ? 80 : 0 }}>
        {filteredMenu.length === 0 ? (
          <div style={{
            textAlign: "center", padding: 40,
            background: "white", borderRadius: 16
          }}>
            <div style={{ fontSize: 48 }}>😕</div>
            <p style={{ marginTop: 12, color: "#888" }}>No items found</p>
          </div>
        ) : (
          filteredMenu.map(item => (
            <MenuItem
              key={item.id}
              item={item}
              cartQty={cartItems.find(i => i.id === item.id)?.qty || 0}
              onAdd={() => onAdd(item, r)}
              onRemove={() => onRemove(item.id)}
            />
          ))
        )}
      </div>

      {/* Bottom Cart Bar */}
      {cartCount > 0 && (
        <div style={{
          position: "fixed", bottom: 20, left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #FC8019, #ff5722)",
          color: "white", borderRadius: 16, padding: "16px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "calc(100% - 80px)", maxWidth: 640,
          boxShadow: "0 8px 32px rgba(252,128,25,0.5)",
          zIndex: 100, cursor: "pointer"
        }}
          onClick={onCartClick}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              background: "rgba(255,255,255,0.2)", borderRadius: 8,
              padding: "4px 10px", fontWeight: 800, fontSize: 14
            }}>
              {cartCount}
            </div>
            <span style={{ fontWeight: 700 }}>
              {cartCount} item{cartCount > 1 ? "s" : ""} added
            </span>
          </div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>
            View Cart • ₹{cartTotal} →
          </div>
        </div>
      )}
    </div>
  );
}
