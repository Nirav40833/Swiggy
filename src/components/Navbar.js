import { useState } from "react";

export default function Navbar({ cartCount, cartTotal, onCartClick, onHomeClick, address, setAddress, searchQuery, setSearchQuery }) {
  const [editingAddress, setEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);
  const [showSearch, setShowSearch] = useState(false);

  const saveAddress = () => {
    setAddress(tempAddress);
    setEditingAddress(false);
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 1000,
      background: "white",
      boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
      padding: "0 20px",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", alignItems: "center",
        height: 72, gap: 24
      }}>
        {/* Logo */}
        <div
          onClick={onHomeClick}
          style={{
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            textDecoration: "none"
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "linear-gradient(135deg, #FC8019, #ff5722)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 4px 12px rgba(252,128,25,0.4)"
          }}>🍜</div>
          <span style={{
            fontSize: 22, fontWeight: 800, color: "#FC8019",
            letterSpacing: "-0.5px"
          }}>ABC</span>
        </div>

        {/* Location */}
        <div
          onClick={() => setEditingAddress(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            cursor: "pointer", padding: "8px 12px", borderRadius: 8,
            transition: "background 0.2s",
            background: "transparent",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#fff3e8"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <span style={{ fontSize: 18 }}>📍</span>
          <div>
            <div style={{ fontSize: 11, color: "#888", fontWeight: 500 }}>Delivering to</div>
            <div style={{
              fontSize: 13, fontWeight: 700, color: "#3d4152",
              display: "flex", alignItems: "center", gap: 4
            }}>
              {address.split(",")[1]}
              <span style={{ color: "#FC8019", fontSize: 12 }}>▼</span>
            </div>
          </div>
        </div>

        {/* Address Modal */}
        {editingAddress && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999
          }}>
            <div style={{
              background: "white", borderRadius: 16, padding: 28,
              width: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
            }}>
              <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 700 }}>📍 Delivery Address</h3>
              <input
                value={tempAddress}
                onChange={e => setTempAddress(e.target.value)}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10,
                  border: "2px solid #FC8019", outline: "none",
                  fontSize: 14, marginBottom: 16
                }}
                placeholder="Enter your delivery address..."
              />
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={saveAddress} style={{
                  flex: 1, padding: "12px", background: "#FC8019", color: "white",
                  border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer",
                  fontSize: 14
                }}>Save Address</button>
                <button onClick={() => setEditingAddress(false)} style={{
                  flex: 1, padding: "12px", background: "#f5f5f5", color: "#333",
                  border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer",
                  fontSize: 14
                }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: 500 }}>
          <div style={{
            display: "flex", alignItems: "center",
            background: "#f5f5f5", borderRadius: 10,
            padding: "10px 16px", gap: 10,
            border: "2px solid transparent",
            transition: "border 0.2s",
          }}
            onFocus={e => e.currentTarget.style.border = "2px solid #FC8019"}
            onBlur={e => e.currentTarget.style.border = "2px solid transparent"}
          >
            <span style={{ fontSize: 18, color: "#888" }}>🔍</span>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for restaurants and food..."
              style={{
                flex: 1, border: "none", outline: "none",
                background: "transparent", fontSize: 14,
                color: "#3d4152", fontFamily: "inherit"
              }}
            />
            {searchQuery && (
              <span
                onClick={() => setSearchQuery("")}
                style={{ cursor: "pointer", color: "#888", fontSize: 18 }}
              >✕</span>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <NavLink icon="🏠" label="Home" onClick={onHomeClick} />
          <NavLink icon="🔖" label="Offers" />
          <NavLink icon="❓" label="Help" />

          {/* Cart Button */}
          <button
            onClick={onCartClick}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: cartCount > 0 ? "linear-gradient(135deg, #FC8019, #ff5722)" : "#f5f5f5",
              color: cartCount > 0 ? "white" : "#3d4152",
              border: "none", borderRadius: 10, padding: "10px 18px",
              cursor: "pointer", fontWeight: 700, fontSize: 14,
              fontFamily: "inherit", transition: "all 0.3s",
              boxShadow: cartCount > 0 ? "0 4px 16px rgba(252,128,25,0.4)" : "none"
            }}
          >
            <span style={{ fontSize: 18 }}>🛒</span>
            {cartCount > 0 ? (
              <>
                <span>{cartCount} item{cartCount > 1 ? "s" : ""}</span>
                <span>•</span>
                <span>₹{cartCount > 0 ? (cartTotal + 40).toFixed(0) : 0}</span>
              </>
            ) : (
              <span>Cart</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 5,
        color: "#3d4152", fontSize: 14, fontWeight: 600,
        fontFamily: "inherit", padding: "6px 10px",
        borderRadius: 8, transition: "background 0.2s"
      }}
      onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
      onMouseLeave={e => e.currentTarget.style.background = "none"}
    >
      <span>{icon}</span> {label}
    </button>
  );
}
